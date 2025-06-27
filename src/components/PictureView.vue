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
    <MainCanvas/>
    <div class="imageFlame">
      <img :src="imgSource" class="mainImage"/>   
    </div>
  </div>
</template>

<style scoped>

.base {     
  height: v-bind(canvasSize.height);
  width: v-bind(canvasSize.width);
  /*background-color: rgb(255, 214, 227);*/
  background-color: v-bind(backgroundColor);
  overflow:hidden;
  position: relative;
  background-color: darkgreen;
}

.imageFlame {
  height: 200vh;
  width: 100%;
  overflow:hidden;
  background-color: brown;
  height: v-bind(canvasSize.height);
  width: v-bind(canvasSize.width);
}

.mainImage {
  left:0px;
  top:0px;
  background: url(v-bind(imgSource));
  position: absolute;
  z-index: 1;
  opacity: v-bind(cssParams.get(constPictureView.PARAM_LIST.ALPHA.id));
  object-position: v-bind(cssParams.get(constPictureView.PARAM_LIST.POS_X.id)) v-bind(cssParams.get(constPictureView.PARAM_LIST.POS_Y.id));
  rotate: v-bind(cssParams.get(constPictureView.PARAM_LIST.ROTE_ANGLE.id));
  transform: scale(v-bind(cssParams.get(constPictureView.PARAM_LIST.SIZE_RATE.id)));
}

.asciiArt {
  position: absolute;
  background-color: transparent;
  z-index: 10;
  overflow: hidden;
  width: 100%;
}

</style>
