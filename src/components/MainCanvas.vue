<script setup lang="ts">
import {ref, nextTick, computed, type Ref } from "vue";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import type { CanvasMain } from "@/interfaces";
import '@/assets/fonts/Saitamaar.ttf';

const rowIndex = ref("1");
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

const updateRowIndex = (str: string) => {
  const lineCount = str.length - str.replace(/\n/g, "").length + 1
  let index = "1";
  for(let i=1; i<lineCount; i++){
    index += ("\r\n" + (i+1));
  }
  rowIndex.value = index;
}

const onChangeTextArea = async (e: any) => {
  if(e.target == null){
    mainCanvasAsciiArtStore.editAsciiArt("", {value:e.data, start: 0, end: 0});
  }else{
    const str:string = e.target.value
    for(let i=0; i < str.length; i++){
      const char = str.charAt(i);
      text.value = char;
      if(myElement.value != null){
        await nextTick();
        console.log(char + " : " + myElement.value.offsetWidth);
        mainCanvasAsciiArtStore.addCharSizeDic(char, myElement.value.offsetWidth);
      }
    }
    mainCanvasAsciiArtStore.editAsciiArt(str, {value:e.data, start: 0, end: 0});
    updateRowIndex(str);
    onSelectionChange(e);
  }
  
}

const onSelectionChange = (e:any) => {
  const rawStr:string = e.target.value;
  const endPos = e.target.selectionEnd;
  const startPos:number = e.target.selectionEnd;
  const frontStr:string = rawStr.substring(0, startPos);
  const strs = frontStr.split("\n");

  //行数
  const lineCount:number = frontStr.length;
  //キャレットの左側の文字列
  const targetStr:string = strs[strs.length-1];
  //ドット数
  const dot = mainCanvasAsciiArtStore.calcStrWidth(targetStr);
}

</script>

<template>
  <div class="base">  
    <div class="mainCanvas">
      <div class="asciiArt">{{ rowIndex }}</div>
      <textarea class="asciiArt" v-on:input="onChangeTextArea" v-on:selectionchange="onSelectionChange">{{ mainCanvasAA }}</textarea>
    </div>
    <div class="menu">
      <span class="asciiArt" ref="myElement">{{ text }}</span>
    </div>
  </div>
</template>

<style scoped>

.base {
  height: 100vh;
  background-color: paleturquoise;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-x: scroll;
  overflow-y: scroll;
}
.mainCanvas {
  display: flex;
  flex-direction: row;
}
.menu{
  background-color: aqua;
}
.asciiArt {
  font-size:16px;
  font-style: normal;
  font-weight: 400;
  line-height:18px;
  letter-spacing: 0;
  text-shadow: none;
  font-family: 'Saitamaar', 'ＭＳ Ｐゴシック', 'MS PGothic', 'IPAMonaPGothic' !important;
  white-space: pre-wrap;
}

@font-face {
  font-family: 'Saitamaar';
  src: url('@/assets/fonts/Saitamaar.ttf') format('truetype');
}
</style>
