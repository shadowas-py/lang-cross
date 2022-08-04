<template>
  <button v-on:click="submitData">GENERUJ</button>
</template>

<script setup>
import { ref, emit } from 'vue';

const props = defineProps(['inputFields']);

const cswGridParams = ref([]);

function submitData() {
  props.inputFields.forEach((element) => {
    cswGridParams.value.push(element.value);
  });
  emit('cswGridParams', cswGridParams);
}
</script>

<style scoped>
button {
  box-sizing: border-box;
  background-color: burlywood;
  font-weight: bold;
  padding: 0.4rem;
}
button:hover {
  background-color: coral;
}
button:active {
  background-color: black;
  color: coral;
  border: 0px solid black;
}
</style>
