<template>
  <div class="csw-grid-wrapper">
    <div
      class="csw-grid"
      :style="{
        width: `${cswWrapperWidth}rem`,
        height: `${cswWrapperHeight}rem`,
      }"
      @input="$event.target.nextElementSibling.focus()"
    >
      <CrosswordRow
        v-for="i in cswHeight"
        :key="i"
        :cswWidth="cswWidth"
        :cswColor="cswColor"
        :rowNumber="i"
      />
    </div>
  </div>
</template>

<script setup>
import CrosswordRow from '@/components/molecules/CrosswordRow.vue';
import { TILE_SIZE_REM } from '@/constants';

const props = defineProps({
  cswWidth: Number,
  cswHeight: Number,
  cswColor: String,
});

const cswWrapperWidth = $computed(
  () => props.cswWidth * TILE_SIZE_REM,
  // For each field, I have to subtract twice its border.
);
const cswWrapperHeight = $computed(
  () => props.cswHeight * TILE_SIZE_REM,
  // Maybe i dont need to compute this,
  // because its style dont need height property to render container properly
);
</script>

<style scoped>
.csw-grid {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  width: fit-content;
}
.csw-grid-wrapper {
  width: fit-content;
  margin: 0 auto auto;
  border: 0.2rem solid black;
}
</style>
