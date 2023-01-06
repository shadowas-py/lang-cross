<template>
  <div class="csw-grid-wrapper">
    <table
      id="csw-grid"
      class="csw-grid"
      @input="handleInputEvent($event as any)"
      @mousedown.left.stop="handleClickEvent($event as EventWithTarget)"
      @mousedown.right="handleRightClick($event as EventWithTarget)"
      @click.stop=""
    >
      <tr v-for="row in cswHeight" :key="row" class="csw-row" :id="`csw-row-${row}`">
        <td v-for="col in cswWidth" :id="`csw-td-${col}-${row}`" :key="`${col}-${row}`">
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
    <WordList :filteredWords="filteredWords" />
  </div>
</template>

<script lang="ts" setup>
import {
  computed, Ref, ref, reactive, onMounted, watch,
} from 'vue';
import {
  selectNextNthElement,
  selectNextSibling,
} from '@/utils/select';
import WordList from '@/components/organisms/WordList.vue';
import CrosswordAnswerTile from '@/components/atoms/CrosswordAnswerTile.vue';
import CrosswordClueTile from '@/components/atoms/CrosswordClueTile.vue';
import RegexPattern from '@/utils/RegexPattern';
import {
  Coordinate, CrosswordTileData, TileTagName, CrosswordData, EventWithTarget,
} from '@/types';

// MAIN DATA
const selectedTile: Ref<null | HTMLInputElement> = ref(null);
const prevSelectedTile: Ref<null | HTMLInputElement> = ref(null);
const selectedSameTile = computed(() => prevSelectedTile.value === selectedTile.value);

const firstWordSearchTile: Ref<null | HTMLInputElement> = ref(null);

const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));

const INPUT_TILE_STYLES = ['selected-to-word-search', 'direction-marking-tile'];

const CSW_GRID_ELEMENT = ref();
onMounted(() => {
  CSW_GRID_ELEMENT.value = document.querySelector('#csw-grid');
});

// HANDLE CHILD COMP
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

// GRID TRAVERSE
function traverseCswGrid(
  startElement: HTMLInputElement | null,
  callback: (target: HTMLInputElement, arg: string[]) => void,
  args: string[] = [],
  stopCondition: (arg: HTMLInputElement) => boolean = () => false,
  _getNextTile: (arg: HTMLInputElement) => HTMLInputElement | null = getNextTile.value,
) {
  let target = startElement;
  while (target && target?.tagName === 'INPUT' && !stopCondition(target)) {
    callback(target, args);
    target = _getNextTile(target);
  }
}

function mapCswGrid(
  startElement: HTMLInputElement | null,
  callback: (target: HTMLInputElement, arg?: unknown) => string,
  stopCondition: (arg: HTMLInputElement) => boolean = () => false,
  _getNextTile: (arg: HTMLInputElement) => HTMLInputElement | null = getNextTile.value,
) {
  let target = startElement;
  console.log(target?.value);
  const _data: string[] = [];
  while (target && !stopCondition(target)) {
    console.log(target);
    _data.push(callback(target));
    target = _getNextTile(target);
  }
  return _data;
}

// REFACTOR!!! DEBUG!!!
// function keepFocus() {
//  if (selectedTile.value) {
//    selectedTile.value.focus();
//  }
// }

// WORD SEARCH HANDLERS
const regexPattern = reactive(new RegexPattern([]));
const filteredWords = reactive([]);

watch([firstWordSearchTile, isHorizontal], () => {
  console.log('change');
  regexPattern.set(mapCswGrid(firstWordSearchTile.value, (el) => el.value || '.'));
});
watch(regexPattern, (n, o) => console.log(n.get(), 'REGEXY', o.get()));

