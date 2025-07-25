<script setup lang="ts">
import router from '@/router';
import { useMainCanvasStore } from '@/stores/mainCanvas';
import { computed, ref, type Ref } from 'vue';
import ButtonText from './ButtonText.vue';
import { useColorStore } from '@/stores/color';
import constColor from '@/consts/constColor';

const colorStore = useColorStore();

const previewRawAA: Ref<string> = ref("");
const fontColor: Ref<string> = ref("#000000");
const backgroundColor: Ref<string> = ref("#ffffff");
const magnification: Ref<number> = ref(100);

const previewAA = computed(():string => {
  let result = previewRawAA.value.replace(/\ +/g, '\ ');
  result = result.split(/\r\n\ +|\n\ +|\r\ +/g).join('\n');
  if(result.charAt(0) == " "){
    result = result.slice(1, result.length)
  }
  return result;
})

// 子が親からのメッセージを受信する場合
window.addEventListener("message", (event) => {
    if(typeof event.data == "string"){
      previewRawAA.value = event.data;
    }
})

const changeMagnification = (e: any) => {
  magnification.value = e.target.value;
}
const decrementMagnification = () => {
  magnification.value--;
}
const incrementMagnification = () => {
  magnification.value++;
}

</script>
<template>
  <div class="base">
    <div class="menu">
      <span>線色</span>
      <input type="color" v-model="fontColor"/>
      <span>背景色</span>
      <input type="color" v-model="backgroundColor"/>
      <span>表示倍率</span>
      <button v-on:click="decrementMagnification">◀</button>
      <input type="range" :min="0" :max="500" v-model="magnification" v-on:input="changeMagnification"/> 
      <button v-on:click="incrementMagnification">▶</button>
      <input v-model="magnification" v-on:change="changeMagnification"/>
    </div>
    <div class="asciiArt preview">{{ previewAA }}</div>    
  </div>

</template>
<style scoped>
.base {
  background-color: white;
}
  .menu {
    background-color: white;
    border-bottom: 1px solid black;
    align-items:center; 
  }
  .preview {
    color: v-bind(fontColor);
    background-color: v-bind(backgroundColor);
    transform: scale(v-bind(magnification / 100));
    transform-origin: 0 0;
  }

</style>