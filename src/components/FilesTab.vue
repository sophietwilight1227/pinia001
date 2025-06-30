<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { useMainCanvasStore } from "@/stores/mainCanvas";

const mainCanvasAsciiArtStore = useMainCanvasStore();
const fileNameList: Ref<Array<{name:string}>> = ref([]);
const aaNameList: Ref<Array<{name:string}>> = ref([]);

const selectFile = (index: number):void => {
    mainCanvasAsciiArtStore.selectFile(index);
}
const addFile = ():void => {
    mainCanvasAsciiArtStore.addFile("new file" , [{aaName: "aa1", asciiArt: ""}]);
}
const selectAa = (index: number):void => {
    mainCanvasAsciiArtStore.selectAa(index);
}
const addAa = ():void => {
    mainCanvasAsciiArtStore.addAa("new aa", "");
}
const deleteFile = (index: number):void => {
    fileNameList.value.splice(index, 1);
}

watch(
    () => mainCanvasAsciiArtStore.fileNameList,
    (newValue) => {
        const newList:Array<{name:string}> = [];
        for(let i=0; i < newValue.length; i++){
            newList.push({name: newValue[i]});
        }
        fileNameList.value = newList;
    }
)
watch(
    () => mainCanvasAsciiArtStore.aaNameList,
    (newValue) => {
        const newList:Array<{name:string}> = [];
        for(let i=0; i < newValue.length; i++){
            newList.push({name: newValue[i]});
        }
        aaNameList.value = newList;
    }
)

</script>

<template>
  <div class="base">    
    <div class="filelist">
        <div v-for="(data, i) in fileNameList" class="tab">
            <span class="tab">
                <span v-on:click="selectFile(i)">{{ data.name }}</span>
                <span class="button" v-on:click="deleteFile(i)"> _delete_ </span>
            </span>
        </div>
        <div class="button" v-on:click="addFile"> _add_ </div>        
    </div>
    <div class="filelist">
        <div v-for="(data, i) in aaNameList" class="tab">
            <span class="tab">
                <span v-on:click="selectAa(i)">{{ data.name }}</span>
                <span class="button" v-on:click="deleteFile(i)"> _delete_ </span>
            </span>
        </div>
        <div class="button" v-on:click="addAa"> _add_ </div>        
    </div>

  </div>
</template>

<style scoped>

.base {
    height: 100%;
    background-color: antiquewhite;
    display: flex;
    flex-direction: column;
}
.filelist {
    height: 50%;
}

.tab {
    background-color: aqua;
    align-content: flex-start;
}

.button{
    background-color: pink;
}
</style>
