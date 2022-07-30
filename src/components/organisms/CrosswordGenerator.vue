<template>
        <div class='wrapper-csw-generator'>
                <h3>GENERATOR SIATKI</h3>
                        <GeneratorField
                        v-for="field in fields" :key="field" :field="field"/>
                <SubmitButton/>
        </div>
</template>

<script>
import GeneratorField from '@/components/atoms/GeneratorField.vue';
import SubmitButton from '@/components/atoms/SubmitButton.vue';

export default {
        setup() {
                return {
                        fields: [{
                                name: 'width-input',
                                label: 'szerokość',
                                maxValue: 30,
                                type: 'number',
                                defaultValue: 15,
                        }, {
                                name: 'height-input',
                                label: 'wysokość',
                                maxValue: 30,
                                type: 'number',
                                defaultValue: 15,
                        }, {
                                name: 'color-input',
                                label: 'kolor',
                                maxValue: 30,
                                type: 'color',
                                defaultValue: '#F1F1F1',
                        },

                        ],
                };
        },
        components: { GeneratorField, SubmitButton },
};
</script>
