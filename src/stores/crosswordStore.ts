import { selectNextNthElement, selectNextSibling } from '@/utils/crosswordGridSelectors';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

// eslint-disable-next-line import/prefer-default-export
export const useCrosswordStore = defineStore('crossword', () => {
  const selectedTile = ref();
  const prevSelectedTile = ref();
  const isHorizontal = ref(true);
  const isSelectedSameTile = computed(() => selectedTile.value === prevSelectedTile.value);
  const getNextTile = computed(() =>
    (isHorizontal.value ? selectNextSibling : selectNextNthElement));
  return {
    selectedTile, prevSelectedTile, isSelectedSameTile, isHorizontal, getNextTile,
  };
});
