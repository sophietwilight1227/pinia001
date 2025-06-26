<script setup lang="ts">
import { useSettingStore } from "@/stores/settings";
import CharactorList from './CharactorList.vue';
import PanelContainer from './PanelContainer.vue'
import PanelDivider from './PanelDivider.vue'
import charPalette from '../assets/data/charPalette.json'
import { useCharSetStore } from "@/stores/charSet";
import { ref, type Ref } from "vue";

const settingStore = useSettingStore();
const charSetStore = useCharSetStore();

const charIndexList: Ref<Array<string>> = ref([]);

const initCharPalette = ():void => {
  for(let i=0; i < charPalette.length; i++){
    charSetStore.addCharPaletteIndex(i, charPalette[i].indexName);
    for(let j=0; j < charPalette[i].charList.length; j++){
      const width = 0;  //実測するように
      charSetStore.addCharPalette(i, j, charPalette[i].charList[j], width);
    }
    charIndexList.value.push(charPalette[i].indexName);
  }
}
initCharPalette();

const selectIndex = (index: number):void => {
  charSetStore.selectIndex(index);
}

</script>

<template>
  <div class="base">    
        <PanelContainer :order="0" :name="'charList'">
          <div class="charIndexList">
            <div v-for="(data, i) in charIndexList" class="tab">
                <span class="tab">
                    <span v-on:click="selectIndex(i)">{{ data }}</span>
                </span>
            </div>
          </div>
        </PanelContainer>
        <PanelDivider :order="0" :layout-name="'charList'"/>   
        <PanelContainer :order="1" :name="'charList'">
          <CharactorList/>
        </PanelContainer>
  </div>
</template>

<style scoped>

.base {
    display: flex;  
    flex-direction: row;
    max-width: none;
}
.charIndexList {
    display: flex;
  flex-direction: column;
}
</style>
