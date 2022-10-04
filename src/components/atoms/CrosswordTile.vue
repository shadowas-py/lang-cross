<template>
  <input
    value=""
    maxlength="1"
    :readonly="isTileLocked"
    :class="classNames"
    :id="elementId"
    :style="{ width: `${F_TILE_SIZE_REM}`, height: `${F_TILE_SIZE_REM}` }"
    @mousedown.right.prevent="toggleTileStatus($event.target)"
    @contextmenu.prevent
    @focus="$event.target.select()"
  />
</template>

<script setup>
import { F_TILE_SIZE_REM } from '@/constants';
import { computed, ref } from 'vue';

const props = defineProps({
  colNumber: Number,
  rowNumber: Number,
  value: String,
});

const emit = defineEmits(['setLocked', 'setActive']);

const classNames = computed(() => `tile col-${props.colNumber}`);
const elementId = computed(() => `${props.colNumber}-${props.rowNumber}-tile`);

const tileStatus = ref('active');
const isTileLocked = computed(() => tileStatus.value === 'locked');

function toggleTileStatus(target) {
  tileStatus.value = tileStatus.value === 'active' ? 'locked' : 'active';
  if (tileStatus.value === 'active') {
    target.classList.remove('locked-tile');
    emit('setActive', target);
  } else {
    target.classList.add('locked-tile');
    emit('setLocked', target);
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

.tile {
  box-sizing: border-box;
  border: 1px dotted rgb(150, 150, 150);
  text-align: center;
  outline: none;
  font-weight: bold;
  font-size: 1.8rem;
  font-family: 'Patrick Hand', cursive;
  caret-color: black;
  color: darkblue;
  -webkit-appearance: none;
  cursor: default;
}
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
.locked-tile.tile {
  background-color: black;
}
</style>
