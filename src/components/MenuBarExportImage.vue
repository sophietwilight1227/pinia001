<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout';
import { useMainCanvasStore } from '@/stores/mainCanvas';
import { nextTick, ref, type Ref } from 'vue';
import GIF from 'gif.js';
import ButtonWithIcon from './ButtonWithIcon.vue';
import IconBase from '@/assets/icons/icon_base.vue';
import IconCamera from '@/assets/icons/icon_camera.vue';
import IconDownload from '@/assets/icons/icon_download.vue';
import IconImage from '@/assets/icons/icon_image.vue';


const mainCanvasStore = useMainCanvasStore();
const layoutStore = useLayoutStore();
const canvasElem: any = ref(null);
const imageElem: any = ref(null);
const aElem: any = ref(null);
const sizeRefElem: any = ref(null);
const sizeRefAA: Ref<string> = ref("");
const canvasHeight: Ref<string> = ref("0px");
const canvasWidth: Ref<string> = ref("0px");
const previewSource: Ref<string> = ref("");

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
        ctx.fillText(textArray[i], 0 ,  (i + 1) * lineHeight);
    }
    
    const dataURL = canvasElem.value.toDataURL('image/png');
    //imageElem.value.src = dataURL;
    //previewSource.value = dataURL;
    canvasElem.value.toBlob((blob: any) => {
        if(blob != null){
            previewSource.value = dataURL;
            aElem.value.href = window.URL.createObjectURL(blob);
        }
        sizeRefElem.value.style.display = "none";
    })
}
const download = () => {
    //aElem.value.click();
    window.open(aElem.value.href, '_blank');
}

</script>
<template>
    <div class="base">
        <ButtonWithIcon :value="'画像化'" v-on:click="render">
            <IconBase>
                <IconCamera/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'ダウンロード'" v-on:click="download">
            <IconBase>
                <IconDownload/>
            </IconBase>
        </ButtonWithIcon>
        <a ref="aElem"></a>            
        <div class="img">
            <canvas class="canvas" ref="canvasElem"></canvas>
            <ButtonWithIcon :value="'プレビュー'" v-show="previewSource == ''">
                <IconBase>
                    <IconImage/>
                </IconBase>
            </ButtonWithIcon>
            <div v-show="previewSource != ''">
                <div>プレビュー</div>
                <img v-bind:src="previewSource" alt="canvas_image" ref="imageElem">
            </div>
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
</style>