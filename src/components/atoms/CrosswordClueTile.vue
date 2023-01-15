<template>
  <textarea
    :id="props.id"
    :class="props.class + ` tile`"
    :coord="props.coord"
    :aria-label="`${value}`"
    v-model.lazy="value"
    maxlength="30"
    @focus="$event.target.select()"
  ></textarea>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps({
  coord: Array,
  class: String,
  id: String,
  value: String,
});
const value = ref(props.value);
</script>
