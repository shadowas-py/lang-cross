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
          <template v-if="csw.getTileAttr(`${col},${row}`, 'tileType') === 'INPUT'">
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
import { reactive, ref } from 'vue';
import { EventWithTarget } from '@/types';
import CrosswordData, { ICrosswordData, CoordKey, CrosswordTile } from '@/controllers/CrosswordState';
import { storeToRefs } from 'pinia';
import { useCrosswordStore } from '@/stores/crosswordStore';

// MAIN DATA
const props = defineProps({
  csw: {
    type: Object,
    required: true,
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    tiles: Object,
  },
  hooks: {
    type: Object,
    beforeDirectionChange: Array,
    afterDirectionChange: Array,
    afterTileChange: Array,
    afterRightClick: Array,
  },
  editMode: Boolean,
});
const store = useCrosswordStore();
const {
  selectedTile, prevSelectedTile, isSelectedSameTile, isHorizontal, getNextTile,
} = storeToRefs(store);

// CROSSWORD STATE
const csw = reactive(new CrosswordData(props.csw as ICrosswordData));
const isEditMode = ref();

// HOOKS
function useCswHook(functions: Array<() => void> | undefined) {
  if (functions) {
    functions.forEach((func) => {
      func();
    });
  }
}

// EVENT HANDLERS
function handleEvents(target: HTMLInputElement) {
  prevSelectedTile.value = selectedTile.value;
  selectedTile.value = target;
  if (isSelectedSameTile.value) {
    if (selectedTile.value) {
      useCswHook(props.hooks?.beforeDirectionChange);
      isHorizontal.value = !isHorizontal.value;
      useCswHook(props.hooks?.afterDirectionChange);
    }
  } else {
    useCswHook(props.hooks?.afterTileChange);
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
  useCswHook(props.hooks?.afterRightClick);
  // MOUNT/UNMOUNT CROSSWORD INPUT TILE
  if (isEditMode.value) {
    const coord = target.getAttribute('coord') as CoordKey;
    csw.toogleTileType(coord);
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
