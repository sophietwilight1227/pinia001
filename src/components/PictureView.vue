<script setup lang="ts">
import {computed, ref, watch, type Ref} from "vue";
import RangeSlider from "./RangeSlider.vue"
import constPictureView from "@/consts/constPictureView";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import MainCanvas from "./MainCanvas.vue";
import { usePictureViewStore } from "@/stores/pictureView";

  const pictureViewSrtore = usePictureViewStore();

  const lineRed = ref();
  const lineGreen = ref();
  const lineBlue = ref();

  //changeValue で必要
  const componentRefs = (id: string):Ref => {
    switch(id){
      case constPictureView.PARAM_LIST.LINE_RED.id:
        return lineRed;
        break;
      case constPictureView.PARAM_LIST.LINE_BLUE.id:
        return lineBlue;
        break;
      case constPictureView.PARAM_LIST.LINE_GREEN.id:
        return lineGreen;
        break;
      default:
        return ref();
    }
  }

  const cssParams: Ref<Map<string, string>> = ref(new Map());
    pictureViewSrtore.$subscribe((mutation, state) => {
      Object.values(constPictureView.PARAM_LIST).forEach(value => {
        cssParams.value.set(value.id, pictureViewSrtore.getCssValue(value.id));
      });
      backgroundColor.value = state.backgroundColor;

      if(imgSource.value != state.imageUrl){
        imgSource.value = state.imageUrl;
      }
  })


  const backgroundColor = ref("white");
  const imgSource = ref("");

</script>

<template>
  <div class="base">
    <MainCanvas class="asciiArt"/>
    <img :src="imgSource" class="mainImage"/>
  </div>
</template>

<style scoped>

.base {     
  height: 100vh;
  width: 100%;
  /*background-color: rgb(255, 214, 227);*/
  background-color: v-bind(backgroundColor);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-x: scroll;
  overflow-y: scroll;
}
.menu {
  z-index: 10;
  background-color: aliceblue;
  display: flex;
  flex-direction: row;   
}
.menu_content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.mainImage {
  position: absolute;
  z-index: 0;
  opacity: v-bind(cssParams.get(constPictureView.PARAM_LIST.ALPHA.id));
  object-position: v-bind(cssParams.get(constPictureView.PARAM_LIST.POS_X.id)) v-bind(cssParams.get(constPictureView.PARAM_LIST.POS_Y.id));
  rotate: v-bind(cssParams.get(constPictureView.PARAM_LIST.ROTE_ANGLE.id));
  transform: scale(v-bind(cssParams.get(constPictureView.PARAM_LIST.SIZE_RATE.id)));
}

.asciiArt {
  position: absolute;
  z-index: 10;
  background-color: transparent;
}

</style>
