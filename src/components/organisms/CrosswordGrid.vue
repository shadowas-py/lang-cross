<template>
  <div
    class="csw-wrapper"
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
</template>

<script setup>
import CrosswordRow from '@/components/molecules/CrosswordRow.vue';

const props = defineProps({
  cswWidth: Number,
  cswHeight: Number,
  TILE_SIZE_REM: Number,
  cswColor: String,
});

const cswWrapperWidth = $computed(
  () => Math.ceil(props.cswWidth * props.TILE_SIZE_REM),
  // For each field, I have to subtract twice its border.
);
const cswWrapperHeight = $computed(
  () => props.cswHeight * props.TILE_SIZE_REM,
  // Maybe i dont need to compute this,
  // because its style dont need height property to render container properly
);
</script>

<style scoped>
.csw-wrapper {
  border: 0.2rem solid black;
  box-sizing: content-box;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto auto;
  width: fit-content;
}
</style>
