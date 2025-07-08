<script setup lang="ts">
import {computed, nextTick, ref, watch, type Ref} from "vue";
import RangeSlider from "./RangeSlider.vue"
import constPictureView from "@/consts/constPictureView";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import MainCanvas from "./MainCanvas.vue";
import { usePictureViewStore } from "@/stores/pictureView";
import { useLayoutStore } from "@/stores/layout";

const rowIndex: Ref<string> = ref("1");
const rowIndexElem: any = ref(null);
const columnIndex: Ref<number> = ref(10);
const columnIndexElem: any = ref(null);
const viewElem: any = ref(null);
const viewScrollLeftValue: Ref<number> = ref(0);

const layoutStore = useLayoutStore();
layoutStore.$subscribe((mutation, state) => {
    canvasSize.value.height = state.canvasSize.height;
    canvasSize.value.width = state.canvasSize.width;
    let width: number = 1000;
    if(viewElem.value != null){
      if(viewElem.value.scrollWidth != null){
        width = viewElem.value.scrollWidth;
      }
    }
    columnIndex.value = (width - (width % 100)) / 100
})
const rowIndexWidth = ():number => {
    let width: number = 0;
    if(rowIndexElem.value != null){
      if(rowIndexElem.value.scrollWidth != null){
        width = rowIndexElem.value.scrollWidth;
      }
    }
    return width;
}
const viewScrollLeft = ():number => {
    let width: number = 0;
    if(viewElem.value != null){
      if(viewElem.value.scrollLeft != null){
        width = viewElem.value.scrollLeft;
      }
    }
    console.log(width, "scroll");
    return width;
}
const onScroll = (e:any): void => {
  viewScrollLeftValue.value = viewScrollLeft();
}

const mainCanvasStore = useMainCanvasStore();
mainCanvasStore.$subscribe((mutation, state) => {
  rowIndex.value = state.rowIndex;
})

const canvasSize: Ref<{height: string, width: string}> = ref({height: "100%", width: "100%"})

</script>

<template>
  <div class="base">
    <div class="row1 size_measure_frame2">
            <div v-for="i in columnIndex" 
                  class="asciiArt size_measure_node2 "
                  v-bind:style="{left: i * 100 + rowIndexWidth() - viewScrollLeftValue + 'px'}"
                  ref="columnIndexElem">{{i * 100}}</div>  
    </div>
    <div class="row2" ref="viewElem" v-on:scroll="onScroll">
      <div class="asciiArt rowIndex sticky_row" ref="rowIndexElem">{{ rowIndex }}</div>
      <div class="size_measure_frame">
            <div v-for="i in columnIndex" 
                  class="asciiArt size_measure_node"
                  v-bind:style="{left: i * 100 + 'px'}"
                  ref="columnIndexElem"></div>          
      </div>      
      <div>
          <slot></slot>     
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
  min-width: 30px;
  white-space: pre-wrap;
  font-size:16px;
  line-height:18px;
  overflow: hidden;
  z-index: 3100;
  border-right: 1px solid;
  height: v-bind(canvasSize.height);
}
.sticky_row {
  position: sticky;
  top: 0;
  left: 0;
}
.size_measure_frame {
  position: sticky;
  background-color: blue;
  top: 0;
}
.size_measure_node {
  position: absolute;
  height: max-content;
  min-height: 100vh;
  border-left: 1px solid;
}
.size_measure_frame2 {
  position: relative;
  color: white;
  background-color: blue;
  height: 20px;
  width: 100%;
  overflow: hidden;
}
.size_measure_node2 {
  position: absolute;
  height: 100%;
  border-left: 1px solid;
}
.asciiArt {
  white-space: pre;
  z-index: 10;
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
