<script setup lang="ts">
import {ref, nextTick, computed, type Ref, reactive, onMounted } from "vue";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import { useCharSetStore } from "@/stores/charSet";
import type { CanvasMain, EditLog } from "@/interfaces";
import '@/assets/fonts/Saitamaar.ttf';
import { useLayoutStore } from "@/stores/layout";
import { usePictureViewStore } from "@/stores/pictureView";
import constPictureView from "@/consts/constPictureView";
import constLocalStorage from "@/consts/constLocalStorage";

const props = defineProps<{
  isPictureView: boolean,
}>()

const text = ref("not");
const width = ref(99);
const spanElem:Ref<HTMLElement | null> = ref(null);
const textAreaElem:any = ref(null);
const textAreRefElem: any = ref(null);
const headSpaceElem: any = ref(null);
const sizeRef100:Ref<HTMLElement | null> = ref(null);
const rectSelectContainerElem: any = ref(null);
const arrowContainerElem: any = ref(null);
const caretPositionElem: any = ref(null);
const baseElem: any = ref(null);

const charSetStore = useCharSetStore();
const mainCanvasAsciiArtStore = useMainCanvasStore();
//mainCanvasAsciiArtStore.initAsciiArt();
const mainCanvasAA = ref("");
const mainCanvasFontColor: Ref<string> = ref("rgb(0, 0, 0)")
const caretPositionColor: Ref<string> = ref("transparent")
const isDragging: Ref<boolean> = ref(false);
const caretPosition: Ref<{top: number, left: number}> = ref({top: 0, left: 0}); //座標。CSSで使う
const selectedRectTextInfo: Ref<Array<{row: number, start: number, end: number, text: string}>> = ref([]);
const caretText: Ref<string> = ref("");
const viewScrollLeftValue: Ref<number> = ref(0);

mainCanvasAsciiArtStore.$subscribe((mutation, state) => {
  mainCanvasAA.value = mainCanvasAsciiArtStore.asciiArt;
  console.log("caret position 1:",mainCanvasAsciiArtStore.caretPosition.start, props.isPictureView)
  updateArrow(mainCanvasAA.value);
  updateCaretPosition(mainCanvasAA.value, mainCanvasAsciiArtStore.caretPosition.start, mainCanvasAsciiArtStore.caretPosition.end);
  if(textAreRefElem.value != null && "TEXTAREA" != document.activeElement?.nodeName && !props.isPictureView){
    const start = mainCanvasAsciiArtStore.caretPosition.start;
    const end = mainCanvasAsciiArtStore.caretPosition.end;
    
    //textAreaElem.value.focus();


    console.log("caret position 2:",mainCanvasAsciiArtStore.caretPosition.start)
    textAreaElem.value.setSelectionRange(start, end );  
  }
  
  console.log("subscribe: ", mainCanvasAA.value);
})
const mainCanvasAaRef = computed(() => {
  return mainCanvasAsciiArtStore.asciiArt + '\u200b';//これがないとテキスト末尾の空行がうまくいかなくなる
})

const layoutStore = useLayoutStore();
//const canvasSize: Ref<{height: string, width: string}> = ref({height: "100%", width: "100%"})
layoutStore.$subscribe((mutation, state) => {
//  canvasSize.value.height = state.canvasSize.height;
//  canvasSize.value.width = state.canvasSize.width;
  updateScroll();
})

const pictureViewStore = usePictureViewStore();
pictureViewStore.$subscribe((mutation, state) => {
  updatePictureValues();
})
const updatePictureValues = () => {
  if(props.isPictureView){
    const r: number = pictureViewStore.getValue(constPictureView.PARAM_LIST.LINE_RED.id);
    const g: number = pictureViewStore.getValue(constPictureView.PARAM_LIST.LINE_GREEN.id);
    const b: number = pictureViewStore.getValue(constPictureView.PARAM_LIST.LINE_BLUE.id);
    mainCanvasFontColor.value = `rgb(${r},${g},${b})`;
    caretPositionColor.value = `rgb(${r},${g},${b})`;
  }  
}

const initCaretPositionColor = () => {
  if(props.isPictureView){
    caretPositionColor.value = "black";
  }else{
    caretPositionColor.value = "black";
  }
}
initCaretPositionColor();

