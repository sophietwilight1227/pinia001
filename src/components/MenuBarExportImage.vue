<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout';
import { useMainCanvasStore } from '@/stores/mainCanvas';
import { nextTick, ref, type Ref } from 'vue';
import GIF from 'gif.js';

const mainCanvasStore = useMainCanvasStore();
const layoutStore = useLayoutStore();
const canvasElem: any = ref(null);
const imageElem: any = ref(null);
const aElem: any = ref(null);
const sizeRefElem: any = ref(null);
const sizeRefAA: Ref<string> = ref("");
const canvasHeight: Ref<string> = ref("0px");
const canvasWidth: Ref<string> = ref("0px");

const render = async () => {
    sizeRefElem.value.style.display = "inline-block";
    sizeRefAA.value = mainCanvasStore.asciiArt;
    await nextTick();
    canvasHeight.value = sizeRefElem.value.scrollHeight;
    canvasWidth.value = sizeRefElem.value.scrollWidth;
    canvasElem.value.height = sizeRefElem.value.scrollHeight;
    canvasElem.value.width = sizeRefElem.value.scrollWidth;
    imageElem.value.height = sizeRefElem.value.scrollHeight;
    imageElem.value.width = sizeRefElem.value.scrollWidth;

    const ctx = canvasElem.value.getContext('2d');
    ctx.clearRect(0, 0, canvasElem.value.width, canvasElem.value.height);
    ctx.font = '16px Saitamaar';
    const lineHeight: number = 18;  //18px
    const textArray: Array<string> = mainCanvasStore.asciiArt.split("\n");
    for(let i = 0; i < textArray.length; i++){
        ctx.fillText(textArray[i], 0 ,  (i + 0.5) * lineHeight);
    }
    
    const dataURL = canvasElem.value.toDataURL('image/png');
    imageElem.value.src = dataURL;
    canvasElem.value.toBlob((blob: any) => {
        aElem.value.href = window.URL.createObjectURL(blob);
        sizeRefElem.value.style.display = "none";
    })
}
</script>
<template>
    <div class="base">
        <div class="buttons">
            <button v-on:click="render">画像化</button>
            <a ref="aElem">ダウンロード</a>            
        </div>
        <div class="img">
            <canvas class="canvas" ref="canvasElem"></canvas>
            <img src="" alt="canvas_image" ref="imageElem">
            <div class="asciiArt ref" ref="sizeRefElem">{{ sizeRefAA }}</div>
        </div>
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
    .ref{
        display: none;
        color: transparent;
        background-color: transparent;
        height: fit-content;
        width: fit-content;
    }
    .canvas{
        display: none;
        background-color: white;
        height: v-bind(canvasHeight);
        width: v-bind(canvasWidth);
    }
    .img {
        max-height: 100%;
        max-width: 100%;
        background-color: white;
    }
    .buttons {
        display: flex;
        flex-direction: column;
    }
</style>