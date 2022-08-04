<template>
  <nav>
    <div to="/" class="main-title">CROSS| |LANG</div>
  </nav>
  <router-view :TILE_SIZE_PX="TILE_SIZE_PX" />
</template>

<script setup>
import { ref } from 'vue';

const TILE_SIZE_PX = ref(40);
</script>

<style>
body {
  font-size: 2rem;
  background-color: #f2ea7c;
}
div {
  background-color: #eeeaca;
}

input {
  background-color: #f1f1f1;
}
.main-title {
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
}
</style>
