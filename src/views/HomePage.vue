<template>
  <CrosswordGrid
    v-if="cswElementVisible"
    :cswWidth="cswWidth"
    :cswHeight="cswHeight"
    :TILE_SIZE_PX="TILE_SIZE_PX"
  />
  <CrosswordGenerator @cswTemplateParams="generateCswGrid" />
</template>

<script>
import CrosswordGenerator from '@/components/organisms/CrosswordGenerator.vue';
import CrosswordGrid from '@/components/organisms/CrosswordGrid.vue';

export default {
  props: ['TILE_SIZE_PX'],
  data() {
    return {
      cswWidth: 15,
      cswHeight: 15,
      cswElementVisible: false,
    };
  },
  methods: {
    setCswVisible() {
      this.cswVisible = true;
    },
    generateCswGrid(val) {
      [this.cswWidth, this.cswHeight, this.cswColor] = val;
      this.cswElementVisible = true;
    },
  },
  name: 'HomeView',
  components: {
    CrosswordGrid,
    CrosswordGenerator,
  },
};
</script>
