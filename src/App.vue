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
*{
  margin:0;
  padding:0;
  box-sizing: border-box;
}
#app{
  height:100vh;
  width:100vw;
}
body {
  background-color: black;
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
