<template>
  <main class='main'>
  <CrosswordGrid
    v-if="cswGridVisible"
    :cswWidth="cswWidth"
    :cswHeight="cswHeight"
  />
  <WordList :regexPattern="regexPattern.get()" />
  <GridGeneratorForm v-if="!cswGridVisible" @onCswGridParams="generateCswGrid" />
</main>
</template>

<script lang="ts" setup>
import GridGeneratorForm from '@/components/organisms/GridGeneratorForm.vue';
import CrosswordGrid from '@/components/organisms/CrosswordGrid.vue';
import WordList from '@/components/organisms/WordList.vue';
import {
  computed,
  reactive, Ref, ref, watch,
} from 'vue';
import RegexPattern from '@/utils/RegexPattern';
import { selectNextSibling, selectNextNthElement } from '@/utils/select';

const cswWidth = ref(15);
const cswHeight = ref(15);
const cswGridVisible = ref(false);

function setCswGridVisible() {
  cswGridVisible.value = true;
}
// CROSSWORD GRID HANDLERS
const firstWordSearchTile: Ref<null | HTMLInputElement> = ref(null);
const isHorizontal = ref(true);
const getNextTile = computed(() => (isHorizontal.value ? selectNextSibling : selectNextNthElement));
// TRAVERSING CROSSWORD GRID
function mapCswGrid(
  startElement: HTMLInputElement | null,
  callback: (target: HTMLInputElement, arg?: unknown) => string,
  stopCondition: (arg: HTMLInputElement) => boolean = () => false,
  _getNextTile: (arg: HTMLInputElement) => HTMLInputElement | null = getNextTile.value,
) {
  let target = startElement;
  const _data: string[] = [];
  while (target && !stopCondition(target)) {
    _data.push(callback(target));
    target = _getNextTile(target);
  }
  return _data;
}

// WORD SEARCH HANDLERS
const regexPattern = reactive(new RegexPattern([]));

watch([firstWordSearchTile, isHorizontal], () => {
  regexPattern.set(mapCswGrid(firstWordSearchTile.value, (el) => el.value || '.'));
});

// GRID GENERATOR FORM HANDLER
function generateCswGrid(val:[number, number]) {
  [cswWidth.value, cswHeight.value] = val;
  setCswGridVisible();
}
</script>
