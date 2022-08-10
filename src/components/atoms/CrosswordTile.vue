<template>
  <input
    @focus="
      addStyle($event, 'selected-sibling');
      selectContent($event)"
    @blur="removeStyle($event, 'selected-sibling')"
    @click="handleDirection($event, 'selected-sibling')"
    value=""
    maxlength="1"
    :class="classNames"
    :id="elementId"
    :style="{ width: `${F_TILE_SIZE_REM}`, height: `${F_TILE_SIZE_REM}` }"
  />
  <!-- backgroundColor: `${props.cswColor}` -->
</template>

<script setup>
import { F_TILE_SIZE_REM } from '@/constants';
import { inject } from 'vue';
import { selectNextNthElement, selectNextSibling } from '@/utils/Select';

const { getIsHorizontal } = inject('isHorizontal');
const { getPrevTargetTile } = inject('prevTargetTile');

const props = defineProps({
  colNumber: Number,
  rowNumber: Number,
  value: String,
  cswColor: String,
});
const emit = defineEmits(['updateIsHorizontal']);

const classNames = $computed(() => `tile col-${props.colNumber}`);
const elementId = $computed(() => `${props.colNumber}-${props.rowNumber}`);

function selectContent(e) {
  e.target.select();
}

function addStyle(e, name) {
  const selectNextElement = getIsHorizontal() ? selectNextSibling : selectNextNthElement;
  let nextEl = selectNextElement(e.target);
  while (nextEl) {
    nextEl.classList.add(name);
    nextEl = selectNextElement(nextEl);
  }
}
function removeStyle(e, name) {
  const selectNextElement = getIsHorizontal() ? selectNextSibling : selectNextNthElement;
  let nextEl = selectNextElement(e.target);
  while (nextEl) {
    nextEl.classList.remove(name);
    nextEl = selectNextElement(nextEl);
  }
}

function handleDirection(e, name) {
  removeStyle(e, name);
  emit('updateIsHorizontal', e.target);
  if (getPrevTargetTile() === e.target) {
    addStyle(e, name);
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

.tile {
  box-sizing: border-box;
  border: 1px solid black;
  text-align: center;
  outline: none;
  font-weight: bold;
  font-size: 1.8rem;
  font-family: 'Patrick Hand', cursive;
  caret-color: black;
  color: darkblue;
  -webkit-appearance: none;
}

.tile:focus {
  background-color: cadetblue;
  border: 2px solid red;
}
.selected-sibling {
  background-color: blueviolet;
}
</style>
