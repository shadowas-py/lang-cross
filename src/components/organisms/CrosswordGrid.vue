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
import {
  computed, ref, watch,
} from 'vue';
import { selectNextNthElement, selectNextSibling } from '@/utils/select';
import WordSearchEngine from '@/components/organisms/WordSearchEngine.vue';
import CrosswordTile from '../atoms/CrosswordTile.vue';

// MAIN DATA
const selectedTile = ref(null);
const activeElementsIDs = ref([]);
const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));

function toggleWritingDirection() {
  isHorizontal.value = !isHorizontal.value;
}

// function addActiveElement(el) {
//   activeElementsIDs.value.push(el);
// }

// function resetactiveElementsIDs() {
//   activeElementsIDs.value = [];
// }

// function sliceActiveTiles(startId, endId = null) {
//   const selectedTileIndex = activeElementsIDs.value.indexOf(startId);
//   const lastTileIndex = endId || activeElementsIDs.value.length;
//   activeElementsIDs.value = activeElementsIDs.value.slice(selectedTileIndex, lastTileIndex);
// }

// RENDERING
const props = defineProps({
  cswWidth: Number,
  cswHeight: Number,
});

const cswWrapperWidth = computed(() => props.cswWidth * TILE_SIZE_REM);
const cswWrapperHeight = computed(() => props.cswHeight * TILE_SIZE_REM);

function toggleDisplayingWritingDirection(target) {
  if (target.classList.contains('direction-marking-tile')) {
    console.log(target.id, 'HIDE');
    target.classList.remove('direction-marking-tile');
  } else {
    console.log(target.id, 'SHOW');
    target.classList.add('direction-marking-tile');
  }
}

function toggleDisplayingSelectedBlock(target) {
  if (target.classList.contains('selected-line')) {
    console.log(target.id, 'HIDE BLOCK');
    target.classList.remove('selected-line');
  } else {
    console.log(target.id, 'SHOW BLOCK');
    target.classList.add('selected-line');
  }
}

watch(activeElementsIDs, (n, o) => {
  console.log('ACTIVE BLOCK CHANGE');
  console.log(n.value, o.value);
});

// WORD SEARCH ENGINE HANDLERS
const charsSequence = ref('');

const regexPattern = ref(/.*/);

function generatePreRegexPattern(target) {
  charsSequence.value += target.value.toLowerCase() || '.';
}

function applyRegexPattern() {
  regexPattern.value = new RegExp(`^${charsSequence.value}$`);
}

// MAIN FUNCTIONS
function iterateThroughGridLine(
  _target,
  _callbacks,
  _stopCondition = true,
  _getNextTile = getNextTile.value,
  _args = {},
) {
  console.log('NEW FUNC', _args);
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

// EVENT HANDLERS
function onInputLetter(e) {
  if (e.data) {
    e.target.value = e.data.toUpperCase();
  }
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

function* getIds(target) {
  let nextTile = getNextTile.value(target);
  yield target.id;
  while (nextTile) {
    yield nextTile.id;
    nextTile = getNextTile.value(nextTile);
  }
}

// MAIN WATCHERS
watch(isHorizontal, () => {
  charsSequence.value = selectedTile.value.value.toLowerCase() || '.';
  regexPattern.value = '';

  forEachTileInLine(selectedTile.value, [toggleDisplayingWritingDirection,
    toggleDisplayingSelectedBlock], true);

  forEachTileInLine(selectedTile.value, [
    generatePreRegexPattern,
    toggleDisplayingWritingDirection,
    toggleDisplayingSelectedBlock,
  ]);
  activeElementsIDs.value = Array.from(getIds(selectedTile.value));
  applyRegexPattern();
});

watch(selectedTile, (newTile, oldTile) => {
  charsSequence.value = newTile.value || '.';
  regexPattern.value = '';
  if (oldTile) {
    // forEachTileInLine(oldTile, [toggleDisplayingWritingDirection]);
    iterateThroughGridLine(
      oldTile,
      [(target) => { target.classList.remove('direction-marking-tile'); }],
      (target) => { target.classList.contains('locked-tile'); },
    );
  }
  forEachTileInLine(newTile, [toggleDisplayingWritingDirection, generatePreRegexPattern]);
  if (!activeElementsIDs.value.includes(newTile.id)) {
    activeElementsIDs.value = Array.from(getIds(selectedTile.value));
    forEachTileInLine(newTile, [toggleDisplayingSelectedBlock]);
  } else if (activeElementsIDs.value.includes(newTile.id)
  && activeElementsIDs.value.includes(newTile.id)) {
    let nextTile = getNextTile(oldTile);
    while (nextTile !== newTile) {
      nextTile.classList.remove('active-block');
      nextTile = getNextTile(nextTile);
    }
  }
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
