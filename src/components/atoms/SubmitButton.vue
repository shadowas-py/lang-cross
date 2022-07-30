<template>
        <button >GENERUJ</button>
</template>

<script>
export default {
        props: ['onSubmitCallback', 'inputsData'],
        setup() {
        },
        methods: {
                submitData(value) {
                        console.log(value);
                        this.$emit('submit', value);
                },

        },
};
</script>

<style scoped>
        button{
                box-sizing: border-box;
                background-color:burlywood;
                font-weight: bold;
                padding:0.4rem;
        }
        button:hover{
                background-color:coral;
        }
        button:active{
                background-color:black;
                color: coral;
                border: 0px solid black;
        }
</style>
