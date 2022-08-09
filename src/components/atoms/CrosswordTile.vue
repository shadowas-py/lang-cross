<template>
  <input
    @click="selectContent"
    @blur="tileStyleHander($event, 'selected-sibling', 'REMOVE')"
    @focus="tileStyleHander($event, 'selected-sibling', 'ADD')"
    value=""
    maxlength="1"
    :class="classNames"
    :style="{ width: `${F_TILE_SIZE_REM}`, height: `${F_TILE_SIZE_REM}` }"
  />
      <!-- backgroundColor: `${props.cswColor}` -->
</template>

<script setup>
import { F_TILE_SIZE_REM } from '@/constants';
import { inject } from 'vue';

const props = defineProps({ colNumber: Number, value: String, cswColor: String });
const { getIsHorizontal } = inject('isHorizontal');
const classNames = $computed(() => `tile col-${props.colNumber}`);

function selectContent(e) {
  e.target.select();
}

function selectNextSibling(el) {
  return el.nextElementSibling;
}

function selectNextNthElement(el) {
  console.log(el.id);
  return el;
}

function tileStyleHander(e, name, action) {
  const selectingNextElement = getIsHorizontal ? selectNextSibling : selectNextNthElement;
  let nextEl = selectingNextElement(e.target);
  while (nextEl) {
    switch (action) {
    case 'ADD': {
      nextEl.classList.add(name);
      break;
    }
    case 'REMOVE': {
      nextEl.classList.remove(name);
      break;
    }
    default:
      throw Error('wrong action');
    }
    nextEl = selectingNextElement(nextEl);
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
/* .tile:focus ~ .tile {
  background-color: powderblue;
}
.tile:focus + .tile {
  background-image: url('@/static/images/arrow.png');
  background-size: 90%;
  background-position: center;
  background-repeat: no-repeat;
} */
.selected-sibling {
  background-color: blueviolet;
}
</style>
