<template>
  <label :for="field.label"
    >{{ field.label }}:
    <input :class="field.name" :type="field.type" v-model="inputEl.value" v-on:change="emitValue" />
  </label>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ field: Object });
const emit = defineEmits(['onInputValue']);

const inputEl = computed({
  get() {
    return props.field;
  },
});

function emitValue(e) {
  emit('onInputValue', e.target.value);
}
</script>

<style scoped>
* {
  font-size: 1.3rem;
}
.color-input {
  background-color: black;
}
input {
  margin: 0.5rem;
}
</style>
