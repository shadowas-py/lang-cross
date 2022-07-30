<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
        <label :for="field.label">{{field.label}}:
                <input :class='field.name' :type='field.type' :value='field.defaultValue'/>
        </label>
</template>

<script>
export default {
        props: ['field'],
        setup() {
                return {
                        // class: this.field.name,
                };
        },
        beforeMount() {
                // this.class = this.field.name;
                console.log(this.field);
                console.log(this.class);
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
