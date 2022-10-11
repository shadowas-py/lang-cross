<template>
  <CrosswordGrid
    v-if="cswGridVisible"
    :cswWidth="cswWidth"
    :cswHeight="cswHeight"
    :cswColor="cswColor"
  />
  <GridGeneratorForm v-if="!cswGridVisible" @onCswGridParams="generateCswGrid" />
</template>

<script lang="ts" setup>
import GridGeneratorForm from '@/components/organisms/GridGeneratorForm.vue';
import CrosswordGrid from '@/components/organisms/CrosswordGrid.vue';
import { ref } from 'vue';

const cswWidth = ref(15);
const cswHeight = ref(15);
const cswGridVisible = ref(false);
const cswColor = ref('#9595FF');

function setCswGridVisible() {
  cswGridVisible.value = true;
}

function generateCswGrid(val:[number, number, string]) {
  [cswWidth.value, cswHeight.value, cswColor.value] = val;
  setCswGridVisible();
}
</script>
