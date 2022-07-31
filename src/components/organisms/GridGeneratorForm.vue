<template>
  <div class="wrapper-csw-generator">
    <h3 class="csw-gen-title">GENERATOR SIATKI</h3>
    <GeneratorField v-for="(field, i) in inputFields" :key="i" :field="field" />

    <SubmitButton :inputsData="inputFields" @cswGridParams="emitCswParams" />
  </div>
</template>

<script>
import GeneratorField from '@/components/atoms/GeneratorField.vue';
import SubmitButton from '@/components/atoms/SubmitButton.vue';

export default {
  setup() {
    return {
      inputFields: [
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
      ],
    };
  },
  methods: {
    emitCswParams(val) {
      this.$emit('cswGridParams', val);
    },
  },
  components: { GeneratorField, SubmitButton },
};
</script>
