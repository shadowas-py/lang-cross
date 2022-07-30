<template>
        <div class='wrapper-csw-generator'>
                <h3>GENERATOR SIATKI</h3>
                <GeneratorField :props="name"/>
        </div>
</template>

<script>
import GeneratorField from '@/components/atoms/GeneratorField.vue';

export default {
        setup() {
                return {
                        name: 'nazwa',
                };
        },
        components: { GeneratorField },
};
</script>
