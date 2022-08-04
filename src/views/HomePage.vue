<template>
  <CrosswordGrid
    v-if="cswGridVisible"
    :cswWidth="cswWidth"
    :cswHeight="cswHeight"
    :cswColor="cswColor"
    :TILE_SIZE_PX="TILE_SIZE_PX"
  />
  <GridGeneratorForm @cswGridParams="generateCswGrid" />
</template>

<script setup>
import { ref } from 'vue';
import GridGeneratorForm from '@/components/organisms/GridGeneratorForm.vue';
import CrosswordGrid from '@/components/organisms/CrosswordGrid.vue';

// const TILE_SIZE_PX = ref('');

let cswWidth = ref(15);
let cswHeight = ref(15);
let cswGridVisible = ref(false);
let cswColor = ref('#9595FF');

function setCswGridVisible() {
  cswGridVisible = true;
}

function generateCswGrid(val) {
  [cswWidth, cswHeight, cswColor] = val;
  setCswGridVisible();
}
</script>
