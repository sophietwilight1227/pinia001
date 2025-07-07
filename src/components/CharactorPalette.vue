<script setup lang="ts">
import { useSettingStore } from "@/stores/settings";
import CharactorList from './CharactorList.vue';
import PanelContainer from './PanelContainer.vue'
import PanelDivider from './PanelDivider.vue'
import charPalette from '../assets/data/charPalette.json'
import { useCharSetStore } from "@/stores/charSet";
import { nextTick, onMounted, onUpdated, ref, type Ref } from "vue";
import FileTab from "./FileTab.vue";

const nameListRef: any = ref(null);
const spanElem: Ref<HTMLElement | null> = ref(null);
const text: Ref<string> = ref("");
const settingStore = useSettingStore();
const charSetStore = useCharSetStore();

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
  for(let i=0; i < charPalette.length; i++){
    charSetStore.addCharPaletteIndex(i, charPalette[i].indexName);
    for(let j=0; j < charPalette[i].charList.length; j++){
      const width: number = (await calcWidth(charPalette[i].charList[j])).valueOf();
      charSetStore.addCharPalette(i, j, charPalette[i].charList[j], width);
    }
    charIndexList.value.push(charPalette[i].indexName);
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
  }
  await nextTick();

  if(nameListRef.value[charSetStore.currentIndex] != null){
    nameListRef.value[charSetStore.currentIndex].select(true);
  }
}
charSetStore.$subscribe((mutation, state) => {
    updateCharPalette(state.charPalette);
})
</script>

<template>
  <div class="base">    
    <PanelContainer :order="0" :name="'charList'">
      <div class="charIndexList">
        <div v-for="(data, i) in charIndexList">
          <FileTab :value="data" v-on:click="selectIndex(i)" ref="nameListRef" class="tab">{{ data }}</FileTab>
        </div>
      </div>
    </PanelContainer>
    <PanelDivider :order="0" :layout-name="'charList'"/>   
    <PanelContainer :order="1" :name="'charList'">
      <CharactorList/>
    </PanelContainer>
  </div>
  <span class="asciiArt" ref="spanElem">{{ text }}</span>
</template>

<style scoped>

.base {
    display: flex;  
    flex-direction: row;
    max-width: none;
    overflow: hidden;
    height: 100%;
    background-color: aquamarine;
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
</style>
