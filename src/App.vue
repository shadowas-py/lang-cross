<template>
  <nav>
    <div to="/" class="main-title">CROSS| |LANG</div>
  </nav>
  <router-view />
</template>

<script setup></script>

<style>
:root {
  font-size: 10px;
}
body {
  background-color: #f2ea7c;
  font-size: 2rem;
}
div {
  background-color: #eeeaca;
}

input {
  background-color: #f1f1f1;
  width: 6rem;
}
label {
  margin: 2rem;
}
.main-title {
  text-align: center;
  font-size: 3.6rem;
  padding: 2rem;
  margin-bottom: 2rem;
}
</style>
