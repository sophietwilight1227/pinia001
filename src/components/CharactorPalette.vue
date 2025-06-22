<script setup lang="ts">
import { useSettingStore } from "@/stores/settings";
import CharactorList from './CharactorList.vue';
import PanelContainer from './PanelContainer.vue'
import PanelDivider from './PanelDivider.vue'
const settingStore = useSettingStore();

</script>

<template>
  <div class="base">    
        <PanelContainer :order="0" :name="'charList'">
          <span>aaaaaaaaaaaa</span>
        </PanelContainer>
        <PanelDivider :order="0" :layout-name="'charList'"/>   
        <PanelContainer :order="1" :name="'charList'">
          <CharactorList/>
        </PanelContainer>
  </div>
</template>

<style scoped>

.base {
    height: 100vh;
    display: flex;  
    flex-direction: row;
    max-width: none;
}

</style>