// FETCHING/SAVING DATA
function saveCrossword() {
  const tilesList: Array<HTMLElement> = Array.from(
    CSW_GRID_ELEMENT.value.querySelectorAll('td > *:first-child'),
  );
  let tilesData: Array<CrosswordTileData> = [];
  for (let i = 0; i < tilesList.length; i += props.cswWidth as number) {
    tilesData = tilesData.concat(
      tilesList.slice(i, i + (props.cswWidth as number)).map((el: HTMLElement) => ({
        value: (el as HTMLInputElement).value,
        tagName: el.tagName as TileTagName,
      })),
    );
  }
  const crosswordData: CrosswordData = {
    width: props.cswWidth as number,
    height: props.cswHeight as number,
    tiles: tilesData,
  };
  window.localStorage.setItem('crossword', JSON.stringify(crosswordData));
}

// EVENT HANDLERS
function handleEvents(target: EventTarget) {
  prevSelectedTile.value = selectedTile.value;
  selectedTile.value = target as HTMLInputElement;

  // SAME TILE
  if (selectedSameTile.value) {
    traverseCswGrid(
      firstWordSearchTile.value,
      removeStyle,
      INPUT_TILE_STYLES,
      (el) => el === selectedTile.value,
    );
    traverseCswGrid(
      getNextTile.value(selectedTile.value as HTMLInputElement),
      removeStyle,
      INPUT_TILE_STYLES,
    );

    isHorizontal.value = !isHorizontal.value;

    traverseCswGrid(getNextTile.value(selectedTile.value), addStyle, INPUT_TILE_STYLES);

    firstWordSearchTile.value = target as HTMLInputElement;
    regexPattern.set(mapCswGrid(firstWordSearchTile.value, (el) => el.value || '.', (el) => el.tagName === 'TEXTAREA'));

    // INSIDE 'SELECTED TO WORD SEARCH CLASS'
  } else if (selectedTile.value.classList.contains('selected-to-word-search')) {
    //
    // INSIDE 'SELECTED TO DIRECTION MARKING TILE CLASS'
    if (selectedTile.value.classList.contains('direction-marking-tile')) {
      traverseCswGrid(
        prevSelectedTile.value,
        removeStyle,
        ['direction-marking-tile'],
        (el) => el === selectedTile.value,
      );
    } else {
      traverseCswGrid(
        selectedTile.value,
        addStyle,
        ['direction-marking-tile'],
        (el) => el === prevSelectedTile.value,
      );
    }
    //
    // OUTSIDE 'SELECTED TO WORD SEARCH CLASS'
  } else {
    traverseCswGrid(firstWordSearchTile.value, removeStyle, INPUT_TILE_STYLES);
    INPUT_TILE_STYLES.map((cls) =>
      traverseCswGrid(selectedTile.value, addStyle, [cls], (el) => el.classList.contains(cls)));

    firstWordSearchTile.value = target as HTMLInputElement;
    regexPattern.set(mapCswGrid(firstWordSearchTile.value, (el) => el.value || '.'));
  }
}

function handleClickEvent(e: EventWithTarget) {
  if (e.target instanceof HTMLTextAreaElement) {
    console.log('HANDLE TEXTAREA SELECT');
  } else {
    e.target.focus();
    handleEvents(e.target as EventTarget);
  }
}

function handleInputEvent(e: InputEvent) {
  if (e.target instanceof HTMLInputElement) {
    e.target.value = e.data?.toUpperCase() || '';
    const nextTile = getNextTile.value(e.target);
    if (nextTile) {
      handleEvents(nextTile);
      nextTile.focus();
    }
  }
  saveCrossword();
}

function handleRightClick(e: EventWithTarget) {
  const coordValue = e.target.getAttribute('coord');
  traverseCswGrid(firstWordSearchTile.value, removeStyle, INPUT_TILE_STYLES);
  // MOUNT/UNMOUNT CROSSWORD INPUT TILE
  if (clueTileCoords.has(coordValue)) {
    clueTileCoords.delete(coordValue);
  } else {
    clueTileCoords.add(coordValue);
  }
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
