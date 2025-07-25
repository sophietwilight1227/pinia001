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
import { decodeNumericEntity } from "@/scripts/encode";

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
const errorContainerElem: any = ref(null);
const caretPositionElem: any = ref(null);
const baseElem: any = ref(null);

const charSetStore = useCharSetStore();
const mainCanvasAsciiArtStore = useMainCanvasStore();
//mainCanvasAsciiArtStore.initAsciiArt();
const mainCanvasAA = ref("");
const prevMainCanvasAA = ref("");
const prevSpaceElemText: Ref<Array<string>> = ref([]);
const mainCanvasFontColor: Ref<string> = ref("rgb(0, 0, 0)");
const caretPositionColor: Ref<string> = ref("transparent");
const isDragging: Ref<boolean> = ref(false);
const caretPosition: Ref<{top: number, left: number}> = ref({top: 0, left: 0}); //座標。CSSで使う
const selectedRectTextInfo: Ref<Array<{row: number, start: number, end: number, text: string}>> = ref([]);
const caretText: Ref<string> = ref("");
const viewScrollLeftValue: Ref<number> = ref(0);
const spacePool: Ref<Array<Array<HTMLElement>>> = ref([]);  //不使用
const spaceErrorPool: Ref<Array<Array<HTMLElement>>> = ref([]);   //不使用
const arrowPool: Ref<Array<HTMLElement>> = ref([]);   //不使用

