<template>
  <input
    value=""
    maxlength="1"
    :class="classNames"
    :id="elementId"
    :style="{ width: `${F_TILE_SIZE_REM}`, height: `${F_TILE_SIZE_REM}` }"
  />
</template>

<script setup>
import { F_TILE_SIZE_REM } from '@/constants';

const props = defineProps({
  colNumber: Number,
  rowNumber: Number,
  value: String,
});

const classNames = $computed(() => `tile col-${props.colNumber}`);
const elementId = $computed(() => `${props.colNumber}-${props.rowNumber}-tile`);
</script>

<style scoped>
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
  cursor: default;
}
.tile:hover {
  background-color: var(--hover-tile);
}
.tile:focus {
  background-color: var(--selected-tile);
  border: 2px solid var(--selected-tile-border);
}
.direction-marking-tile {
  background-color: var(--selected-sibling);
}
</style>
