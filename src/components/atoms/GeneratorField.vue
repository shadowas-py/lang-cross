<template>
  <label :for="field.label"
    >{{ field.label }}:
    <input :class="field.name" :type="field.type" v-model="inputEl.value" v-on:change="emitValue" />
  </label>
</template>

<script setup>
import { computed, emit } from 'vue';

const props = defineProps({ field: Object });

// const cswWrapperHeight = computed(
//   () => props.cswHeight * props.TILE_SIZE_PX - props.cswHeight * 2,
//   // Maybe i dont need to compute this,
//   // because its style dont need height property to render container properly
// );

const inputEl = computed({
  get() {
    return props.field;
  },
});

function emitValue(val) {
  emit('inputValue', val);
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
