<script setup lang="ts">
import constLayout from "@/consts/constLayout";
import MenuBar from "@/components/MenuBar.vue";
import MenuBarBody from "@/components/MenuBarBody.vue";
import FilesTab from "@/components/FilesTab.vue";
import MainCanvas from '@/components/MainCanvas.vue'
import CharctorPalette from '@/components/CharactorPalette.vue'
import PictureView from '@/components/PictureView.vue'
import PanelContainer from '@/components/PanelContainer.vue'
import PanelDivider from '@/components/PanelDivider.vue'
import EditablePreview from "@/components/EditablePreview.vue";
import InfoBar from "@/components/InfoBar.vue";
import Dialog from "@/components/DialogConfirm.vue";

import { useLayoutStore } from "@/stores/layout";
import { onMounted, ref, type Ref } from "vue";
import { useColorStore } from "@/stores/color";
import { useDialogStore } from "@/stores/dialog";
import constLocalStorage from "@/consts/constLocalStorage";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import Loading from "./Loading.vue";
import { useLoadingStore } from "@/stores/loading";

  const mainCanvasAsciiArtStore = useMainCanvasStore();
  mainCanvasAsciiArtStore.initAsciiArt();

  const layoutStore = useLayoutStore();
  layoutStore.initLayout();

  const isLeftPictureView: Ref<boolean> = ref(false);

  layoutStore.$subscribe((mutation, state) => {
    isLeftPictureView.value = state.isLeftPictureView;
  })

  const colorStore = useColorStore();
  colorStore.initScheme();
  colorStore.init();

  const dialogStore = useDialogStore();
  const dialog = ref(null);

  const loadingElem:any = ref(null);
  const loadingStore = useLoadingStore();
  

  onMounted(() => {
    dialogStore.initStore(dialog.value);
    loadingStore.init(loadingElem.value);
  })


</script>

<template>
  <div>
    <div class="main">
      <MenuBarBody/>
      <div class="container">
          <PanelContainer :order="0" :name="'main'">
            <FilesTab/>
          </PanelContainer>
          <PanelDivider :order="0" :layout-name="'main'"/>
          <PanelContainer :order="1" :name="'main'">
            <EditablePreview v-if="!isLeftPictureView" :is-picture-view="false">
              <MainCanvas  :is-picture-view="false"/>
            </EditablePreview>
            <EditablePreview v-if="isLeftPictureView" :is-picture-view="true">
              <div class="container" >
                <PictureView/>             
                <MainCanvas :is-picture-view="true"/> 
              </div>
            </EditablePreview>
          </PanelContainer>
          <PanelDivider :order="1" :layout-name="'main'"/>
          <PanelContainer :order="2" :name="'main'">
            <EditablePreview v-if="isLeftPictureView" :is-picture-view="false">
              <MainCanvas :is-picture-view="false"/>
            </EditablePreview>
            <EditablePreview v-if="!isLeftPictureView" :is-picture-view="false">
              <div class="container">
                <PictureView/> 
                <MainCanvas :is-picture-view="true"/>      
              </div>
            </EditablePreview>
          </PanelContainer>
          <PanelDivider :order="2" :layout-name="'main'"/>
          <PanelContainer :order="3" :name="'main'">
            <CharctorPalette/> 
          </PanelContainer>        
      </div>
      <InfoBar/>
    </div>

    <Dialog ref="dialog"></Dialog>
    <Loading ref="loadingElem"></Loading>
</div>
</template>

<style scoped>
  .main {
    background-color: darkcyan;
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .container {
    display: flex;
    flex-direction: row;
    height: 100%;
    max-width: none;
    overflow: hidden;
    flex-grow: 1;
    align-items: stretch;
  }
</style>
