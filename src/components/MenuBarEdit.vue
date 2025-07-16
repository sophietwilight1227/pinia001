<script setup lang="ts">
import { useMainCanvasStore } from '@/stores/mainCanvas';
import ToggleButton from './ToggleButton.vue';
import { useCharSetStore } from '@/stores/charSet';

const charSetStore = useCharSetStore();
const mainCanvasStore = useMainCanvasStore();

const setRectSelectMode = (value: boolean):void => {
    mainCanvasStore.setRecSelectMode(value);
}

const addSpaceToEndOfLineToArrange = () => {
    const aa: Array<string> = mainCanvasStore.asciiArt.split("\n");
    const widthList: Array<number> = [];
    for(let i=0; i < aa.length; i++){
        widthList.push(charSetStore.calcStrWidth(aa[i]));
    }
    mainCanvasStore.addSpaceToLineEndToArrange(widthList);
}

</script>
<template>
    <div class="base">
        <div>矩形選択切り替え</div>
        <ToggleButton v-on:click="setRectSelectMode"/>    
        <div v-on:click="mainCanvasStore.addSpaceToEndOfLine">[空白追加]</div>    
        <div v-on:click="mainCanvasStore.deleteSpaceAtEnd">[行末空白削除]</div>    
        <div v-on:click="mainCanvasStore.deleteEmptyLine">[空行削除]</div>
        <div v-on:click="mainCanvasStore.addSpaceToLineHead">[行頭空白追加]</div>
        <div v-on:click="mainCanvasStore.deleteSpaceFromLineHead">[行頭空白削除]</div>
        <div v-on:click="addSpaceToEndOfLineToArrange">[行末を揃える]</div>
        <div v-on:click="mainCanvasStore.deleteLastCharFromAllLine">[行末から1文字削除]</div>
    </div>
</template>

<style scoped>
    .base {
        max-height: 100%;
        max-width: 100%;
        overflow: hidden;
        display: flex;
        align-items: flex-start;
    }
</style>