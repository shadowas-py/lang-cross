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
          @mousedown="onTileClick($event)"
          @focus="
            displayWritingDirection($event.target, 'direction-marking-tile'),
              selectTile($event.target)
          "
          @blur="
            stopDisplayingWritingDirection($event.target, 'direction-marking-tile'),
              (selectedTile = null)
          "
        />
      </div>
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

const isHorizontal = ref(true);
const selectedTile = ref(null);

// STYLE HANDLERS
function displayWritingDirection(target, name) {
  const selectNextElement = isHorizontal.value ? selectNextSibling : selectNextNthElement;
  let nextEl = selectNextElement(target);
  while (nextEl) {
    nextEl.classList.add(name);
    nextEl = selectNextElement(nextEl);
  }
}

function stopDisplayingWritingDirection(target, name) {
  const selectNextElement = isHorizontal.value ? selectNextSibling : selectNextNthElement;
  let nextEl = selectNextElement(target);
  while (nextEl) {
    nextEl.classList.remove(name);
    nextEl = selectNextElement(nextEl);
  }
}

// SELECTION HANDLERS
function selectTile(targetTile) {
  selectedTile.value = targetTile;
  targetTile.select();
}

function onTileClick(e) {
  if (selectedTile.value === e.target) {
    stopDisplayingWritingDirection(e.target, 'direction-marking-tile');
    isHorizontal.value = !isHorizontal.value;
    displayWritingDirection(e.target, 'direction-marking-tile');
  }
}
function onInputLetter(e) {
  if (e.data) {
    e.target.value = e.data.toUpperCase();
  }
  const selectNext = isHorizontal.value ? selectNextSibling : selectNextNthElement;
  const nextEl = selectNext(e.target);
  if (nextEl) {
    nextEl.focus();
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
