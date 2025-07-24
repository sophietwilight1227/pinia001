<script setup lang="ts">
import { useMainCanvasStore } from '@/stores/mainCanvas';
import { computed } from 'vue';

const mainCanvasStore = useMainCanvasStore();

const previewAA = computed(():string => {
  const raw = mainCanvasStore.asciiArt;
  let result = raw.replace(/\ +/g, '\ ');
  result = result.split(/\r\n\ +|\n\ +|\r\ +/g).join('\n');
  if(result.charAt(0) == " "){
    result = result.slice(1, result.length)
  }
  return result;
})

</script>
<template>
    <div class="asciiArt">{{ previewAA }}</div>
</template>
<style scoped>
.asciiArt {
  white-space: pre;
  z-index: 10;
  font-size:16px;
  font-style: normal;
  font-weight: 400;
  line-height:18px;
  letter-spacing: 0;
  text-shadow: none;
  font-weight:normal;
  font-family:'UnicodeException','Saitamaar', 'ＭＳ Ｐゴシック', 'MS PGothic',  'IPAMonaPGothic' !important;
}
  @font-face {
    font-family: 'Saitamaar';
    src: url('@/assets/fonts/Saitamaar.ttf') format('truetype');
  }

</style>