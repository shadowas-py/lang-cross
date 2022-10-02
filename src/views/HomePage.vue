<template>
  <CrosswordGrid
    v-if="cswGridVisible"
    :cswWidth="cswWidth"
    :cswHeight="cswHeight"
    :cswColor="cswColor"
  />
  <GridGeneratorForm v-if="!cswGridVisible" @onCswGridParams="generateCswGrid" />
</template>

<script setup>
import GridGeneratorForm from '@/components/organisms/GridGeneratorForm.vue';
import CrosswordGrid from '@/components/organisms/CrosswordGrid.vue';

let cswWidth = $ref(15);
let cswHeight = $ref(15);
let cswGridVisible = $ref(false);
let cswColor = $ref('#9595FF');

function setCswGridVisible() {
  cswGridVisible = true;
}

function generateCswGrid(val) {
  [cswWidth, cswHeight, cswColor] = val;
  setCswGridVisible();
}
</script>
