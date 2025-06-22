<script setup lang="ts">
import { ref } from 'vue';

  const testList = ref(["none"]);
  for(let i=0; i < 100; i++){
    testList.value.push("none");
  }
  const onMouseOver = (index: number):void => {
    testList.value[index] = "block";
  }
  const onMouseOut = (index: number):void => {
    testList.value[index] = "none";
  }
</script>

<template>
  <div class="base">    
    <span v-for="(data, i) in testList">
        <div class="charChip asciiArt" v-on:mouseover="onMouseOver(i)" v-on:mouseout="onMouseOut(i)" >
          <span>{{ i + "a" }}</span>
          <p class="baloon" :style="{display: data}">tip</p>
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
