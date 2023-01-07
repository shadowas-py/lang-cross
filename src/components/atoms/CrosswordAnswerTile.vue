<template>
  <input
    maxlength="1"
    @focus="$event.target.select()"
    @mousedown.left.prevent
    @contextmenu.prevent
  />
</template>

<script setup>

</script>
