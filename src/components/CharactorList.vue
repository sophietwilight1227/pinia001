<script setup lang="ts">
import { useCharSetStore } from '@/stores/charSet';
import { useMainCanvasStore } from '@/stores/mainCanvas';
import { nextTick, reactive, ref, type Ref } from 'vue';
import { useColorStore } from '@/stores/color';
import constColor from '@/consts/constColor';
import { useDialogStore } from "@/stores/dialog";

const dialogStore = useDialogStore();

const colorStore = useColorStore();
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
const removeChar = async () => {
  if(await dialogStore.alert("この文字を削除しますか？：" + charList.value[menuPosition.currentIndex].value)){
    charSetStore.removeCharFromCurrentPalette(menuPosition.currentIndex);
    await dialogStore.info("削除しました");
  }
}

const canRemove = (index: number): boolean => {
  return index < charList.value.length;
}

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
  console.log(menuPosition.currentIndex);
  document.addEventListener('click', hideMenu);
}
const hideMenu = () => {
  menuPosition.show = false
  document.removeEventListener('click', hideMenu);
}
const showAddCharMenu = () => {
  menuAddChar.show = true;
}
const hideAddCharMenu = () => {
  menuAddChar.show = false;
}


</script>

<template>
  <div class="base" v-on:contextmenu.prevent="onRightClick($event, charList.length)">    
    <span v-for="(data, i) in charList" class="charChip" >
        <div class="asciiArt" 
          v-on:mouseover="onMouseOver(i)" 
          v-on:mouseout="onMouseOut(i)" 
          v-on:click.stop="onMouseClisk(i)" 
          v-on:contextmenu.prevent.stop="onRightClick($event, i)">
          <span>{{ data.value }}</span>
          <p class="baloon" :style="{display: data.isMouseOver}">{{ data.width }}</p>
        </div>
    </span>
  </div>
  <div>
    <div v-show="menuPosition.show" class="contextMenu">
      <div>リスト編集</div>
      <div v-on:click="showAddCharMenu">追加</div>
      <div v-on:click="removeChar" v-show="canRemove(menuPosition.currentIndex)">削除</div>
    </div>    

    <span class="asciiArt" ref="spanElem">{{ text }}</span>

    <div v-show="menuAddChar.show" class="menuAddChar">
      <div>追加したい文字列</div>
      <input type="text" v-model="menuAddChar.text"/>
      <button v-on:click="addChar">add</button>
      <button v-on:click="hideAddCharMenu">cancel</button>
    </div>    
  </div>

</template>

<style scoped>

.base {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow: scroll;
  width: 100%;
  background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
}
.charChip {
    min-width: 30px;
    user-select: none;
    align-items:flex-start;
    margin: 1px;
    padding: 3px 0px 3px 0px;
    text-align: center;
    background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.MAIN_CANVAS_BACKGROUND));
}
.baloon {
    position: absolute;
    width: 30px;
    z-index: 100;
    filter: drop-shadow(0px 1px 4px #aaa);
    color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
}
.contextMenu {
  z-index: 100;
  position: fixed;
  top: v-bind(menuPosition.top + "px");
  left: v-bind(menuPosition.left + "px");
  color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
  background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.BASE));
  border: 1px solid v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
}

.menuAddChar {
  z-index: 100;
  position: fixed;
  top: 50%;
  left: 50%;
  background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.BASE));
  border: 1px solid v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
}
</style>
