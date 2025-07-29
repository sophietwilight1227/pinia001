<script setup lang="ts">
import { useMainCanvasStore } from '@/stores/mainCanvas';
import ToggleButton from './ToggleButton.vue';
import { nextTick, ref, type Ref } from 'vue';
import GIF from 'gif.js';
import IconBase from '@/assets/icons/icon_base.vue';
import IconDownload from '@/assets/icons/icon_download.vue';
import IconProjector from '@/assets/icons/icon_projector.vue';
import ButtonWithIcon from './ButtonWithIcon.vue';
import { useDialogStore } from '@/stores/dialog';
import ProgressBar from './ProgressBar.vue';
import DialogSelect from './DialogSelect.vue';
import Loading from './Loading.vue';
import ButtonText from './ButtonText.vue';
import { useLoadingStore } from '@/stores/loading';
import LabelText from './LabelText.vue';


const dialogStore = useDialogStore();
const mainCanvasStore = useMainCanvasStore();
const sizeRefAA: Ref<string> = ref("");
const canvasElem: any = ref(null);
const aElem: any = ref(null);
const sizeRefElem: any = ref(null);
const imageElem: any = ref(null);
const canvasWidth: Ref<number> = ref(0);
const canvasHeight: Ref<number> = ref(0);
const loadingStore = useLoadingStore();
const fontColor: Ref<string> = ref("#000000");
const backgroundColor: Ref<string> = ref("#ffffff");
const isTransparent: Ref<boolean> = ref(false);

const setMovieMode = (value: boolean):void => {
    mainCanvasStore.setMovieMode(value);
}
const incrementMovie = (): void => {
    mainCanvasStore.setMovieIndex(mainCanvasStore.currentMoviePosition + 1);
}
const decrementMovie = (): void => {
    mainCanvasStore.setMovieIndex(mainCanvasStore.currentMoviePosition - 1);
}
const getMovieMaxIndex = ():number => {
    const currentFile = mainCanvasStore.allData[mainCanvasStore.currentFileNamePosition];
    if(currentFile != null){
        const currentAaPosition: number = currentFile.currentPosition;
        return mainCanvasStore.allData[mainCanvasStore.currentFileNamePosition].aaList[currentAaPosition].editLogs.length;
    }else{
        return 0;
    }
}   
const onChangeMovieIndexRange = (e: any) => {
    mainCanvasStore.setMovieIndex(e.target.value);
}
const resizeImage = async () => {
    const aalist = mainCanvasStore.allData[mainCanvasStore.currentFileNamePosition].aaList;
    const current = mainCanvasStore.allData[mainCanvasStore.currentFileNamePosition].currentPosition;
    const editLogs = aalist[current].editLogs;

    let height: number = 0;
    let width: number = 0;

    for(let i=0; i < editLogs.length; i++){
        const aa = editLogs[i].value;
        if(aa != null){
            sizeRefAA.value = aa;
            await nextTick();    
            height = Math.max(height, sizeRefElem.value.scrollHeight);
            width = Math.max(width, sizeRefElem.value.scrollWidth);
        }
    }

    canvasHeight.value = height;
    canvasWidth.value = width;
    await nextTick();
}
const startRender_ = () => {
    const worker = new Worker(new URL('@/scripts/exportMovie.mjs', import.meta.url));
    console.log("test1");
    const obj1 = mainCanvasStore.allData[mainCanvasStore.currentFileNamePosition];
    const obj2 = canvasElem.value;
    const obj3 = sizeRefElem.value ;
    worker.postMessage({ currentData: JSON.parse(JSON.stringify(obj1)),
                         canvasElem: JSON.parse(JSON.stringify(obj2)), 
                         sizeRefElem: JSON.parse(JSON.stringify(obj3))});
    console.log("test2");
    worker.onmessage = (e) => {
        //aElem.value.href = window.URL.createObjectURL(e.data);
        //sizeRefElem.value.style.display = "none";

        //dialogStore.info("ダウンロードボタンのリンク先から保存してください")
        dialogStore.info(e.data);
    };
}

