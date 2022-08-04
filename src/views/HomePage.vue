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
import { ref } from 'vue';
import GridGeneratorForm from '@/components/organisms/GridGeneratorForm.vue';
import CrosswordGrid from '@/components/organisms/CrosswordGrid.vue';

const props = defineProps({ TILE_SIZE_PX: Number });

const cswWidth = ref(15);
const cswHeight = ref(15);
const cswGridVisible = ref(false);
const cswColor = ref('#9595FF');

function setCswGridVisible() {
  cswGridVisible.value = true;
}

function generateCswGrid(val) {
  [cswWidth.value, cswHeight.value, cswColor.value] = val;
  setCswGridVisible();
}
</script>
