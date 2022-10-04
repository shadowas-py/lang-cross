<template>
  <div class="csw-grid-wrapper">
    <div
      class="csw-grid"
      @input="onInputLetter($event)"
      @mousedown.left="setSelectedTile($event.target)"
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
          @focus="$event.target.select()"
          @mouseup.left="
            ($event) => {
              if (selectedTile === $event.target) {
                $event.target.select();
              }
            }
          "
        />
      </div>
    </div>
    <p>^{{ charsSequence }}$</p>
    <WordSearchEngine :pattern="regexPattern" />
  </div>
</template>
@setLocked="stopDisplayWritingDirection" @setActive="displayWritingDirection"
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
const charsSequence = ref('');
const regexPattern = ref(/./);
// SETTERS
function toggleWritingDirection() {
  isHorizontal.value = !isHorizontal.value;
}

function generateWordPattern(target) {
  // eslint-disable-next-line no-useless-concat
  charsSequence.value += target.value.toLowerCase() || '.';
  // console.log(regexPattern.value);
}

function setRegexPattern() {
  regexPattern.value = new RegExp(`^${charsSequence.value}$`);
}

// STYLE HANDLERS
function toggleWritingDirectionDisplay(target) {
  if (target.classList.contains('direction-marking-tile')) {
    target.classList.remove('direction-marking-tile');
  } else {
    target.classList.add('direction-marking-tile');
  }
}

// MAIN HANDLER
function iterateInGrid(startTarget, callbacks) {
  let nextTile = getNextTile.value(startTarget);
  while (nextTile && !nextTile.classList.contains('locked-tile')) {
    for (let i = 0; i < callbacks.length; i += 1) {
      callbacks[i](nextTile);
    }
    nextTile = getNextTile.value(nextTile);
  }
}

// watch(isHorizontal, (newSelected, oldSelected) => {
//   console.log(newSelected, oldSelected, 'WRITING DIR');
//   iterateInGrid(selectedTile.value, [toggleWritingDirectionDisplay]);
//   // iterateInGrid(selectedTile.value, [toggleWritingDirectionDisplay]);
// });

// watch(selectedTile, (newSelected, oldSelected) => {
//   // console.log(newSelected, oldSelected, 'SELECTED');

// });

// SELECTION HANDLERS
function setSelectedTile(targetTile) {
  charsSequence.value = targetTile.value.toLowerCase() || '.';
  if (!targetTile.readOnly) {
    if (targetTile === selectedTile.value) {
      iterateInGrid(selectedTile.value, [
        toggleWritingDirectionDisplay,
      ]);
      toggleWritingDirection();
      iterateInGrid(selectedTile.value, [
        generateWordPattern,
        toggleWritingDirectionDisplay,
      ]);
      // regexPattern.value = new RegExp(pattern);
    } else {
      iterateInGrid(selectedTile.value, [
        toggleWritingDirectionDisplay,
      ]);
      selectedTile.value = targetTile;
      iterateInGrid(selectedTile.value, [
        generateWordPattern,
        toggleWritingDirectionDisplay,
      ]);
      setRegexPattern();
    }
  }
}

function onInputLetter(e) {
  if (e.data) {
    e.target.value = e.data.toUpperCase();
  }

  const nextTile = getNextTile.value(e.target);
  if (nextTile && !nextTile.readOnly) {
    nextTile.focus();
    setSelectedTile(nextTile);
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
p {
  font-size: 2rem;
}
</style>
