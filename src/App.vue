<script setup lang="ts">
import constLayout from "@/consts/constLayout";
import MenuBar from "./components/MenuBar.vue";
import FilesTab from "./components/FilesTab.vue";
import MainCanvas from './components/MainCanvas.vue'
import CharctorPalette from './components/CharactorPalette.vue'
import PictureView from './components/PictureView.vue'
import PanelContainer from './components/PanelContainer.vue'
import PanelDivider from './components/PanelDivider.vue'
import EditablePreview from "./components/EditablePreview.vue";
import InfoBar from "./components/InfoBar.vue";

import { useLayoutStore } from "@/stores/layout";
  const layoutStore = useLayoutStore();
  layoutStore.initLayout();

</script>

<template>
  <main>
    <div class="main">
      <MenuBar/>
      <div class="container">
          <PanelContainer :order="0" :name="'main'">
            <FilesTab/>
          </PanelContainer>
          <PanelDivider :order="0" :layout-name="'main'"/>
          <PanelContainer :order="1" :name="'main'">
            <EditablePreview>
              <div>
                <MainCanvas/>
                <PictureView/>                
              </div>
            </EditablePreview>
          </PanelContainer>
          <PanelDivider :order="1" :layout-name="'main'"/>
          <PanelContainer :order="2" :name="'main'">
            <EditablePreview>
              <MainCanvas/>
            </EditablePreview>
          </PanelContainer>
          <PanelDivider :order="2" :layout-name="'main'"/>
          <PanelContainer :order="3" :name="'main'">
            <CharctorPalette/> 
          </PanelContainer>        
      </div>
      <InfoBar/>
    </div>
  </main>
</template>

<style scoped>
  .main {
    background-color: darkcyan;
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .container {
    display: flex;
    flex-direction: row;
    max-width: none;
    overflow: hidden;
    height: 100%;
    flex-grow: 1;
    align-items: stretch;
  }
</style>
