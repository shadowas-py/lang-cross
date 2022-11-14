<template>
  <div class="csw-grid-wrapper" @click.="keepFocus">
    <div
      class="csw-grid"
      @input="handleKeyboardEvent($event as any)"
      @mousedown.left.stop="handleClickEvent($event)"
      @click.stop=""
      :style="{ width: `${cswWrapperWidth}rem`, height: `${cswWrapperHeight}rem` }"
    >
      <div v-for="row in cswHeight" :key="row" class="csw-row" :id="`csw-row-${row}`">
        <CrosswordTile
          v-for="col in props.cswWidth"
          :key="`${col}-${row}`"
          :colNumber="col"
          :rowNumber="row"
          :isInput ="isInput"
          @click.right.prevent='handleTileTypeChange($event.target)'
        />
      </div>
    </div>
    <p></p>
    <WordSearchEngine :pattern="regexPattern" />
  </div>
</template>
<script lang="ts" setup>
import { TILE_SIZE_REM } from '@/constants';
import {
  computed, Ref, ref,
} from 'vue';
import {
  selectNextNthElement, selectNextSibling, selectPrevNthElement, selectPrevSibling,
} from '@/utils/select';
import WordSearchEngine from '@/components/organisms/WordSearchEngine.vue';
import CrosswordTile from '../atoms/CrosswordTile.vue';

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

// HANDLE CHILD COMP
const isInput = ref(true);

// DEBUG
// let GLOBAL_COUNTER = 1;
function keepFocus(e:Event) {
  if (selectedTile.value) {
    selectedTile.value.focus();
  }
}

// DO I Need this?
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
  // console.log('REMOVE', classNames, element?.id);
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

// maybe make class for this ?
function addToWordSearchTilesIds(target: HTMLInputElement) {
  wordSearchTilesIds.value.push(target.id);
}

// MAIN FUNCTIONS
function iterateCrosswordTiles(
  startElement: HTMLInputElement | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// EVENT HANDLERS
// to handle 'active tiles'
function mainEventHandler(target: EventTarget) {
  prevSelectedTile.value = selectedTile.value;
  selectedTile.value = target as HTMLInputElement;

  // TO OPT.
  wordSearchTilesIds.value = []; // DO I really need this?
  charsSequence.value = ''; // TO OPT.

  // too many repetition
  iterateCrosswordTiles(firstWordSearchTile.value, addToSearchPattern);
  iterateCrosswordTiles(firstWordSearchTile.value, addToWordSearchTilesIds); // OPT.

  if (!wordSearchTilesIds.value.includes(selectedTile.value.id)) {
    // console.log('SETUP IF firstWordSearchTile change', firstWordSearchTile.value?.id);

    if (selectedTile.value.id !== firstWordSearchTile.value?.id || !firstWordSearchTile.value) {
      // console.log('SET');
      prevFirstWordSearchTile.value = firstWordSearchTile.value;
      firstWordSearchTile.value = target as HTMLInputElement;
    }
  }

  if (prevSelectedTile.value) {
    if (selectedTile.value === prevSelectedTile.value) {
      // console.log('CLICK SAME');
      iterateCrosswordTiles(getNextTile.value(prevSelectedTile.value), removeStyle, [
        'direction-marking-tile', 'selected-to-word-search',
      ]);
      iterateCrosswordTiles(
        firstWordSearchTile.value,
        removeStyle,
        ['selected-to-word-search'],
        (el: HTMLInputElement) => firstWordSearchTile.value === el,
      );

      // REMOVING FROM FIRST TILE TO OLD SELECTED TILE
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
        'direction-marking-tile', 'selected-to-word-search',
      ]);
    } else if ((target as HTMLInputElement).classList.contains('direction-marking-tile')) {
      // console.log('CLICK INSIDE');
      iterateCrosswordTiles(
        prevSelectedTile.value,
        removeStyle,
        ['direction-marking-tile'],
        (el: HTMLInputElement) => el === target,
      );
    } else {
      // console.log('CLICK OUTSIDE');
      ['direction-marking-tile', 'selected-to-word-search'].forEach((cls) => iterateCrosswordTiles(
        selectedTile.value,
        addStyle,
        [cls],
        (t) => t.classList.contains(cls),
      ));

      wordSearchTilesIds.value = [];
      iterateCrosswordTiles(firstWordSearchTile.value, addToWordSearchTilesIds);
      // only reason for wordSearchTilesIds
      if (prevFirstWordSearchTile.value
        && !wordSearchTilesIds.value.includes(prevFirstWordSearchTile.value.id)
      ) {
        // console.log('CLICK OUTSIDE SEC');
        iterateCrosswordTiles(prevFirstWordSearchTile.value, removeStyle, [
          'selected-to-word-search',
          'direction-marking-tile',
        ]);
      }
    }
  } else {
    // MAYBE MERGE THIS ELSE WITH SOMETHING ELSE
    // console.log('FIRST CLICK ');
    iterateCrosswordTiles(selectedTile.value, addStyle, [
      'selected-to-word-search',
      'direction-marking-tile',
    ]);
  }
}

function handleClickEvent(e: Event) {
  if ((e.target as HTMLInputElement).classList.contains('question-field')) {
    // first just select this field like regular textarea
  } else {
    (e.target as HTMLInputElement).focus();
    mainEventHandler(e.target as EventTarget);
  }
}

function handleKeyboardEvent(e : Event & {data:string}) {
  (e.target as HTMLInputElement).value = e.data?.toUpperCase() || '';
  const nextTile = getNextTile.value(e.target as HTMLInputElement);
  if (nextTile && !nextTile.readOnly) {
    mainEventHandler(nextTile);
    nextTile.focus();
  }
}

function handleTileTypeChange(target: HTMLInputElement) {
  console.log('clicked', target);
  if (target && !target.classList.contains('question-field')) {
    addStyle(target, ['question-field']);
    iterateCrosswordTiles(getNextTile.value(target), removeStyle, ['selected-to-word-search', 'direction-marking-tile']);
  } else if (target) {
    removeStyle(target, ['question-field']);
    if (getPrevTile.value(target)?.classList.contains('direction-marking-tile')) {
      iterateCrosswordTiles(
        target,
        addStyle,
        ['selected-to-word-search', 'direction-marking-tile'],
      );
    }
  }

  // if (tileType === 'question') {
  //   addStyle(target, ['question-field']);
  //   if (target.classList.contains('direction-marking-tile')) {
  //     removeStyle(target, ['selected-to-word-search', 'direction-marking-tile']);
  //     iterateCrosswordTiles(getNextTile.value(target), removeStyle,
  // ['selected-to-word-search', 'direction-marking-tile']);
  //   }
  // } else {
  //   removeStyle(target, ['question-field']);
  //   if (getPrevTile.value(target)?.classList.contains('direction-marking-tile')) {
  //     iterateCrosswordTiles(target, addStyle,
  //  ['selected-to-word-search', 'direction-marking-tile']);
  //   }
  // }
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
.csw-row{
  display:flex;
}
</style>
