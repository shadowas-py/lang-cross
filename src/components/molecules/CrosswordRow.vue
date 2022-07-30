<template>
        <CrosswordTile v-for="i in cswWidth" :key="i"/>
</template>
<script>

import CrosswordTile from '@/components/atoms/CrosswordTile.vue';

export default ({
        setup() {

        },
        props: ['cswWidth'],
        components: {
                CrosswordTile,
        },
});
</script>
