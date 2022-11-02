<template>
  <div class="csw-grid-wrapper">
    <div
      class="csw-grid"
      @input="handleKeyboardEvent($event as any)"
      @mousedown.left="handleClickEvent($event)"
      :style="{ width: `${cswWrapperWidth}rem`, height: `${cswWrapperHeight}rem` }"
    >
      <div v-for="row in cswHeight" :key="row" class="csw-row" :id="`csw-row-${row}`">
        <CrosswordTile
          v-for="col in props.cswWidth"
          :key="`${col}-${row}`"
          :colNumber="col"
          :rowNumber="row"
          @focus="$event.target.select()"
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
  computed, Ref, ref,
} from 'vue';
import { selectNextNthElement, selectNextSibling } from '@/utils/select';
import WordSearchEngine from '@/components/organisms/WordSearchEngine.vue';
import CrosswordTile from '../atoms/CrosswordTile.vue';

// MAIN DATA
// skrócić to
const selectedTile: Ref<null | HTMLInputElement> = ref(null);
const prevSelectedTile: Ref<null | HTMLInputElement> = ref(null);

const firstWordSearchTile: Ref<null | HTMLInputElement> = ref(null);
const prevFirstWordSearchTile: Ref<null | HTMLInputElement> = ref(null);

const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));

const wordSearchTilesIds: Ref<string[]> = ref([]);
// const firstTileInSelectedBlock: Ref<HTMLInputElement | undefined | null> = ref();

