<template>
  <div>
    <button @click="clearLocalStorage">CLEAR</button>
    <button @click="getWordList">GET WORDS LIST</button>
    <div id="word-list-container">
      <ul v-if="wordList.length > 0" >
        <li v-for="word in wordList" :key="word">{{word}}</li>
      </ul>
      <p v-else>NOTHING TO SHOW</p>
    </div>
  </div>
</template>

<script setup>
import fetchDictionary from '@/utils/fetch';
import { ENG_DICTIONARY_URL } from '@/constants';
import { ref, watch, watchEffect } from 'vue';

const wordList = ref([]);
// FOR DEBUG
const isThereDict = ref(false);
watch(isThereDict, () => {
  if (isThereDict.value) {
    // console.log(window.localStorage.getItem('engDict'));
  }
});

function saveDictionary() {
  if (!window.localStorage.getItem('engDict')) {
    fetchDictionary(ENG_DICTIONARY_URL).then((res) => {
      if (res) {
        window.localStorage.setItem('engDict', JSON.stringify(res));
        isThereDict.value = true;
      }
    });
  }
}

watchEffect(() => {
  saveDictionary();
});

const PATTERN = /^ma...$/;
function getWordList() {
  const res = JSON.parse(window.localStorage.getItem('engDict')).filter((word) => PATTERN.test(word));
  wordList.value = res;
}

// FOR DEBUG
function clearLocalStorage() {
  window.localStorage.clear();
}
</script>

<style scoped>
  #word-list-container *{
    font-size: 1.5rem;
    margin: 0 3rem;
  }
</style>
