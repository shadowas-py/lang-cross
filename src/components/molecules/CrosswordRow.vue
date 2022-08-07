<template>
  <div class="csw-row">
    <CrosswordTile v-for="i in props.cswWidth" :key="i" :class="className" :colNumber="i" />
  </div>
</template>

<script setup>
import CrosswordTile from '@/components/atoms/CrosswordTile.vue';

const props = defineProps({
  cswWidth: Number,
  cswColor: String,
  rowNumber: Number,
});

const className = $computed(() => `row-${props.rowNumber}`);
</script>
<style scoped>
/* .csw-row {
  border-collapse: collapse;
} */
</style>
