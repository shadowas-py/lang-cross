<template>
  <input
    value=""
    maxlength="1"
    :class="classNames"
    @input="convertToUpperCase"
    :style="{ width: `${F_TILE_SIZE_REM}`, height: `${F_TILE_SIZE_REM}` }"
  />
</template>

<script setup>
import { F_TILE_SIZE_REM } from '@/constants';

const props = defineProps({ colNumber: Number, value: String });

const classNames = $computed(() => `tile col-${props.colNumber}`);
function convertToUpperCase(e) {
  e.target.value = e.target.value.toUpperCase();
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
.tile:focus ~ .tile {
  background-color: powderblue;
}
.tile:focus + .tile {
  background-image: url('@/static/images/arrow.png');
  background-size: 90%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
