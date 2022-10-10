<template>
  <div class="csw-grid-wrapper">
    <div
      class="csw-grid"
      @input="onInputLetter($event)"
      @mousedown.left="onLeftClick($event)"
      :style="{
        width: `${cswWrapperWidth}rem`,
        height: `${cswWrapperHeight}rem`,
      }"
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
<script setup>
import { TILE_SIZE_REM } from '@/constants';
import { computed, ref, watch } from 'vue';
import { selectNextNthElement, selectNextSibling } from '@/utils/select';
import WordSearchEngine from '@/components/organisms/WordSearchEngine.vue';
import CrosswordTile from '../atoms/CrosswordTile.vue';

// MAIN DATA
const selectedTile = ref(null);
const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));

const activeElementsIDs = ref([]);
const firstTileInSelectedBlock = ref(null);

function toggleWritingDirection() {
  isHorizontal.value = !isHorizontal.value;
}

// RENDERING
const props = defineProps({
  cswWidth: Number,
  cswHeight: Number,
});

const cswWrapperWidth = computed(() => props.cswWidth * TILE_SIZE_REM);
const cswWrapperHeight = computed(() => props.cswHeight * TILE_SIZE_REM);

function toggleDisplayingWritingDirection(target) {
  if (target.classList.contains('direction-marking-tile')) {
    target.classList.remove('direction-marking-tile');
  } else {
    target.classList.add('direction-marking-tile');
  }
}

// WORD SEARCH HANDLERS
const charsSequence = ref('');
const regexPattern = ref(/.*/);

function addToCharsSequence(target) {
  console.log(target.id);
  charsSequence.value += target.value.toLowerCase() || '.';
}

function applyRegexPattern() {
  regexPattern.value = new RegExp(`^${charsSequence.value}$`);
}

// MAIN FUNCTIONS
function iterateCrosswordTiles(
  _target,
  _callbacks,
  _stopCondition = true,
  _getNextTile = getNextTile.value,
  _args = {},
) {
  let target = _target;
  do {
    for (let i = 0; i < _callbacks.length; i += 1) {
      _callbacks[i](target, { ..._args });
    }
    target = _getNextTile(target);
  } while (target && _stopCondition);
}

function forEachTileInLine(startTarget, callbacks, reversed = false) {
  let _getNextTile;
  if (reversed) {
    _getNextTile = !isHorizontal.value ? selectNextSibling : selectNextNthElement;
  } else {
    _getNextTile = getNextTile.value;
  }
  let nextTile = _getNextTile(startTarget);
  while (nextTile && !nextTile.classList.contains('locked-tile')) {
    for (let i = 0; i < callbacks.length; i += 1) {
      callbacks[i](nextTile);
    }
    nextTile = _getNextTile(nextTile);
  }
}

function setSelectedTile(targetTile) {
  selectedTile.value = targetTile;
}

function* getIds(target) {
  let nextTile = getNextTile.value(target);
  yield target.id;
  while (nextTile) {
    yield nextTile.id;
    nextTile = getNextTile.value(nextTile);
  }
}
// EVENT HANDLERS
function onInputLetter(e) {
  e.target.value = e.data.toUpperCase();
  const nextTile = getNextTile.value(e.target);
  if (nextTile && !nextTile.readOnly) {
    setSelectedTile(nextTile);
    nextTile.focus();
  }
}

function onLeftClick(e) {
  if (e.target === selectedTile.value) {
    toggleWritingDirection();
  } else if (!e.target.readOnly) {
    setSelectedTile(e.target);
  }
}

// MAIN WATCHERS

// ON WRITING DIRECTION CHANGE
watch(isHorizontal, () => {
  // BEFORE CHANGE
  charsSequence.value = selectedTile.value.value.toLowerCase() || '.';
  regexPattern.value = '';

  if (firstTileInSelectedBlock.value) {
    iterateCrosswordTiles(
      firstTileInSelectedBlock.value,
      [
        (target) => {
          target.classList.remove('selected-line');
        },
      ],
      (target) => {
        target.classList.contains('locked-tile');
      },
      isHorizontal.value ? selectNextNthElement : selectNextSibling,
    );
  }
  forEachTileInLine(
    selectedTile.value,
    [(target) => target.classList.remove('direction-marking-tile')],
    true,
  );
  // ON CHANGE
  firstTileInSelectedBlock.value = selectedTile.value;

  // AFTER CHANGE
  iterateCrosswordTiles(
    selectedTile.value,
    [
      (target) => {
        target.classList.add('selected-line');
      },
    ],
    (target) => {
      target.classList.contains('locked-tile');
    },
  );

  forEachTileInLine(selectedTile.value, [addToCharsSequence, toggleDisplayingWritingDirection]);
  activeElementsIDs.value = Array.from(getIds(selectedTile.value));
  applyRegexPattern();
});

// ON ACTIVE TILE  CHANGE
watch(selectedTile, (newTile, oldTile) => {
  // BEFORE CHANGE
  charsSequence.value = '';
  regexPattern.value = '';
  if (activeElementsIDs.value.length === 0 || !activeElementsIDs.value.includes(newTile.id)) {
    if (firstTileInSelectedBlock.value) {
      iterateCrosswordTiles(
        firstTileInSelectedBlock.value,
        [
          (target) => {
            target.classList.remove('selected-line');
          },
        ],
        (target) => {
          target.classList.contains('locked-tile');
        },
      );
    }

    // ON CHANGE
    firstTileInSelectedBlock.value = selectedTile.value;

    iterateCrosswordTiles(
      selectedTile.value,
      [
        (target) => {
          target.classList.add('selected-line');
        },
      ],
      (target) => {
        target.classList.contains('locked-tile');
      },
    );
    activeElementsIDs.value = Array.from(getIds(selectedTile.value));
  }

  iterateCrosswordTiles(firstTileInSelectedBlock.value, [addToCharsSequence]);
  // REMOVE STYLE
  if (oldTile) {
    console.log('THIS');
    iterateCrosswordTiles(
      oldTile,
      [
        (target) => {
          target.classList.remove('direction-marking-tile');
        },
      ],
      (target) => {
        target.classList.contains('locked-tile');
      },
    );
  }

  // ADD STYLE
  iterateCrosswordTiles(
    newTile,
    [
      (target) => {
        target.classList.add('direction-marking-tile');
      },
    ],
    (target) => {
      target.classList.contains('locked-tile');
    },
  );
  applyRegexPattern();
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
