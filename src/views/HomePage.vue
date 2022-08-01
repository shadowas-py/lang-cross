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

<script>
import GridGeneratorForm from '@/components/organisms/GridGeneratorForm.vue';
import CrosswordGrid from '@/components/organisms/CrosswordGrid.vue';

export default {
  name: 'HomeView',
  props: ['TILE_SIZE_PX'],
  data() {
    return {
      cswWidth: 15,
      cswHeight: 15,
      cswGridVisible: false,
      cswColor: '#9595FF',
    };
  },
  methods: {
    setCswGridVisible() {
      this.cswGridVisible = true;
    },
    generateCswGrid(val) {
      [this.cswWidth, this.cswHeight, this.cswColor] = val;
      this.setCswGridVisible();
    },
  },
  components: {
    CrosswordGrid,
    GridGeneratorForm,
  },
};
</script>
