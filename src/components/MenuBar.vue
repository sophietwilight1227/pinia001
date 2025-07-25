<script setup lang="ts">

//不使用

import { nextTick, ref, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type Ref } from "vue";
import PictureEditer from "./PictureEditer.vue";
import IconFile from "@/assets/icons/icon_file.vue";
import IconFolder from "@/assets/icons/icon_folder.vue";
import IconBase from "@/assets/icons/icon_base.vue";
import IconImage from "@/assets/icons/icon_image.vue";
import IconSave from "@/assets/icons/icon_save.vue";
import IconAalist from "@/assets/icons/icon_aalist.vue";
import { usePictureViewStore } from "@/stores/pictureView";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import { useCharSetStore } from "@/stores/charSet";
import CharactorPalette from "./CharactorPalette.vue";
import { useLayoutStore } from "@/stores/layout";
import ButtonText from "./ButtonText.vue";
import ButtonWithIcon from "./ButtonWithIcon.vue";
import { useColorStore } from "@/stores/color";
import constColor from "@/consts/constColor";
import { useDialogStore } from "@/stores/dialog";
import ToggleButton from "./ToggleButton.vue";
import { decodeNumericEntity } from "@/scripts/encode";

const menuButtonInfoList = [{id: "file", name: "ファイル"},
                            {id: "image", name: "元画像"},
                            {id: "setting", name: "設定"},
                            {id: "export_image", name: "画像出力"},
                            {id: "export_movie", name: "動画出力"}]
const menuButtons: any = ref(null);

const mainCanvasStore = useMainCanvasStore();
const pictureViewSrtore = usePictureViewStore();
const charSetStore = useCharSetStore();
const layoutStore = useLayoutStore();
const colorStore = useColorStore();
const dialogStore = useDialogStore();

const visibleList: Ref<Map<string, boolean>> = ref(new Map());
const visibleModalMenu: Ref<boolean> = ref(false);
const visibleCredit: Ref<boolean> = ref(false);
const imageUrl: Ref<string> = ref("");
const inputLocalImageButton: any = ref(null);
const inputLocalTextButton:any = ref(null);
const inputAaListButton: any = ref(null);
const textSizeRef: any = ref("");
const sizeRefElem: any = ref(null);

const initSetting = ():void => {
    for(let i=0; i < menuButtonInfoList.length; i++){
        visibleList.value.set(menuButtonInfoList[i].id, false);
    }
}   
initSetting();

const changeMenu = (id: string): void => {
    for (let [key, value] of visibleList.value){
        if(key == id){
            visibleList.value.set(id, !visibleList.value.get(id));
        }else{
            visibleList.value.set(key, false);
        }
    }

    for(let i=0; i < menuButtonInfoList.length; i++){
        if(menuButtons.value != null && menuButtons.value[i] != null){
            if(menuButtonInfoList[i].id == id && visibleList.value.get(id)){
                menuButtons.value[i].select(true);
            }else{
                menuButtons.value[i].select(false);
            }
        }
    }
}

const openImage = () => {
    pictureViewSrtore.setImage(imageUrl.value);
    hideModalMenu();
}

const showModalMenu = ():void => {
    visibleModalMenu.value = true;
}
const hideModalMenu = ():void => {
    visibleModalMenu.value = false;
}
const showCredit = ():void => {
    visibleCredit.value = true;
}
const hideCredit = ():void => {
    visibleCredit.value = false;
}
const onClickOpenLocalImage = ():void => {
    inputLocalImageButton.value!.click();
}
const openLocalFileImage = (e: Event):void => {
    if(inputLocalImageButton.value != null){
        imageUrl.value = URL.createObjectURL(inputLocalImageButton.value.files[0]);
        openImage();
    } 
}

const onClickOpenLocalText = ():void => {
    inputLocalTextButton.value.click();
}
const openLocalText = (e: any):void => {
    if(inputLocalTextButton.value != null){
        const file = inputLocalTextButton.value.files[0];
        if(!isValidFileType(file.name, ["mlt"])){
            return;
        }
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                //const text: string | ArrayBuffer | null = e.target!.result;
                if(e.target!.result != null){
                    const text: string =  e.target!.result.toString();
                    mainCanvasStore.readMLT(inputLocalTextButton.value.files[0].name, text);
                }
            };
            reader.readAsText(file, "sjis");
        }
    }
}
async function writeFile(fileHandle: any, contents: string) {
  // writable作成
  const writable = await fileHandle.createWritable();

  // コンテンツを書き込む
  await writable.write(contents);

  // ファイル閉じる
  await writable.close();
}

