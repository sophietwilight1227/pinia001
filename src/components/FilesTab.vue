<script setup lang="ts">
import FileTab from "./FileTab.vue";
import { reactive, ref, watch, type Ref } from "vue";
import { useMainCanvasStore } from "@/stores/mainCanvas";

const mainCanvasAsciiArtStore = useMainCanvasStore();
const fileNameList: Array<{name:string}> = reactive([]);
const aaNameList: Ref<Array<{name:string}>> = ref([]);
const fileNameRefs: Ref<Array<typeof FileTab> | null> = ref(null);
const aaNameRefs: Ref<Array<typeof FileTab> | null> = ref(null);

const selectFile = (index: number):void => {
    if(fileNameRefs.value != null){
        for(let i=0; i < fileNameRefs.value.length; i++){
            fileNameRefs.value[i].select(false);
        }
        fileNameRefs.value[index].select(true);
    }
    mainCanvasAsciiArtStore.selectFile(index);
}
const renameFile = (newName: string):void => {
    mainCanvasAsciiArtStore.renameFile(newName);
}
const addFile = ():void => {
    mainCanvasAsciiArtStore.addFile("new file" , [{aaName: "aa1", asciiArt: ""}]);
}
const deleteFile = ():void => {
    mainCanvasAsciiArtStore.deleteFile();
}
const selectAa = (index: number):void => {
    if(aaNameRefs.value != null){
        for(let i=0; i < aaNameRefs.value.length; i++){
            aaNameRefs.value[i].select(false);
        }
        aaNameRefs.value[index].select(true);
    }
    mainCanvasAsciiArtStore.selectAa(index);
}
const addAa = ():void => {
    mainCanvasAsciiArtStore.addAa("new aa", "");
}
const deleteAa = ():void => {
    mainCanvasAsciiArtStore.deleteAa();
}
const renameAa = (newName: string):void => {
    mainCanvasAsciiArtStore.renameAa(newName);
}

watch(
    () => mainCanvasAsciiArtStore.fileNameList,
    (newValue) => {
        fileNameList.splice(0);
        for(let i=0; i < newValue.length; i++){
            fileNameList.push({name: newValue[i]});
        }
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
        <div>ファイル</div>
        <div class="namelist">
            <div v-for="(data, i) in fileNameList">
                <FileTab :value="data.name"
                         v-on:click="selectFile(i)" 
                         v-on:change="renameFile"
                         ref="fileNameRefs">{{ data.name }}</FileTab>
            </div>
        </div>
        <div class="buttonlist">
            <div class="button" v-on:click="addFile">[add]</div>
            <div class="button" v-on:click="deleteFile">[delete]</div>
        </div>      
    </div>
    <div class="filelist">
        <div>AA</div>
        <div class="namelist">
            <div v-for="(data, i) in aaNameList">
                <FileTab :value="data.name"
                         v-on:click="selectAa(i)"
                         v-on:change="renameAa" 
                         ref="aaNameRefs"/>
            </div>
        </div>

        <div class="buttonlist">
            <div class="button" v-on:click="addAa">[add]</div>
            <div class="button" v-on:click="deleteAa">[delete]</div>
        </div>          
    </div>

  </div>
</template>

<style scoped>

.base {
    height: 100%;
    background-color:lightgray;
    display: flex;
    flex-direction: column;
    padding: 5%;
}
.filelist {
    background-color: white;
    height: 50%;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 5% auto;
}
.namelist {
    width: 100%;
    height: 100%;
    background-color: aquamarine;
    overflow: scroll;
}

.buttonlist {
    display: flex;
    flex-direction: row;
}
.button{
    background-color: pink;
    user-select: none;
}
</style>
