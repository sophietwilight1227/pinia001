<script setup lang="ts">
import { useMainCanvasStore } from '@/stores/mainCanvas';
import ToggleButton from './ToggleButton.vue';


const mainCanvasStore = useMainCanvasStore();

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

</script>

<template>
    <div>
        <div>動画モード</div>
        <ToggleButton v-on:click="setMovieMode"/>        
        <div v-show="mainCanvasStore.isMovieMode">
            <button v-on:click="decrementMovie">＜</button>
            <span>{{ mainCanvasStore.currentMoviePosition }}</span>
            <button v-on:click="incrementMovie">＞</button>
            <input type="range" 
                :min="0" 
                :max="getMovieMaxIndex()" 
                v-on:input="onChangeMovieIndexRange"
                v-model="mainCanvasStore.currentMoviePosition"/> 
        </div>    
    </div>
</template>

<style scoped>

</style>