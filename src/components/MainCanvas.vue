<script setup lang="ts">
import {ref, nextTick, computed, type Ref, reactive } from "vue";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import { useCharSetStore } from "@/stores/charSet";
import type { CanvasMain } from "@/interfaces";
import '@/assets/fonts/Saitamaar.ttf';
import { useLayoutStore } from "@/stores/layout";

const text = ref("not");
const width = ref(99);
const spanElem:Ref<HTMLElement | null> = ref(null);
const textAreaElem:Ref<HTMLElement | null> = ref(null);
const sizeRef100:Ref<HTMLElement | null> = ref(null);

const charSetStore = useCharSetStore();
const mainCanvasAsciiArtStore = useMainCanvasStore();
mainCanvasAsciiArtStore.initAsciiArt();
const mainCanvasAA = ref("");


mainCanvasAsciiArtStore.$subscribe((mutation, state) => {
  mainCanvasAA.value = state.asciiArt;
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

const updateTextAreaWidth = () => {
  //const newHeight: string = compareLength(textAreaElem.value?.scrollHeight, sizeRef100.value?.clientHeight) + "px"
  //const newWidth: string =  compareLength(textAreaElem.value?.scrollWidth, sizeRef100.value?.clientWidth) + "px"
  const newHeight: string = textAreaElem.value?.scrollHeight + "px";
  const newWidth: string = textAreaElem.value?.scrollWidth + "px"
  layoutStore.updateCanvasSize(newHeight, newWidth);
}
const compareLength = (value: number | undefined, reference: number | undefined): number => {
  if(value != null && reference != null){
    if(value > reference){
      return value;
    }else{
      return reference;
    }
  }else{
    return 0;
  }
}

const decodeNumericEntity = (str: string) => {
    var re = /&#([0-9a-fA-F]+);/g;
    return str.replace(re, function(m) {
      var cp = parseInt(arguments[1], 10);
      return String.fromCodePoint(cp);
    }); 
}

const onChangeTextArea = async (e: any) => {
  if(e.target == null){
    mainCanvasAsciiArtStore.editAsciiArt("", {value:e.data, start: 0, end: 0});
  }else{
    const str:string = decodeNumericEntity(e.target.value);
    for(let i=0; i < str.length; i++){
      const char = str.charAt(i);
      text.value = char;
      if(spanElem.value != null){
        await nextTick();
        console.log(char + " : " + spanElem.value.offsetWidth);
        charSetStore.addCharSizeDic(char, spanElem.value.offsetWidth);
      }
    }
    mainCanvasAsciiArtStore.editAsciiArt(str, {value:str, start: 0, end: 0});
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
    <textarea class="asciiArt textarea" 
                v-on:input="onChangeTextArea" 
                v-on:selectionchange="onSelectionChange"
                v-model="mainCanvasAA"
                ></textarea>
    <textarea class="measureAA asciiArt" ref="textAreaElem">{{ mainCanvasAA }}</textarea>
    <div class="measure">
      <span class="asciiArt" ref="spanElem">{{ text }}</span>
      
    </div>
    <span class="sizeRef100" ref="sizeRef100">　</span>
  </div>
  
</template>

<style scoped>

.base {
  position: absolute;
  top: 0px;
  min-height: 100%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  height: v-bind(canvasSize.height);
  width: v-bind(canvasSize.width);  
}
.mainFrame {
  overflow: hidden;
  min-height: 100%;
  height: v-bind(canvasSize.height);
  width: v-bind(canvasSize.width);
  background-color: transparent;
  display: flex;
  flex-direction: row;
  position: absolute;
}
.measure{
  background-color: aqua;
  position: absolute;
}
.measureAA {
  width: fit-content;
  height: fit-content;
  field-sizing: content;
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

.sizeRef100 {
  width: 100%;
  height: 100%;
  background-color: transparent;
}

@font-face {
  font-family: 'Saitamaar';
  src: url('@/assets/fonts/Saitamaar.ttf') format('truetype');
}
</style>
