<script setup lang="ts">
import {computed, ref, watch, type Ref} from "vue";
import RangeSlider from "./RangeSlider.vue"
import constPictureView from "@/consts/constPictureView";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import MainCanvas from "./MainCanvas.vue";
import { usePictureViewStore } from "@/stores/pictureView";
import { useLayoutStore } from "@/stores/layout";

const rowIndex: Ref<string> = ref("1");

const layoutStore = useLayoutStore();
layoutStore.$subscribe((mutation, state) => {
    canvasSize.value.height = state.canvasSize.height;
    canvasSize.value.width = state.canvasSize.width;
})

const mainCanvasStore = useMainCanvasStore();
mainCanvasStore.$subscribe((mutation, state) => {
  rowIndex.value = state.rowIndex;
})

const canvasSize: Ref<{height: string, width: string}> = ref({height: "100%", width: "100%"})

</script>

<template>
  <div class="base">
    <div class="row1">
      <div class="asciiArt">{{"　　" }}</div>
      <div  class="asciiArt">size measure</div>
      
    </div>
    <div class="row2">
      <div class="asciiArt rowIndex sticky_row">{{ rowIndex }}</div>
      <div class="view">
        <slot ></slot>     
      </div>
    </div>  
  </div>

</template>

<style scoped>
.base {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.row1 {
  display: flex;
  width: 100%;
  flex-direction: row;
  overflow-y: scroll;
}
.row2 {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  overflow: auto;
  position: relative;
}
.rowIndex {
  position: sticky;
  background-color: white;
  text-align: right;
  width: 30px;
  white-space: pre-wrap;
  font-size:16px;
  line-height:18px;
  overflow: hidden;
  z-index: 100;
  height: v-bind(canvasSize.height);
}
.sticky_row {
  position: sticky;
  top: 0;
  left: 0;
}
.view {
  top: 0px;
  min-height: 100%;
  overflow: hidden;
  height: v-bind(canvasSize.height);
  width: v-bind(canvasSize.width) - 30px;
}`
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

@font-face {
  font-family: 'Saitamaar';
  src: url('@/assets/fonts/Saitamaar.ttf') format('truetype');
}
</style>
