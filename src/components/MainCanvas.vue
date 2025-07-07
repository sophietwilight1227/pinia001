<script setup lang="ts">
import {ref, nextTick, computed, type Ref, reactive } from "vue";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import { useCharSetStore } from "@/stores/charSet";
import type { CanvasMain } from "@/interfaces";
import '@/assets/fonts/Saitamaar.ttf';
import { useLayoutStore } from "@/stores/layout";
import { usePictureViewStore } from "@/stores/pictureView";
import constPictureView from "@/consts/constPictureView";

const props = defineProps<{
  isPictureView: boolean,
}>()

const text = ref("not");
const width = ref(99);
const spanElem:Ref<HTMLElement | null> = ref(null);
const textAreaElem:any = ref(null);
const textAreRefElem: any = ref(null);
const sizeRef100:Ref<HTMLElement | null> = ref(null);

const charSetStore = useCharSetStore();
const mainCanvasAsciiArtStore = useMainCanvasStore();
mainCanvasAsciiArtStore.initAsciiArt();
const mainCanvasAA = ref("");
const mainCanvasFontColor: Ref<string> = ref("rgb(0, 0, 0)")

mainCanvasAsciiArtStore.$subscribe((mutation, state) => {
  mainCanvasAA.value = state.asciiArt;
})

const layoutStore = useLayoutStore();
const canvasSize: Ref<{height: string, width: string}> = ref({height: "100%", width: "100%"})
layoutStore.$subscribe((mutation, state) => {
  canvasSize.value.height = state.canvasSize.height;
  canvasSize.value.width = state.canvasSize.width;
})

const pictureViewStore = usePictureViewStore();
pictureViewStore.$subscribe((mutation, state) => {
  if(props.isPictureView){
    const r: number = pictureViewStore.getValue(constPictureView.PARAM_LIST.LINE_RED.id);
    const g: number = pictureViewStore.getValue(constPictureView.PARAM_LIST.LINE_GREEN.id);
    const b: number = pictureViewStore.getValue(constPictureView.PARAM_LIST.LINE_BLUE.id);
    mainCanvasFontColor.value = `rgb(${r},${g},${b})`;
  }
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
  const newHeight: number = textAreRefElem.value?.scrollHeight!;
  const newWidth: number = textAreRefElem.value?.scrollWidth!;
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

//MenuBarにも同じのがある。共通化する
const decodeNumericEntity = (str: string) => {
    var re = /&#([0-9a-fA-F]+);/g;
    return str.replace(re, function(m) {
      var cp = parseInt(arguments[1], 10);
      return String.fromCodePoint(cp);
    }); 
}
const checkSpace = (text: string): void => {
  if(!text.includes("  ")){
    return;
  }
  const words = text.split(/ {1}/); // スペースで分割
  let html = '';
  let prevSpace: number = 0;

  words.forEach(word => {
    // ここにスペルチェックロジックを実装 (例: 辞書データと照合)
    if(word == ""){
      prevSpace ++;
    }else{
      if(prevSpace == 0){
        if(html == ""){
          html += `<span class="asciiArt">${word}</span> `;
        }else{
          html += `<span class="asciiArt">${" "}</span> `;
          html += `<span class="asciiArt">${word}</span> `;          
        }
      }else{
        html += `<span class="misspelled asciiArt">${" ".repeat(prevSpace + 1)}</span> `;
        html += `<span class="asciiArt">${word}</span> `;
        prevSpace = 0;
      }
    }
  });
  textAreRefElem.value!.innerHTML = html;
}

const onChangeTextArea = async (e: any) => {
  if(e.target == null){
    mainCanvasAsciiArtStore.editAsciiArt("", {value:e.data, start: 0, end: 0});
  }else{
    const str:string = decodeNumericEntity(e.target.value);
    for(let i=0; i < str.length; i++){
      const char = str.charAt(i);
      if(!charSetStore.$state.charSizeDic.has(char)){
        text.value = char;
        if(spanElem.value != null){
          await nextTick();
          charSetStore.addCharSizeDic(char, spanElem.value.offsetWidth);
        }
      }
    }
    mainCanvasAsciiArtStore.editAsciiArt(str, {value:str, start: 0, end: 0});
    onSelectionChange(e);
    updateTextAreaWidth();

    checkSpace(str);
  }
}


const onSelectionChange = (e:any) => {
  if(e.target != document.activeElement){
    return;
  }

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
const changeDot = async (delta: number) => {
        mainCanvasAsciiArtStore.changeDot(delta);
        await nextTick();
        textAreaElem.value.setSelectionRange(mainCanvasAsciiArtStore.caretPosition.start, mainCanvasAsciiArtStore.caretPosition.end);  
        checkSpace(mainCanvasAA.value);
}
const onKeyDown = async (e: KeyboardEvent) => {
  if(e.altKey){
    switch(e.key){
      case 'ArrowLeft':
        e.preventDefault();
        changeDot(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        changeDot(1);
        break;
    }
  }
}

</script>

<template>
  <div class="base">  
    <div class="measureAA asciiArt" ref="textAreRefElem">{{ mainCanvasAA }}</div>
    <textarea class="asciiArt textarea" 
                spellcheck=false
                v-on:input="onChangeTextArea" 
                v-on:selectionchange="onSelectionChange"
                v-on:keydown="onKeyDown"
                v-model="mainCanvasAA"
                ref="textAreaElem"
                ></textarea>
    
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
  background-color: transparent;
  color: transparent;
  position: absolute;
}
.measureAA {
  display: table; 
  color: transparent;
  position: absolute;
  width: fit-content;
  height: fit-content;
  field-sizing: content;
  z-index: 9;
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
  background-color: transparent;
  white-space: pre;
  min-height: 100%;
  min-width: 100%;
  z-index: 10;
  resize: none;
  overflow: hidden;
  height: v-bind(canvasSize.height);
  width: v-bind(canvasSize.width);
  color: v-bind(mainCanvasFontColor);
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
