<template>
  <div>
    <button @click="clearLocalStorage">FIND</button>
  </div>
</template>

<script setup>
import fetchDictionary from '@/utils/fetch';
import { ENG_DICTIONARY_URL } from '@/constants';
import { ref, watch, watchEffect } from 'vue';

// FOR DEBUG
const isThereDict = ref(false);
watch(isThereDict, () => {
  if (isThereDict.value) {
    console.log(window.localStorage.getItem('engDict'));
  }
});

function saveDictionary() {
  if (!window.localStorage.getItem('engDict')) {
    fetchDictionary(ENG_DICTIONARY_URL).then((res) => {
      if (res) {
        window.localStorage.setItem('engDict', res);
        isThereDict.value = true;
      }
    });
  }
}

watchEffect(() => {
  saveDictionary();
});

// FOR DEBUG
function clearLocalStorage() {
  window.localStorage.clear();
}
</script>

<style scoped></style>
