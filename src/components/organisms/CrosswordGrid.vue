<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <div class="csw-grid-wrapper" >
    <table
      class="csw-grid"
      @input="handleKeyboardEvent($event as any)"
      @mousedown.left.stop="handleClickEvent($event)"
      @mousedown.right="handleRightClick"
      @click.stop=""
    >
      <tr v-for="row in cswHeight" :key="row" class="csw-row" :id="`csw-row-${row}`">
        <td v-for="col in props.cswWidth" :id="`csw-td-${col}-${row}`" :key="`${col}-${row}`">
          <CrosswordAnswerTile
            v-if="isAnswerTile([col, row])"
            :class="`tile answer-tile ${col}-${row}-tile`"
            :id="`${col}-${row}-tile`"
            :coord="[col, row]"
          />
          <CrosswordClueTile
            v-else
            :class="`tile clue-tile ${col}-${row}-tile`"
            :id="`${col}-${row}-tile)`"
            :coord="[col, row]"
          />
        </td>
      </tr>
    </table>
    <p></p>
    <WordSearchEngine :pattern="regexPattern" />
  </div>
</template>

<script lang="ts" setup>
import {
  computed, Ref, ref, reactive,
} from 'vue';
import {
  selectNextNthElement,
  selectNextSibling,
  // selectPrevNthElement,
  // selectPrevSibling,
} from '@/utils/select';
import WordSearchEngine from '@/components/organisms/WordSearchEngine.vue';
import CrosswordAnswerTile from '@/components/atoms/CrosswordAnswerTile.vue';
import CrosswordClueTile from '@/components/atoms/CrosswordClueTile.vue';

// MAIN DATA
// simplify this somehow ???
const selectedTile: Ref<null | HTMLInputElement> = ref(null);
const prevSelectedTile: Ref<null | HTMLInputElement> = ref(null);

const firstSearchTileElement: Ref<null | HTMLInputElement> = ref(null);

const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));
// const getPrevTile = computed(() => (
//  isHorizontal.value ? selectPrevSibling : selectPrevNthElement));

const wordSearchTilesIds: Ref<string[]> = ref([]);

const ALL_INPUT_TILE_STYLES = ['selected-to-word-search', 'direction-marking-tile'];

// HANDLE CHILD COMP

type Coordinate = [number, number];
const clueTileCoords = reactive(new Set());
const isAnswerTile = (coord: Coordinate) => !clueTileCoords.has(coord.toString());

// RENDERING
const props = defineProps({
  cswWidth: Number,
  cswHeight: Number,
});

function addStyle(element: HTMLElement, classNames: string[]) {
  console.log('ADD', classNames, element?.id);
  classNames.forEach((cls) => {
    element.classList.add(cls);
  });
}
function removeStyle(element: HTMLElement, classNames: string[]) {
  console.log('REMOVE', classNames, element?.id);
  classNames.forEach((cls) => {
    element.classList.remove(cls);
  });
}

// WORD SEARCH HANDLERS
const charsSequence = ref('');
const regexPattern: Ref<RegExp> = ref(/.*/);

function addToSearchPattern(target: HTMLInputElement) {
  charsSequence.value += target.value.toLowerCase() || '.';
}

// TODO IMPORTANT
// function applyRegexPattern() {
//   regexPattern.value = new RegExp(`^${charsSequence.value}$`);
// }

function addToWordSearchTilesIds(target: HTMLInputElement) {
  // wordSearchTilesIds.value.push(target.id);
}

// MAIN FUNCTIONS
function iterateCrosswordTiles(
  startElement: HTMLInputElement | null,
  callback: (target: HTMLInputElement, arg?: any) => void,
  args: unknown[] = [],
  stopCondition: (arg: HTMLInputElement) => boolean = () => false,
  _getNextTile: (arg: HTMLInputElement) => HTMLInputElement | null = getNextTile.value,
) {
  let target = startElement;
  while (target && target?.tagName === 'INPUT' && !stopCondition(target)) {
    callback(target, args);
    target = _getNextTile(target);
  }
}

// REFACTOR!!! DEBUG!!!
// function keepFocus() {
//  if (selectedTile.value) {
//    selectedTile.value.focus();
//  }
// }

