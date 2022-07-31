<template>
        <label :for="field.label">{{field.label}}:
                <input
                :class='field.name'
                :type='field.type'
                v-model="fieldLocal.value"
                v-on:change='emitValue'/>

        </label>
</template>

<script>
export default {
        props: ['field'],
        setup() {
                return {
                };
        },
        computed: {
                fieldLocal: {
                        get() {
                                return this.field;
                        },
                },
        },
        methods: {
                emitValue() {
                        this.$emit('inputValue', this.fieldLocal.value);
                },
        },
};
</script>

<style  scoped>
*{
        font-size:1.3rem;
}
        .color-input{
                background-color: black;
        }
        input{
                margin:0.5rem;
        }
</style>>
