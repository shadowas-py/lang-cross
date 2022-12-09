<template>
  <CrosswordGrid
    v-if="cswGridVisible"
    :cswWidth="cswWidth"
    :cswHeight="cswHeight"
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

function setCswGridVisible() {
  cswGridVisible.value = true;
}

function generateCswGrid(val:[number, number]) {
  [cswWidth.value, cswHeight.value] = val;
  setCswGridVisible();
}
</script>