function mainEventHandler(target: EventTarget) {
  prevSelectedTile.value = selectedTile.value;
  selectedTile.value = target as HTMLInputElement;
  const selectedSameTile = computed(() => prevSelectedTile.value === selectedTile.value);

  // SAME TILE
  if (selectedSameTile.value) {
    iterateCrosswordTiles(
      firstSearchTileElement.value,
      removeStyle,
      ALL_INPUT_TILE_STYLES,
      (el) => el === selectedTile.value,
    );
    iterateCrosswordTiles(
      getNextTile.value(selectedTile.value as HTMLInputElement),
      removeStyle,
      ALL_INPUT_TILE_STYLES,
    );

    isHorizontal.value = !isHorizontal.value;

    iterateCrosswordTiles(getNextTile.value(selectedTile.value), addStyle, ALL_INPUT_TILE_STYLES);

    firstSearchTileElement.value = target as HTMLInputElement;
  } else if (selectedTile.value.classList.contains('selected-to-word-search')) {
    // INSIDE 'SELECTED TO WORD SEARCH CLASS'
    if (selectedTile.value.classList.contains('direction-marking-tile')) {
      // INSIDE 'SELECTED TO DIRECTION MARKING TILE CLASS'
      iterateCrosswordTiles(
        prevSelectedTile.value,
        removeStyle,
        ['direction-marking-tile'],
        (el) => el === selectedTile.value,
      );
    } else {
      console.log('else else');
      iterateCrosswordTiles(
        selectedTile.value,
        addStyle,
        ['direction-marking-tile'],
        (el) => el === prevSelectedTile.value,
      );
    }
  } else {
    // OUTSIDE 'SELECTED TO WORD SEARCH CLASS'
    iterateCrosswordTiles(firstSearchTileElement.value, removeStyle, ALL_INPUT_TILE_STYLES);

    ALL_INPUT_TILE_STYLES.map((cls) =>
      iterateCrosswordTiles(selectedTile.value, addStyle, [cls], (el) =>
        el.classList.contains(cls)));

    firstSearchTileElement.value = target as HTMLInputElement;
  }
}

function handleClickEvent(e: Event) {
  if ((e.target as HTMLInputElement).classList.contains('question-field')) {
    // TO REFACTOR
    console.log('HANDLE TEXTAREA SELECT');
  } else {
    (e.target as HTMLInputElement).focus();
    mainEventHandler(e.target as EventTarget);
  }
}

function handleKeyboardEvent(e: Event & { data: string }) {
  if ((e.target as HTMLInputElement).tagName === 'INPUT') {
    (e.target as HTMLInputElement).value = e.data?.toUpperCase() || '';
    const nextTile = getNextTile.value(e.target as HTMLInputElement);
    if (nextTile) {
      mainEventHandler(nextTile);
      nextTile.focus();
    }
  }
  // TODO textarea logic
}
function handleRightClick(e: any) {
  const coordValue = e.target.attributes.coord.value;

  if (clueTileCoords.has(coordValue)) {
    clueTileCoords.delete(coordValue);
  } else {
    clueTileCoords.add(coordValue);
  }
  // console.log(questionTileIDs);
  // if ((target as HTMLInputElement).tagName === 'INPUT') {
  //  console.log(target.id, 'HANDLE RIGHT CLICK');
  //  target?.data?.isAnswerTile = false;
  //  console.log(isAnswerTile);
  // const prevTile = getPrevTile.value(e.target as HTMLInputElement);

  // if (prevTile) {
  //  console.log(prevTile, 'prev tile');
  //  TILE_INPUT_CLASS_LIST.forEach((cls) => {
  //    if (prevTile.classList.contains(cls)) {
  //      iterateCrosswordTiles(e.target as HTMLInputElement, addStyle, TILE_INPUT_CLASS_LIST);
  //    }
  //  });
  // }

  // AFTER CLICKED TILE

  // } else {
  //  iterateCrosswordTiles(
  //    getNextTile.value(e.target as HTMLInputElement),
  //    removeStyle,
  //    TILE_INPUT_CLASS_LIST,
  //  );
  // }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

p {
  font-size: 2rem;
}

.csw-grid-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  margin: 0 auto auto;
  border: 0.2rem solid black;
}

.csw-grid {
  box-sizing: border-box;
  border-collapse: collapse;
  margin: 1rem;
  width: fit-content;
}

.tile {
  width: 5.6rem;
  height: 5.6rem;
  border: 1px dotted rgb(150, 150, 150);
  text-align: center;
  outline: none;
  caret-color: black;
  cursor: default;
}
.tile:hover {
  background-color: var(--hover-tile);
}
/*.tile:focus {
  background-color: var(--selected-tile);
  border: 2px solid var(--selected-tile-border);
}*/

.answer-tile {
  color: darkblue;
  font-size: 4.6rem;
  font-family: 'Patrick Hand', cursive;
}
.clue-tile {
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  background: black;
  color: white;
  display: block;
  resize: none;
  overflow: hidden;
  letter-spacing: 0;
}
.clue-tile:hover {
  background: darkgreen;
}

.direction-marking-tile {
  background-color: var(--selected-sibling);
}
.selected-to-word-search {
  border: 1px solid blue;
}
</style>
