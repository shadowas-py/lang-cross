<template>
  <div class="csw-grid-wrapper">
    <div
      class="csw-grid"
      @input="onInputLetter($event)"
      @mousedown.left="onTileClick($event)"
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
          @setLocked="stopDisplayWritingDirection"
          @setActive="displayWritingDirection"
        />
      </div>
    </div>
    <p>{{ highlightedTilesLength }}</p>
    <WordSearchEngine/>
  </div>
</template>

<script setup>
import { TILE_SIZE_REM } from '@/constants';
import { computed, ref } from 'vue';
import { selectNextNthElement, selectNextSibling } from '@/utils/select';
import WordSearchEngine from '@/components/organisms/WordSearchEngine.vue';
import CrosswordTile from '../atoms/CrosswordTile.vue';

const props = defineProps({
  cswWidth: Number,
  cswHeight: Number,
});

const cswWrapperWidth = computed(() => props.cswWidth * TILE_SIZE_REM);
const cswWrapperHeight = computed(() => props.cswHeight * TILE_SIZE_REM);

const selectedTile = ref(null);
const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));

// pass this to dedicated component
const highlightedTilesLength = ref(0);

// SETTERS
function toggleWritingDirection() {
  isHorizontal.value = !isHorizontal.value;
}

// STYLE HANDLERS
function displayWritingDirection() {
  highlightedTilesLength.value = 1;
  let nextTile = getNextTile.value(selectedTile.value);
  while (nextTile && !nextTile.classList.contains('locked-tile')) {
    highlightedTilesLength.value += 1;
    nextTile.classList.add('direction-marking-tile');
    nextTile = getNextTile.value(nextTile);
  }
}

function stopDisplayWritingDirection(customTile = null) {
  let nextTile = getNextTile.value(customTile || selectedTile.value);
  if (customTile && customTile.classList.contains('direction-marking-tile')) {
    highlightedTilesLength.value -= 1;
  }
  while (nextTile && !nextTile.classList.contains('locked-tile')) {
    if (nextTile.classList.contains('direction-marking-tile')) {
      highlightedTilesLength.value -= 1;
    }
    nextTile.classList.remove('direction-marking-tile');
    nextTile = getNextTile.value(nextTile);
  }
}

// SELECTION HANDLERS
function setSelectedTile(targetTile) {
  if (!targetTile.readOnly) {
    selectedTile.value = targetTile;
  }
}

function onTileClick(e) {
  if (selectedTile.value) {
    stopDisplayWritingDirection();
  }

  if (selectedTile.value === e.target) {
    toggleWritingDirection();
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
  if (nextTile && !nextTile.readOnly) {
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