// メイン処理
const writeMLT = async () => {
    const textContent = mainCanvasStore.writeMLT();
    const saveFileOptions: any = {
        suggestedName: textContent.fileName,
        types: [
            {
            description: "MLT ファイル　",
            accept: {
                "text/plain": [".mlt"],
            },
            },
        ],
    };
  const handle = await (window as any).showSaveFilePicker(saveFileOptions);
  await writeFile(handle, textContent.asciiArt);
}

const onClickReadAaList = ():void => {
    inputAaListButton.value.click();
}

const openAaList = (e: any):void => {
    if(inputAaListButton.value != null){
        const file = inputAaListButton.value.files[0];
        if(!isValidFileType(file.name, ["txt"])){
            return;
        }
        if (file) {
            const reader = new FileReader();

            reader.onload = async (e) => {
                const text: string | ArrayBuffer | null = e.target!.result;
                if(e.target!.result != null){
                    const text: string =  decodeNumericEntity(e.target!.result.toString());
                    const rawList: Array<string> = text.split(/\n/);
                    const list: Array<{name: string, list: Array<{value: string, width: number}>}> = [];
                    for(let i=0; i < rawList.length; i++){
                        const char: string = rawList[i].trim();
                        if(char.slice(0,9) == "[ListName"){
                            list.push({name: rawList[i].slice(10, char.length - 1), list: []});
                        }else if(char == "[end]"){
                            //何もしない
                        }else{
                            const widthPromis = (await calcCharWidth(char))
                            let width: number = 0
                            if(widthPromis != null){
                                width = widthPromis.valueOf();
                            }
                            
                            list[list.length - 1].list.push({value: char, width: width.valueOf()});
                        }
                    }
                    charSetStore.readAaList(list);
                    charSetStore.saveCharPaletteLocalStorage();
                }
            };
            reader.readAsText(file, "sjis");
        }
    }
}
const calcCharWidth = async (str: string): Promise<number> => {
    textSizeRef.value = str;
    await nextTick();
    return sizeRefElem.value.offsetWidth;
}
const writeAaListAsJson = async () => {
    const list: Array<{indexName: string, charList: Array<string>}> = [];
    for(let i=0; i < charSetStore.charPalette.length; i++){
        list.push({indexName: charSetStore.charPalette[i].indexName, charList: []});
        for(let j=0; j < charSetStore.charPalette[i].charList.length; j++){
            list[i].charList.push(charSetStore.charPalette[i].charList[j].value);
        }
    }
    const saveFileOptions: any = {
        suggestedName: "aalist",
        types: [
            {
            description: "Text Files",
            accept: {
                "text/plain": [".json"],
            },
            },
        ],
    };
    const handle = await (window as any).showSaveFilePicker(saveFileOptions);
    await writeFile(handle, JSON.stringify(list));
}
const isValidFileType = (fileName: string, allowedFiletype: Array<string>): boolean => {
    const filetype:string | undefined = fileName.split('.').pop();
    if(filetype == null){
        dialogStore.error("拡張子を持たないファイルです。読み込みに失敗しました");
        return false;
    }else{
        const fileExtension = filetype.toLowerCase();
        if(allowedFiletype.includes(fileExtension)){
            return true;
        }else{
            dialogStore.error("不正な拡張子です。読み込みに失敗しました");
            return false;
        }
    }
    return false;
}

const changePictureViewPosition = (e: any) => {
    layoutStore.isLeftPictureView = (e.target.value == "true");
}

const changeColorScheme = (e: any) => {
    colorStore.changeColorScheme(e.target.value);
}

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

const openCredit = async () => {
    if(await dialogStore.alert("test message")){
        console.log("ok");
    }
}

</script>



