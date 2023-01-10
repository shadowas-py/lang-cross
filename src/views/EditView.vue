<template>
  <main class="main">
    <template v-if="cswGridVisible">
      <CrosswordGrid
        :cswWidth="cswWidth"
        :cswHeight="cswHeight"
        @regexPatternChange="setRegexPattern"
      >
        <template #answerTile="{ slotProps }">
          <CrosswordAnswerTile
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
import CrosswordAnswerTile from '@/components/atoms/CrosswordAnswerTile.vue';

const cswWidth = ref(15);
const cswHeight = ref(15);
const cswGridVisible = ref(false);

const regexPattern = ref();

function setCswGridVisible() {
  cswGridVisible.value = true;
}

// HANDLE EMITS
function setRegexPattern(regex: RegExp) {
  console.log(regex, 'REGEX');
  regexPattern.value = regex;
}

// GRID GENERATOR FORM HANDLER
function generateCswGrid(val: [number, number]) {
  [cswWidth.value, cswHeight.value] = val;
  setCswGridVisible();
}
</script>
