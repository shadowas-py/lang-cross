<template>
  <button v-on:click="submitData" class="submit-btn">GENERUJ</button>
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
.submit-btn {
  box-sizing: border-box;
  background-color: burlywood;
  font-weight: bold;
  padding: 0.6rem;
  margin: 1rem;
  border: 0.2rem solid black;
  height: 3.5rem;
  width: 9rem;
}
.submit-btn:hover {
  background-color: coral;
  color: black;
  box-shadow: 0px 0px 15px 1rem rgba(255, 200, 60, 0.75);
}

.submit-btn:active {
  background-color: black;
  color: coral;
  font-size: 1.2rem;
  box-shadow: 0px 0px 2px 0.4rem rgba(0, 0, 0, 0.75);
}
</style>
