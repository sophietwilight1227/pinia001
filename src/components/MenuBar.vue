<script setup lang="ts">
import { nextTick, ref, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type Ref } from "vue";
import PictureEditer from "./PictureEditer.vue";
import IconFile from "@/assets/icons/icon_file.vue";
import IconFolder from "@/assets/icons/icon_folder.vue";
import IconBase from "@/assets/icons/icon_base.vue";
import IconImage from "@/assets/icons/icon_image.vue";
import { usePictureViewStore } from "@/stores/pictureView";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import { useCharSetStore } from "@/stores/charSet";
import CharactorPalette from "./CharactorPalette.vue";
import { useLayoutStore } from "@/stores/layout";
import ButtonText from "./ButtonText.vue";
import ButtonWithIcon from "./ButtonWithIcon.vue";

const mainCanvasStore = useMainCanvasStore();
const pictureViewSrtore = usePictureViewStore();
const charSetStore = useCharSetStore();
const layoutStore = useLayoutStore();

const visibleList: Ref<Map<string, boolean>> = ref(new Map());
const visibleModalMenu: Ref<boolean> = ref(false);
const imageUrl: Ref<string> = ref("");
const inputLocalImageButton: any = ref(null);
const inputLocalTextButton:any = ref(null);
const inputAaListButton: any = ref(null);
const textSizeRef: any = ref("");
const sizeRefElem: any = ref(null);

const initSetting = ():void => {
    visibleList.value.set("file", false);
    visibleList.value.set("image", false);
    visibleList.value.set("setting", false);
}   
initSetting();

const changeMenu = (id: string): void => {
    for (let [key, value] of visibleList.value){
        console.log(key, "menu clicked");
        if(key == id){
            visibleList.value.set(id, !visibleList.value.get(id));
        }else{
            visibleList.value.set(key, false);
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
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const text: string | ArrayBuffer | null = e.target!.result;
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
            description: "Text Files",
            accept: {
                "text/plain": [".txt"],
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

//maincanvas にも同じのがある。あとで共通化する
const decodeNumericEntity = (str: string) => {
    var re = /&#([0-9a-fA-F]+);/g;
    return str.replace(re, function(m) {
      var cp = parseInt(arguments[1], 10);
      return String.fromCodePoint(cp);
    }); 
}

const openAaList = (e: any):void => {
    if(inputAaListButton.value != null){
        const file = inputAaListButton.value.files[0];
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

const changePictureViewPosition = (e: any) => {
    layoutStore.setPicturePosition(e.target.value == "left");
}

</script>

<template>
  <div class="base">
    <div class="mainMenu">
        <ButtonText :value="'ファイル'" v-on:click="changeMenu('file')"/>
        <ButtonText :value="'画像'" v-on:click="changeMenu('image')"/>
        <ButtonText :value="'設定'" v-on:click="changeMenu('setting')"/>
    </div>
    <div v-show="visibleList.get('file')" class="hasSubMenu">
        <ButtonWithIcon :value="'新規'">
            <IconBase >
                <IconFile/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'開く'" v-on:click="onClickOpenLocalText">
            <IconBase >
                <IconFolder/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'保存'" v-on:click="writeMLT">
            <IconBase >
                <IconFolder/>
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
                <IconImage/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'aalist出力'" v-on:click="writeAaListAsJson">
            <IconBase >
                <IconImage/>
            </IconBase>
        </ButtonWithIcon>
        <div>
            <div>画像プレビュー位置</div>
            <select name="isLeftPicture" v-on:change="changePictureViewPosition">
                <option value="left">左</option>
                <option value="right">右</option>
            </select>
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
  <!--ここから参照用。非表示にしておく-->
    <input
        style="display: none;"
        ref="inputLocalImageButton"
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        v-on:change="openLocalFileImage">  
    <input
        style="display: none;"
        ref="inputLocalTextButton"
        type="file"
        accept="text/mlt"
        v-on:change="openLocalText">  
    <input
        style="display: none;"
        ref="inputAaListButton"
        type="file"
        accept="text/"
        v-on:change="openAaList">  
    <span class="asciiArt sizeRef" ref="sizeRefElem">{{ textSizeRef }}</span>
</template>

<style scoped>

.base {
    background-color: antiquewhite;
}
.divider {
    height: 1px;
    background-color: white;
}
.mainMenu {
    background-color: lightgreen;
}
.tab {
    background-color: aqua;
}

.button{
    background-color: pink;
}
.baloon {
    position: absolute;
    z-index: 100;
    background-color: white;
    filter: drop-shadow(0px 1px 4px #aaa);
}
.hasSubMenu{
    display: flex;
    flex-direction: row;
}
.modalMenu {
    position: absolute;
    margin: 0 auto;
    z-index: 2000;
    background-color: aqua;
    box-shadow: 0 10px 25px 0 rgba(0, 0, 0, .5);
    padding: 10px;
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
.asciiArt {
  white-space: pre;
  z-index: 10;
  background-color: transparent;
  font-size:16px;
  font-style: normal;
  font-weight: 400;
  line-height:18px;
  letter-spacing: 0;
  text-shadow: none;
  font-family: 'Saitamaar', 'ＭＳ Ｐゴシック', 'MS PGothic', 'IPAMonaPGothic' !important;
}
.sizeRef {
    width: fit-content;
    background-color: blueviolet;
}

@font-face {
  font-family: 'Saitamaar';
  src: url('@/assets/fonts/Saitamaar.ttf') format('truetype');
}
</style>