mainCanvasAsciiArtStore.$subscribe((mutation, state) => {
  prevMainCanvasAA.value = mainCanvasAA.value;
  mainCanvasAA.value = mainCanvasAsciiArtStore.asciiArt;
  updateTextAreaWidth();
  updateArrow(mainCanvasAA.value);
  updateCaretPosition(mainCanvasAA.value, mainCanvasAsciiArtStore.caretPosition.start, mainCanvasAsciiArtStore.caretPosition.end);
  if(textAreRefElem.value != null && "TEXTAREA" != document.activeElement?.nodeName && !props.isPictureView){
    const start = mainCanvasAsciiArtStore.caretPosition.start;
    const end = mainCanvasAsciiArtStore.caretPosition.end;
    textAreaElem.value.setSelectionRange(start, end );  
  }
  //const start = mainCanvasAsciiArtStore.caretPosition.start;
  //const end = mainCanvasAsciiArtStore.caretPosition.end;
  //console.log("selection change", start, end)
  //textAreaElem.value.setSelectionRange(start, end );  
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

const updateTextAreaWidth = async () => {
  await nextTick();
  const newHeight: number = baseElem.value?.scrollHeight!;
  const newWidth: number = baseElem.value?.scrollWidth!;
  textAreaElem.value.style.height = textAreRefElem.value.scrollHeight + "px";
  textAreaElem.value.style.width = (textAreRefElem.value.scrollWidth + 100) + "px";
  layoutStore.updateAsciiArtSize(newHeight, newWidth);
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
      mainCanvasAsciiArtStore.editAsciiArt(str, {value:str, start: 0, end: str.length});
    }
    updateArrow(mainCanvasAA.value);
    onSelectionChange(e);
  }
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
const updateArrow = (aa: string) => {
  if(!mainCanvasAsciiArtStore.showSpaceArrow){
    if(!hasErrorSpace()){
      arrowContainerElem.value.innerHTML = "";  
      errorContainerElem.value.innerHTML = "";  
      return;
    }
  }

  if(mainCanvasAsciiArtStore.showSpaceWithText){
    updateArrowWithText(aa);
  }else{
    updateArrowWithElem(aa);
  }
}

const hasErrorSpace = (): boolean => {
  if(mainCanvasAA.value.indexOf("  ") > 0 || mainCanvasAA.value.indexOf("\n ") > 0 || mainCanvasAA.value.charAt(0) == " "){
    console.log(mainCanvasAA.value.indexOf("  "), mainCanvasAA.value.indexOf("\n ") )
    return true;
  }else{
    return false;
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
const updateArrow__ = async (aa: string) => {
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

const updateArrow___ = async (aa: string) => {
    if(arrowContainerElem.value == null || aa == prevMainCanvasAA.value){
      return;
    }
    const text: Array<string> = aa.split("\n");
    const prevText: Array<string> = prevMainCanvasAA.value.split("\n");
    let html: string = "";
    let prefix = "";
    if(props.isPictureView){
      prefix = "aaSpaceTrue"
    }else{
      prefix = "aaSpaceFalse"
    }
    const rowHeight: number = 18;
    for(let i=0; i < text.length; i++){
      if((prevText.length > i && prevText[i] != text[i]) || prevText.length <= i ){
        let children = document.getElementsByClassName(prefix + i);
        const len = children.length;
        if(len > 0){
          for(let k=0; k < len; k++){
            children[0].remove(); //childrenは動的なので常に先頭を削除する
          }          
        }
        for(let j=0; j < text[i].length; j++){
          const rowLeft: number = await charSetStore.calcStrWidth(text[i].slice(0, j));
          switch(text[i].charAt(j)){
            case " ":
              if((j == 0 && text[i].charAt(j) == " ") || (j > 0 && text[i].charAt(j-1) == " ") || (j < text[i].length-1 && text[i].charAt(j+1) == " ")){
                html += `<div class="asciiArt misspelled ${prefix + i }" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
              }else{
                html += `<div class="asciiArt not_misspelled ${prefix + i }" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
              }
              
              break;
            case "　":
              html += `<div class="asciiArt not_misspelled ${prefix + i }" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 10px"></div> `;
              break;
          }
        }        
      }

      const rowLeft: number = await charSetStore.calcStrWidth(text[i]);
      html += `<div class="asciiArt arrowNode ${prefix + i }" style = "top: ${rowHeight * i}px; left: ${rowLeft}px;">↓</div> `;
    }
    arrowContainerElem.value.innerHTML = html;  
}

const updateArrowWithElem  = async (aa: string) => {
    if(arrowContainerElem.value == null || aa == prevMainCanvasAA.value){
      return;
    }
    const text: Array<string> = aa.split("\n");
    const prevText: Array<string> = prevMainCanvasAA.value.split("\n");
    let html: string = "";
    const rowHeight: number = 18;
    if(text.length < prevSpaceElemText.value.length){
      for(let i=prevSpaceElemText.value.length-1; i >= text.length; i--){
        prevSpaceElemText.value.pop();
      }
    }
    for(let i=0; i < text.length; i++){
      //if((prevText.length > i && prevText[i] != text[i]) || prevText.length <= i ){
      if(true ){
        html = "";
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
        if(prevSpaceElemText.value.length <= i){
          prevSpaceElemText.value.push()
        }
        prevSpaceElemText.value[i] = html;              
      }

      const rowLeft: number = await charSetStore.calcStrWidth(text[i]);
      html = `<div class="asciiArt arrowNode" style = "top: ${rowHeight * i}px; left: ${rowLeft}px;">↓</div> `;
    }
    arrowContainerElem.value.innerHTML = prevSpaceElemText.value.join("") + html;  
}
const initSpacePool = () => {
  for(let i=0; i < 60; i++){
    addArrowElem();
    spacePool.value.push([])
    spaceErrorPool.value.push([])
    for(let j=0; j < 10; j++){
      addSpaceElem(true, i);
      addSpaceElem(false, i);
    }
  }
}
const addArrowElem = () => {
  const elem = document.createElement("span");
  elem.classList.add("asciiArt", "arrowNode");
  elem.style.top = "-18px";
  elem.style.left = "0px";
  elem.innerHTML = "↓";
  arrowPool.value.push(elem);
  arrowContainerElem.value.appendChild(elem);
}
const addSpaceElem = (isError: boolean, row: number) => {
  const elem = document.createElement("span");

  elem.style.top = "-18px";
  elem.style.left = "0px";
  elem.style.widows = "0px";
  if(isError){
    elem.classList.add("asciiArt", "misspelled");
    spaceErrorPool.value[row].push(elem);
  }else{
    elem.classList.add("asciiArt", "not_misspelled");
    spacePool.value[row].push(elem);
  }  
  arrowContainerElem.value.appendChild(elem);
}
const updateArrow_____ = async (aa: string) => {
    if(arrowContainerElem.value == null){
      return;
    }
    const text: Array<string> = aa.split("\n");
    const rowHeight: number = 18;
    if(text.length > arrowPool.value.length){
      for(let i = 0; i < text.length - arrowPool.value.length; i++){
        addArrowElem();
        spacePool.value.push([])
        spaceErrorPool.value.push([])
      }
    }
    for(let i=0; i < arrowPool.value.length; i++){
      if(i < text.length){
        const rowLeft: number = await charSetStore.calcStrWidth(text[i]);
        arrowPool.value[i].style.top = i * rowHeight + "px";
        arrowPool.value[i].style.left = rowLeft + "px";
        let spaceCount = 0;
        for(let j=0; j < text[i].length; j++){
          if(spaceCount + 1 > spacePool.value[i].length){
            for(let k=0; k < spaceCount + 1 - spacePool.value[i].length; k++){
              addSpaceElem(true, i);
              addSpaceElem(false, i);
            }
          }
          let rowLeft = 0;
          switch(text[i].charAt(j)){
            case " ":
              rowLeft = await charSetStore.calcStrWidth(text[i].slice(0, j));
              if((j == 0 && text[i].charAt(j) == " ") || (j > 0 && text[i].charAt(j-1) == " ") || (j < text[i].length-1 && text[i].charAt(j+1) == " ")){
                spaceErrorPool.value[i][spaceCount].style.top = rowHeight * (i + 1) + "px";
                spaceErrorPool.value[i][spaceCount].style.left = rowLeft + "px";
                spaceErrorPool.value[i][spaceCount].style.width = "4px";
              }else{
                spacePool.value[i][spaceCount].style.top = rowHeight * (i + 1) + "px";
                spacePool.value[i][spaceCount].style.left = rowLeft + "px";
                spacePool.value[i][spaceCount].style.width = "4px";
              }
              spaceCount++;
              break;
            case "　":
              rowLeft = await charSetStore.calcStrWidth(text[i].slice(0, j));
              spacePool.value[i][spaceCount].style.top = rowHeight * (i + 1) + "px";
              spacePool.value[i][spaceCount].style.left = rowLeft + "px";
              spacePool.value[i][spaceCount].style.width = "10px";
              spaceCount++;
              break;
          }
        }  
      }else{
        arrowPool.value[i].style.top = "-" + rowHeight + "px";
        for(let j=0; j < spacePool.value[i].length; j++){
          //spacePool.value[i][j].style.top = "-" + rowHeight + "px";
        }
        for(let j=0; j < spaceErrorPool.value[i].length; j++){
          //spaceErrorPool.value[i][j].style.top = "-" + rowHeight + "px";
        }
      }
    }
}
const getBrancText = (len: number): string => {
  const res: number = len % 5;
  let halfCount: number = (len - res) / 5;
  let thinText: string = "";
  switch(res){
    case 0:
      break;
    case 1:
      halfCount--;
      thinText = "&thinsp;".repeat(3);
      break;
    case 2:
      thinText = "&thinsp;".repeat(1);
      break; 
    case 3:
      if(halfCount == 0){
        thinText = ".";
      }else{
        halfCount--;
        thinText = "&thinsp;".repeat(4);
      }
      break;
    case 4:
      thinText = "&thinsp;".repeat(2);
      break;
  } 
  
  return " ".repeat(halfCount) + thinText;
}

const updateArrowWithText = async (aa: string) => {
    if(arrowContainerElem.value == null){
      return;
    }
    const text: Array<string> = aa.split("\n");
    let html: string = "";

    let spaceText: string = "";
    let spaceErrorText: string = "";
    const rowHeight: number = 18;
    const HALF_SPACE: string = "_";
    const FULL_SPACE: string = "　";
    for(let i=0; i < text.length; i++){
      let rowLeft: number = 0;
      let prevCharIndex = 0;
      let prevErrorCharIndex = 0;
      for(let j=0; j < text[i].length; j++){
        switch(text[i].charAt(j)){
          case " ":
            if(j == 0){
              spaceErrorText += HALF_SPACE;
              prevErrorCharIndex = j;
            }else if(j > 0 && text[i].charAt(j-1) == " "){
              spaceErrorText += HALF_SPACE;
              prevErrorCharIndex = j + 1;
            }else if(j < text[i].length-1 && text[i].charAt(j+1) == " "){
              rowLeft = await charSetStore.calcStrWidth(text[i].slice(prevErrorCharIndex , j));
              spaceErrorText += getBrancText(rowLeft);
              spaceErrorText += HALF_SPACE;
              prevErrorCharIndex = j;
            }else{
              rowLeft = await charSetStore.calcStrWidth(text[i].slice(prevCharIndex+1, j));
              spaceText += getBrancText(rowLeft);
              spaceText += HALF_SPACE;
              prevCharIndex = j;
            }
            break;
          case "　":
            rowLeft = await charSetStore.calcStrWidth(text[i].slice(prevCharIndex+1, j));
            spaceText += getBrancText(rowLeft);
            spaceText += FULL_SPACE;
            prevCharIndex = j;
            break;
        }
      }
      rowLeft = await charSetStore.calcStrWidth(text[i].slice(prevCharIndex+1, text[i].length));
      spaceText += getBrancText(rowLeft);
      spaceText += "↓\n";
      spaceErrorText += "\n";
    }
    arrowContainerElem.value.innerHTML = spaceText;  
    errorContainerElem.value.innerHTML = spaceErrorText;  
}

const updateCaretPosition = async (rawStr: string, startPos: number, endPos: number) => {

  const frontStr:string = rawStr.substring(0, startPos);
  const strs = frontStr.split("\n");
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
  if(e.target != document.activeElement){
    return;
  }
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
  if(props.isPictureView){
    layoutStore.scrollY_pic = e.target.scrollTop;
    layoutStore.scrollX_pic = e.target.scrollLeft;
  }else{
    layoutStore.scrollY_canvas = e.target.scrollTop;
    layoutStore.scrollX_canvas = e.target.scrollLeft;
    
  }
  if(layoutStore.isDragging){
    baseElem.value.scrollLeft = viewScrollLeftValue.value;
  }
  viewScrollLeftValue.value = viewScrollLeft();  

  layoutStore.canvasSize.height = baseElem.value.height;
  layoutStore.canvasSize.width = baseElem.value.width;
}


const updateScroll = () => {
  if(props.isPictureView){
    baseElem.value.scrollTop = layoutStore.scrollY_pic;
  }else{
    baseElem.value.scrollTop = layoutStore.scrollY_canvas;
  }
  
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
  const rowHeight = 18;
  let html: string = "";
  for(let i = 0; i < 100; i++){
    for(let j=0; j< 100; j++){
      const rowLeft = j * 5;
      html += `<div class="asciiArt misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
    }
  }
  arrowContainerElem.value.innerHTML = html
}
const test2 = () => {
  const rowHeight = 18;
  let html: string = "";
  for(let i = 0; i < 100; i++){
    for(let j=0; j< 100; j++){
      const rowLeft = j * 5;
      html += `<div class="asciiArt misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
    }
  }
  arrowContainerElem.value.innerHTML = html
  html = "";
  for(let i = 0; i < 100; i++){
    for(let j=0; j< 100; j++){
      const rowLeft = j * 5;
      html += `<div class="asciiArt misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
    }
  }
  arrowContainerElem.value.innerHTML = html
}
const test3 = () => {
  const rowHeight = 18;
  let html: string = "";
  for(let i = 0; i < 100; i++){
    for(let j=0; j< 100; j++){
      const rowLeft = j * 5;
      html += `<div class="asciiArt misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
    }
  }
  arrowContainerElem.value.innerHTML = html
  const children = arrowContainerElem.value.children;
  for(let i=children.length-1; i >= 0; i--){
    //children[i].remove();
    arrowContainerElem.value.removeChild(children[i]);
  }
  html = "";
  for(let i = 0; i < 100; i++){
    for(let j=0; j< 100; j++){
      const rowLeft = j * 5;
      html += `<div class="asciiArt misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
    }
  }
  arrowContainerElem.value.innerHTML = html
}
const test4 = () => {
  const rowHeight = 18;
  let html: string = "";
  for(let i = 0; i < 100; i++){
    for(let j=0; j< 100; j++){
      const rowLeft = j * 5;
      html += `<div class="asciiArt misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
    }
  }
  arrowContainerElem.value.innerHTML = html
  arrowContainerElem.value.innerHTML = ""
  html = "";
  for(let i = 0; i < 100; i++){
    for(let j=0; j< 100; j++){
      const rowLeft = j * 5;
      html += `<div class="asciiArt misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
    }
  }
  arrowContainerElem.value.innerHTML = html
}
const test5 = () => {
  const rowHeight = 18;
  let html: string = "";
  for(let i = 0; i < 100; i++){
    for(let j=0; j< 100; j++){
      const rowLeft = j * 5;
      html += `<div class="asciiArt misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
    }
  }
  arrowContainerElem.value.innerHTML = html
  const ele = arrowContainerElem.value;
  while( ele.firstChild ){
    ele.removeChild( ele.firstChild );
  }
  html = "";
  for(let i = 0; i < 100; i++){
    for(let j=0; j< 100; j++){
      const rowLeft = j * 5;
      html += `<div class="asciiArt misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
    }
  }
  arrowContainerElem.value.innerHTML = html
}

const test6 = () => {
  const rowHeight = 18;
  let html: string = "";
  for(let i = 0; i < 100; i++){
    for(let j=0; j< 100; j++){
      const rowLeft = j * 5;
      html += `<div class="asciiArt misspelled row${i.toString() + props.isPictureView}" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
    }
  }
  arrowContainerElem.value.innerHTML = html
  const ele = arrowContainerElem.value;
  const children = document.getElementsByClassName(`row10${props.isPictureView}`);
  const len = children.length;
  if(len > 0){
    for( let i=0; i < len; i++ ){
      ele.removeChild( children[0] );
    }    
  }
  html = "";
  const i = 10;
  for(let j=0; j< 100; j++){
    const rowLeft = j * 5;
    html += `<div class="asciiArt misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
  }
  
  arrowContainerElem.value.innerHTML = html
}

const test7 = () => {
  const rowHeight = 18;
  let html: string = "";
  for(let i = 0; i < 100; i++){
    for(let j=0; j< 100; j++){
      const rowLeft = j * 5;
      html += `<div class="asciiArt misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
    }
  }
  arrowContainerElem.value.innerHTML = html
  const children = arrowContainerElem.value.children;
  for(let i=0; i < children.length; i++){
    children[i].style.height += 18;
  }
}
const test8 = () => {
  const rowHeight = 18;
  let html: string = "";
  for(let i = 0; i < 100; i++){
    for(let j=0; j< 100; j++){
      const rowLeft = j * 5;
      html += `<div class="asciiArt misspelled" style = "top: ${rowHeight * (i + 1)}px; left: ${rowLeft}px; width: 4px"></div> `;
    }
  }
  arrowContainerElem.value.innerHTML = html
  const children = arrowContainerElem.value.children;
  for(let i=0; i < children.length; i++){
    children[i].classList.remove("misspelled");
    children[i].classList.add("not_misspelled");
  }
}
const test9 = () => {
  const rowHeight = 18;
  let html: string = "";
  for(let i = 0; i < 100; i++){
    for(let j=0; j< 100; j++){
      const rowLeft = j * 5;
      html += ".._";
    }
    html += "\n";
  }
  arrowContainerElem.value.innerHTML = html
}

onMounted(() => {
  updatePictureValues();
  //measure("on mounted test", test); //10
  //measure("on mounted test2", test2); //20
  //measure("on mounted test2", test3); //700
  //measure("on mounted test2", test4); //20
  //measure("on mounted test2", test5); //30
  //measure("on mounted test2", test6); //30
  //measure("on mounted test2", test7); //12
  //measure("on mounted test2", test8); //18
  //measure("on mounted test2", test9); //0.2

  //initSpacePool();
  
})


</script>

<template>
  <div class="base" ref="baseElem" v-on:scroll="onScroll">  
    <div class="caretPosition asciiArt blinking" ref="caretPositionElem">{{ caretText }}</div>
    <div class="measureAA asciiArt" ref="headSpaceElem"></div>
    <div class="measureAA asciiArt" ref="textAreRefElem">{{ mainCanvasAaRef }}</div>
    <div class="asciiArt arrowSpace" ref="arrowContainerElem"></div>
    <div class="asciiArt errorSpace" ref="errorContainerElem"></div>
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
.arrowSpace {
  position: absolute;
  color: lightgray;
}
.errorSpace {
  position: absolute;
  color: red;
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
