<template>
  <div class="csw-grid-wrapper" @click.="keepFocus">
    <table
      class="csw-grid"
      @input="handleKeyboardEvent($event as any)"
      @mousedown.left.stop="handleClickEvent($event)"
      @click.stop=""
      :style="{ width: `${cswWrapperWidth}rem`, height: `${cswWrapperHeight}rem` }"
      @mousedown.right="handleRightClick"
    >
      <tr v-for="row in cswHeight" :key="row" class="csw-row" :id="`csw-row-${row}`">
        <td
          v-for="col in props.cswWidth"
          :id="`csw-tile-${col}${row}`"
          :key="col.toString() + row.toString()"
        >
          <CrosswordAnswerTile v-if="isAnswerTile" />
          <CrosswordClueTile v-else />
        </td>
      </tr>
    </table>
    <p></p>
    <WordSearchEngine :pattern="regexPattern" />
  </div>
</template>
<script lang="ts" setup>
import { TILE_SIZE_REM } from '@/constants';
import { computed, Ref, ref } from 'vue';
import {
  selectNextNthElement,
  selectNextSibling,
  selectPrevNthElement,
  selectPrevSibling,
} from '@/utils/select';
import WordSearchEngine from '@/components/organisms/WordSearchEngine.vue';
import CrosswordAnswerTile from '../atoms/CrosswordAnswerTile.vue';

// MAIN DATA
// simplify this somehow ???
const selectedTile: Ref<null | HTMLInputElement> = ref(null);
const prevSelectedTile: Ref<null | HTMLInputElement> = ref(null);

const firstWordSearchTile: Ref<null | HTMLInputElement> = ref(null);
const prevFirstWordSearchTile: Ref<null | HTMLInputElement> = ref(null);

const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));
const getPrevTile = computed(() => (isHorizontal.value ? selectPrevSibling : selectPrevNthElement));

const wordSearchTilesIds: Ref<string[]> = ref([]);

const TILE_INPUT_CLASS_LIST = ['selected-to-word-search', 'direction-marking-tile'];

// DEBUGGING
// let GLOBAL_COUNTER = 1;

// HANDLE CHILD COMP
const isAnswerTile = ref(true);

// do i need this?
function isTileLocked(target: HTMLInputElement) {
  return target.classList.contains('question-field');
}

// RENDERING
const props = defineProps({
  cswWidth: Number,
  cswHeight: Number,
});

const cswWrapperWidth = computed(() => Number(props.cswWidth) * TILE_SIZE_REM);
const cswWrapperHeight = computed(() => Number(props.cswHeight) * TILE_SIZE_REM);

function addStyle(element: HTMLElement, classNames: string[]) {
  // console.log('ADD', classNames, element?.id);
  classNames.forEach((cls) => {
    element.classList.add(cls);
  });
}
function removeStyle(element: HTMLElement, classNames: string[]) {
  console.log('REMOVE', classNames, element?.id);
  classNames.forEach((cls) => {
    element.classList.remove(cls);
  });
}

// WORD SEARCH HANDLERS
const charsSequence = ref('');
const regexPattern: Ref<RegExp> = ref(/.*/);

function addToSearchPattern(target: HTMLInputElement) {
  charsSequence.value += target.value.toLowerCase() || '.';
}

// TODO IMPORTANT
// function applyRegexPattern() {
//   regexPattern.value = new RegExp(`^${charsSequence.value}$`);
// }

function addToWordSearchTilesIds(target: HTMLInputElement) {
  wordSearchTilesIds.value.push(target.id);
}

// MAIN FUNCTIONS
function iterateCrosswordTiles(
  startElement: HTMLInputElement | null,
  callback: (target: HTMLInputElement, arg?: any) => void,
  args: unknown = [],
  stopCondition: (arg: HTMLInputElement) => boolean = () => false,
  _getNextTile: (arg: HTMLInputElement) => HTMLInputElement | null = getNextTile.value,
) {
  let target: HTMLInputElement | null = startElement;
  while (target && !isTileLocked(target) && !stopCondition(target)) {
    callback(target, args);
    target = _getNextTile(target);
  }
}

// OTHERS

// REFACTOR!!! DEBUG!!!
function keepFocus(e: Event) {
  if (selectedTile.value) {
    selectedTile.value.focus();
  }
}

