<script setup lang="ts">
import { useSettingStore } from "@/stores/settings";
import CharactorList from './CharactorList.vue';
import PanelContainer from './PanelContainer.vue'
import PanelDivider from './PanelDivider.vue'
import charPalette from '../assets/data/charPalette.json'
import { useCharSetStore } from "@/stores/charSet";
import { nextTick, onMounted, onUpdated, reactive, ref, type Ref } from "vue";
import FileTab from "./FileTab.vue";
import DraggableListNode from "./DraggableListNode.vue";
import { useColorStore } from '@/stores/color';
import constColor from '@/consts/constColor';
import { useDialogStore } from "@/stores/dialog";
import aalist from '@/assets/data/aalist.json'

const dialogStore = useDialogStore();

const colorStore = useColorStore();

const nameListRef: any = ref(null);
const nameDragListRef: any = ref(null);
const spanElem: Ref<HTMLElement | null> = ref(null);
const text: Ref<string> = ref("");
const settingStore = useSettingStore();
const charSetStore = useCharSetStore();
const menuPosition: {left: number, top: number, show: boolean} = reactive({left: 0, top: 0, show: false});
const dragIndex: Ref<{start: number, end: number}> = ref({start: 0, end: 0});

const charIndexList: Ref<Array<string>> = ref([]);

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

const initCharPalette = async () => {
  const prevCharPalette = localStorage.getItem("ahoge_editor_charpalette");
  if(prevCharPalette == null){
    importDefaultCharPalette();
  }else{
    importPrevCharPalette(prevCharPalette);
  }
}

const importDefaultCharPalette = async () => {
  //for(let i=0; i < charPalette.length; i++){
  //  charSetStore.addCharPaletteIndex(i, charPalette[i].indexName);
  //  for(let j=0; j < charPalette[i].charList.length; j++){
  //    const width: number = (await calcWidth(charPalette[i].charList[j])).valueOf();
  //    charSetStore.addCharPalette(i, j, charPalette[i].charList[j], width);
  //  }
  //  charIndexList.value.push(charPalette[i].indexName);
  //}
    charSetStore.initCharPlette(aalist);
    for(let i=0; i < charSetStore.charPalette.length; i++){
      charIndexList.value.push(charSetStore.charPalette[i].indexName);
    }
}
const importPrevCharPalette = (prevCharPalette: string): void => {
    charSetStore.initCharPlette(JSON.parse(prevCharPalette));
    for(let i=0; i < charSetStore.charPalette.length; i++){
      charIndexList.value.push(charSetStore.charPalette[i].indexName);
    }
}



const selectIndex = (index: number):void => {
    if(nameListRef.value != null){
        for(let i=0; i < nameListRef.value.length; i++){
            nameListRef.value[i].select(false);
        }
        nameListRef.value[index].select(true);
    }

    charSetStore.selectIndex(index);
}

initCharPalette();

const updateCharPalette = async (list: Array<{indexName: string, charList: Array<{value: string,width: number}>}>) => {
  charIndexList.value = [];
  await nextTick();
  for(let i=0; i < list.length; i++){
    charIndexList.value.push(list[i].indexName);
    if(nameListRef.value[i] != null){
      nameListRef.value[i].change(list[i].indexName);
    }
  }
  await nextTick();

  if(nameListRef.value[charSetStore.currentIndex] != null){
    nameListRef.value[charSetStore.currentIndex].select(true);
  }
}

const addCharIndex = ():void => {
  charSetStore.addCharPaletteIndex(charSetStore.currentIndex, "新規タブ");
}

const removeCharIndex = async () => {
  if(await dialogStore.alert("選択中の見出しを削除しますか？")){
    charSetStore.removeCharPaletteIndex(charSetStore.currentIndex);
    await dialogStore.info("削除しました");
  }
}

const renameCharIndex = (name: string):void => {
  charSetStore.renameCharPaletteIndex(name);
}

charSetStore.$subscribe((mutation, state) => {
    updateCharPalette(state.charPalette);
})

const onRightClick = (e: MouseEvent):void => {
  menuPosition.left = e.pageX;
  menuPosition.top = e.pageY;
  menuPosition.show = true;
  document.addEventListener('click', hideMenu);
}
const hideMenu = () => {
  menuPosition.show = false
  document.removeEventListener('click', hideMenu);
}

const onDragStart = (index: number): void => {
  const height:string = nameDragListRef.value[index].getHeight();
  for(let i=0; i < index; i++){
    nameDragListRef.value[i].setDrag(true, height);
  }

  for(let i=index+1; i < charIndexList.value.length; i++){
    nameDragListRef.value[i].setDrag(true, "-" + height);
  }
  dragIndex.value.start = index;
  dragIndex.value.end = index;
}
const onDragEnd = (index: number): void => {
  for(let i=0; i < charIndexList.value.length; i++){
    nameDragListRef.value[i].setDrag(false, "0px");
  }
  charSetStore.moveCharPaletteIndex(dragIndex.value.start, dragIndex.value.end);
  selectIndex(dragIndex.value.end);
}
const onDragEnter = (index: number):void => {
  for(let i=0; i < charIndexList.value.length; i++){
    nameDragListRef.value[i].move(false);
  }
  let start: number = 0;
  let end: number = 0;
  if(index > dragIndex.value.start){
    start = dragIndex.value.start+1;
    end = index+1;
  }else{
    start = index+1;
    end = dragIndex.value.start+1;
  }
  for(let i=start; i < end; i++){
    nameDragListRef.value[i].move(true);
  }  
  dragIndex.value.end = index;
}
const onDragLeave = ():void => {
  
}
onMounted(() => {
  charSetStore.setTextSizeRef(spanElem.value);
})
</script>

<template>
  <div class="base">    
    <PanelContainer :order="0" :name="'charList'">
      <div class="charIndexList" v-on:contextmenu.prevent="onRightClick">
        <div v-for="(data, i) in charIndexList">
          <DraggableListNode ref="nameDragListRef"
                            v-on:dragstart="onDragStart(i)"
                            v-on:dragend="onDragEnd(i)"
                            v-on:dragenter="onDragEnter(i)">
            <FileTab :value="data" 
                    v-on:click="selectIndex(i)" 
                    v-on:change="renameCharIndex"
                    ref="nameListRef" 
                    class="tab"></FileTab>
          </DraggableListNode>
        </div>
      </div>
    </PanelContainer>
    <PanelDivider :order="0" :layout-name="'charList'"/>   
    <PanelContainer :order="1" :name="'charList'">
      <CharactorList/>
    </PanelContainer>
  </div>

  <span class="asciiArt" ref="spanElem">{{ text }}</span>

  <div v-show="menuPosition.show" class="contextMenu">
    <div>リスト編集</div>
    <div v-on:click="addCharIndex">追加</div>
    <div v-on:click="removeCharIndex" v-show="charIndexList.length > 0">削除</div>
  </div>    

</template>

<style scoped>

.base {
    display: flex;  
    flex-direction: row;
    max-width: none;
    overflow: hidden;
    height: 100%;
    background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
}
.charIndexList {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  user-select: none;
}

.tab {
  white-space: nowrap;
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

</style>
