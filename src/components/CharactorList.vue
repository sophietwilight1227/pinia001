<script setup lang="ts">
import { useCharSetStore } from '@/stores/charSet';
import { useMainCanvasStore } from '@/stores/mainCanvas';
import { nextTick, reactive, ref, type Ref } from 'vue';

const charSetStore = useCharSetStore();
const mainCanvasAsciiArtStore = useMainCanvasStore();

const spanElem: Ref<HTMLElement | null> = ref(null);
const text: Ref<string> = ref("");

const menuPosition: {left: number, top: number, show: boolean, currentIndex: number} = reactive({left: 0, top: 0, show: false, currentIndex: 0});
const menuAddChar: {left: number, top: number, show: boolean, text: string} = reactive({left: 0, top: 0, show: false, text: ""})

const charList: Ref<Array<{value:string, width: number, isMouseOver: string}>> = ref([])
const updateCharList = (newValue: Array<{value: string, width: number}>):void => {
  const newList:Array<{value:string, width: number, isMouseOver: string}> = [];
  for(let i=0; i < newValue.length; i++){
    newList.push({value: newValue[i].value, width: newValue[i].width, isMouseOver: "none"});
  }
  charList.value = newList;
}

const calcWidth = async (str: string): Promise<number> => {
  text.value = str;
  await nextTick();
  let width = 0;

  if(spanElem.value != null){
    width = spanElem.value.offsetWidth;
  }
  text.value = "";  //これで非表示になる
  return width;
}

const addChar = async () => {
  const str: string = menuAddChar.text;
  const index: number = menuPosition.currentIndex;
  const width:number  = (await calcWidth(str)).valueOf();
  charSetStore.addCharToCurrentPalette(index, str, width);

  menuAddChar.show = false;
}
//updateCharList(charSetStore.charList);  //これがないと初期セットされない


//watch(
//    () => charSetStore.charList,
//    (newValue) => {
//        updateCharList(newValue);
//    }
//)
charSetStore.$subscribe((mutation, state) => {
    updateCharList(charSetStore.charList);
})

const onMouseOver = (index: number):void => {
  charList.value[index].isMouseOver = "block";
}
const onMouseOut = (index: number):void => {
  charList.value[index].isMouseOver = "none";
}

const onMouseClisk = (index: number): void => {
  mainCanvasAsciiArtStore.insertCharToAsciiArt(charList.value[index].value);
}
const onRightClick = (e: MouseEvent ,index: number):void => {
  menuPosition.left = e.pageX;
  menuPosition.top = e.pageY;
  menuPosition.show = true;
  menuPosition.currentIndex = index;
  document.addEventListener('click', hideMenu);
}
const hideMenu = () => {
  menuPosition.show = false
  document.removeEventListener('click', hideMenu);
}
const showAddCharMenu = () => {
  console.log("add char")
  menuAddChar.show = true;
}
const hideAddCharMenu = () => {
  menuAddChar.show = false;
}


</script>

<template>
  <div class="base">    
    <span v-for="(data, i) in charList" class="charChip" >
        <div class="asciiArt" 
          v-on:mouseover="onMouseOver(i)" 
          v-on:mouseout="onMouseOut(i)" 
          v-on:click.stop="onMouseClisk(i)" 
          v-on:contextmenu.prevent="onRightClick($event, i)">
          <span>{{ data.value }}</span>
          <p class="baloon" :style="{display: data.isMouseOver}">{{ data.width }}</p>
        </div>
    </span>
  </div>
  <div>
    <div v-show="menuPosition.show" class="contextMenu">
      <div v-on:click="showAddCharMenu">add</div>
      <div>menu2</div>
      <div>menu3</div>
    </div>    

    <span class="asciiArt" ref="spanElem">{{ text }}</span>
    <div v-show="menuAddChar.show" class="menuAddChar">
      <div>追加kしたい文字列</div>
      <input type="text" v-model="menuAddChar.text"/>
      <button v-on:click="addChar">add</button>
      <button v-on:click="hideAddCharMenu">cancel</button>
    </div>    
  </div>

</template>

<style scoped>

.base {
  background-color: white;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow: scroll;
}
.charChip {
    background-color: lightcoral;
    width: 30px;
    user-select: none;
    align-items:flex-start;
    margin: 1px;
}
.baloon {
    position: absolute;
    z-index: 100;
    background-color: white;
    filter: drop-shadow(0px 1px 4px #aaa);
}
.contextMenu {
  background-color: white;
  z-index: 100;
  border: 1px solid black;
  position: fixed;
  top: v-bind(menuPosition.top + "px");
  left: v-bind(menuPosition.left + "px");
}

.menuAddChar {
  background-color: white;
  z-index: 100;
  border: 1px solid black;
  position: fixed;
  top: 50%;
  left: 50%;
}

.asciiArt {
  background-color: aqua;
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
