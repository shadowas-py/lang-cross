<template>
  <svg
    class="csw-arrow--{{ data.direction }}"
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M27.9124 10L10.8305 5.36199e-07L45 5.36199e-07L27.9124 10Z" />
  </svg>

</template>

<script lang="ts">
import { computed, defineProps } from 'vue';

const CSW_ARROW_CSV = 'M27.9124 10L10.8305 5.36199e-07L45 5.36199e-07L27.9124 10Z';

const pathTypes = {
  right: CSW_ARROW_CSV,
  down: CSW_ARROW_CSV,
  left: CSW_ARROW_CSV,
  up: CSW_ARROW_CSV,
};
type Direction = keyof typeof pathTypes;

const props = defineProps({
  data: {
    type: Object,
    required: true,
    direction: { type: String, required: true },
  },
});

const pathType = computed(() => pathTypes[props.data.direction as Direction]);

</script>

<!-- <svg
class="csw-arrow--down"
width="56"
height="56"
viewBox="0 0 56 56"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path d="M27.9124 10L10.8305 5.36199e-07L45 5.36199e-07L27.9124 10Z" />
</svg> -->

<style lang="scss" scoped>

.csw-arrow {
    position: absolute;
    top: 0;
    left: 0;
    width: 56px;
    height: 56px;
    transform: translate(0, 0);
    &--right {
        transform: translate(0, 0);
    }
    &--down {
        transform: translate(0, 0);
    }
    &--left {
        transform: translate(0, 0);
    }
    &--up {
        transform: translate(0, 0);}
}
</style>
