<template>
  <CrosswordTile v-for="i in cswWidth" :key="i" :style="{ backgroundColor: cswColor }" />
</template>

<script>
import CrosswordTile from '@/components/atoms/CrosswordTile.vue';

export default {
  setup() {},
  props: ['cswWidth', 'cswColor'],
  components: {
    CrosswordTile,
  },
};
</script>
