<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template >
  <input v-if='isInput'
    value=""
    maxlength="1"
    :class="classNames"
    :id="elementId"
    :style="{ width: `${F_TILE_SIZE_REM}`, height: `${F_TILE_SIZE_REM}` }"
    @focus="$event.target.select()"
    @mousedown.left.prevent
    @mousedown.right='isInput=!isInput'
    @contextmenu.prevent
  />
  <textarea v-else
    value=""
    maxlength="20"
    :class="`${classNames} question-field`"
    :id="elementId"
    :style="{ width: `${F_TILE_SIZE_REM}`, height: `${F_TILE_SIZE_REM}` }"
    @focus="$event.target.select()"
    @mousedown.right="isInput=!isInput"
    @contextmenu.prevent
  ></textarea>

</template>

<script setup>
import { F_TILE_SIZE_REM } from '@/constants';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  colNumber: Number,
  rowNumber: Number,
  value: String,
  isInput: Boolean,
});

const emit = defineEmits(['changeTileType']);

const classNames = computed(() => `tile col-${props.colNumber}`);
const elementId = computed(() => `${props.colNumber}-${props.rowNumber}-tile`);
const isInput = ref(true);
// const isTileLocked = computed(() => tileStatus.value === 'locked');

function toggleTileStatus(target) {
  emit('changeTileType', target);
  isInput.value = !isInput.value;
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
.question-field.tile {
  background-color: black;
}
.selected-to-word-search{
  border: 1px solid blue;
}
</style>
