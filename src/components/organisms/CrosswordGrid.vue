<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <div class="csw-grid-wrapper">
    <div
      class="csw-grid"
      @input="onInputLetter"
      :style="{
        width: `${cswWrapperWidth}rem`,
        height: `${cswWrapperHeight}rem`,
      }"
    >
      <div v-for="row in cswHeight" :key="row" class="csw-row" :id="`csw-row-${row}`">
        <CrosswordTile
          v-for="col in props.cswWidth"
          :key="`${col}-${row}`"
          :colNumber="col"
          :rowNumber="row"
          @click="onTileClick($event)"
        />
      </div>
      <!-- <CrosswordRow
        v-for="i in cswHeight"
        :key="i"
        :cswWidth="cswWidth"
        :cswColor="cswColor"
        :rowNumber="i"
        @updateIsHorizontal="toggleWritingDirection"
      /> -->
    </div>
  </div>
</template>

<script setup>
// import CrosswordRow from '@/components/molecules/CrosswordRow.vue';
import { TILE_SIZE_REM } from '@/constants';
import { computed, ref } from 'vue';
import { selectNextNthElement, selectNextSibling } from '@/utils/Select';
import CrosswordTile from '../atoms/CrosswordTile.vue';

const props = defineProps({
  cswWidth: Number,
  cswHeight: Number,
});

const cswWrapperWidth = computed(() => props.cswWidth * TILE_SIZE_REM);
const cswWrapperHeight = computed(() => props.cswHeight * TILE_SIZE_REM);

const isHorizontal = ref(true);
const lastTargetTile = ref(null);

// SELECTION HANDLERS
function onTileClick(e) {
  if (lastTargetTile.value === e.target) {
    isHorizontal.value = !isHorizontal.value;
  }
  lastTargetTile.value = e.target;
  e.target.select();
  console.log('IS HORIZONTAL?', isHorizontal.value);
}

function onInputLetter(e) {
  if (e.data) {
    e.target.value = e.data.toUpperCase();
  }
  const selectNext = isHorizontal.value ? selectNextSibling : selectNextNthElement;
  const nextEl = selectNext(e.target);
  if (nextEl) {
    nextEl.focus();
    lastTargetTile.value = nextEl;
    nextEl.select();
  }
}
// STYLE HANDLERS
// eslint-disable-next-line no-unused-vars
function addStyleClass(e, name) {
  const selectNextElement = isHorizontal.value ? selectNextSibling : selectNextNthElement;
  let nextEl = selectNextElement(e.target);
  while (nextEl) {
    nextEl.classList.add(name);
    nextEl = selectNextElement(nextEl);
  }
}
// eslint-disable-next-line no-unused-vars
function removeStyleClass(e, name) {
  const selectNextElement = isHorizontal.value ? selectNextSibling : selectNextNthElement;
  let nextEl = selectNextElement(e.target);
  while (nextEl) {
    nextEl.classList.remove(name);
    nextEl = selectNextElement(nextEl);
  }
}

// eslint-disable-next-line no-unused-vars
// function handleDirection(e, name) {
//   console.log('handle direction');
//   removeStyleClass(e, name);
//   if (getPrevTargetTile() === e.target) {
//     addStyleClass(e, name);
//   }
// }
</script>

<style scoped>
.csw-grid {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  width: fit-content;
}
.csw-grid-wrapper {
  width: fit-content;
  margin: 0 auto auto;
  border: 0.2rem solid black;
}
</style>
