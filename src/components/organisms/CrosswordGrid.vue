<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <div class="csw-grid-wrapper">
    <div
      class="csw-grid"
      @input="handleInputLetters"
      :style="{
        width: `${cswWrapperWidth}rem`,
        height: `${cswWrapperHeight}rem`,
      }"
    >
      <CrosswordRow
        v-for="i in cswHeight"
        :key="i"
        :cswWidth="cswWidth"
        :cswColor="cswColor"
        :rowNumber="i"
        @updateIsHorizontal="toggleWritingDirection"
      />
    </div>
  </div>
</template>

<script setup>
import CrosswordRow from '@/components/molecules/CrosswordRow.vue';
import { TILE_SIZE_REM } from '@/constants';
import { provide } from 'vue';
import { selectNextNthElement, selectNextSibling } from '@/utils/Select';

const props = defineProps({
  cswWidth: Number,
  cswHeight: Number,
  cswColor: String,
});
const cswWrapperWidth = $computed(() => props.cswWidth * TILE_SIZE_REM);
const cswWrapperHeight = $computed(() => props.cswHeight * TILE_SIZE_REM);

let isHorizontal = $ref(true);
let prevTargetTile = $ref(null);

function handleInputLetters(e) {
  if (e.data) {
    e.target.value = e.data.toUpperCase();
  }
  const selectNext = isHorizontal ? selectNextSibling : selectNextNthElement;
  const nextEl = selectNext(e.target);
  if (nextEl) {
    nextEl.focus();
    nextEl.select();
  }
}

function toggleWritingDirection(target) {
  if (prevTargetTile === target) {
    isHorizontal = !isHorizontal;
  }
  prevTargetTile = target;
}

const getIsHorizontal = () => isHorizontal;
provide('isHorizontal', {
  getIsHorizontal,
});

const getPrevTargetTile = () => prevTargetTile;
provide('prevTargetTile', {
  getPrevTargetTile,
});
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
