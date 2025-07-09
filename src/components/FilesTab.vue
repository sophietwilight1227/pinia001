<script setup lang="ts">
import FileTab from "./FileTab.vue";
import ButtonText from "./ButtonText.vue";
import { nextTick, reactive, ref, watch, type Ref } from "vue";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import DraggableListNode from "./DraggableListNode.vue";

const mainCanvasAsciiArtStore = useMainCanvasStore();
const fileNameList: Ref<Array<string>> = ref([]);
const aaNameList: Ref<Array<{name:string}>> = ref([]);
const fileNameRefs: any = ref(null);
const aaNameRefs: Ref<Array<typeof FileTab> | null> = ref(null);
const dragIndex: Ref<{start: number, end: number}> = ref({start: 0, end: 0});
const fileNameDragListRef: any = ref(null);
const aaNameDragListRef:any = ref(null);

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
const updateFileNameList = (newValue: Array<string>): void => {
    fileNameList.value.splice(0);
    for(let i=0; i < newValue.length; i++){
        fileNameList.value.push( newValue[i]);
        if(fileNameRefs.value != null && fileNameRefs.value[i] != null){
            fileNameRefs.value[i].change(newValue[i]);
        }
    }
}
const updateAaNameList = (newValue: Array<string>):void => {
    aaNameList.value.splice(0);
    for(let i=0; i < newValue.length; i++){
        aaNameList.value.push({name: newValue[i]});
        if(aaNameRefs.value != null && aaNameRefs.value[i] != null){
            aaNameRefs.value[i].change(newValue[i]);
        }
    }
}
mainCanvasAsciiArtStore.$subscribe((mutation, state) => {
    
    updateFileNameList(mainCanvasAsciiArtStore.fileNameList);
    updateAaNameList(mainCanvasAsciiArtStore.aaNameList);
    console.log(fileNameList)
})

const dragStart = (index: number, elemListRef: any ): void => {
  const height:string = elemListRef.value[index].getHeight();
  for(let i=0; i < index; i++){
    elemListRef.value[i].setDrag(true, height);
  }

  for(let i=index+1; i < elemListRef.value.length; i++){
    elemListRef.value[i].setDrag(true, "-" + height);
  }
  dragIndex.value.start = index;
  dragIndex.value.end = index;
}
const dragEnd = (elemListRef: any): void => {
  for(let i=0; i < elemListRef.value.length; i++){
    elemListRef.value[i].setDrag(false, "0px");
  }
  //charSetStore.moveCharPaletteIndex(dragIndex.value.start, dragIndex.value.end);
  //selectIndex(dragIndex.value.end);
}
const dragEnter = (index: number, elemListRef: any):void => {
  for(let i=0; i < elemListRef.value.length; i++){
    elemListRef.value[i].move(false);
  }
  let start: number = 0;
  let end: number = 0;
  if(index > dragIndex.value.start){
    start = dragIndex.value.start+1;
    end = index+1;
  }else{
    start = index;
    end = dragIndex.value.start+1;
  }
  for(let i=start; i < end; i++){
    elemListRef.value[i].move(true);
  }  
  dragIndex.value.end = index;
}
const onDragStartFileList = (index: number):void => {
    dragStart(index, fileNameDragListRef)
}
const onDragEndFileList = ():void => {
    dragEnd(fileNameDragListRef);
    mainCanvasAsciiArtStore.moveFile(dragIndex.value.start, dragIndex.value.end);
    selectFile(dragIndex.value.end);
}
const onDragEnterFileList = (index: number): void => {
    dragEnter(index, fileNameDragListRef);
}

const onDragStartAaList = (index: number):void => {
    dragStart(index, aaNameDragListRef)
}
const onDragEndAaList = ():void => {
    dragEnd(aaNameDragListRef);
    mainCanvasAsciiArtStore.moveAa(dragIndex.value.start, dragIndex.value.end);
    selectAa(dragIndex.value.end);
}
const onDragEnterAaList = (index: number): void => {
    dragEnter(index, aaNameDragListRef);
}
</script>

<template>
  <div class="base">    
    <div class="filelist">
        <div>ファイル</div>
        <div class="namelist">
            <div v-for="(data, i) in fileNameList">
                <DraggableListNode ref="fileNameDragListRef"
                                    v-on:dragstart="onDragStartFileList(i)"
                                    v-on:dragend="onDragEndFileList"
                                    v-on:dragenter="onDragEnterFileList(i)">
                    <FileTab :value="data"
                            v-on:click="selectFile(i)" 
                            v-on:change="renameFile"
                            ref="fileNameRefs"></FileTab>                        
                </DraggableListNode>
            </div>
        </div>
        <div class="buttonlist">
            <ButtonText :value="'+ 追加'" v-on:click="addFile"/>
            <ButtonText :value="'- 削除'" v-on:click="deleteFile"/>
        </div>      
    </div>
    <div class="filelist">
        <div>AA</div>
        <div class="namelist">
            <div v-for="(data, i) in aaNameList">
                <DraggableListNode ref="aaNameDragListRef"
                                    v-on:dragstart="onDragStartAaList(i)"
                                    v-on:dragend="onDragEndAaList"
                                    v-on:dragenter="onDragEnterAaList(i)">
                    <FileTab :value="data.name"
                            v-on:click="selectAa(i)"
                            v-on:change="renameAa" 
                            ref="aaNameRefs"/>                
                </DraggableListNode>

            </div>
        </div>

        <div class="buttonlist">
            <ButtonText :value="'+ 追加'" v-on:click="addAa"/>
            <ButtonText :value="'- 削除'" v-on:click="deleteAa"/>
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
