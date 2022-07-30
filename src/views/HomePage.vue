<template>

        <CrosswordTemplate
        :cswWidth='cswWidth' :cswHeight='cswHeight' :TILE_SIZE_PX="TILE_SIZE_PX"/>
        <CrosswordGenerator/>

</template>

<script>
import CrosswordTemplate from '@/components/organisms/CrosswordTemplate.vue';
import CrosswordGenerator from '@/components/organisms/CrosswordGenerator.vue';

export default {
        props: ['TILE_SIZE_PX'],
        data() {
                return {
                        cswWidth: 15,
                        cswHeight: 15,
                };
        },
        // props: ['csw_width', 'csw_height'],
        name: 'HomeView',
        components: {
                CrosswordTemplate,
                CrosswordGenerator,
        },
};
</script>
