<script setup lang="ts">
import {ref, nextTick, computed, type Ref, reactive } from "vue";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import { useCharSetStore } from "@/stores/charSet";
import type { CanvasMain } from "@/interfaces";
import '@/assets/fonts/Saitamaar.ttf';
import { useLayoutStore } from "@/stores/layout";

const rowIndex = ref("1");
const text = ref("not");
const width = ref(99);
const spanElem:Ref<HTMLElement | null> = ref(null);
const textAreaElem:Ref<HTMLElement | null> = ref(null);

const charSetStore = useCharSetStore();
const mainCanvasAsciiArtStore = useMainCanvasStore();
mainCanvasAsciiArtStore.initAsciiArt();
const mainCanvasAA = ref("");


  mainCanvasAsciiArtStore.$subscribe((mutation, state) => {
    mainCanvasAA.value = state.asciiArt;
    updateRowIndex(state.asciiArt);
  })

const layoutStore = useLayoutStore();
const canvasSize: Ref<{height: string, width: string}> = ref({height: "100%", width: "100%"})
  layoutStore.$subscribe((mutation, state) => {
    canvasSize.value.height = state.canvasSize.height;
    canvasSize.value.width = state.canvasSize.width;
  })

const onButtonClick = async () => {
  console.log("pushed");
  text.value = "";
  for (let i = 1; i < 100; i++){
    text.value += "_";
    await nextTick();
    if(spanElem.value == null){
      width.value = 0;
    }else{
      width.value = spanElem.value.scrollWidth;
    }   
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

const updateTextAreaWidth = () => {
  const newHeight = textAreaElem.value?.scrollHeight + "px";
  const newWidth = textAreaElem.value?.scrollWidth + "px";
  //const newWidth = "100%"
  //canvasSize.value.height = newHeight;
  //canvasSize.value.width = newWidth;
  layoutStore.updateCanvasSize(newHeight, newWidth);
  console.log("w / h update")
}

const onChangeTextArea = async (e: any) => {
  if(e.target == null){
    mainCanvasAsciiArtStore.editAsciiArt("", {value:e.data, start: 0, end: 0});
  }else{
    const str:string = e.target.value
    for(let i=0; i < str.length; i++){
      const char = str.charAt(i);
      text.value = char;
      if(spanElem.value != null){
        await nextTick();
        console.log(char + " : " + spanElem.value.offsetWidth);
        charSetStore.addCharSizeDic(char, spanElem.value.offsetWidth);
      }
    }
    mainCanvasAsciiArtStore.editAsciiArt(str, {value:e.data, start: 0, end: 0});
    updateRowIndex(str);
    onSelectionChange(e);
    updateTextAreaWidth();
  }
}

const onSelectionChange = (e:any) => {
  if(e.target != document.activeElement){
    return;
  }
  console.log("caret : " + e.target.selectionStart);

  const rawStr:string = e.target.value;
  const endPos = e.target.selectionEnd;
  const startPos:number = e.target.selectionStart;
  const frontStr:string = rawStr.substring(0, startPos);
  const strs = frontStr.split("\n");

  //行数
  const lineCount:number = frontStr.length;
  //キャレットの左側の文字列
  const targetStr:string = strs[strs.length-1];
  //ドット数
  const dot = charSetStore.calcStrWidth(targetStr);
  
  mainCanvasAsciiArtStore.editCaretPosition(startPos, endPos);
}

</script>

<template>
  <div class="base">  
    <div class="mainCanvas">
      <div class="asciiArt">{{ rowIndex }}</div>
      <textarea class="asciiArt textarea" 
                v-on:input="onChangeTextArea" 
                v-on:selectionchange="onSelectionChange"
                v-model="mainCanvasAA"
                ref="textAreaElem"></textarea>
    </div>
    <div class="menu">
      <span class="asciiArt" ref="spanElem">{{ text }}</span>
    </div>
  </div>
</template>

<style scoped>

.base {
  top: 0px;
  height: v-bind(canvasSize.height);
  width: v-bind(canvasSize.width);
  min-height: 100%;
  background-color: red;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
}
.mainCanvas {
  overflow: hidden;
  height: v-bind(canvasSize.height);
  width: v-bind(canvasSize.width);
  background-color: transparent;
  display: flex;
  flex-direction: row;
  position: absolute;
}
.menu{
  background-color: aqua;
  position: absolute;
}
.asciiArt {
  white-space: pre;
  z-index: 10;
  background-color: transparent;
  font-size:16px;
  font-style: normal;
  font-weight: 400;
  line-height:18px;
  letter-spacing: 0;
  text-shadow: none;
  font-family: 'Saitamaar', 'ＭＳ Ｐゴシック', 'MS PGothic', 'IPAMonaPGothic' !important;
}

.textarea {
  height: v-bind(canvasSize.height);
  width: v-bind(canvasSize.width);
  white-space: pre;
  field-sizing: content;
  min-height: 100%;
  z-index: 10;
  resize: none;
  overflow: hidden;
}


@font-face {
  font-family: 'Saitamaar';
  src: url('@/assets/fonts/Saitamaar.ttf') format('truetype');
}
</style>
