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
import {
  computed, Ref, ref, watch,
} from 'vue';
import { TILE_SIZE_REM } from '@/constants';
import { selectNextNthElement, selectNextSibling } from '@/utils/select';
import WordSearchEngine from '@/components/organisms/WordSearchEngine.vue';
import CrosswordTile from '../atoms/CrosswordTile.vue';

// DEBUG
let COUNTER = 0

// MAIN DATA
const selectedTile: Ref<null | HTMLInputElement> = ref(null);
const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));

const activeElementsIDs: Ref<string[]> = ref([]);
const firstTileInSelectedBlock: Ref<HTMLInputElement | undefined | null> = ref();

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

function addStyle(element: HTMLElement, className: string, ) {
  if (className=== 'selected-line'){
  console.log('ADD', className, element?.id);
}
  element.classList.add(className);
}

function removeStyle(element: HTMLElement, className: string, ) {
  if (className=== 'selected-line'){
  console.log('REMOVE', className, element?.id);
  }
  element.classList.remove(className);
}

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
  _callback: (target: HTMLInputElement, arg?:any) => void,
  _stopCondition: (arg: HTMLInputElement) => boolean = () => false,
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
  COUNTER+=1
  console.log(`${COUNTER} click`)
  if (e.target === selectedTile.value) {
    toggleWritingDirection();
  } else if (e.target && !(e.target as HTMLInputElement).readOnly) {
    setSelectedTile(e.target as HTMLInputElement);
  }
}

// MAIN WATCHERS
// WRITING DIRECTION
watch(isHorizontal, () => {
  // INITIAL VALUES
  charsSequence.value = '';
  regexPattern.value = /''/;

  // REMOVE STYLE
  if (firstTileInSelectedBlock.value) {
    console.log('WRITING DIRECTION CHANGE')
    iterateCrosswordTiles(
      firstTileInSelectedBlock.value,
      (target) => removeStyle(target,'selected-line'),
      undefined,
      isHorizontal.value ? selectNextNthElement : selectNextSibling,
    );
  }
  
  firstTileInSelectedBlock.value = selectedTile.value

  iterateCrosswordTiles(
    selectedTile.value as HTMLInputElement,
    (target) => removeStyle(target, 'direction-marking-tile'),
    undefined,
    isHorizontal.value ? selectNextNthElement : selectNextSibling,
  );

  // AFTER CHANGE
  console.log('IN HORIZONTAL AFTER')
  iterateCrosswordTiles(selectedTile.value as HTMLInputElement, (target) => addStyle(target, 'selected-line'));

  iterateCrosswordTiles(selectedTile.value as HTMLInputElement, (target) => {
    addToCharsSequence(target);
    addStyle(target, 'direction-marking-tile');
  });
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
      (target) => addStyle(target,'selected-line'),
      (target) => target.classList.contains('selected-line'),
    );

    // REMOVE STYLE
    if (!activeElementsIDs.value.includes(newTile.id)) {
      console.log('CHANGE FIRST TILE')
      firstTileInSelectedBlock.value = selectedTile.value;
    }

    iterateCrosswordTiles(firstTileInSelectedBlock.value as HTMLInputElement, addToCharsSequence);
    // REMOVE STYLE
    if (oldTile) {
      iterateCrosswordTiles(oldTile, (target) => removeStyle(target, 'direction-marking-tile'));

    }

    // ADD STYLE
    iterateCrosswordTiles(newTile, (target) => {
      addStyle(target, 'direction-marking-tile');
    });
    applyRegexPattern();
  },
);

watch(firstTileInSelectedBlock, (newTile, oldTile) => {
  activeElementsIDs.value = Array.from(getIds(selectedTile.value as HTMLInputElement));
  if (oldTile && !activeElementsIDs.value.includes(oldTile.id)) {
    
    console.log('REMOVE AFTER CHANGE FIRST')
    iterateCrosswordTiles(oldTile, (target) => removeStyle(target, 'selected-line'));
  }
});

// watch(activeElementsIDs, (newElements, oldElements) =>{
//   // console.log(newElements, oldElements, 'CHANGES')
//   firstTileInSelectedBlock.value = newElements[0]
//   previousTileInSelectedBlock 
//   if (newElements[0] !== oldElements[0]){
//     console.log('FIRST TILE CHANGED')
//     if (oldElements.includes(newElements[0])){
//       iterateCrosswordTiles(oldElements[0], (target) => removeStyle(target, 'selected-line'),undefined,isHorizontal.value ?
//       selectNextNthElement : selectNextSibling)
//     }
//       // REMOVE FROM LAST FIRST TILE in reversed direction
//       else{
//         // STANDARD
//       }

//   }
// })
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
