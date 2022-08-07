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
  font-size: 2rem;
}
.color-input {
  background-color: black;
}
label:first-of-type {
  margin-left: 6rem;
}
</style>
