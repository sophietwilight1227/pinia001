<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout';
import { useMainCanvasStore } from '@/stores/mainCanvas';
import { nextTick, ref } from 'vue';
import GIF from 'gif.js';

const mainCanvasStore = useMainCanvasStore();
const layoutStore = useLayoutStore();
const canvasElem: any = ref(null);
const imageElem: any = ref(null);
const aElem: any = ref(null);

const render = () => {
    //canvas の大きさの設定から
    const ctx = canvasElem.value.getContext('2d');
    ctx.clearRect(0, 0, canvasElem.value.width, canvasElem.value.height);
    ctx.font = '16px Saitamaar';
    const lineHeight: number = 18;  //18px
    const textArray: Array<string> = mainCanvasStore.asciiArt.split("\n");
    for(let i = 0; i < textArray.length; i++){
        ctx.fillText(textArray[i], 10, 10 + i * lineHeight);
    }
    
    const dataURL = canvasElem.value.toDataURL('image/png');
    imageElem.value.src = dataURL;
    canvasElem.value.toBlob((blob: any) => {
        aElem.value.href = window.URL.createObjectURL(blob);
    })
}
const renderLogs = async () => {
    var gif = new GIF({
        workers: 2,
        quality: 10,
        width: 100,
        height: 100
    });

    //canvas の大きさの設定から
    const ctx = canvasElem.value.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, canvasElem.value.width, canvasElem.value.height);
    ctx.font = '16px Saitamaar';
    const lineHeight: number = 18;  //18px

    const aalist = mainCanvasStore.allData[mainCanvasStore.currentFileNamePosition].aaList;
    const current = mainCanvasStore.allData[mainCanvasStore.currentFileNamePosition].currentPosition;
    const editLogs = aalist[current].editLogs;
    for(let i=0; i < editLogs.length; i++){
        const aa = editLogs[i].value
        ctx.clearRect(0, 0, canvasElem.value.width, canvasElem.value.height);
        if(aa != null ){
            const textArray: Array<string> = aa.split("\n");
            
            ctx.fillStyle = 'white';
            for(let j = 0; j < textArray.length; j++){
                ctx.fillText(textArray[j], 10, 10 + j * lineHeight);
            }       
            const dataURL = canvasElem.value.toDataURL('image/png');
            const img = new Image();
            img.src = dataURL;
            await gif.addFrame(img ,{delay: 1}); 
        }
    }

    gif.on('finished', function(blob) {
        //window.open(URL.createObjectURL(blob));
        aElem.value.href = window.URL.createObjectURL(blob);
    });
    gif.render();
}

</script>
<template>
    <div>
        <button v-on:click="render">画像化</button>
        <button v-on:click="renderLogs">動画</button>
        <a ref="aElem">ダウンロード</a>
        <canvas class="canvas" ref="canvasElem"></canvas>
        <img src="" alt="canvas_image" ref="imageElem">        
    </div>

</template>

<style scoped>
    .canvas{
        display: none;
    }
</style>