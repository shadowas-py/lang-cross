<template>
  <div class="wrapper-csw-generator">
    <h3 class="csw-gen-title">GENERATOR SIATKI</h3>
    <GeneratorField v-for="(field, i) in inputFields" :key="i" :field="field" />

    <SubmitButton :inputFields="inputFields" @onCswGridParams="emitCswParams" />
  </div>
</template>

<script setup>
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

function emitCswParams(data) {
  emit('onCswGridParams', data.value);
}
</script>
