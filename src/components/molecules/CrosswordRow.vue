<!-- <template>
  <div class="csw-row" :id="rowId">
    <CrosswordTile
      v-for="i in props.cswWidth"
      :key="i"
      :class="className"
      :colNumber="i"
      :rowNumber="props.rowNumber"
      :cswColor="props.cswColor"
      @updateIsHorizontal="passEmit"
    />
  </div>
</template>

<script setup>
import CrosswordTile from '@/components/atoms/CrosswordTile.vue';

const emit = defineEmits(['updateIsHorizontal']);
function passEmit(data) {
  emit('updateIsHorizontal', data);
}

const props = defineProps({
  cswWidth: Number,
  cswColor: String,
  rowNumber: Number,
});
const className = $computed(() => `row-${props.rowNumber}`);
const rowId = $computed(() => `csw-row-${props.rowNumber}`);
</script>
<style scoped></style> -->
