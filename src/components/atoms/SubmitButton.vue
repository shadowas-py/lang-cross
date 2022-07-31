<template>
  <button v-on:click="submitData">GENERUJ</button>
</template>

<script>
export default {
  props: ['inputsData'],
  setup() {
    return { cswGridParams: [] };
  },
  methods: {
    submitData() {
      console.log('submit');
      this.inputsData.forEach((element) => {
        this.cswGridParams.push(element.value);
      });
      this.$emit('cswGridParams', this.cswGridParams);
    },
  },
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
