<template>
  <textarea
    :id='props.id'
    :class='props.class + ` tile`'
    :coord='props.coord'
    :aria-label="`${clue}`"
    maxlength="40"
    @focus="$event.target.select()"
    @mousedown.right="isInput = !isInput"
    v-model="clue"
  ></textarea>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps({ coord: Array, class: String, id: String });

const clue = ref('');
</script>
