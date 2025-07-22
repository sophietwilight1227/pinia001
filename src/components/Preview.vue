<script setup lang="ts">
import { useMainCanvasStore } from '@/stores/mainCanvas';

const mainCanvasStore = useMainCanvasStore();

</script>
<template>
    <div class="measureAA">{{ mainCanvasStore.asciiArt }}</div>
</template>
<style scoped>
:deep(.measureAA) {
  position: relative;
  background-color: transparent;
  /*justify-content: space-between;*/
  overflow: scroll;
  min-height: 100%;
  min-width: 100%;
  color: transparent;
  width: fit-content;
  height: fit-content;
  field-sizing: content;
  z-index: 9;
  white-space: pre;
}
</style>