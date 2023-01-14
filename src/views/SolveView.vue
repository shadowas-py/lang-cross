<template>
  <main class="main">
    <CrosswordGridTemplate
      v-if="isCrosswordData"
      :csw='{width:cswWidth, height:cswHeight, tiles:crosswordState.tiles}'
    >
      <template #inputTile="{ slotProps }">
        <CrosswordInputTile :class="slotProps.class" :id="slotProps.id" :coord="slotProps.coord"/>
      </template>
      <template #clueTile="{ slotProps }">
        <CrosswordClueTile :class="slotProps.class" :id="slotProps.id" :coord="slotProps.coord" />
      </template>
    </CrosswordGridTemplate>
    <div v-else>LOADING...</div>
  </main>
</template>

<script lang="ts" setup>
import CrosswordClueTile from '@/components/atoms/CrosswordClueTile.vue';
import CrosswordGridTemplate from '@/components/templates/CrosswordGridTemplate.vue';
import { CrosswordData } from '@/controllers/CrosswordEditMode';
import CrosswordSolveMode from '@/controllers/CrosswordSolveMode';
import { ref } from 'vue';
import CrosswordInputTile from '@/components/atoms/CrosswordInputTile.vue';

const cswWidth = ref();
const cswHeight = ref();
const isCrosswordData = ref(false);
const crosswordState = ref();
(async function fetchCrossword(
  api = 'http://localhost:8080/lang-cross/crossword.json',
): Promise<CrosswordData> {
  try {
    const response = await fetch(api);
    if (response.status !== 200) {
      throw new Error(`Can't fetch data from ${api}`);
    }
    const data = response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) console.error('ERROR:', error.message);
    throw error;
  }
}()).then((data) => {
  crosswordState.value = new CrosswordSolveMode(data);
  cswWidth.value = crosswordState.value.width;
  cswHeight.value = crosswordState.value.height;
  isCrosswordData.value = true;
});
</script>
