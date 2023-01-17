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
          <template v-if="csw.getTileAttr(`${col},${row}`, 'tagName') !== 'TEXTAREA'">
            <slot
              name="inputTile"
              :slotProps="{
                value: csw.getTileAttr(`${col},${row}`, 'value')?.toUpperCase(),
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
              :slotProps="{
                value: csw.getTileAttr(`${col},${row}`, 'value'),
                class: `clue-tile`,
                id: `${col}-${row}-tile`,
                coord: [col, row],
              }"
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
import { mapCswGrid, traverseCswGridInputs } from '@/utils/crosswordGridIterators';
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

// !!! to remove from here
const firstWordSearchTile: Ref<null | HTMLInputElement> = ref(null);

const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));

// !!! to rename
const INPUT_TILE_STYLES = ['selected-to-word-search', 'direction-marking-tile'];

// CROSSWORD STATE
const csw = reactive(new CrosswordData(props.csw as ICrosswordData));

// WORD SEARCH HANDLERS
const regexPattern = reactive(new RegexPattern([]));

// !!! to simpify, to remove from here
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
function handleEvents(target: HTMLInputElement) {
  prevSelectedTile.value = selectedTile.value;
  selectedTile.value = target;

  // SAME TILE
  if (selectedSameTile.value) {
    // BEFORE DIRECTION CHANGE ()
    let startElement =
      firstWordSearchTile.value === selectedTile.value ?
        getNextTile.value(selectedTile.value) :
        firstWordSearchTile.value;

    traverseCswGridInputs(
      startElement,
      removeStyle,
      getNextTile.value,
      INPUT_TILE_STYLES,
      undefined,
      (el) => el === selectedTile.value,
    );

    isHorizontal.value = !isHorizontal.value;

    // AFTER DIRECTION CHANGE ()
    startElement = getNextTile.value(selectedTile.value);
    traverseCswGridInputs(
      startElement,
      addStyle,
      getNextTile.value,
      INPUT_TILE_STYLES,
    );

    // !!! REGEX View  to => AFTER DIRECTION CHANGE ()
    firstWordSearchTile.value = target;

    // INSIDE 'SELECTED TO WORD SEARCH CLASS'
    // customStyling()
    // !!! to refactor
  } else if (selectedTile.value.classList.contains('selected-to-word-search')) {
    //
    // INSIDE 'SELECTED TO DIRECTION MARKING TILE CLASS'
    if (selectedTile.value.classList.contains('direction-marking-tile')) {
      traverseCswGridInputs(
        prevSelectedTile.value,
        removeStyle,
        getNextTile.value,
        ['direction-marking-tile'],
        (el) => el === selectedTile.value,
      );
    } else {
      traverseCswGridInputs(
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
    traverseCswGridInputs(
      firstWordSearchTile.value,
      removeStyle,
      getNextTile.value,
      INPUT_TILE_STYLES,
    );
    INPUT_TILE_STYLES.map((cls) =>
      traverseCswGridInputs(
        selectedTile.value,
        addStyle,
        getNextTile.value,
        [cls],
        (el) => !el || !el.classList.contains(cls),
      ));
    firstWordSearchTile.value = target;
  }
}

function handleClickEvent(e: MouseEvent) {
  if (e.target instanceof HTMLTextAreaElement) {
    console.log('HANDLE TEXTAREA SELECT');
  } else if (e.target instanceof HTMLInputElement) {
    e.target.focus();
    handleEvents(e.target);
  }
}

function handleInputEvent(e: InputEvent) {
  const { target } = e;
  if (target instanceof HTMLTextAreaElement || target instanceof HTMLTextAreaElement) {
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
  traverseCswGridInputs(
    firstWordSearchTile.value,
    removeStyle,
    getNextTile.value,
    INPUT_TILE_STYLES,
  );
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
