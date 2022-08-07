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
  /* border-radius: 0px; */
  border: 1px solid black;
  /* box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 1); */
  text-align: center;
  outline: none;
  font-weight: bold;
  font-size: 1.8rem;
  font-family: 'Patrick Hand', cursive;
  caret-color: black;
  color: darkblue;
  -webkit-appearance: none;
}

/* .tile:last-child {
  border-right: 2px solid black;
}

.tile:first-child {
  border-left: 2px solid black;
} */

.tile:focus {
  background-color: cadetblue;
  border: 2px solid red;
  /* box-shadow: 0px 0px 0px 2px rgb(213, 79, 79); */
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
