<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <div class="csw-grid-wrapper" @click="keepFocus">
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

const firstWordSearchTile: Ref<null | HTMLInputElement> = ref(null);
const prevFirstWordSearchTile: Ref<null | HTMLInputElement> = ref(null);

const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));
// const getPrevTile = computed(() => (
//  isHorizontal.value ? selectPrevSibling : selectPrevNthElement));

const wordSearchTilesIds: Ref<string[]> = ref([]);

const TILE_INPUT_CLASS_LIST = ['selected-to-word-search', 'direction-marking-tile'];

// HANDLE CHILD COMP

type Coordinate = [number, number];
const questionTileCoords = reactive(new Set());
const isAnswerTile = (coord: Coordinate) => !questionTileCoords.has(coord.toString());
// do i need this?
function isTileLocked(target: HTMLInputElement) {
  return target.classList.contains('question-field');
}

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
  args: unknown = [],
  stopCondition: (arg: HTMLInputElement) => boolean = () => false,
  _getNextTile: (arg: HTMLInputElement) => HTMLInputElement | null = getNextTile.value,
) {
  let target: HTMLInputElement | null = startElement;
  while (target && !isTileLocked(target) && !stopCondition(target)) {
    callback(target, args);
    target = _getNextTile(target);
  }
}

// OTHERS

// REFACTOR!!! DEBUG!!!
function keepFocus() {
  if (selectedTile.value) {
    selectedTile.value.focus();
  }
}

// TODO JUST MAKE SIMPLE CODE

function mainEventHandler(target: EventTarget) {
  prevSelectedTile.value = selectedTile.value;
  selectedTile.value = target as HTMLInputElement;
  const selectedSameTile = computed(() => prevSelectedTile.value === selectedTile.value);

  // BEFORE RENDER
  if (prevSelectedTile.value) {
    if (selectedTile.value.classList.contains('selected-to-word-search')) {
      console.log('THIS');
      iterateCrosswordTiles(prevSelectedTile.value, removeStyle, ['direction-marking-tile']);
    } else {
      iterateCrosswordTiles(
        selectedSameTile.value ? getNextTile.value(prevSelectedTile.value) : prevSelectedTile.value,
        removeStyle,
        ['direction-marking-tile'],
        (el) => el === selectedTile.value,
      );
    }
  }

  // HANDLE DIRECTION
  if (selectedSameTile.value) {
    isHorizontal.value = !isHorizontal.value;
  }

  // RENDERING
  if (selectedTile.value.classList.contains('selected-to-word-search')) {
    iterateCrosswordTiles(
      prevSelectedTile.value,
      addStyle,
      ['direction-marking-tile'],
      (el) => el.classList.contains('direction-marking-tile'),
    );
  } else {
    console.log('ELSE');
    iterateCrosswordTiles(
      selectedSameTile.value ?
        getNextTile.value(selectedTile.value as HTMLInputElement) :
        selectedTile.value,
      addStyle,
      ['direction-marking-tile'],
      (el) => el.classList.contains('direction-marking-tile'),
    );
    iterateCrosswordTiles(
      selectedSameTile.value ?
        getNextTile.value(selectedTile.value as HTMLInputElement) :
        selectedTile.value,
      addStyle,
      ['selected-to-word-search'],
      (el) => el.classList.contains('selected-to-word-search'),
    );
  }
}
// iterateCrosswordTiles(
//  selectedSameTile.value ? getNextTile.value(selectedTile.value) : selectedTile.value,
//  addStyle,
//  ['direction-marking-tile', 'selected-to-word-search'],
//  (el) => el.classList.contains('direction-marking-tile'),
// );

// EVENT HANDLERS
// function mainEventHandler(target: EventTarget) {
//  prevSelectedTile.value = selectedTile.value;
//  selectedTile.value = target as HTMLInputElement;

//  // TO OPT.!!!
//  wordSearchTilesIds.value = []; // DO I really need this?
//  charsSequence.value = ''; // TO OPT.

//  // TO REFACTOR!!!
//  iterateCrosswordTiles(firstWordSearchTile.value, addToSearchPattern);
//  iterateCrosswordTiles(firstWordSearchTile.value, addToWordSearchTilesIds); // OPT.

//  if (!wordSearchTilesIds.value.includes(selectedTile.value.id)) {
//    if (selectedTile.value.id !== firstWordSearchTile.value?.id || !firstWordSearchTile.value) {
//      prevFirstWordSearchTile.value = firstWordSearchTile.value;
//      firstWordSearchTile.value = target as HTMLInputElement;
//    }
//  }

