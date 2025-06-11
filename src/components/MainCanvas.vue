<script setup lang="ts">
import {ref, nextTick, computed, type Ref } from "vue";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import type { CanvasMain } from "@/interfaces";
import '@/assets/fonts/Saitamaar.ttf';


const text = ref("not");
const width = ref(99);
const myElement:Ref<HTMLElement | null> = ref(null);

const mainCanvasAsciiArtStore = useMainCanvasStore();
mainCanvasAsciiArtStore.initAsciiArt();
const mainCanvasAA = ref("");

const onButtonClick = async () => {
  console.log("pushed");
  text.value = "";
  for (let i = 1; i < 100; i++){
    text.value += "_";
    await nextTick();
    if(myElement.value == null){
      width.value = 0;
    }else{
      width.value = myElement.value.offsetWidth;
    }
   
    console.log(width.value);    
  }

};

const onChangeTextArea = (e: any) => {
  if(e.target == null){
    mainCanvasAsciiArtStore.editAsciiArt("", {value:e.data, start: 0, end: 0});
  }else{
    mainCanvasAsciiArtStore.editAsciiArt(e.target.value, {value:e.data, start: 0, end: 0});
  }
  
}
</script>

<template>
  <div class="base">
    <button v-on:click="onButtonClick">push</button>
    <span class="textarea" ref="myElement">{{ text }}</span>
    <textarea class="textarea" v-on:input="onChangeTextArea">{{ mainCanvasAA }}</textarea>
  </div>
</template>

<style scoped>

.base {
  background-color: paleturquoise;
}

.textarea {
  font-size:16px;
  font-style: normal;
  font-weight: 400;
  line-height:18px;
  letter-spacing: 0;
  text-shadow: none;
  font-family: 'Saitamaar', 'ＭＳ Ｐゴシック', 'MS PGothic', 'IPAMonaPGothic' !important;
}

@font-face {
  font-family: 'Saitamaar';
  src: url('@/assets/fonts/Saitamaar.ttf') format('truetype');
}
</style>
