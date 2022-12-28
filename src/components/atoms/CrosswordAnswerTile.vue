<template>
  <input
    maxlength="1"
    @focus="$event.target.select()"
    @mousedown.left.prevent
    @contextmenu.prevent
  />
</template>

<script setup>
// import { F_TILE_SIZE_REM } from '@/constants';

const props = defineProps({
  colNumber: Number,
  rowNumber: Number,
  value: String,
});

// const classNames = computed(() => `tile col-${props.colNumber}`);
// const elementId = computed(() => `${props.colNumber}-${props.rowNumber}-tile`);

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

.tile:hover {
  background-color: var(--hover-tile);
}
.tile:focus {
  background-color: var(--selected-tile);
  border: 2px solid var(--selected-tile-border);
}
.direction-marking-tile {
  background-color: var(--selected-sibling);
}
.selected-to-word-search {
  border: 1px solid blue;
}
</style>
