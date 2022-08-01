<template>
  <div
    class="csw-wrapper"
    :style="{
      width: `${cswWrapperWidth}px`,
      height: `${cswWrapperHeight}px`,
    }"
  >
    <CrosswordRow v-for="i in cswHeight" :key="i" :cswWidth="cswWidth" :cswColor="cswColor" />
  </div>
</template>

<script>
import CrosswordRow from '@/components/molecules/CrosswordRow.vue';

export default {
  setup() {},
  props: ['cswWidth', 'cswHeight', 'TILE_SIZE_PX', 'cswColor'],
  components: { CrosswordRow },
  computed: {
    cswWrapperWidth() {
      // For each field, I have to subtract twice its border.
      return this.cswWidth * this.TILE_SIZE_PX - this.cswWidth * 2;
    },
    cswWrapperHeight() {
      // Maybe i dont need to compute this,
      // because its style dont need height property to render container properly
      return this.cswHeight * this.TILE_SIZE_PX - this.cswHeight * 2;
    },
  },
};
</script>

<style>
.csw-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 auto auto;
  width: fit-content;
}
</style>
