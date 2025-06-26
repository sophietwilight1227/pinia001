<script setup lang="ts">
import { useCharSetStore } from '@/stores/charSet';
import { useMainCanvasStore } from '@/stores/mainCanvas';
import { reactive, ref, watch, type Ref } from 'vue';

const charSetStore = useCharSetStore();
const mainCanvasAsciiArtStore = useMainCanvasStore();

const menuPosition: {left: number, top: number, show: boolean} = reactive({left: 0, top: 0, show: false});

const charList: Ref<Array<{value:string, width: number, isMouseOver: string}>> = ref([])
const updateCharList = (newValue: Array<{value: string, width: number}>):void => {
  const newList:Array<{value:string, width: number, isMouseOver: string}> = [];
  for(let i=0; i < newValue.length; i++){
    newList.push({value: newValue[i].value, width: newValue[i].width, isMouseOver: "none"});
  }
  charList.value = newList;
}
updateCharList(charSetStore.charList);  //これがないと初期セットされない

watch(
    () => charSetStore.charList,
    (newValue) => {
        updateCharList(newValue);
    }
)

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
  document.addEventListener('click', hideMenu);
}
const hideMenu = () => {
  menuPosition.show = false
  document.removeEventListener('click', hideMenu);
}
</script>

<template>
  <div class="base">    
    <span v-for="(data, i) in charList">
        <div class="charChip asciiArt" 
          v-on:mouseover="onMouseOver(i)" 
          v-on:mouseout="onMouseOut(i)" 
          v-on:click.stop="onMouseClisk(i)" 
          v-on:contextmenu.prevent="onRightClick($event, i)">
          <span>{{ data.value }}</span>
          <p class="baloon" :style="{display: data.isMouseOver}">tip</p>
        </div>
    </span>
  </div>
  <div v-show="menuPosition.show" class="contextMenu">
    <div>menu1</div>
    <div>menu2</div>
    <div>menu3</div>
  </div>
</template>

<style scoped>

.base {
  background-color: white;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.charChip {
    background-color: lightcoral;
    width: 30px;
    user-select: none;
}
.baloon {
    position: absolute;
    z-index: 100;
    background-color: white;
    filter: drop-shadow(0px 1px 4px #aaa);
}
.contextMenu {
  background-color: white;
  border: 1px solid black;
  position: absolute;
  top: v-bind(menuPosition.top + "px");
  left: v-bind(menuPosition.left + "px")
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
