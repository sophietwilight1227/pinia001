<script setup lang="ts">
import {computed, ref, type Ref} from "vue";
import RangeSlider from "./RangeSlider.vue"
import constPictureView from "@/consts/constPictureView";
import { useMainCanvasStore } from "@/stores/mainCanvas";

  const mainCanvasAsciiArtStore = useMainCanvasStore();
  mainCanvasAsciiArtStore.$subscribe((mutation, state) => {
    asciiArt.value = state.asciiArt;
  })

  const asciiArt = ref();

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

  const params = new Map();
  Object.values(constPictureView.PARAM_LIST).forEach(value => {
    params.set(value.id, ref(value.initialValue));
  });

  const cssParams = computed(() => (id:string) => {
    switch(id){
      case constPictureView.PARAM_LIST.POS_X.id:
        return params.get(id).value + "px";
      case constPictureView.PARAM_LIST.POS_Y.id:
        return params.get(id).value + "px";
      case constPictureView.PARAM_LIST.SIZE_RATE.id:
        return params.get(id).value / 100;
      case constPictureView.PARAM_LIST.ROTE_ANGLE.id:
        return params.get(id).value + "deg";
      case constPictureView.PARAM_LIST.ALPHA.id:
        if(params.get(id).value < 0){
          backgroundColor.value = "black"
        }else{
          backgroundColor.value = "white"
        }
        return 1 - Math.abs(params.get(id).value / 100) ;
      default:
        return "";
    }
  });

  const backgroundColor = ref("white");
  const imgSource = ref("");

  const draw = ():void => {
    //img
    imgSource.value = 'https://ap1.sozaitamago.com/common/img/tamago/sample/image/Sisk0111.jpg';
  }
  
  const changeSliderValue = (id: string, newValue: number):void => {
    console.log("catch: " + id + " / " + newValue);
    params.get(id).value = newValue;
  }
  const testClick = ():void => {
    //componentRefs("lineRed").value.changeValue(100);
    draw();
  }

</script>

<template>
  <div class="base">
    <div v-for="n in 1">{{ params.get(constPictureView.PARAM_LIST.ROTE_ANGLE.id) }}</div>
    <div class="asciiArt">{{ asciiArt }}</div>
    <img :src="imgSource" class="mainImage"/>
    <div class="menu">
      <div>
        <div>
          <span>line color</span>
          <input type="color"/>
        </div>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.LINE_RED" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.LINE_RED.id"/>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.LINE_GREEN" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.LINE_GREEN.id"/>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.LINE_BLUE" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.LINE_BLUE.id"/>
      </div>
      <div>
        <button v-on:click="testClick">input</button>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.POS_X" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.POS_X.id"/>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.POS_Y" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.POS_Y.id"/>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.SIZE_RATE" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.SIZE_RATE.id"/>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.ROTE_ANGLE" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.ROTE_ANGLE.id"/>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.ALPHA" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.ALPHA.id"/>
      </div>
      
    </div>
  </div>
</template>

<style scoped>

.base {     
  height: 100vh;
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
  z-index: 1;
  opacity: v-bind(cssParams(constPictureView.PARAM_LIST.ALPHA.id));
  object-position: v-bind(cssParams(constPictureView.PARAM_LIST.POS_X.id)) v-bind(cssParams(constPictureView.PARAM_LIST.POS_Y.id));
  rotate: v-bind(cssParams(constPictureView.PARAM_LIST.ROTE_ANGLE.id));
  transform: scale(v-bind(cssParams(constPictureView.PARAM_LIST.SIZE_RATE.id)));
}

.asciiArt {
  white-space: pre-line;
}

</style>