// EVENT HANDLERS
function mainEventHandler(target: EventTarget) {
  prevSelectedTile.value = selectedTile.value;
  selectedTile.value = target as HTMLInputElement;

  // TO OPT.!!!
  wordSearchTilesIds.value = []; // DO I really need this?
  charsSequence.value = ''; // TO OPT.

  // TO REFACTOR!!!
  iterateCrosswordTiles(firstWordSearchTile.value, addToSearchPattern);
  iterateCrosswordTiles(firstWordSearchTile.value, addToWordSearchTilesIds); // OPT.

  if (!wordSearchTilesIds.value.includes(selectedTile.value.id)) {
    if (selectedTile.value.id !== firstWordSearchTile.value?.id || !firstWordSearchTile.value) {
      prevFirstWordSearchTile.value = firstWordSearchTile.value;
      firstWordSearchTile.value = target as HTMLInputElement;
      console.log(
        'SET',
        'O:',
        prevFirstWordSearchTile.value?.id,
        'N:',
        firstWordSearchTile.value.id,
      );
    }
  }

  if (prevSelectedTile.value) {
    //
    // CLICK SAME TILE TWICE
    //
    if (selectedTile.value === prevSelectedTile.value) {
      console.log('CLICK SAME');
      console.log(firstWordSearchTile.value?.id, 'firstwordserachtile');
      console.log(prevSelectedTile.value.id, '=>', firstWordSearchTile?.value?.id);

      // TO OPT.
      // REMOVE AFTER SELECTED TILE
      console.log('FROM', getNextTile.value(prevSelectedTile.value)?.id, 'REMOVE');
      iterateCrosswordTiles(getNextTile.value(prevSelectedTile.value), removeStyle, [
        'direction-marking-tile',
        'selected-to-word-search',
      ]);

      console.log('FROM', firstWordSearchTile.value?.id, 'REMOVE');
      // REMOVE BEFORE SELECTED TILE
      iterateCrosswordTiles(
        firstWordSearchTile.value,
        removeStyle,
        ['selected-to-word-search'],
        (el: HTMLInputElement) => el === selectedTile.value,
      );
      if (prevFirstWordSearchTile.value !== selectedTile.value) {
        // NOT TESTED
        prevFirstWordSearchTile.value = firstWordSearchTile.value;
        firstWordSearchTile.value = target as HTMLInputElement;

        iterateCrosswordTiles(
          prevFirstWordSearchTile.value,
          removeStyle,
          ['selected-to-word-search'],
          (el: HTMLInputElement) => selectedTile.value === el,
        );
      }
      isHorizontal.value = !isHorizontal.value;

      // to many repetitions
      wordSearchTilesIds.value = [];
      iterateCrosswordTiles(firstWordSearchTile.value, addToSearchPattern);
      iterateCrosswordTiles(firstWordSearchTile.value, addToWordSearchTilesIds); // OPT.

      iterateCrosswordTiles(getNextTile.value(selectedTile.value), addStyle, [
        'direction-marking-tile',
        'selected-to-word-search',
      ]);

      //
      //  CLICK INSIDE SELECTED LINE
      //
    } else if ((target as HTMLInputElement).classList.contains('direction-marking-tile')) {
      console.log('CLICK INSIDE');
      iterateCrosswordTiles(
        prevSelectedTile.value,
        removeStyle,
        ['direction-marking-tile'],
        (el: HTMLInputElement) => el === target,
      );
      //
      //  CLICK OUTSIDE SELECTED LINE
      //
    } else {
      console.log('CLICK OUTSIDE');
      ['direction-marking-tile', 'selected-to-word-search'].forEach((cls) => iterateCrosswordTiles(selectedTile.value, addStyle, [cls], (t) => t.classList.contains(cls)));

      wordSearchTilesIds.value = [];
      iterateCrosswordTiles(firstWordSearchTile.value, addToWordSearchTilesIds);
      // only reason for wordSearchTilesIds
      if (
        prevFirstWordSearchTile.value
        && !wordSearchTilesIds.value.includes(prevFirstWordSearchTile.value.id)
      ) {
        // console.log('CLICK OUTSIDE SEC');
        iterateCrosswordTiles(prevFirstWordSearchTile.value, removeStyle, [
          'selected-to-word-search',
          'direction-marking-tile',
        ]);
      }
    }
    //
    //  FIRST SELECTING TILE
    //
  } else {
    console.log('FIRST CLICK ');
    iterateCrosswordTiles(selectedTile.value, addStyle, TILE_INPUT_CLASS_LIST);
  }
}

function handleClickEvent(e: Event) {
  if ((e.target as HTMLInputElement).classList.contains('question-field')) {
    // first just select this field like regular textarea
    // TO REFACTOR
    console.log('HANDLE TEXTAREA SELECT');
  } else {
    (e.target as HTMLInputElement).focus();
    mainEventHandler(e.target as EventTarget);
  }
}

function handleKeyboardEvent(e: Event & { data: string }) {
  if ((e.target as HTMLInputElement).tagName === 'INPUT') {
    (e.target as HTMLInputElement).value = e.data?.toUpperCase() || '';
    const nextTile = getNextTile.value(e.target as HTMLInputElement);
    if (nextTile && !nextTile.readOnly) {
      mainEventHandler(nextTile);
      nextTile.focus();
    }
  }
  // TODO textarea logic
}
function handleRightClick(e: any) {
  // REFACTOR - I don't know how to do this without queryselector
  const el = document.getElementById(e.target.id);

  // CLICKED TILE
  if (el && el.tagName === 'INPUT') {
    const prevTile = getPrevTile.value(el as HTMLInputElement);
    if (prevTile) {
      TILE_INPUT_CLASS_LIST.forEach((cls) => {
        if (prevTile.classList.contains(cls)) {
          iterateCrosswordTiles(el as HTMLInputElement, addStyle, TILE_INPUT_CLASS_LIST);
        }
      });
    }

    // AFTER CLICKED TILE
  } else {
    iterateCrosswordTiles(
      getNextTile.value(el as HTMLInputElement),
      removeStyle,
      TILE_INPUT_CLASS_LIST,
    );
  }
}
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
.csw-row {
  display: flex;
}
</style>
