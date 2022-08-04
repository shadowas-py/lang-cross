<template>
  <button v-on:click="submitData">GENERUJ</button>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({ inputFields: Array });
const emit = defineEmits(['onCswGridParams']);

const cswGridParams = ref([]);

const submitData = () => {
  props.inputFields.forEach((element) => {
    cswGridParams.value.push(element.value);
  });
  emit('onCswGridParams', cswGridParams);
  cswGridParams.value = [];
};
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
