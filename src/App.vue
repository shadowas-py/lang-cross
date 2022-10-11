<template>
  <nav>
    <div to="/" class="main-title">CROSS||LANG</div>
  </nav>
  <router-view />
</template>

<script lang='ts' setup></script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Nunito&family=Roboto+Mono:wght@300;500&display=swap');
:root {
  font-size: 10px;
  --selected-tile: rgb(162, 197, 253);
  --selected-tile-border: rgb(0, 0, 143);
  --selected-sibling: rgb(207, 240, 249);
  --main-color: #eeeaca;
  --input-background-color: #f1f1f1;
  --border-color-light: rgb(240, 207, 86);
  --hover-tile: rgba(156, 255, 207, 0.5);
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  height: 100vh;
  width: 100vw;
}
body {
  background-color: var(--main-color);
}
input {
  background-color: var(--input-background-color);
}
.main-title {
  text-align: center;
  font-size: 4.6rem;
  padding: 0.6rem;
  margin-bottom: 0;
  font-family: 'Patrick Hand', cursive;
}
</style>
