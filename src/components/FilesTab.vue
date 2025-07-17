<script setup lang="ts">
import FileTab from "./FileTab.vue";
import ButtonText from "./ButtonText.vue";
import { nextTick, reactive, ref, watch, type Ref } from "vue";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import DraggableListNode from "./DraggableListNode.vue";
import { useColorStore } from "@/stores/color";
import constColor from "@/consts/constColor";
import { useDialogStore } from "@/stores/dialog";

const dialogStore = useDialogStore();

const mainCanvasAsciiArtStore = useMainCanvasStore();
const colorStore = useColorStore();
const fileNameList: Ref<Array<string>> = ref([]);
const aaNameList: Ref<Array<{name:string}>> = ref([]);
const fileNameRefs: any = ref(null);
const aaNameRefs: Ref<Array<typeof FileTab> | null> = ref(null);
const dragIndex: Ref<{start: number, end: number}> = ref({start: 0, end: 0});
const fileNameDragListRef: any = ref(null);
const aaNameDragListRef:any = ref(null);
const aaPreview: any = ref(null);
const aaPreviewPosition: Ref<{top: string, left: string}> = ref({top: "0px", left: "0px"});
const isVisiblePreview: Ref<boolean> = ref(false);
const aaPreviewText: Ref<string> = ref("");

const selectFile = async (index: number) => {
    if(fileNameRefs.value != null){
        for(let i=0; i < fileNameRefs.value.length; i++){
            fileNameRefs.value[i].select(false);
        }
        fileNameRefs.value[index].select(true);
    }
    mainCanvasAsciiArtStore.selectFile(index);
    await nextTick();
    selectAa(mainCanvasAsciiArtStore.allData[mainCanvasAsciiArtStore.currentFileNamePosition].currentPosition);
}
const renameFile = (newName: string):void => {
    mainCanvasAsciiArtStore.renameFile(newName);
}
const addFile = ():void => {
    mainCanvasAsciiArtStore.addFile("new file" , [{aaName: "aa1", asciiArt: "", editLogs: []}]);
}
const deleteFile = async () => {
    if(await dialogStore.alert("選択中のファイルを削除しますか？")){
        mainCanvasAsciiArtStore.deleteFile();
        await dialogStore.info("削除しました");
    }    
}
const selectAa = (index: number):void => {
    if(aaNameRefs.value != null){
        for(let i=0; i < aaNameRefs.value.length; i++){
            aaNameRefs.value[i].select(false);
        }
        aaNameRefs.value[index].select(true);
    }
    console.log(index, "select aa");
    mainCanvasAsciiArtStore.selectAa(index);
}
const addAa = ():void => {
    mainCanvasAsciiArtStore.addAa("new aa", "");
}
const deleteAa = async () => {
    if(await dialogStore.alert("選択中のAAを削除しますか？")){
        mainCanvasAsciiArtStore.deleteAa();
        await dialogStore.info("削除しました");
    }
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
const onMouseOver = (e: MouseEvent, index: number) => {
    isVisiblePreview.value = true;
    aaPreviewPosition.value.left = e.clientX + "px";
    aaPreviewPosition.value.top = e.clientY + "px";
    aaPreviewText.value = mainCanvasAsciiArtStore.allData[mainCanvasAsciiArtStore.currentFileNamePosition].aaList[index].asciiArt;
}
const onMouseOut = (e: Event) => {
    isVisiblePreview.value = false;
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
                                    v-on:mouseover="onMouseOver($event, i)"
                                    v-on:mouseout="onMouseOut"
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
    <div ref="aaPreview" 
        v-show="isVisiblePreview"
        class="aaPreview asciiArt">{{ aaPreviewText }}</div>
  </div>
</template>

<style scoped>

.base {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
}
.filelist {
    height: 50%;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 5% auto;
    user-select: none;
    color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
}
.namelist {
    width: 100%;
    height: 100%;
    overflow: scroll;
    background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
}

.buttonlist {
    display: flex;
    flex-direction: row;
}
.button{
    background-color: pink;
    user-select: none;
}
.aaPreview {
    position: absolute;
    border: 1px solid;
    z-index: 3000;
    box-shadow: 10px v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
    top: v-bind(aaPreviewPosition.top);
    left: v-bind(aaPreviewPosition.left);
}
</style>
