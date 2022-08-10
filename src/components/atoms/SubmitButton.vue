<template>
  <button v-on:click="submitData" class="submit-btn"><span id="span">GENERUJ</span></button>
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
span {
  display: flex;
  /* vertical-align: sub; */
  justify-content: center;
  align-items: center;
  height: 100%;
}
span:active {
  transform: rotate(10deg);
}

.submit-btn {
  padding: 0.2em, 0.5em;
  box-sizing: border-box;
  background-color: burlywood;
  font-weight: bold;
  border: 1px solid black;
  height: 3.5rem;
  width: 9rem;
  cursor: pointer;
  margin: 1.2rem 0.6rem;
  right: 100px;
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
  font-weight: normal;
  letter-spacing: 0.3rem;
  box-shadow: 0.1rem -0.1rem 0.8rem 0.4rem rgba(0, 0, 0, 1);
}
</style>
