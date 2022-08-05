<template>
  <input value="" maxlength="1" :class="classNames" />
</template>

<script setup>
const props = defineProps({ colNumber: Number });

const classNames = $computed(() => `tile col-${props.colNumber}`);
</script>

<style>
.tile {
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  border: 2px solid black;
  border-radius: 0px;
  margin: -1px;
  text-align: center;
  outline: none;
}
/* .col-1 {
  background-color: yellow;
}
.row-2 {
  background-color: red;
} */
</style>
