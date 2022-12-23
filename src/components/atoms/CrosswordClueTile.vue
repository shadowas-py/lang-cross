<template>
  <textarea
    :aria-label="`${clue}`"
    value=""
    maxlength="20"
    :class="`${classNames} question-field`"
    :id="elementId"
    :style="{ width: `${F_TILE_SIZE_REM}`, height: `${F_TILE_SIZE_REM}` }"
    @focus="$event.target.select()"
    @mousedown.right="isInput = !isInput"
    @contextmenu.prevent
    v-model="clue"
  ></textarea>
</template>
<script>
import { ref, watch } from 'vue';

const clue = ref('');
watch(clue, (n) => console.log(n));

</script>
<style scoped>
textarea {
  background-color: black;
  color:white;
}
</style>