const renderLogs = async () => {

    loadingStore.show("動画作成中 (数分かかります)");

    const aalist = mainCanvasStore.allData[mainCanvasStore.currentFileNamePosition].aaList;
    const current = mainCanvasStore.allData[mainCanvasStore.currentFileNamePosition].currentPosition;
    const editLogs = aalist[current].editLogs;

    resizeImage();

    const ctx = canvasElem.value.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, canvasElem.value.width, canvasElem.value.height);
    ctx.font = '16px Saitamaar';
    ctx.letterSpacing = 0;
    const lineHeight: number = 18;  //18px

    sizeRefElem.value.style.display = "inline-block";
    for(let i=0; i < editLogs.length; i++){
        const aa = editLogs[i].value;
        if(aa != null){
            ctx.font = '16px Saitamaar';
            ctx.letterSpacing = 0;
            sizeRefAA.value = aa
            await nextTick();
            canvasHeight.value = Math.max(canvasHeight.value, sizeRefElem.value.scrollHeight)
            canvasWidth.value = Math.max(canvasWidth.value, sizeRefElem.value.scrollWidth)
        }
    }
    canvasElem.value.height = canvasHeight.value;
    canvasElem.value.width = canvasWidth.value;  

    var gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvasWidth.value,
        height: canvasHeight.value,
    });

    for(let i=0; i < editLogs.length; i++){
        const aa = editLogs[i].value
        ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
        ctx.font = '16px Saitamaar';
        ctx.letterSpacing = 0;
        if(aa != null ){
            const textArray: Array<string> = aa.split("\n");
            
            if(isTransparent.value){
                ctx.fillStyle = "transparent";
            }else{
                ctx.fillStyle = backgroundColor.value;
            }
            
            ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
            ctx.fillStyle = fontColor.value;
            for(let j = 0; j < textArray.length; j++){
                ctx.fillText(textArray[j], 0,  (j + 0.5) * lineHeight);
            }       
            const dataURL = canvasElem.value.toDataURL('image/png');
            const img = new Image();
            img.height = canvasHeight.value;
            img.width = canvasWidth.value; 
            img.src = dataURL;
            console.log(img.height, img.width);
            await gif.addFrame(img ,{delay: 1}); 
        }
    }

    gif.on('finished', function(blob) {
        //window.open(URL.createObjectURL(blob));
        aElem.value.href = window.URL.createObjectURL(blob);
        sizeRefElem.value.style.display = "none";

        loadingStore.hide();
        dialogStore.info("ダウンロードボタンのリンク先から保存してください")
    });
    gif.render();
}
const download = () => {
    window.open(aElem.value.href, '_blank');
}
</script>

<template>
    <div>
        <LabelText :value="'動画モード'"/>
        <ToggleButton v-on:click="setMovieMode"/>        
        <div v-show="mainCanvasStore.isMovieMode" class="buttons">
            <button v-on:click="decrementMovie">＜</button>
            <span>{{ mainCanvasStore.currentMoviePosition }}</span>
            <button v-on:click="incrementMovie">＞</button>
            <input type="range" 
                :min="0" 
                :max="getMovieMaxIndex()" 
                v-on:input="onChangeMovieIndexRange"
                v-model="mainCanvasStore.currentMoviePosition"/> 
            <div class="buttons">
                <ButtonWithIcon :value="'動画化'" v-on:click="renderLogs">
                    <IconBase >
                        <IconProjector/>
                    </IconBase>                    
                </ButtonWithIcon>
                <ButtonWithIcon :value="'ダウンロード'" v-on:click="download">
                    <IconBase>
                        <IconDownload/>
                    </IconBase>
                </ButtonWithIcon>
                <a ref="aElem"></a>
            </div>     
            <div>
                <div class="row">
                    <label for="fontColor">
                        <input type="color" id="backgroundColor" v-model="fontColor">   
                        <LabelText :value="'文字色'"/>
                    </label>  
                </div>
                <div class="row">
                    <label for="backgroundColor">
                        <input type="color" id="fontColor" v-model="backgroundColor">  
                        <LabelText :value="'背景色'"/>
                    </label>
                    <label for="transparent">
                        <input type="checkbox" id="transparent" v-model="isTransparent">
                        <LabelText :value="'透明色'"/>
                    </label>
                </div>
            </div>           
        </div>    

        <div class="img">
            <canvas class="canvas" ref="canvasElem"></canvas>
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
        overflow: scroll;
    }
    .buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .row {
        display: flex;
        flex-direction: row;
        align-items:center; 
    }
</style>