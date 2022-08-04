<template>
  <button v-on:click="submitData">GENERUJ</button>
</template>

<script setup>
const props = defineProps({ inputFields: Array });
const emit = defineEmits(['onCswGridParams']);

let cswGridParams = $ref([]);

const submitData = () => {
  props.inputFields.forEach((element) => {
    cswGridParams.push(element.value);
  });
  emit('onCswGridParams', cswGridParams);
  cswGridParams = [];
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
