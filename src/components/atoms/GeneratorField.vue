<template>
  <label :for="field.label"
    >{{ field.label }}:
    <input :class="field.name" :type="field.type" v-model="inputEl.value" v-on:change="emitValue" />
  </label>
</template>

<script>
export default {
  props: ['field'],
  setup() {
    return {};
  },
  computed: {
    inputEl: {
      // I dont know how to set ONLY field.value to <input> value without copying the whole object.
      get() {
        return this.field;
      },
    },
  },
  methods: {
    emitValue(val) {
      this.$emit('inputValue', val);
    },
  },
};
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
