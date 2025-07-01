<script setup lang="ts">
import {computed, reactive, ref, watch, type Ref} from "vue";
import RangeSlider from "./RangeSlider.vue"
import constPictureView from "@/consts/constPictureView";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import MainCanvas from "./MainCanvas.vue";
import { usePictureViewStore } from "@/stores/pictureView";
import { useLayoutStore } from "@/stores/layout";

const layoutStore = useLayoutStore();
  layoutStore.$subscribe((mutation, state) => {
    canvasSize.value.height = state.canvasSize.height;
    canvasSize.value.width = state.canvasSize.width;
  })
  const canvasSize: Ref<{height: string, width: string}> = ref({height: "100%", width: "100%"})

  
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
    <img :src="imgSource" class="mainImage"/>   
  </div>
</template>

<style scoped>

.base {     
  width: 100%;
  height: 100%;
  /*height: v-bind(canvasSize.height);*/
  background-color: v-bind(backgroundColor);
  overflow:hidden;
  position: absolute;
}

.mainImage {
  left: v-bind(cssParams.get(constPictureView.PARAM_LIST.POS_X.id));
  top: v-bind(cssParams.get(constPictureView.PARAM_LIST.POS_Y.id));
  background: url(v-bind(imgSource));
  position: absolute;
  z-index: 1;
  opacity: v-bind(cssParams.get(constPictureView.PARAM_LIST.ALPHA.id));
  rotate: v-bind(cssParams.get(constPictureView.PARAM_LIST.ROTE_ANGLE.id));
  transform: scale(v-bind(cssParams.get(constPictureView.PARAM_LIST.SIZE_RATE.id)));
}

</style>
