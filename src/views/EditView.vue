<!--@regexPatternChange="setRegexPattern"-->
<template>
  <main class="main">
    <template v-if="cswGridVisible">
      <CrosswordGrid
        :csw="{width: cswWidth, height: cswHeight}"
        @regexPatternChange="setRegexPattern"
      >
        <template #inputTile="{ slotProps }">
          <CrosswordInputTile
            :class="slotProps.class"
            :id="slotProps.id"
            :coord="slotProps.coord"
          />
        </template>
        <template #clueTile="{ slotProps }">
          <CrosswordClueTile
            :class="slotProps.class"
            :id="slotProps.id"
            :coord="slotProps.coord" />
          </template>
      </CrosswordGrid>
      <WordList :regexPattern="regexPattern" />
    </template>
    <GridGeneratorForm v-if="!cswGridVisible" @onCswGridParams="generateCswGrid" />
  </main>
</template>

<script lang="ts" setup>
import GridGeneratorForm from '@/components/organisms/GridGeneratorForm.vue';
import WordList from '@/components/organisms/WordList.vue';
import {
  ref, reactive, computed, Ref,
} from 'vue';
import CrosswordGrid from '@/components/templates/CrosswordGridTemplate.vue';
import CrosswordClueTile from '@/components/atoms/CrosswordClueTile.vue';
import CrosswordInputTile from '@/components/atoms/CrosswordInputTile.vue';
import RegexPattern from '@/utils/RegexPattern';

import { removeStyle } from '@/utils/styleHandlers';
import { selectNextSibling, selectNextNthElement } from '@/utils/crosswordGridSelectors';
import { createCswGridIterator } from '@/utils/crosswordGridIterators';

const cswWidth = ref(15);
const cswHeight = ref(15);
const cswGridVisible = ref(false);

const csw = ref();

// HANDLE REGEX CLUES
// const regexPattern = reactive(new RegexPattern([]));

// watch(csw);

// watch([firstWordSearchTile, isHorizontal], () => {
//  regexPattern.set(
//    mapCswGrid(
//      firstWordSearchTile.value,
//      (el) => el.value.toLowerCase() || '.',
//      getNextTile.value,
//      (el) => el.tagName !== 'INPUT',
//    ),
//  );
//  emits('regexPatternChange', regexPattern.get());
// });

const regexPattern = ref();

function setCswGridVisible() {
  cswGridVisible.value = true;
}

// HANDLE EMITS
function setRegexPattern(regex: RegExp) {
  regexPattern.value = regex;
}

// GRID GENERATOR FORM HANDLER
function generateCswGrid(val: [number, number]) {
  [cswWidth.value, cswHeight.value] = val;
  setCswGridVisible();
}
// setup
const selectedTile: Ref<null | HTMLInputElement> = ref(null);
const prevSelectedTile: Ref<null | HTMLInputElement> = ref(null);

// !!! to remove from here
const firstWordSearchTile: Ref<null | HTMLInputElement> = ref(null);

const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));

// !!! to rename
const INPUT_TILE_STYLES = ['selected-to-word-search', 'direction-marking-tile'];

const traverseCswGrid = computed(() => createCswGridIterator({ getNext: getNextTile.value }));

// METHODS

// beforeDirectionChange = [() => {
//  const startElement =
//      firstWordSearchTile.value === selectedTile.value ?
//        getNextTile.value(selectedTile.value) :
//        firstWordSearchTile.value;

//  traverseCswGrid.value(
//    startElement,
//    removeStyle,
//    INPUT_TILE_STYLES,
//    { omitCondition: (el) => el === selectedTile.value },
//  );
// }];
</script>
