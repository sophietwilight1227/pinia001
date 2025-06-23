<script setup lang="ts">
import constLayout from "@/consts/constLayout";
import MenuBar from "./components/MenuBar.vue";
import FilesTab from "./components/FilesTab.vue";
import MainCanvas from './components/MainCanvas.vue'
import CharctorPalette from './components/CharactorPalette.vue'
import PictureView from './components/PictureView.vue'
import PanelContainer from './components/PanelContainer.vue'
import PanelDivider from './components/PanelDivider.vue'

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
            <PictureView/>
          </PanelContainer>
          <PanelDivider :order="1" :layout-name="'main'"/>
          <PanelContainer :order="2" :name="'main'">
            <MainCanvas/>
          </PanelContainer>
          <PanelDivider :order="2" :layout-name="'main'"/>
          <PanelContainer :order="3" :name="'main'">
            <CharctorPalette/> 
          </PanelContainer>        
      </div>
    </div>
  </main>
</template>

<style scoped>
  .main {
    height: 100vh;
  }
  .container {
    display: flex;
    max-width: none;
  }
</style>
