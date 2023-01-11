<template>
  <main class="main">
    <CrosswordGrid
      v-if="isCrosswordData"
      :cswWidth="cswWidth"
      :cswHeight="cswHeight"
    >
      <template #answerTile="{ slotProps }">
        <CrosswordAnswerTile :class="slotProps.class" :id="slotProps.id" :coord="slotProps.coord"/>
      </template>
      <template #clueTile="{ slotProps }">
        <CrosswordClueTile :class="slotProps.class" :id="slotProps.id" :coord="slotProps.coord" />
      </template>
    </CrosswordGrid>
    <div v-else>LOADING...</div>
  </main>
</template>

<script lang="ts" setup>
import CrosswordAnswerTile from '@/components/atoms/CrosswordAnswerTile.vue';
import CrosswordClueTile from '@/components/atoms/CrosswordClueTile.vue';
import CrosswordGrid from '@/components/organisms/CrosswordGrid.vue';
import { CrosswordData } from '@/controllers/CrosswordEditMode';
import CrosswordSolveMode from '@/controllers/CrosswordSolveMode';
import { ref, reactive } from 'vue';

const cswWidth = ref();
const cswHeight = ref();
const isCrosswordData = ref(false);

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
  const crosswordState = reactive(new CrosswordSolveMode(data));
  cswWidth.value = crosswordState.width;
  cswHeight.value = crosswordState.height;
  isCrosswordData.value = true;
});
</script>
