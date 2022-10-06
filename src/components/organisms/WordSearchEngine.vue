<template>
  <div>
    <button @click="clearLocalStorage">CLEAR</button>
    <button @click="getWordList">GET WORDS LIST</button>
    <div id="word-list-container">
      <ul v-if="wordList.length > 0">
        <li v-for="word in wordList" :key="word">{{ word }}</li>
      </ul>
      <p v-else>NOTHING TO SHOW</p>
    </div>
  </div>
</template>

<script setup>
import fetchDictionary from '@/utils/fetch';
import { ref, watch, watchEffect } from 'vue';
import { ENG_DICTIONARY_URL } from '@/constants';

// FETCHING DATA
function saveDictionary() {
  if (!window.localStorage.getItem('engDict')) {
    fetchDictionary(
      ENG_DICTIONARY_URL,
    ).then((res) => {
      console.log(res);
      if (res) {
        window.localStorage.setItem('engDict', JSON.stringify(res));
      }
    });
  }
}

watchEffect(() => {
  saveDictionary();
});

// DISPLAYING WORD-CLUES
const wordList = ref([]);

const props = defineProps({ pattern: RegExp });

function getWordList() {
  const res = JSON.parse(window.localStorage.getItem('engDict')).filter((word) => props.pattern.test(word));
  wordList.value = res;
}

watch(
  () => props.pattern,
  () => {
    getWordList();
  },
);

// FOR DEBUG
function clearLocalStorage() {
  window.localStorage.clear();
}
</script>

<style scoped>
#word-list-container * {
  font-size: 1.5rem;
  margin: 0 3rem;
}
#word-list-container {
  max-height: 10rem;
  background: darkslateblue;
  color: white;
  overflow: scroll;
}
</style>
