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
import { ref } from 'vue';

const clue = ref('');
</script>
