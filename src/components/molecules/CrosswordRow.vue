<template>
  <CrosswordTile
    v-for="i in props.cswWidth"
    :key="i"
    :style="{ backgroundColor: props.cswColor }"
  />
</template>

<script setup>
import CrosswordTile from '@/components/atoms/CrosswordTile.vue';

const props = defineProps({ cswWidth: Number, cswColor: String });
</script>
