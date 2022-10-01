<template>
  <div class="csw-grid-wrapper">
    <div
      class="csw-grid"
      @input="onInputLetter($event)"
      @mousedown="onTileClick($event)"
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
        />
      </div>
      <p>{{ highlightedTilesLength }}</p>
    </div>
  </div>
</template>

<script setup>
import { TILE_SIZE_REM } from '@/constants';
import { computed, ref } from 'vue';
import { selectNextNthElement, selectNextSibling } from '@/utils/select';
import CrosswordTile from '../atoms/CrosswordTile.vue';

const props = defineProps({
  cswWidth: Number,
  cswHeight: Number,
});

const cswWrapperWidth = computed(() => props.cswWidth * TILE_SIZE_REM);
const cswWrapperHeight = computed(() => props.cswHeight * TILE_SIZE_REM);

const selectedTile = ref(null);
const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextNthElement : selectNextSibling));

// pass this to dedicated component
const highlightedTilesLength = ref(0);

// STYLE HANDLERS

function displayWritingDirection() {
  highlightedTilesLength.value = 1;
  let nextTile = getNextTile.value(selectedTile.value);
  while (nextTile) {
    nextTile.classList.add('direction-marking-tile');
    nextTile = getNextTile.value(nextTile);
    highlightedTilesLength.value += 1;
  }
}

function stopDisplayWritingDirection() {
  let nextTile = getNextTile.value(selectedTile.value);
  while (nextTile) {
    nextTile.classList.remove('direction-marking-tile');
    nextTile = getNextTile.value(nextTile);
  }
}

// SELECTION HANDLERS
function setSelectedTile(targetTile) {
  selectedTile.value = targetTile;
}

function onTileClick(e) {
  if (selectedTile.value) {
    stopDisplayWritingDirection();
  }

  if (selectedTile.value === e.target) {
    isHorizontal.value = !isHorizontal.value;
  } else {
    setSelectedTile(e.target);
  }

  displayWritingDirection();
}

function onInputLetter(e) {
  if (e.data) {
    e.target.value = e.data.toUpperCase();
  }

  const nextTile = getNextTile.value(e.target);
  if (nextTile) {
    nextTile.focus();
    stopDisplayWritingDirection();
    setSelectedTile(nextTile);
    displayWritingDirection();
  }
}
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
