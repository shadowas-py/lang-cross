<template>
  <div class="csw-grid-wrapper">
    <table
      id="csw-grid"
      class="csw-grid"
      @input="handleInputEvent($event as any)"
      @mousedown.left.stop="handleClickEvent($event as EventWithTarget)"
      @mousedown.right="handleRightClick($event.target as HTMLInputElement)"
      @click.stop=""
      @contextmenu.prevent
    >
      <tr v-for="row in csw.height" :key="row" class="csw-row" :id="`csw-row-${row}`">
        <td v-for="col in csw.width" :key="`${col}-${row}`">
          <!-- TO CHANGE -->
          <template
            v-if="
              csw.getTileAttr(`${col},${row}`, 'tagName') !== 'TEXTAREA'
            ">
            <slot
              name="inputTile"
              :slotProps="{
                class: `input-tile ${col}-${row}-tile`,
                id: `${col}-${row}-tile`,
                coord: [col, row],
              }"
            >
            </slot>
          </template>
          <template v-else>
            <slot
              name="clueTile"
              :slotProps="{ class: `clue-tile`, id: `${col}-${row}-tile`, coord: [col, row] }"
            >
            </slot>
          </template>
        </td>
      </tr>
    </table>
    <p></p>
  </div>
</template>

<script lang="ts" setup>
import {
  computed, Ref, ref, reactive, watch,
} from 'vue';
import { selectNextNthElement, selectNextSibling } from '@/utils/crosswordGridSelectors';
import RegexPattern from '@/utils/RegexPattern';
import { EventWithTarget } from '@/types';
import { removeStyle, addStyle } from '@/utils/styleHandlers';
import { mapCswGrid, traverseCswGrid } from '@/utils/crosswordGridIterators';
import CrosswordData, { ICrosswordData, CoordKey } from '@/controllers/CrosswordState';

// MAIN DATA
const props = defineProps({
  csw: {
    type: Object,
    required: true,
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    tiles: Object,
  },
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
// const CSW_GRID_ELEMENT = ref();
// const crosswordData = ref();
// onMounted(() => {
//  CSW_GRID_ELEMENT.value = document.querySelector('#csw-grid');
//  crosswordData.value = Crossword.fromComponent(
//    props.cswWidth as number,
//    props.cswHeight as number,
//    CSW_GRID_ELEMENT.value,
//  );
//  crosswordData.value.save();
// });

// INITIALIZING CROSSWORD STATE
const csw = reactive(new CrosswordData(props.csw as ICrosswordData));
// if (!props.csw.gridData) {
//  const crosswordState = reactive(
//    ,
//  );
// } else {
//  console.log('NO DATA');
// }

// HANDLE TILES IDENTITY
// const clueTileCoords = reactive(new Set());

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

function handleInputEvent(e: InputEvent) {
  const { target } = e;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    const coord = target.getAttribute('coord') as CoordKey;
    csw.setTileAttr(coord, 'value', target.value);
    if (target instanceof HTMLInputElement) {
      target.value = target.value.toUpperCase();
      const nextTile = getNextTile.value(target);
      if (nextTile && nextTile?.tagName === 'INPUT') {
        handleEvents(nextTile);
        nextTile.focus();
      }
    }
  }
}

function handleRightClick(target: HTMLInputElement) {
  const coord = target.getAttribute('coord') as CoordKey;
  traverseCswGrid(firstWordSearchTile.value, removeStyle, getNextTile.value, INPUT_TILE_STYLES);
  // MOUNT/UNMOUNT CROSSWORD INPUT TILE
  if (csw.getTileAttr(coord, 'tagName') === 'INPUT') {
    csw.setTileAttr(coord, 'tagName', 'TEXTAREA');
  } else {
    csw.setTileAttr(coord, 'tagName', 'INPUT');
    csw.setTileAttr(coord, 'value', '');
  }
}
</script>

<style>
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
.input-tile {
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
  background-color: var(--next-active-tile-color);
}
.selected-to-word-search {
  border: 1px solid blue;
}
</style>