<template>
  <div class="base">
    <div class="mainMenu">
        <ButtonText 
            v-for="data in menuButtonInfoList" 
            ref="menuButtons"
            :value="data.name" 
            v-on:click="changeMenu(data.id)"/>
    </div>
    <div v-show="visibleList.get('file')" class="hasSubMenu">
        <ButtonWithIcon :value="'開く'" v-on:click="onClickOpenLocalText">
            <IconBase>
                <IconFolder/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'保存'" v-on:click="writeMLT">
            <IconBase >
                <IconSave/>
            </IconBase>
        </ButtonWithIcon>
    </div>
    <div v-show="visibleList.get('image')" class="hasSubMenu">
        <ButtonWithIcon :value="'開く'" v-on:click="showModalMenu">
            <IconBase >
                <IconImage/>
            </IconBase>
        </ButtonWithIcon>
        <PictureEditer/>
    </div>
    <div v-show="visibleList.get('setting')" class="hasSubMenu">
        <ButtonWithIcon :value="'aalist読み込み'" v-on:click="onClickReadAaList">
            <IconBase >
                <IconAalist/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'aalist出力'" v-on:click="writeAaListAsJson">
            <IconBase >
                <IconAalist/>
            </IconBase>
        </ButtonWithIcon>
        <div>
            <div>[画像プレビュー位置]</div>
            <select name="isLeftPicture" v-on:change="changePictureViewPosition">
                <option value="left">左</option>
                <option value="right">右</option>
            </select>
        </div>
        <div>
             <div>[グリッドの表示]</div>
            <select name="hasGrid">
                <option value="true">する</option>
                <option value="false">しない</option>
            </select>           
        </div>
        <div>
            <div>[配色]</div>
            <select name="colorScheme" v-on:change="changeColorScheme">
                <option value="test">テスト</option>
                <option value="light">ライト</option>
                <option value="dark">ダーク</option>
                <option value="classic">クラシック</option>
            </select>
        </div>
        <div>
            <div v-on:click="openCredit">[info3]</div>
            <button v-on:click="showCredit">[表示]</button>            
        </div>
    </div>
    <div v-show="visibleList.get('export_image')" class="hasSubMenu">
        <div>編集エリアのAAを画像出力するための設定など</div>
    </div>
    <div v-show="visibleList.get('export_movie')" class="hasSubMenu">
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
  </div>
  <div class="divider"></div>


  <div v-show="visibleModalMenu" class="modalMenuFrame">
    <div class="modalMenuBackground"></div>
    <div class="modalMenu">
        <div>画像選択</div>
        <div>
            <div>ウェブ</div>
            <input type="text" v-model="imageUrl"/>
            <button v-on:click="openImage">開く</button>        
        </div>
        <div>
            <div>ローカル</div>
            <button v-on:click="onClickOpenLocalImage">参照(ローカル)</button>
        </div>
        
        <button v-on:click="hideModalMenu">キャンセル</button>
    </div>
  </div>
  
  <div v-show="visibleCredit" class="modalMenuFrame">
    <div class="modalMenu">
        <div>info</div>
        <img src="@/assets/images/logo.png" alt="logo">
        <ButtonText :value="'とじる'" v-on:click="hideCredit"/>
    </div>
  </div>
  <!--ここから参照用。非表示にしておく-->
    <input
        style="display: none;"
        ref="inputLocalImageButton"
        type="file"
        accept=".jpeg, .jpg, .png"
        v-on:change="openLocalFileImage">  
    <input
        style="display: none;"
        ref="inputLocalTextButton"
        type="file"
        accept=".mlt"
        v-on:change="openLocalText">  
    <input
        style="display: none;"
        ref="inputAaListButton"
        type="file"
        accept=".txt"
        v-on:change="openAaList">  
    <span class="asciiArt sizeRef" ref="sizeRefElem">{{ textSizeRef }}</span>
</template>

<style scoped>

.base {
    background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
}
.divider {
    height: 1px;
    background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
}
.mainMenu {
    width: 100%;
    color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.PRIMARY));
}
.tab {
    background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
}

.button{
    background-color: pink;
}
.baloon {
    position: absolute;
    z-index: 100;
    background-color: white;
    filter: drop-shadow(0px 1px 4px #000);
}
.hasSubMenu{
    display: flex;
    flex-direction: row;
    color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
}
.modalMenu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 2000;
    box-shadow: 0 10px 25px 0 rgba(0, 0, 0, .5);
    padding: 10px;
    color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
}
.modalMenuBackground {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: white;
    opacity: 0.5;
    z-index: 1900;
    background-position: center;
}
.modalMenuFrame {
  display: flex;
  justify-content: center;
}

.sizeRef {
    width: fit-content;
    background-color: blueviolet;
}

</style>
