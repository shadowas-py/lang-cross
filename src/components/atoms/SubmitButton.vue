<template>
  <button v-on:click="submitData" class="submit-btn"><span id="span">GENERUJ</span></button>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';

const props = defineProps({ inputFields: Array });
const emit = defineEmits(['onCswGridParams']);

let cswGridParams = ref([]);

const submitData = () => {
  props.inputFields.forEach((element) => {
    cswGridParams.value.push(element.value);
  });
  emit('onCswGridParams', cswGridParams.value);
  cswGridParams = [];
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito&family=Roboto+Mono:wght@300;500&family=Roboto+Slab&display=swap');

span {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
span:active {
  transform: rotate(10deg);
}

.submit-btn {
  box-sizing: border-box;
  background-color: burlywood;
  font-weight: bold;
  font-family: 'Roboto Slab', serif;
  border: 1px solid black;
  height: 3.5rem;
  width: 9rem;
  cursor: pointer;
  right: 100px;
  margin: 0.2rem auto;
  /* font-family: 'Nunito', sans-serif; */
}
.submit-btn:hover {
  background-color: coral;
  outline: 2px ridge coral;
  color: black;
  box-shadow: 0px 0px 2px 0.4rem rgba(0, 0, 0, 0.5);
}

.submit-btn:active {
  color: black;
  outline-color: brown;
  letter-spacing: 0.3rem;
  box-shadow: 0.1rem -0.1rem 0.8rem 0.4rem rgba(0, 0, 0, 1);
}
</style>
