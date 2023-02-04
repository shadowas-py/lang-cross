<!--@regexPatternChange="setRegexPattern"-->
<template>
  <main class="main">
    <template v-if="cswGridVisible">
      <CrosswordGrid
        :csw="{ width: cswWidth, height: cswHeight }"
        :hooks="{ beforeDirectionChange, afterDirectionChange, afterTileChange, afterRightClick }"
        :editMode="true"
      >
        <template #inputTile="{ slotProps }">
          <CrosswordInputTile
            :class="slotProps.class"
            :id="slotProps.id"
            :coord="slotProps.coord"
          />
        </template>
        <template #clueTile="{ slotProps }">
          <CrosswordClueTile :class="slotProps.class" :id="slotProps.id" :coord="slotProps.coord" />
          <svg class="csw-arrow--right" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.9124 10L10.8305 5.36199e-07L45 5.36199e-07L27.9124 10Z"/>
</svg>
<svg class="csw-arrow--down" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.9124 10L10.8305 5.36199e-07L45 5.36199e-07L27.9124 10Z"/>
</svg>
        </template>
      </CrosswordGrid>
      <WordList :regexPattern="regexPattern.get()" />
    </template>
    <GridGeneratorForm v-if="!cswGridVisible" @onCswGridParams="generateCswGrid" />
  </main>
</template>

<script lang="ts" setup>
import GridGeneratorForm from '@/components/organisms/GridGeneratorForm.vue';
import WordList from '@/components/organisms/WordList.vue';
import {
  ref, computed, Ref, watch, reactive,
} from 'vue';
import CrosswordGrid from '@/components/templates/CrosswordGridTemplate.vue';
import CrosswordClueTile from '@/components/atoms/CrosswordClueTile.vue';
import CrosswordInputTile from '@/components/atoms/CrosswordInputTile.vue';
import RegexPattern from '@/utils/RegexPattern';

import { addStyle, removeStyle } from '@/utils/styleHandlers';
import { createCswGridIterator, mapCswGrid } from '@/utils/crosswordGridIterators';
import { useCrosswordStore } from '@/stores/crosswordStore';
import { storeToRefs } from 'pinia';

const cswStore = useCrosswordStore();
const {
  selectedTile, prevSelectedTile, getNextTile, isHorizontal,
} = storeToRefs(cswStore);

const cswWidth = ref(15);
const cswHeight = ref(15);
const cswGridVisible = ref(false);

// HANDLE REGEX CLUES
const firstWordSearchTile: Ref<null | HTMLInputElement> = ref(null);
const regexPattern = reactive(new RegexPattern([]));

watch([firstWordSearchTile, isHorizontal], () => {
  regexPattern.set(
    mapCswGrid(
      firstWordSearchTile.value,
      (el) => el.value.toLowerCase() || '.',
      getNextTile.value,
      { stopCondition: (el) => el.tagName !== 'INPUT' },
    ),
  );
});

function setCswGridVisible() {
  cswGridVisible.value = true;
}

// GRID GENERATOR FORM HANDLER
function generateCswGrid(val: [number, number]) {
  [cswWidth.value, cswHeight.value] = val;
  setCswGridVisible();
}

const INPUT_TILE_STYLES = ['selected-to-word-search', 'direction-marking-tile'];

const traverseCswGrid = computed(() => createCswGridIterator({ getNext: getNextTile.value }));

// HOOKS METHODS
const beforeDirectionChange = [
  () => {
    const startElement =
      firstWordSearchTile.value === selectedTile.value ?
        getNextTile.value(selectedTile.value) :
        firstWordSearchTile.value;
    traverseCswGrid.value(startElement, removeStyle, INPUT_TILE_STYLES, {
      omitCondition: (el) => el === selectedTile.value,
    });
  },
];
const afterRightClick = [
  () => {
    traverseCswGrid.value(firstWordSearchTile.value, removeStyle, INPUT_TILE_STYLES);
  },
];

const afterDirectionChange = [
  () => {
    const startElement = getNextTile.value(selectedTile.value);
    traverseCswGrid.value(startElement, addStyle, INPUT_TILE_STYLES, {
      getNext: getNextTile.value,
    });
    firstWordSearchTile.value = selectedTile.value;
  },
];

const afterTileChange = [
  () => {
    if (selectedTile.value?.classList.contains('selected-to-word-search')) {
      //
      // INSIDE 'SELECTED TO DIRECTION MARKING TILE CLASS'
      if (selectedTile.value.classList.contains('direction-marking-tile')) {
        traverseCswGrid.value(prevSelectedTile.value, removeStyle, ['direction-marking-tile'], {
          stopCondition: (el) => el === selectedTile.value,
        });
        // JEZELI SELECTED TO WORD SEARCH - DIRECTION MARKING TILE
      } else {
        traverseCswGrid.value(selectedTile.value, addStyle, ['direction-marking-tile'], {
          stopCondition: (el) => el === prevSelectedTile.value,
        });
      }
      //
      // DERAULT OUTSIDE 'SELECTED TO WORD SEARCH CLASS'
    } else {
      traverseCswGrid.value(firstWordSearchTile.value, removeStyle, INPUT_TILE_STYLES, {});
      INPUT_TILE_STYLES.map((cls) =>
        traverseCswGrid.value(selectedTile.value, addStyle, [cls], {
          stopCondition: (el) => el.classList.contains(cls),
        }));
      firstWordSearchTile.value = selectedTile.value;
    }
  },
];

</script>

<style>

.tile-data {
  position: relative;
}

.csw-arrow--down {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 10%);
  z-index: 1;
  fill: silver;
}

.csw-arrow--right {
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translate(8%, -50%) rotate(-90deg);
  z-index: 1;
  fill: silver;
}
.csw-arrow--right:hover {
  cursor: pointer;
  top: 50%;
  left: 100%;
  fill: black;
  transform: translate(5%, -50%) rotate(-90deg) scale(1.1);
  transition: 0.2s linear all;
}
.csw-arrow--down:hover {
  cursor: pointer;
  top: 100%;
  left: 50%;
  fill: black;
  transform: translate(-50%, 5%) scale(1.1);
  transition: 0.2s linear all;
}

</style>
