<template>
  <main class="main">
    <CrosswordGridTemplate v-if="isCswData" :csw="csw">
      <template #inputTile="{ slotProps }">
        <CrosswordInputTile
          :class="slotProps.class"
          :id="slotProps.id"
          :coord="slotProps.coord"
          :value="slotProps.value"
        />
      </template>
      <template #clueTile="{ slotProps }">
        <CrosswordClueTile
          :class="slotProps.class"
          :id="slotProps.id"
          :coord="slotProps.coord"
          :value="slotProps.value"
        />
      </template>
    </CrosswordGridTemplate>
    <div v-else>LOADING...</div>
  </main>
</template>

<script lang="ts" setup>
import CrosswordState from '@/controllers/CrosswordState';
import CrosswordGridTemplate from '@/components/templates/CrosswordGridTemplate.vue';
import CrosswordClueTile from '@/components/atoms/CrosswordClueTile.vue';
import CrosswordInputTile from '@/components/atoms/CrosswordInputTile.vue';
import { ref } from 'vue';

const isCswData = ref(false);
const csw = ref();

(async function fetchCrossword(
  api = 'http://localhost:8080/lang-cross/crossword.json',
): Promise<CrosswordState> {
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
  csw.value = new CrosswordState(data);
  // console.log(csw.value.tiles, ' LOADED');
  isCswData.value = true;
});
</script>
