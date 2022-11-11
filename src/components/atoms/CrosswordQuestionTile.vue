<template>
        <label for='...'>
        <textarea
          value=""
          maxlength="22"
          :class="classNames"
          :id="elementId"
          :style="{ width: `${F_TILE_SIZE_REM}`, height: `${F_TILE_SIZE_REM}` }"
          @mousedown.right.prevent="toggleTileStatus($event.target)"
          @mousedown.left.prevent
          @contextmenu.prevent
        ></textarea>
</label>

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
// const isTileLocked = computed(() => tileStatus.value === 'locked');

function toggleTileStatus(target) {
  tileStatus.value = tileStatus.value === 'active' ? 'locked' : 'active';
  if (tileStatus.value === 'active') {
    target.classList.remove('locked-tile');
    emit('setActive', target);
  } else {
    target.classList.add('locked-tile');
    // SET MAX LENGTH and make it editable
    emit('setLocked', target);
  }
}
</script>

      <style scoped>
      .question-tile {
        background-color: black;
        color: white;
        font-size: 1rem;
        font-family: Arial, Helvetica, sans-serif;
        overflow: wrap;
        text-overflow: wrap;
      }

      .locked-tile.tile::before {
        height: 0;
        margin: 0;
      }
      .locked-tile.tile::after {
        height: 0;
        margin: 0;
      }

      .selected-to-word-search{
        border: 1px solid blue;
      }
      </style>
