<template>
  <input
    @focus="addStyle($event, 'selected-sibling')"
    @blur="removeStyle($event, 'selected-sibling')"
    @click.prevent="handleDirection($event,'selected-sibling')"
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

const { getIsHorizontal } = inject('isHorizontal');
const { getPrevTargetTile } = inject('prevTargetTile');
// const isHorizontal = getIsHorizontal();
// let prevIsHorizontal = true;
const props = defineProps({
  colNumber: Number,
  rowNumber: Number,
  value: String,
  cswColor: String,
});

const classNames = $computed(() => `tile col-${props.colNumber}`);
const elementId = $computed(() => `${props.colNumber}-${props.rowNumber}`);

// function selectContent(e) {
//   e.target.select();
// }

function selectNextSibling(el) {
  return el.nextElementSibling;
}

function selectNextNthElement(el) {
  const colNr = el.id.split('-')[0] - 1;
  if (el.parentElement.nextElementSibling) {
    return el.parentElement.nextElementSibling.children[colNr];
  }
  return null;
}

function addStyle(e, name) {
  const selectNextElement = getIsHorizontal() ? selectNextSibling : selectNextNthElement;
  let nextEl = selectNextElement(e.target);
  // console.log('add', getIsHorizontal());
  while (nextEl) {
    nextEl.classList.add(name);
    nextEl = selectNextElement(nextEl);
  }
}
function removeStyle(e, name) {
  const selectNextElement = getIsHorizontal() ? selectNextSibling : selectNextNthElement;
  let nextEl = selectNextElement(e.target);
  // console.log('remove', getIsHorizontal());
  while (nextEl) {
    nextEl.classList.remove(name);
    nextEl = selectNextElement(nextEl);
  }
}

function handleDirection(e, name) {
  getIsHorizontal();
  console.log(getIsHorizontal(), 'PREF VALUIE OR ACTUAL?');
  if (getPrevTargetTile() === e.target) {
    // console.log('remove after click', getIsHorizontal());
    removeStyle(e, name);
    // console.log('add after click', getIsHorizontal());
    addStyle(e, name);
  }
}

// function tileStyleHander(e, name, action) {
//   const selectingNextElement = getIsHorizontal() ? selectNextSibling : selectNextNthElement;
//   let nextEl = selectingNextElement(e.target);
//   while (nextEl) {
//     switch (action) {
//     case 'ADD': {
//       console.log('ADD');
//       nextEl.classList.add(name);
//       break;
//     }
//     case 'REMOVE': {
//       console.log('REMOVE');
//       nextEl.classList.remove(name);
//       break;
//     }
//     default:
//       throw Error('wrong action');
//     }
//     nextEl = selectingNextElement(nextEl);
//   }
// }
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