//  if (prevSelectedTile.value) {
//    //
//    // CLICK SAME TILE TWICE
//    //
//    if (selectedTile.value === prevSelectedTile.value) {
//      console.log('CLICK SAME');
//      console.log(firstWordSearchTile.value?.id, 'firstwordserachtile');
//      console.log(prevSelectedTile.value.id, '=>', firstWordSearchTile?.value?.id);

//      // TO OPT.
//      // REMOVE AFTER SELECTED TILE
//      // console.log('FROM', getNextTile.value(prevSelectedTile.value)?.id, 'REMOVE');
//      iterateCrosswordTiles(getNextTile.value(prevSelectedTile.value), removeStyle, [
//        'direction-marking-tile',
//        'selected-to-word-search',
//      ]);

//      // console.log('FROM', firstWordSearchTile.value?.id, 'REMOVE');
//      // REMOVE BEFORE SELECTED TILE
//      iterateCrosswordTiles(
//        firstWordSearchTile.value,
//        removeStyle,
//        ['selected-to-word-search'],
//        (el: HTMLInputElement) => el === selectedTile.value,
//      );
//      if (prevFirstWordSearchTile.value !== selectedTile.value) {
//        // NOT TESTED
//        prevFirstWordSearchTile.value = firstWordSearchTile.value;
//        firstWordSearchTile.value = target as HTMLInputElement;

//        iterateCrosswordTiles(
//          prevFirstWordSearchTile.value,
//          removeStyle,
//          ['selected-to-word-search'],
//          (el: HTMLInputElement) => selectedTile.value === el,
//        );
//      }
//      isHorizontal.value = !isHorizontal.value;

//      // to many repetitions
//      wordSearchTilesIds.value = [];
//      iterateCrosswordTiles(firstWordSearchTile.value, addToSearchPattern);
//      iterateCrosswordTiles(firstWordSearchTile.value, addToWordSearchTilesIds); // OPT.

//      iterateCrosswordTiles(getNextTile.value(selectedTile.value), addStyle, [
//        'direction-marking-tile',
//        'selected-to-word-search',
//      ]);

//      //
//      //  CLICK INSIDE SELECTED LINE
//      //
//    } else if ((target as HTMLInputElement).classList.contains('direction-marking-tile')) {
//      console.log('CLICK INSIDE');
//      iterateCrosswordTiles(
//        prevSelectedTile.value,
//        removeStyle,
//        ['direction-marking-tile'],
//        (el: HTMLInputElement) => el === target,
//      );
//      //
//      //  CLICK OUTSIDE SELECTED LINE
//      //
//    } else {
//      console.log('CLICK OUTSIDE');
//      ['direction-marking-tile', 'selected-to-word-search'].forEach((cls) =>
//        iterateCrosswordTiles(selectedTile.value, addStyle, [cls], (t) =>
//          t.classList.contains(cls)));

//      wordSearchTilesIds.value = [];
//      iterateCrosswordTiles(firstWordSearchTile.value, addToWordSearchTilesIds);
//      // only reason for wordSearchTilesIds
//      if (
//        prevFirstWordSearchTile.value &&
//        !wordSearchTilesIds.value.includes(prevFirstWordSearchTile.value.id)
//      ) {
//        // console.log('CLICK OUTSIDE SEC');
//        iterateCrosswordTiles(prevFirstWordSearchTile.value, removeStyle, [
//          'selected-to-word-search',
//          'direction-marking-tile',
//        ]);
//      }
//    }
//    //
//    //  FIRST SELECTING TILE
//    //
//  } else {
//    console.log('FIRST CLICK ');
//    iterateCrosswordTiles(selectedTile.value, addStyle, TILE_INPUT_CLASS_LIST);
//  }
// }

function handleClickEvent(e: Event) {
  if ((e.target as HTMLInputElement).classList.contains('question-field')) {
    // first just select this field like regular textarea
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
    if (nextTile && !nextTile.readOnly) {
      mainEventHandler(nextTile);
      nextTile.focus();
    }
  }
  // TODO textarea logic
}
function handleRightClick(e: any) {
  const coordValue = e.target.attributes.coord.value;

  // console.log(coordValue, 'Coord Val');

  if (questionTileCoords.has(coordValue)) {
    questionTileCoords.delete(coordValue);
  } else {
    questionTileCoords.add(coordValue);
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
