<script setup lang="ts">
import {computed, nextTick, onMounted, ref, type HTMLAttributes, type Ref} from "vue";
import RangeSlider from "./RangeSlider.vue"
import constPictureView from "@/consts/constPictureView";
import { usePictureViewStore } from "@/stores/pictureView";
import { useColorStore } from "@/stores/color";
import constColor from "@/consts/constColor";
import constLocalStorage from "@/consts/constLocalStorage";

  const colorStore = useColorStore();
  const pictureViewSrtore = usePictureViewStore();
  pictureViewSrtore.initParams();

  pictureViewSrtore.$subscribe((mutation, state) => {
    updateValues();
  })
  const updateValues = () => {
    const r: number = pictureViewSrtore.getValue(constPictureView.PARAM_LIST.LINE_RED.id);
    const g: number = pictureViewSrtore.getValue(constPictureView.PARAM_LIST.LINE_GREEN.id);
    const b: number = pictureViewSrtore.getValue(constPictureView.PARAM_LIST.LINE_BLUE.id);
    fontColor.value = rgbToHex(r, g, b);

    Object.values(constPictureView.PARAM_LIST).forEach(value => {
      if(componentRefs(value.id)!.value != null){
        componentRefs(value.id)!.value.changeValue(pictureViewSrtore.getValue(value.id));
      }
    });  
  }

  const lineRed = ref();
  const lineGreen = ref();
  const lineBlue = ref();
  const posX = ref();
  const posY = ref();
  const sizeRate = ref();
  const roteAngle = ref();
  const alpha = ref();

  //changeValue (子要素のメソッドの実行) で必要
  const componentRefs = (id: string):Ref | null => {
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
      case constPictureView.PARAM_LIST.POS_X.id:
        return posX;
        break;
      case constPictureView.PARAM_LIST.POS_Y.id:
        return posY;
        break;
      case constPictureView.PARAM_LIST.SIZE_RATE.id:
        return sizeRate;
        break;
      case constPictureView.PARAM_LIST.ROTE_ANGLE.id:
        return roteAngle;
        break;
      case constPictureView.PARAM_LIST.ALPHA.id:
        return alpha;
        break;
      default:
        return null;
    }
  }

  const params = new Map();
  const init = () => {
    Object.values(constPictureView.PARAM_LIST).forEach(value => {
      //const savedValue = localStorage.getItem(constLocalStorage.PREFIX + value.id);
      //const savedValue: number = pictureViewSrtore.getValue(value.id);
      //if(savedValue == null){
      //  params.set(value.id, ref(value.initialValue));
      //}else{
      //  params.set(value.id, savedValue);
      //  if(componentRefs(value.id)!.value != null){
      //    componentRefs(value.id)!.value.changeValue(savedValue);
      //  }
      //}
      params.set(value.id, ref(value.initialValue));
      //console.log("saved value", savedValue);
    });    
  }


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
    pictureViewSrtore.setValue(id, newValue);
  }

  const changeFontColor = (e: any) => {
    if(e != null && e.target != null){
      const hexValue = e.target.value.replace('#', '');
      const isOmit = hexValue.length === 3; // #fffなどの省略記法か
      console.log(e.target.value)

      const [r, g, b] = hexValue
        .match(isOmit ? /./g : /.{2}/g)
        .map((s: string) => parseInt(isOmit ? s.repeat(2) : s, 16));     
      
      pictureViewSrtore.setValue(constPictureView.PARAM_LIST.LINE_RED.id, r);
      pictureViewSrtore.setValue(constPictureView.PARAM_LIST.LINE_GREEN.id, g);
      pictureViewSrtore.setValue(constPictureView.PARAM_LIST.LINE_BLUE.id, b);
      componentRefs(constPictureView.PARAM_LIST.LINE_RED.id)!.value.changeValue(r);
      componentRefs(constPictureView.PARAM_LIST.LINE_GREEN.id)!.value.changeValue(g);
      componentRefs(constPictureView.PARAM_LIST.LINE_BLUE.id)!.value.changeValue(b);
    }
  }

  const to16 = (num:number): string => {
    return Number(num).toString(16).padStart(2, '0');
  }

  const  rgbToHex = (r: number, g: number, b: number ): string => {
    return `#${to16(r)}${to16(g)}${to16(b)}`;
  }

  const fontColor: Ref<string> = ref("#000000");


    onMounted(() => {
      
      init();
      updateValues();
    })
</script>

<template>
  <div class="base">
    <div class="menu">
      <div>
        <div>
          <span>線色</span>
          <input type="color" v-on:input="changeFontColor" :value="fontColor"/>
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
}
.menu {
  z-index: 10;
  display: flex;
  flex-direction: row;   
  color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
  background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
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
