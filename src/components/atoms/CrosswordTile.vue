<template>
  <input value="" maxlength="1" :class="classNames" @input="upper($event)" />
</template>

<script setup>
const props = defineProps({ colNumber: Number, value: String });

const classNames = $computed(() => `tile col-${props.colNumber}`);
function upper(e) {
  e.target.value = e.target.value.toUpperCase();
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

.tile {
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  border: 2px solid black;
  border-radius: 0px;
  margin: -1px;
  text-align: center;
  outline: none;
  font-weight: bold;
  font-size: 1.8rem;
  font-family: 'Patrick Hand', cursive, Arial, Helvetica, sans-serif;
  caret-color: transparent;
  color: darkblue;
}

.tile:focus {
  background-color: skyblue;
}

.tile:focus + .tile {
  background-image: url('@/static/images/arrow.png');
  background-size: 90%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
