<template>
  <div class="csw-grid-wrapper">
    <table
      id="csw-grid"
      class="csw-grid"
      @input="handleInputEvent($event as any)"
      @mousedown.left.stop="handleClickEvent($event as EventWithTarget)"
      @mousedown.right="handleRightClick($event as EventWithTarget)"
      @click.stop=""
      @contextmenu.prevent
    >
      <tr v-for="row in cswHeight" :key="row" class="csw-row" :id="`csw-row-${row}`">
        <td v-for="col in cswWidth" :id="`csw-td-${col}-${row}`" :key="`${col}-${row}`">
          <CrosswordAnswerTile
            v-if="isInputTile([col, row])"
            :class="`tile answer-tile ${col}-${row}-tile`"
            :id="`${col}-${row}-tile`"
            :coord="[col, row]"
          />
          <CrosswordClueTile
            v-else
            :class="`tile clue-tile ${col}-${row}-tile`"
            :id="`${col}-${row}-tile)`"
            :coord="[col, row]"
            :inputCoord="undefined"
            :inputOrientation="undefined"
          />
        </td>
      </tr>
    </table>
    <p></p>
  </div>
</template>

<script lang="ts" setup>
import {
  computed, Ref, ref, reactive, onMounted, watch,
} from 'vue';
import { selectNextNthElement, selectNextSibling } from '@/utils/select';
import CrosswordAnswerTile from '@/components/atoms/CrosswordAnswerTile.vue';
import CrosswordClueTile from '@/components/atoms/CrosswordClueTile.vue';
import RegexPattern from '@/utils/RegexPattern';
import Crossword from '@/controllers/CrosswordState';
import { Coordinate, EventWithTarget } from '@/types';
import { removeStyle, addStyle } from '@/utils/styleHandler';
import { mapCswGrid, traverseCswGrid } from '@/controllers/CrosswordMethods';

// MAIN DATA
const props = defineProps({
  cswWidth: Number,
  cswHeight: Number,
});
const emits = defineEmits(['regexPatternChange']);

const selectedTile: Ref<null | HTMLInputElement> = ref(null);
const prevSelectedTile: Ref<null | HTMLInputElement> = ref(null);
const selectedSameTile = computed(() => prevSelectedTile.value === selectedTile.value);

const firstWordSearchTile: Ref<null | HTMLInputElement> = ref(null);

const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));

const INPUT_TILE_STYLES = ['selected-to-word-search', 'direction-marking-tile'];

// CROSSWORD STATE
const CSW_GRID_ELEMENT = ref();
const crosswordData = ref();
onMounted(() => {
  CSW_GRID_ELEMENT.value = document.querySelector('#csw-grid');
  crosswordData.value = new Crossword(
    props.cswWidth as number,
    props.cswHeight as number,
    CSW_GRID_ELEMENT.value,
  );
  crosswordData.value.save();
});

// HANDLE TILES IDENTITY
const clueTileCoords = reactive(new Set());
const isInputTile = (coord: Coordinate) => !clueTileCoords.has(coord.toString());

// WORD SEARCH HANDLERS
const regexPattern = reactive(new RegexPattern([]));
watch([firstWordSearchTile, isHorizontal], () => {
  regexPattern.set(
    mapCswGrid(
      firstWordSearchTile.value,
      (el) => el.value.toLowerCase() || '.',
      getNextTile.value,
      (el) => el.tagName !== 'INPUT',
    ),
  );
  emits('regexPatternChange', regexPattern.get());
});

// EVENT HANDLERS
function handleEvents(target: EventTarget) {
  prevSelectedTile.value = selectedTile.value;
  selectedTile.value = target as HTMLInputElement;

  // SAME TILE
  if (selectedSameTile.value) {
    traverseCswGrid(
      firstWordSearchTile.value,
      removeStyle,
      getNextTile.value,
      INPUT_TILE_STYLES,
      (el) => el === selectedTile.value,
    );
    traverseCswGrid(
      getNextTile.value(selectedTile.value as HTMLInputElement),
      removeStyle,
      getNextTile.value,
      INPUT_TILE_STYLES,
    );

    isHorizontal.value = !isHorizontal.value;

    traverseCswGrid(
      getNextTile.value(selectedTile.value),
      addStyle,
      getNextTile.value,
      INPUT_TILE_STYLES,
    );

    firstWordSearchTile.value = target as HTMLInputElement;

    // INSIDE 'SELECTED TO WORD SEARCH CLASS'
  } else if (selectedTile.value.classList.contains('selected-to-word-search')) {
    //
    // INSIDE 'SELECTED TO DIRECTION MARKING TILE CLASS'
    if (selectedTile.value.classList.contains('direction-marking-tile')) {
      traverseCswGrid(
        prevSelectedTile.value,
        removeStyle,
        getNextTile.value,
        ['direction-marking-tile'],
        (el) => el === selectedTile.value,
      );
    } else {
      traverseCswGrid(
        selectedTile.value,
        addStyle,
        getNextTile.value,
        ['direction-marking-tile'],
        (el) => el === prevSelectedTile.value,
      );
    }
    //
    // OUTSIDE 'SELECTED TO WORD SEARCH CLASS'
  } else {
    traverseCswGrid(firstWordSearchTile.value, removeStyle, getNextTile.value, INPUT_TILE_STYLES);
    INPUT_TILE_STYLES.map((cls) =>
      traverseCswGrid(selectedTile.value, addStyle, getNextTile.value, [cls], (el) =>
        el.classList.contains(cls)));
    firstWordSearchTile.value = target as HTMLInputElement;
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

function handleInputEvent(e: EventWithTarget & { data: string; target: { value: string } }) {
  console.log('HANDLE INPUT');
  if (e.target instanceof HTMLInputElement) {
    e.target.value = e.data?.toUpperCase() || '';
    const nextTile = getNextTile.value(e.target);
    if (nextTile) {
      handleEvents(nextTile);
      nextTile.focus();
    }
  }
  const coord = e.target?.getAttribute('coord')?.split(',').map(Number);
  crosswordData.value.update(coord, e.target);
}

function handleRightClick(e: EventWithTarget) {
  const coordValue = e.target.getAttribute('coord');
  traverseCswGrid(firstWordSearchTile.value, removeStyle, getNextTile.value, INPUT_TILE_STYLES);
  // MOUNT/UNMOUNT CROSSWORD INPUT TILE
  if (clueTileCoords.has(coordValue)) {
    clueTileCoords.delete(coordValue);
  } else {
    clueTileCoords.add(coordValue);
  }
  const coord = coordValue?.split(',').map(Number);
  // console.log(coord, 'HANDLE', e.target);
  crosswordData.value.update(coord, e.target);
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
  background-color: var(--hover-tile-color);
}
.tile:focus {
  background-color: var(--selected-tile-color);
  border: 2px solid var(--selected-tile-border-color);
}
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
  background-color: var(--selected-tile-secondary-color);
}
.selected-to-word-search {
  border: 1px solid blue;
}
</style>
