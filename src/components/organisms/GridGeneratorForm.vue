<template>
  <div class="csw-generator-wrapper">
    <h3 class="csw-gen-title">GENERATOR SIATKI</h3>
    <GeneratorField v-for="(field, i) in inputFields" :key="i" :field="field" />

    <SubmitButton
      :inputFields="inputFields"
      @onCswGridParams="emitCswParams"
      class="generator-submit-btn"
      id="grid-generator-submit-btn"
    />
  </div>
</template>

<script lang='ts' setup>
import GeneratorField from '@/components/atoms/GeneratorField.vue';
import SubmitButton from '@/components/atoms/SubmitButton.vue';
import { ref } from 'vue';

const emit = defineEmits(['onCswGridParams']);

const inputFields = ref([
  {
    name: 'width-input',
    label: 'szerokość',
    maxValue: 30,
    type: 'number',
    value: 15,
  },
  {
    name: 'height-input',
    label: 'wysokość',
    maxValue: 30,
    type: 'number',
    value: 10,
  },
  {
    name: 'color-input',
    label: 'kolor',
    maxValue: 30,
    type: 'color',
    value: '#F1F1F1',
  },
]);

function emitCswParams(data: [number, number, string]) {
  emit('onCswGridParams', data);
}
</script>

<style scoped>
.csw-gen-title {
  font-size: 3.2rem;
  text-align: center;
  width: 100%;
  margin-bottom: 0.6rem;
  line-height: 3.2rem;
  font-family: 'Patrick Hand', cursive;
}

.csw-generator-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  padding: 1rem;
  border: 1px solid black;
  width: 80vw;
  margin: 2.4rem auto;
  min-height: 10vh;
}
</style>
