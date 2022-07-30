<template>
        <button v-on="onSubmitCallback">GENERUJ</button>
</template>

<script>
export default {
        props: ['onSubmitCallback'],
        setup() {
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
