<template>
  <nav>
    <div to="/" class='main-title'>Kreator Krzyżówkek </div>
  </nav>
  <router-view :TILE_SIZE_PX='TILE_SIZE_PX'/>
</template>
<script>
export default {
        setup() {
                return {
                        TILE_SIZE_PX: 40,
                };
        },
};
</script>

<style>
body{
        font-size: 2rem;
        background-color: #A3A292;
}

div{
        background-color:#A3A292;
}

input{

        background-color: #F1F1F1;
}
.main-title{
        text-align: center;
        padding: 20px;
        margin-bottom: 20px;
}
</style>
