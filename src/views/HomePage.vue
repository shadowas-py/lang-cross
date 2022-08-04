<template>
  <CrosswordGrid
    v-if="cswGridVisible"
    :cswWidth="cswWidth"
    :cswHeight="cswHeight"
    :cswColor="cswColor"
    :TILE_SIZE_PX="props.TILE_SIZE_PX"
  />
  <GridGeneratorForm @onCswGridParams="generateCswGrid" />
</template>

<script setup>
import GridGeneratorForm from '@/components/organisms/GridGeneratorForm.vue';
import CrosswordGrid from '@/components/organisms/CrosswordGrid.vue';

const props = defineProps({ TILE_SIZE_PX: Number });

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
