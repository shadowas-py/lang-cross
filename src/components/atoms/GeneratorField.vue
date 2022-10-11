<template>
  <label :for="field.label"
    >{{ field.label }}:
    <input :class="field.name" :type="field.type" v-model="localField.value" />
  </label>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({ field: Object });

const localField = ref(props.field);
</script>

<style scoped>

* {
  font-size: 1.8rem;
}
label{
  margin:0.2rem;
  font-family: 'Nunito', sans-serif;
}
input {
  font-family: 'Roboto Mono', monospace;
  width: 6rem;
  margin:0.2rem;
  vertical-align:-5%;
  border-color: var(--border-color-light);
  border-style: none;
  box-shadow: 0 0 1rem saddlebrown;
  border-radius: 0.5rem;
}
.color-input {
  margin:0.1rem;
  padding: 0.4rem;
  width: 3rem;
  height:3rem;
  overflow:hidden;
  border-radius:50%;
  vertical-align:-50%;
  background-color: currentColor;
}

</style>
