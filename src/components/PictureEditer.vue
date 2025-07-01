<script setup lang="ts">
import {computed, ref, type Ref} from "vue";
import RangeSlider from "./RangeSlider.vue"
import constPictureView from "@/consts/constPictureView";
import { usePictureViewStore } from "@/stores/pictureView";

  const pictureViewSrtore = usePictureViewStore();
  pictureViewSrtore.initParams();

  const lineRed = ref();
  const lineGreen = ref();
  const lineBlue = ref();

  //changeValue (子要素のメソッドの実行) で必要
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
  
  const changeSliderValue = (id: string, newValue: number):void => {
    console.log("catch: " + id + " / " + newValue);
    pictureViewSrtore.setValue(id, newValue);
  }

</script>

<template>
  <div class="base">
    <div class="menu">
      <div>
        <div>
          <span>線色</span>
          <input type="color"/>
        </div>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.LINE_RED" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.LINE_RED.id"/>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.LINE_GREEN" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.LINE_GREEN.id"/>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.LINE_BLUE" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.LINE_BLUE.id"/>
      </div>
      <div>
        <div>位置</div>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.POS_X" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.POS_X.id"/>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.POS_Y" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.POS_Y.id"/>

      </div>
      <div>
        <div>その他</div>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.SIZE_RATE" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.SIZE_RATE.id"/>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.ROTE_ANGLE" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.ROTE_ANGLE.id"/>
        <RangeSlider v-bind="constPictureView.PARAM_LIST.ALPHA" v-on:change="changeSliderValue" :ref="constPictureView.PARAM_LIST.ALPHA.id"/>        
      </div>
    </div>
  </div>
</template>

<style scoped>

.base {     
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

.asciiArt {
  white-space: pre-line;
}

</style>
