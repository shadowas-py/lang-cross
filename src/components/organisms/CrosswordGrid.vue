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
          @mousedown.left="onTileClick($event)"
          @contextmenu.prevent
          @mousedown.middle.prevent
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

// SETTERS
function toggleWritingDirection() {
  isHorizontal.value = !isHorizontal.value;
}

// STYLE HANDLERS
function displayWritingDirection(target, name) {
  const selectNextElement = isHorizontal.value ? selectNextSibling : selectNextNthElement;
  let nextEl = selectNextElement(target);
  if (!target.readOnly) {
    while (nextEl && !nextEl.readOnly) {
      nextEl.classList.add(name);
      nextEl = selectNextElement(nextEl);
    }
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
  if (!targetTile.readOnly) {
    selectedTile.value = targetTile;
    targetTile.select();
  }
}

function onTileClick(e) {
  if (selectedTile.value === e.target && !e.target.readOnly) {
    stopDisplayingWritingDirection(e.target, 'direction-marking-tile');
    toggleWritingDirection();
    displayWritingDirection(e.target, 'direction-marking-tile');
  } else if (e.target.readOnly) {
    stopDisplayingWritingDirection(e.target, 'direction-marking-tile');
    console.log('selected LOCKED', e.target.value);
  }
}
function onInputLetter(e) {
  if (e.data) {
    e.target.value = e.data.toUpperCase();
  }
  const selectNext = isHorizontal.value ? selectNextSibling : selectNextNthElement;
  const nextEl = selectNext(e.target);
  if (nextEl && !nextEl.readOnly) {
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
