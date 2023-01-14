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
import { ref } from 'vue';
import CrosswordGrid from '@/components/templates/CrosswordGridTemplate.vue';
import CrosswordClueTile from '@/components/atoms/CrosswordClueTile.vue';
import CrosswordInputTile from '@/components/atoms/CrosswordInputTile.vue';

const cswWidth = ref(15);
const cswHeight = ref(15);
const cswGridVisible = ref(false);

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
</script>
