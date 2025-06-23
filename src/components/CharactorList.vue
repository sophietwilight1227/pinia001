<script setup lang="ts">
import { useCharSetStore } from '@/stores/charSet';
import { ref, watch, type Ref } from 'vue';

const charSetStore = useCharSetStore();

const charList: Ref<Array<{value:string, width: number, isMouseOver: string}>> = ref([])
watch(
    () => charSetStore.charList,
    (newValue) => {
        const newList:Array<{value:string, width: number, isMouseOver: string}> = [];
        for(let i=0; i < newValue.length; i++){
            newList.push({value: newValue[i].value, width: newValue[i].width, isMouseOver: "none"});
        }
        console.log("char list update")
        charList.value = newList;
    }
)

  const onMouseOver = (index: number):void => {
    charList.value[index].isMouseOver = "block";
  }
  const onMouseOut = (index: number):void => {
    charList.value[index].isMouseOver = "none";
  }
</script>

<template>
  <div class="base">    
    <span v-for="(data, i) in charList">
        <div class="charChip asciiArt" v-on:mouseover="onMouseOver(i)" v-on:mouseout="onMouseOut(i)" >
          <span>{{ data.value }}</span>
          <p class="baloon" :style="{display: data.isMouseOver}">tip</p>
        </div>
    </span>
  </div>
</template>

<style scoped>

.base {
  background-color: white;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.charChip {
    background-color: lightcoral;
    width: 30px;
}
.baloon {
    position: absolute;
    z-index: 100;
    background-color: white;
    filter: drop-shadow(0px 1px 4px #aaa);
}

.asciiArt {
  font-size:16px;
  font-style: normal;
  font-weight: 400;
  line-height:18px;
  letter-spacing: 0;
  text-shadow: none;
  font-family: 'Saitamaar', 'ＭＳ Ｐゴシック', 'MS PGothic', 'IPAMonaPGothic' !important;
  white-space: pre-wrap;
}

@font-face {
  font-family: 'Saitamaar';
  src: url('@/assets/fonts/Saitamaar.ttf') format('truetype');
}
</style>
