<template>
  <input
    maxlength="1"
    :id='props.id'
    :class='props.class + ` tile`'
    :coord='props.coord'
    @focus="$event.target.select()"
    @mousedown.left.prevent
    @contextmenu.prevent
  />
</template>

<script setup>
const props = defineProps({ coord: Array, class: String, id: String });

</script>
