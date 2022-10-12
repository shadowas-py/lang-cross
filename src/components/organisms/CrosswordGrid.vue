<template>
  <div class="csw-grid-wrapper">
    <div
      class="csw-grid"
      @input="onInputLetter($event as any)"
      @mousedown.left="onLeftClick($event)"
      :style="{ width: `${cswWrapperWidth}rem`, height: `${cswWrapperHeight}rem` }"
    >
      <div v-for="row in cswHeight" :key="row" class="csw-row" :id="`csw-row-${row}`">
        <CrosswordTile
          v-for="col in props.cswWidth"
          :key="`${col}-${row}`"
          :colNumber="col"
          :rowNumber="row"
          @focus="$event.target.select()"
          @mouseup.left="
            ($event) => {
              if (selectedTile === $event.target) {
                $event.target.select();
              }
            }
          "
        />
      </div>
    </div>
    <p></p>
    <WordSearchEngine :pattern="regexPattern" />
  </div>
</template>
<!-- @setLocked="stopDisplayWritingDirection" @setActive="displayWritingDirection" -->
<script lang="ts" setup>
import { TILE_SIZE_REM } from '@/constants';
import {
  computed, Ref, ref, watch,
} from 'vue';
import { selectNextNthElement, selectNextSibling } from '@/utils/select';
import WordSearchEngine from '@/components/organisms/WordSearchEngine.vue';
import CrosswordTile from '../atoms/CrosswordTile.vue';

// MAIN DATA
const selectedTile: Ref<null | HTMLInputElement> = ref(null);
const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));

const activeElementsIDs: Ref<string[]> = ref([]);
const firstTileInSelectedBlock: Ref<HTMLInputElement | undefined | null> = ref();

function isTileLocked(target:HTMLInputElement) {
  return target.classList.contains('locked-tile');
}

function toggleWritingDirection() {
  isHorizontal.value = !isHorizontal.value;
}

// RENDERING
const props = defineProps({
  cswWidth: Number,
  cswHeight: Number,
});

const cswWrapperWidth = computed(() => Number(props.cswWidth) * TILE_SIZE_REM);
const cswWrapperHeight = computed(() => Number(props.cswHeight) * TILE_SIZE_REM);

// WORD SEARCH HANDLERS
const charsSequence = ref('');
const regexPattern: Ref<RegExp> = ref(/.*/);

function addToCharsSequence(target: HTMLInputElement) {
  charsSequence.value += target.value.toLowerCase() || '.';
}

function applyRegexPattern() {
  regexPattern.value = new RegExp(`^${charsSequence.value}$`);
}

// MAIN FUNCTIONS

function iterateCrosswordTiles(
  _target: HTMLInputElement,
  _callback: (target: HTMLInputElement) => void,
  _stopCondition:((arg: HTMLInputElement) => boolean) = () => false,
  _getNextTile: (arg: HTMLInputElement) => HTMLInputElement | null = getNextTile.value,
) {
  let target: HTMLInputElement | null = _target;
  do {
    _callback(target);
    target = _getNextTile(target);
  } while (target && !isTileLocked(target) && !_stopCondition(target));
}

function setSelectedTile(targetTile: HTMLInputElement | null) {
  selectedTile.value = targetTile;
}

function* getIds(target: HTMLInputElement) {
  let nextTile = getNextTile.value(target);
  yield target.id;
  while (nextTile) {
    yield nextTile.id;
    nextTile = getNextTile.value(nextTile);
  }
}
// EVENT HANDLERS
function onInputLetter(e: { target: { value: string | null }; data: string }) {
  e.target.value = e.data.toUpperCase() || null;
  const nextTile = getNextTile.value(e.target as HTMLInputElement);
  if (nextTile && !nextTile.readOnly) {
    setSelectedTile(nextTile);
    nextTile.focus();
  }
}

function onLeftClick(e: MouseEvent) {
  if (e.target === selectedTile.value) {
    toggleWritingDirection();
  } else if (e.target && !(e.target as HTMLInputElement).readOnly) {
    setSelectedTile(e.target as HTMLInputElement);
  }
}

// MAIN WATCHERS
// ON WRITING DIRECTION CHANGE
watch(isHorizontal, () => {
  // INITIAL VALUES
  charsSequence.value = '';
  regexPattern.value = /''/;

  if (firstTileInSelectedBlock.value) {
    iterateCrosswordTiles(
      firstTileInSelectedBlock.value,
      (target) => target.classList.remove('selected-line'),
      undefined,
      isHorizontal.value ? selectNextNthElement : selectNextSibling,
    );
  }
  // REMOVE STYLE
  iterateCrosswordTiles(
    selectedTile.value as HTMLInputElement,
    (target) => target.classList.remove('direction-marking-tile'),
    undefined,
    isHorizontal.value ? selectNextNthElement : selectNextSibling,
  );

  // AFTER CHANGE
  iterateCrosswordTiles(
    selectedTile.value as HTMLInputElement,
    (target) => target.classList.add('selected-line'),
  );

  iterateCrosswordTiles(
    selectedTile.value as HTMLInputElement,
    (target) => {
      addToCharsSequence(target);
      (() => target.classList.add('direction-marking-tile'))();
    },
  );
  activeElementsIDs.value = Array.from(getIds(selectedTile.value as HTMLInputElement));
  applyRegexPattern();
});

// ON ACTIVE TILE CHANGE
watch(
  selectedTile as Ref<HTMLInputElement>,
  (newTile: HTMLInputElement, oldTile: HTMLInputElement | null) => {
    // INITIAL VALUES
    charsSequence.value = '';
    regexPattern.value = /''/;

    // ADD STYLE
    iterateCrosswordTiles(
      newTile,
      (target) => target.classList.add('selected-line'),
      (target) => target.classList.contains('selected-line'),
    );

    // REMOVE STYLE
    if (!activeElementsIDs.value.includes(newTile.id)) {
      firstTileInSelectedBlock.value = selectedTile.value;
    }

    iterateCrosswordTiles(firstTileInSelectedBlock.value as HTMLInputElement, addToCharsSequence);
    // REMOVE STYLE
    if (oldTile) {
      iterateCrosswordTiles(
        oldTile,
        (target) => target.classList.remove('direction-marking-tile'),
      );
    }

    // ADD STYLE
    iterateCrosswordTiles(
      newTile,
      (target) => {
        target.classList.add('direction-marking-tile');
      },
    );
    applyRegexPattern();
  },
);

watch(firstTileInSelectedBlock, (newTile, oldTile) => {
  activeElementsIDs.value = Array.from(getIds(selectedTile.value as HTMLInputElement));
  if (oldTile && !activeElementsIDs.value.includes(oldTile.id)) {
    iterateCrosswordTiles(
      oldTile,
      (target) => target.classList.remove('selected-line'),
    );
  }
});
</script>

<style scoped>
.csw-grid {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  width: fit-content;
}

.csw-grid-wrapper {
  width: fit-content;
  margin: 0 auto auto;
  border: 0.2rem solid black;
}

p {
  font-size: 2rem;
}
</style>