// let GLOBAL_COUNTER = 1;
function isTileLocked(target: HTMLInputElement) {
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

function addStyle(element: HTMLElement, classNames: string[]) {
  // if (classNames === 'selected-line') {
  console.log('ADD', classNames, element?.id);
  // }
  // console.log(classNames);
  // console.log(classNames, '????');
  classNames.forEach((cls) => {
    // console.log(element.id, cls);
    element.classList.add(cls);
  });
}
function removeStyle(element: HTMLElement, classNames: string[]) {
  // if (classNames === 'selected-line') {
  console.log('REMOVE', classNames, element?.id);
  // }
  // console.log(classNames, 'REMOVE', element.id);
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

function applyRegexPattern() {
  regexPattern.value = new RegExp(`^${charsSequence.value}$`);
}

function addToWordSearchTilesIds(target: HTMLInputElement) {
  // console.log('add>>>>', target.id);
  wordSearchTilesIds.value.push(target.id);
}

// MAIN FUNCTIONS

function iterateCrosswordTiles(
  startElement: HTMLInputElement | null,
  callback: (target: HTMLInputElement, arg?: any) => void,
  args: any = [],
  stopCondition: (arg: HTMLInputElement) => boolean = () => false,
  _getNextTile: (arg: HTMLInputElement) => HTMLInputElement | null = getNextTile.value,
) {
  let target: HTMLInputElement | null = startElement;
  while (target && !isTileLocked(target) && !stopCondition(target)) {
    callback(target, args);
    target = _getNextTile(target);
  }
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
// SETTERS
// function setSelectedTile(newVal, ref){
//   ref.value = newVal
// }

// EVENT HANDLERS

function mainEventHandler(target: EventTarget) {
  console.log('===MAIN===');
  prevSelectedTile.value = selectedTile.value;
  selectedTile.value = target as HTMLInputElement;
  // console.log(firstWordSearchTile.value?.id, wordSearchTilesIds.value, 'BEFORE');
  // console.log(wordSearchTilesIds.value.includes(firstWordSearchTile.value?.id as any));
  if (!wordSearchTilesIds.value.includes(selectedTile.value.id)
  ) {
    // TO OPT.
    wordSearchTilesIds.value = [];
    charsSequence.value = '';

    console.log('SETUP IF firstWordSearchTile change');
    prevFirstWordSearchTile.value = firstWordSearchTile.value;
    firstWordSearchTile.value = target as HTMLInputElement;
    iterateCrosswordTiles(firstWordSearchTile.value, addToSearchPattern);
    iterateCrosswordTiles(firstWordSearchTile.value, addToWordSearchTilesIds); // OPT.
  }
  if (prevSelectedTile.value) {
    if (selectedTile.value === prevSelectedTile.value) {
      console.log('CLICK SAME');
      iterateCrosswordTiles(getNextTile.value(prevSelectedTile.value), removeStyle, [
        'direction-marking-tile', 'selected-to-word-search',
      ]);
      console.log(firstWordSearchTile.value, 'pref????');
      // IF BEFORE SAME CLICK !!!! TO DEBUG ....
      iterateCrosswordTiles(
        firstWordSearchTile.value,
        removeStyle,
        ['selected-to-word-search'],
        (t: HTMLInputElement) => firstWordSearchTile.value === t,
      );
      isHorizontal.value = !isHorizontal.value;
      iterateCrosswordTiles(getNextTile.value(selectedTile.value), addStyle, [
        'direction-marking-tile',
      ]);
      iterateCrosswordTiles(selectedTile.value, addStyle, ['selected-to-word-search']);
    } else if ((target as HTMLInputElement).classList.contains('direction-marking-tile')) {
      console.log('CLICK INSIDE');
      iterateCrosswordTiles(
        prevSelectedTile.value,
        removeStyle,
        ['direction-marking-tile'],
        (t: HTMLInputElement) => t === target,
      );
    } else {
      console.log('CLICK PRE');
      iterateCrosswordTiles(
        selectedTile.value,
        addStyle,
        ['direction-marking-tile'],
        (t) => t.classList.contains('direction-marking-tile'),
      );
      iterateCrosswordTiles(
        selectedTile.value,
        addStyle,
        ['selected-to-word-search'],
        (t) => t.classList.contains('selected-to-word-search'),
      );
      console.log(wordSearchTilesIds.value, 'WORD SEARCH TILES IDS', prevFirstWordSearchTile.value?.id);
      if (prevFirstWordSearchTile.value
        && !wordSearchTilesIds.value.includes(prevFirstWordSearchTile.value.id)
      ) {
        console.log('CLICK OUTSIDE SEC');
        iterateCrosswordTiles(prevFirstWordSearchTile.value, removeStyle, [
          'selected-to-word-search',
          'direction-marking-tile',
        ]); // FIX:zmienionyKier??
      }
    }
  } else {
    console.log('FIRST CLICK ');
    iterateCrosswordTiles(selectedTile.value, addStyle, [
      'selected-to-word-search',
      'direction-marking-tile',
    ]);
  }
}

function handleClickEvent(e: Event) {
  mainEventHandler(e.target as EventTarget);
}

function handleKeyboardEvent(e : Event & {data:string}) {
  (e.target as HTMLInputElement).value = e.data.toUpperCase() || '';
  const nextTile = getNextTile.value(e.target as HTMLInputElement);
  if (nextTile && !nextTile.readOnly) {
    // selected Tile = ...
    mainEventHandler(nextTile);
    nextTile.focus();
  }
}

// function onInputLetter(e: { target: { value: string | null }; data: string }) {
//   e.target.value = e.data.toUpperCase() || null;
//   const nextTile = getNextTile.value(e.target as HTMLInputElement);
//   if (nextTile && !nextTile.readOnly) {
//     setSelectedTile(nextTile);
//     nextTile.focus();
//   }
// }

// function onLeftClick(e: MouseEvent) {
//   if (e.target === selectedTile.value) {
//     toggleWritingDirection();
//   } else if (e.target && !(e.target as HTMLInputElement).readOnly) {
//     setSelectedTile(e.target as HTMLInputElement);
//   }
// }

// // MAIN WATCHERS
// // WRITING DIRECTION CHANGE
// watch(isHorizontal, () => {
//   // INITIAL VALUES
//   charsSequence.value = '';
//   regexPattern.value = /''/;

//   if (firstTileInSelectedBlock.value) {
//     // console.log('TEST', GLOBAL_COUNTER);
//     // GLOBAL_COUNTER += 1;
//     iterateCrosswordTiles(
//       firstTileInSelectedBlock.value,
//       (target) => {
//         target.classList.remove('selected-line');
//       },
//       undefined,
//       isHorizontal.value ? selectNextNthElement : selectNextSibling,
//     );
//   }
//   // REMOVE STYLE
//   iterateCrosswordTiles(
//     selectedTile.value as HTMLInputElement,
//     (target) => target.classList.remove('direction-marking-tile'),
//     undefined,
//     isHorizontal.value ? selectNextNthElement : selectNextSibling,
//   );

//   // AFTER CHANGE
//   iterateCrosswordTiles(selectedTile.value as HTMLInputElement,
//  (target) => target.classList.add('selected-line'));

//   iterateCrosswordTiles(selectedTile.value as HTMLInputElement, (target) => {
//     addToCharsSequence(target);
//     (() => target.classList.add('direction-marking-tile'))();
//   });
//   activeElementsIDs.value = Array.from(getIds(selectedTile.value as HTMLInputElement));
//   applyRegexPattern();
// });

// // ON ACTIVE TILE CHANGE
// watch(
//   selectedTile as Ref<HTMLInputElement>,
//   (newTile: HTMLInputElement, oldTile: HTMLInputElement | null) => {
//     // INITIAL VALUES
//     charsSequence.value = '';
//     regexPattern.value = /''/;

//     // ADD STYLE
//     iterateCrosswordTiles(
//       newTile,
//       (target) => target.classList.add('selected-line'),
//       (target) => target.classList.contains('selected-line'),
//     );

//     // REMOVE STYLE
//     if (!activeElementsIDs.value.includes(newTile.id)) {
//       firstTileInSelectedBlock.value = selectedTile.value;
//       if (oldTile) {
//         console.log('THIS');
//         iterateCrosswordTiles(oldTile, (target) => target.classList.remove('selected-line'));
//       }
//     }

//     iterateCrosswordTiles(firstTileInSelectedBlock.value as HTMLInputElement,
//  addToCharsSequence);
//     if (oldTile) {
//       iterateCrosswordTiles(oldTile,
//  (target) => target.classList.remove('direction-marking-tile'));
//     }

//     // ADD STYLE
//     iterateCrosswordTiles(newTile, (target) => {
//       target.classList.add('direction-marking-tile');
//     });
//     applyRegexPattern();
//   },
// );

// watch(firstTileInSelectedBlock, (newTile, oldTile) => {
//   activeElementsIDs.value = Array.from(getIds(selectedTile.value as HTMLInputElement));
//   // console.log('CHANGED FIRST TILE', newTile?.id);
//   // if (oldTile && !activeElementsIDs.value.includes(oldTile.id)) {
//   //   console.log('REMOVE FIRST TILE', oldTile.id);
//   //   iterateCrosswordTiles(
//   //     oldTile,
//   //     (target) => target.classList.remove('selected-line'),
//   //   );
//   // }
// });
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
