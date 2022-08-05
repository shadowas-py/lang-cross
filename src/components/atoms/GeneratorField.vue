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
  font-size: 1.3rem;
}
.color-input {
  background-color: black;
}
input {
  margin: 0.5rem;
}
</style>
