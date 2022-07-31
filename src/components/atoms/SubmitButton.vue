<template>
  <button v-on:click="submitData">GENERUJ</button>
</template>

<script>
export default {
  props: ['inputsData'],
  setup() {
    return { cswTemplateParams: [] };
  },
  methods: {
    submitData() {
      console.log('submit');
      this.inputsData.forEach((element) => {
        this.cswTemplateParams.push(element.value);
      });
      this.$emit('cswTemplateParams', this.cswTemplateParams);
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
