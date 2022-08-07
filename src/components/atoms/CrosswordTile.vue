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
/* Ustawić SIZE w property inputa? */
@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

.tile {
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  border: 1px solid black;
  text-align: center;
  outline: none;
  font-weight: bold;
  font-size: 1.8rem;
  font-family: 'Patrick Hand', cursive;
  caret-color: black;
  color: darkblue;
  -webkit-appearance: none;
}

.tile:focus {
  background-color: cadetblue;
  border: 2px solid red;
}
.tile:focus ~ .tile {
  background-color: powderblue;
}
.tile:focus + .tile {
  background-image: url('@/static/images/arrow.png');
  background-size: 90%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
