<template>
  <input
    :id="props.id"
    :class="props.class + ` tile`"
    :coord="props.coord"
    v-model="computedValue"
    maxlength="1"
    @focus="($event.target as HTMLInputElement).select()"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  coord: Array,
  class: String,
  id: String,
  value: String,
});
const refValue = ref(props.value);

const computedValue = computed({
  get() {
    return refValue.value?.toUpperCase();
  },
  set(newVal) {
    refValue.value = newVal;
  },
});
</script>
