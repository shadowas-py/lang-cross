<template>
  <textarea
    :aria-label="`${clue}`"
    maxlength="40"
    @focus="$event.target.select()"
    @mousedown.right="isInput = !isInput"
    v-model="clue"
  ></textarea>
</template>
<script setup>
import { ref, watch } from 'vue';

const clue = ref('');
// watch(clue, (n) => console.log(n));
</script>
<style>

</style>
