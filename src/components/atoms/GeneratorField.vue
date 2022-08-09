<template>
  <label :for="field.label"
    >{{ field.label }}:
    <input :class="field.name" :type="field.type" v-model="localField.value" />
  </label>
</template>

<script setup>
const props = defineProps({ field: Object });

const localField = $ref(props.field);
</script>

<style scoped>
* {
  font-size: 1.6rem;
}
label {
  margin: 0.6rem;
}
input{
  margin-top: 0.2rem;
}
.color-input {
  background-color: black;
}
</style>
