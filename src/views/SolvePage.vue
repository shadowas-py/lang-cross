<template>
  <CrosswordGrid :cswWidth="cswWidth" :cswHeight="cswHeight" />
</template>

<script lang="ts" setup>
import CrosswordGrid from '@/components/organisms/CrosswordGrid.vue';
import { ref } from 'vue';

const cswWidth = ref(15);
const cswHeight = ref(15);
</script>