const onButtonClick = async () => {
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
  const newHeight: number = baseElem.value?.scrollHeight!;
  const newWidth: number = baseElem.value?.scrollWidth!;
  //console.log(newHeight, newWidth, "new size");
  textAreaElem.value.style.height = baseElem.value.scrollHeight + "px";
  textAreaElem.value.style.width = baseElem.value.scrollWidth + "px";
  layoutStore.updateAsciiArtSize(newHeight, newWidth);
  //layoutStore.updateCanvasSize(newHeight, newWidth);
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
const checkContinuousSpace_ = (text: string): void => {
  if(!text.includes("  ")){
    return;
  }
  const words = text.split(/ {1}/); // スペースで分割
  let html = '';
  let prevSpace: number = 0;

  words.forEach(word => {
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
const checkHeadSpace_ = (text: string) => {
  const aa = text.split("\n");
  let html: string = "";
  for(let i=0; i < aa.length; i++){
    if(aa[i].charAt(0) == " "){
      html += `<span class="asciiArt misspelled">${" "}</span> `;
    }else{
      html += `<span class="asciiArt">${" "}</span> `;
    }
  }
  headSpaceElem.value!.innerHTML = html;
}

const onChangeTextArea = async (e: any) => {
  if(e.target == null){
    mainCanvasAsciiArtStore.editAsciiArt("", {value:e.data, start: 0, end: 0});
  }else{
    const str:string = decodeNumericEntity(e.target.value);
    if(str != mainCanvasAsciiArtStore.asciiArt){
      addCharSizeDic(str);
      mainCanvasAsciiArtStore.editAsciiArt(str, {value:str, start: 0, end: str.length});
      updateTextAreaWidth();
      //checkContinuousSpace(str);
      //checkHeadSpace(str);
    }
    onSelectionChange(e);
  }
  console.log("on change: ", mainCanvasAsciiArtStore.asciiArt);
}

const addCharSizeDic = async (str: string) => {
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
}

const updateArrow_ = async (aa: string) => {
    if(arrowContainerElem.value == null){
      return;
    }
    const text: Array<string> = aa.split("\n");
    let html: string = "";
    const rowHeight: number = 18;
    for(let i=0; i < text.length; i++){
      const rowLeft: number = await charSetStore.calcStrWidth(text[i]);
      html += `<div class="asciiArt arrowNode" style = "top: ${rowHeight * i}px; left: ${rowLeft}px;">↓</div> `;
    }
    arrowContainerElem.value.innerHTML = html;  
}
const updateArrow = async (aa: string) => {
    if(arrowContainerElem.value == null){
      return;
    }
    const text: Array<string> = aa.split("\n");
    let html: string = "";
    const rowHeight: number = 18;
    for(let i=0; i < text.length; i++){
      for(let j=0; j < text[i].length; j++){
        const rowLeft: number = await charSetStore.calcStrWidth(text[i].slice(0, j));
        switch(text[i].charAt(j)){
          case " ":
            if((j == 0 && text[i].charAt(j) == " ") || (j > 0 && text[i].charAt(j-1) == " ") || (j < text[i].length-1 && text[i].charAt(j+1) == " ")){
              html += `<div class="asciiArt misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
            }else{
              html += `<div class="asciiArt not_misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
            }
            
            break;
          case "　":
            html += `<div class="asciiArt not_misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 10px"></div> `;
            break;
        }
      }
      const rowLeft: number = await charSetStore.calcStrWidth(text[i]);
      html += `<div class="asciiArt arrowNode" style = "top: ${rowHeight * i}px; left: ${rowLeft}px;">↓</div> `;
    }
    arrowContainerElem.value.innerHTML = html;  
}

const updateCaretPosition = async (rawStr: string, startPos: number, endPos: number) => {

  const frontStr:string = rawStr.substring(0, startPos);
  const strs = frontStr.split("\n");
  console.log("caret move", startPos, endPos);
  //行数
  const lineCount:number = frontStr.length;
  //キャレットの左側の文字列
  //const targetStr:string = strs[strs.length-1];
  //ドット数
  //const dot = charSetStore.calcStrWidth(targetStr);
  
  mainCanvasAsciiArtStore.editCaretPosition(startPos, endPos);
  const rowHeight: number = 18;
  const caretStr: string = strs[strs.length-1];
  if(caretStr == null){
    return;
  }
  //const left: number = await charSetStore.calcStrWidth(caretStr);
  caretPosition.value.top = (strs.length - 1) * rowHeight;
  caretText.value = caretStr;
  //caretPosition.value.left = left;
}


const onSelectionChange = (e:any) => {
  if(e.target != document.activeElement || props.isPictureView){
    return;
  }
  console.log("selection change", props.isPictureView, e.target.selectionStart);
  const rawStr:string = e.target.value;
  const endPos = e.target.selectionEnd;
  const startPos:number = e.target.selectionStart;

  updateCaretPosition(rawStr, startPos, endPos);

  if(mainCanvasAsciiArtStore.isRectSelectMode){
  //選択解除
    e.target.selectionStart = e.target.selectionEnd;  
  }
}

const onMouseDown = (e:MouseEvent) => {
  mainCanvasAsciiArtStore.rectSelectPosition.start = {x: e.offsetX, y: e.offsetY};
  isDragging.value = true;
  rectSelectContainerElem.value.innerHTML = "";
}

const onMouseMove = async (e: MouseEvent) => {
  if(!mainCanvasAsciiArtStore.isRectSelectMode){
    return;
  }  
  if(!isDragging.value){

    return;
  }
  mainCanvasAsciiArtStore.rectSelectPosition.end = {x: e.offsetX, y: e.offsetY};
  const start = mainCanvasAsciiArtStore.rectSelectPosition.start;
  const end = mainCanvasAsciiArtStore.rectSelectPosition.end;
  const topLeft = {x: Math.min(start.x, end.x), y: Math.min(start.y, end.y)};
  const bottomRight = {x: Math.max(start.x, end.x), y: Math.max(start.y, end.y)};
  const aa: Array<string> = mainCanvasAsciiArtStore.asciiArt.split("\n");
  const rowCount: number = aa.length;
  const rowHeight: number = textAreRefElem.value.scrollHeight / rowCount;
  const rowTop: number = (topLeft.y - (topLeft.y % rowHeight) ) / rowHeight;
  const rowBottom: number = (bottomRight.y - (bottomRight.y % rowHeight) ) / rowHeight;
  let html: string = "";
  let selectedStrInfo: Array<{row: number, start: number, end: number, text: string}> = [];
  for(let i=rowTop; i < rowBottom; i++){
    let rowLeft:number = 0;
    const strInfo = {row: 0, start: 0, end: 0, text: ""};
    for(let j=0; j < aa[i].length; j++){
      const char:string = aa[i].charAt(j);
      const charWidth:number = await charSetStore.calcStrWidth(char);
      if(rowLeft + charWidth > topLeft.x){
        strInfo.start = j;
        break;
      }else{
        rowLeft += charWidth;
      }
    }

    let rowRight: number = await charSetStore.calcStrWidth(aa[i]);
    for(let j=aa[i].length; j >= 0; j--){
      
      const char:string = aa[i].charAt(j);
      const charWidth:number = await charSetStore.calcStrWidth(char);
      if(rowRight - charWidth < bottomRight.x){
        strInfo.end = j;
        break;
      }else{
        rowRight -= charWidth;
      }
    }
    html += `<div class="selected_rect asciiArt" style = "height: ${rowHeight}px; width: ${rowRight - rowLeft}px; top: ${rowHeight * i}px; left: ${rowLeft}px;"></div> `;
    strInfo.text = aa[i].slice(strInfo.start, strInfo.end + 1);
    strInfo.row = i;
    selectedStrInfo.push(strInfo)
  }
  rectSelectContainerElem.value.innerHTML = html;
  selectedRectTextInfo.value = selectedStrInfo;
}
const onMouseUp = (e: MouseEvent) => {
  isDragging.value = false;
}

const changeDot = async (delta: number) => {
  mainCanvasAsciiArtStore.changeDot(delta);
  await nextTick();
  textAreaElem.value.setSelectionRange(mainCanvasAsciiArtStore.caretPosition.start, mainCanvasAsciiArtStore.caretPosition.end);  
  const mainCanvasAA = mainCanvasAsciiArtStore.asciiArt;
  //checkContinuousSpace(mainCanvasAA);
  //checkHeadSpace(mainCanvasAA);
}
const copySelectedRectTextToStore = () => {
  mainCanvasAsciiArtStore.rectSelectTextInfo = selectedRectTextInfo.value;
}
const deleteSelectedRectText = () => {

}
const pasteSelectedRectTextFromStore = async () => {
  const aa: Array<string> = mainCanvasAsciiArtStore.asciiArt.split("\n");
  const caretRow = mainCanvasAsciiArtStore.currentRow - 1;
  const firstText: string = mainCanvasAsciiArtStore.halfStrCurrentRow;
  const caretPos = firstText.length;
  const selectInfo = mainCanvasAsciiArtStore.rectSelectTextInfo;
  const firstTextWidth: number = await charSetStore.calcStrWidth(firstText);
  const isInsert: boolean = mainCanvasAsciiArtStore.isRectSelectInsertMode;
  aa[caretRow] = await pasteTextLine(aa[caretRow], firstTextWidth, selectInfo[0].text, isInsert);
  for(let i = 1; i < selectInfo.length; i++){
    if(caretRow + i < aa.length){
      aa[caretRow + i] = await pasteTextLine(aa[caretRow + i], firstTextWidth,selectInfo[i].text , isInsert)
    }else{
      const addText: string = await pasteTextLine("", firstTextWidth,selectInfo[i].text , isInsert);
      aa.push(addText);
    }
  }
  const addedAA: string = aa.join("\n");
  const log: EditLog = {value: addedAA, start: 0, end: addedAA.length - 1};
  mainCanvasAsciiArtStore.editAsciiArt(addedAA, log);
}
//leftPos は実際に測定した長さ
const pasteTextLine = async (target: string, leftPos: number, text: string, isInsert: boolean): Promise<string> => {
  const targetWidth: number = await charSetStore.calcStrWidth(target);
  const textWidth: number = await charSetStore.calcStrWidth(text);
  if(isInsert){ //挿入
    if(targetWidth < leftPos){
      return target + addSpace(targetWidth, leftPos) + text;
    }else{
      const startIndex:number = await getStartIndex(target, leftPos);
      return target.slice(0, startIndex) + text + target.slice(startIndex + 1, target.length);
    }
  }else{  //上書き
    if(targetWidth < leftPos){  //空白の追加が必要である場合
      return target + addSpace(targetWidth, leftPos) + text;
    }else if(targetWidth < leftPos + textWidth){  //元の文字列の途中から上書きが始まるが、末端ははみ出す場合
      const startIndex:number = await getStartIndex(target, leftPos);
      return target.slice(0, startIndex) + text
    }else{  //元の文字列の中に上書きする文字列が収まる場合
      const startIndex:number = await getStartIndex(target, leftPos);
      const endIndex: number = await getStartIndex(target, leftPos + textWidth);
      return target.slice(0, startIndex) + text + target.slice(endIndex, target.length);
    }    
  }
  return "";
}
const addSpace = (start: number, goal: number): string => {
  const halfWidth: number = 5;
  const fullWidth: number = 11;
  const diff: number = goal - start;
  let excess = fullWidth - diff % fullWidth
  let fullCount: number = (diff - diff % fullWidth) / fullWidth + 1;
  let halfCount: number = 0;
  if(excess > halfWidth){
    fullCount --;
    halfCount ++;
    excess -= halfWidth;
  }
  //while(excess > 0 && fullCount > halfCount + 3){
  //  excess --;
  //  halfCount += 2;
  //  fullCount --;
  //}
  return "　 ".repeat(halfCount) + "　".repeat(fullCount - halfCount);
}

const getStartIndex = async (target: string, leftPos: number ):Promise<number> => {
  let startPos: number = await charSetStore.calcStrWidth(target);
  let index: number = target.length - 1;
  while(startPos > leftPos && index > 0){
    startPos -= await charSetStore.calcStrWidth(target.charAt(index));
    index --;
  }
  return index;
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
  if(e.ctrlKey){
    switch(e.key){
      case 'R':
        e.preventDefault();
        return;
      case 'r':
        e.preventDefault();
        return;
      case 'C':
      case 'c':
        if(mainCanvasAsciiArtStore.isRectSelectMode){
          e.preventDefault();
          copySelectedRectTextToStore();
        }
        return;
      case 'X':
      case 'x':
        if(mainCanvasAsciiArtStore.isRectSelectMode){
          e.preventDefault();
          copySelectedRectTextToStore();
          deleteSelectedRectText();
        }
        return;
      case 'V':
      case 'v':
        if(mainCanvasAsciiArtStore.isRectSelectMode){
          e.preventDefault();
          pasteSelectedRectTextFromStore();
        }
        return
    }
  }
}
const viewScrollLeft = ():number => {
    let width: number = 0;
    if(baseElem.value != null){
      if(baseElem.value.scrollLeft != null){
        width = baseElem.value.scrollLeft;
      }
    }
    return width;
}
const onScroll = (e: any) => {
  layoutStore.scrollY = e.target.scrollTop;

  //rectSelectContainerElem.scrollTop = e.target.scrollTop;
  //caretPositionElem.scrollTop = e.target.scrollTop;
  //headSpaceElem.scrollTop = e.target.scrollTop;
  //textAreRefElem.scrollTop = e.target.scrollTop;
  //arrowContainerElem.scrollTop = e.target.scrollTop;
  console.log(layoutStore.isDragging);
  if(layoutStore.isDragging){
    baseElem.value.scrollLeft = viewScrollLeftValue.value;
  }
  viewScrollLeftValue.value = viewScrollLeft();  
}


const updateScroll = () => {
  const scroll = layoutStore.scrollY;
  baseElem.value.scrollTop = scroll
  console.log(scroll, "scroll");
}

const measure = (name: string, func: Function) => {
    const start = performance.now();
    func();
    const end = performance.now();
    
    const elapsed = (end - start);
    const elapsedStr = elapsed.toPrecision(3);
    console.log(`${name}: ${elapsedStr}`);
}

const test = () => {
  for(let i = 0; i < 100; i++){
    mainCanvasAsciiArtStore.asciiArt = "test".repeat(100) + i.toString();
  }
}
onMounted(() => {
  //mainCanvasAA.value = mainCanvasAsciiArtStore.asciiArt;
  updatePictureValues();
  console.log("test", mainCanvasAsciiArtStore.asciiArt, "on mounted");
})


</script>

<template>
  <div class="base" ref="baseElem" v-on:scroll="onScroll">  
    <div class="caretPosition asciiArt blinking" ref="caretPositionElem">{{ caretText }}</div>
    <div class="measureAA asciiArt" ref="headSpaceElem"></div>
    <div class="measureAA asciiArt" ref="textAreRefElem">{{ mainCanvasAsciiArtStore.asciiArt }}</div>
    <div class="asciiArt arrow" ref="arrowContainerElem"></div>
    <div class="selectRect asciiArt" ref="rectSelectContainerElem"></div>
    <textarea class="asciiArt textarea" 
                spellcheck=false
                v-on:input="onChangeTextArea" 
                v-on:selectionchange="onSelectionChange"
                v-on:keydown="onKeyDown"
                v-on:mousedown="onMouseDown"
                v-on:mousemove="onMouseMove"
                v-on:mouseup="onMouseUp"
                v-model="mainCanvasAA"
                ref="textAreaElem"
                v-bind:class="{hiddenEdit: mainCanvasAsciiArtStore.isMovieMode}"
                ></textarea>
    
    <div class="measure">
      <span class="asciiArt" ref="spanElem">{{ text }}</span>
    </div>
    <span class="sizeRef100" ref="sizeRef100">　</span>
  </div>
  
</template>

<style scoped>

.base {
  position: relative;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  /*justify-content: space-between;*/
  overflow: scroll;
  min-height: 100%;
  min-width: 100%;
}
.mainFrame {
  overflow: hidden;
  min-height: 100%;
  height: 100%;
  width: 100%;
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
.selectRect {
  position: absolute;
  display: table;  
}
.textarea {
  background-color: transparent;
  white-space: pre;
  z-index: 10;
  resize: none;
  position: absolute;
  overflow:hidden;
  /*field-sizing:content;*/
  min-height: 100%;
  min-width: 100%;

  color: v-bind(mainCanvasFontColor);
}
.hiddenEdit {
  pointer-events: none;
}

.sizeRef100 {
  width: 100%;
  height: 100%;
  background-color: transparent;
}
.caretPosition {
  position: absolute;
  border-right: 2px solid black;
  left: 0px;
  color: transparent;
  top: v-bind(caretPosition.top + 'px');
}
.arrow {
  position: absolute;
  color: gray;
}

/* 点滅 */
.blinking{
	-webkit-animation:blink 0.5s infinite alternate;
    -moz-animation:blink 0.5s infinite alternate;
    animation:blink 0.5s infinite alternate;
}
@-webkit-keyframes blink{
    0% {opacity:0;}
    100% {opacity:1;}
}
@-moz-keyframes blink{
    0% {opacity:0;}
    100% {opacity:1;}
}
@keyframes blink{
    0% {opacity:0;}
    100% {opacity:1;}
}
</style>
