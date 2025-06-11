<script setup lang="ts">
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
    <div class="container">
      <PanelContainer :order="0">
        <PictureView/>
      </PanelContainer>
      <PanelDivider :order="0"></PanelDivider>
      <PanelContainer :order="1">
        <MainCanvas/>
      </PanelContainer>
      <PanelDivider :order="1"></PanelDivider>
      <PanelContainer :order="2">
        <CharctorPalette/> 
      </PanelContainer>
    </div>
  </main>
</template>

<style scoped>
  .container {
    height: 100vh;
    display: flex;
    max-width: none;
  }
</style>
