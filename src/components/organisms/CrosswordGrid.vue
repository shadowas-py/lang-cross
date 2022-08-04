<template>
  <div
    class="csw-wrapper"
    :style="{
      width: `${cswWrapperWidth}px`,
      height: `${cswWrapperHeight}px`,
    }"
  >
    <CrosswordRow
      v-for="i in cswHeight"
      :key="i"
      :cswWidth="props.cswWidth"
      :cswColor="props.cswColor"
    />
  </div>
</template>

<script setup>
import CrosswordRow from '@/components/molecules/CrosswordRow.vue';
import { computed } from 'vue';

const props = defineProps({
  cswWidth: Number,
  cswHeight: Number,
  TILE_SIZE_PX: Number,
  cswColor: String,
});
const cswWrapperWidth = computed(
  () => props.cswWidth * props.TILE_SIZE_PX - props.cswWidth * 2,
  // For each field, I have to subtract twice its border.
);
const cswWrapperHeight = computed(
  () => props.cswHeight * props.TILE_SIZE_PX - props.cswHeight * 2,
  // Maybe i dont need to compute this,
  // because its style dont need height property to render container properly
);
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
