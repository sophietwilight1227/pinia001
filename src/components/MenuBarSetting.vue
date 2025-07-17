<script setup lang="ts">
import ButtonWithIcon from './ButtonWithIcon.vue';
import IconBase from '@/assets/icons/icon_base.vue';
import IconAalist from '@/assets/icons/icon_aalist.vue';
import constColor from '@/consts/constColor';
import { useColorStore } from '@/stores/color';
import { nextTick, ref, type Ref } from 'vue';
import { isValidFileType } from '@/scripts/fileIO';
import { useCharSetStore } from '@/stores/charSet';
import { useLayoutStore } from '@/stores/layout';
import DialogSelect from './DialogSelect.vue';
import ButtonText from './ButtonText.vue';
import IconSetting from '@/assets/icons/icon_setting.vue';
import IconInfo from '@/assets/icons/icon_info.vue';
import { useMainCanvasStore } from '@/stores/mainCanvas';
import constLocalStorage from '@/consts/constLocalStorage';
import constLayout from '@/consts/constLayout';

const colorStore = useColorStore();
const charSetStore = useCharSetStore();
const layoutStore = useLayoutStore();
const mainCanvasAsciiArtStore = useMainCanvasStore();

const inputAaListButton: any = ref(null);
const textSizeRef: any = ref("");
const sizeRefElem: any = ref(null);
const visibleCredit: Ref<boolean> = ref(false);
const visibleSetting:  Ref<boolean> = ref(false);
const holdLastEditAaElem: any = ref(null);
const previewPositionElem: any = ref(null);
const hasGridElem: any = ref(null);
const colorSchemeElem: any = ref(null);

const init = () => {
    const holdLastEditAA = localStorage.getItem(constLocalStorage.TAG_NAME.HOLD_LAST_EDIT);
    if(holdLastEditAA == null){
        holdLastEditAaElem.value.options[1].selected = true;
    }else{
        if(holdLastEditAA == "true"){
            holdLastEditAaElem.value.options[0].selected = true;
        }else{
            holdLastEditAaElem.value.options[1].selected = true;
        }        
    }
    
    const previewPos = localStorage.getItem(constLocalStorage.TAG_NAME.SETTING.IMAGE_PREVIEW_POSITION);
    let previewPosIndex: number = 0;
    if(previewPos != null){
        if(previewPos == "right"){
            previewPosIndex = 1;
        }
    }
    previewPositionElem.value.options[previewPosIndex].selected = true;
    layoutStore.setPicturePosition(previewPosIndex == 0);

    const hasGrid = localStorage.getItem(constLocalStorage.TAG_NAME.SETTING.SHOW_GRID);
    let hasGridIndex = 0;
    if(hasGrid != null){
        if(hasGrid == "false"){
            hasGridIndex = 1;
        }
    }
    hasGridElem.value.options[hasGridIndex].selected = true;
    layoutStore.changeColumnGrid(hasGridIndex == 0);

    const colorScheme = localStorage.getItem(constLocalStorage.TAG_NAME.SETTING.COLOR_SCHEME);
    let colorSchemeIndex: number = 0;
    if(colorScheme != null){
        for(let i=0; i < constColor.SCHEME_LIST.length; i++){
            if(colorScheme == constColor.SCHEME_LIST[i].id){
                colorSchemeIndex = i;
            }
        }
    }
    colorSchemeElem.value.options[colorSchemeIndex].selected = true;
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

//maincanvas にも同じのがある。あとで共通化する
const decodeNumericEntity = (str: string) => {
    var re = /&#([0-9a-fA-F]+);/g;
    return str.replace(re, function(m) {
      var cp = parseInt(arguments[1], 10);
      return String.fromCodePoint(cp);
    }); 
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

async function writeFile(fileHandle: any, contents: string) {
  // writable作成
  const writable = await fileHandle.createWritable();

  // コンテンツを書き込む
  await writable.write(contents);

  // ファイル閉じる
  await writable.close();
}

const changePictureViewPosition = (e: any) => {
    layoutStore.setPicturePosition(e.target.value == "left");
    localStorage.setItem(constLocalStorage.TAG_NAME.SETTING.IMAGE_PREVIEW_POSITION, e.target.value);
}

const changeColorScheme = (e: any) => {
    colorStore.changeColorScheme(e.target.value);
    localStorage.setItem(constLocalStorage.TAG_NAME.SETTING.COLOR_SCHEME, e.target.value);
}
const changeColumnGrid = (e: any) => {
    layoutStore.changeColumnGrid(e.target.value == "true");
    localStorage.setItem(constLocalStorage.TAG_NAME.SETTING.SHOW_GRID, e.target.value);
}
const changeHoldLastEditAA = (e: any) => {
    const value = (e.target.value == "true")
    mainCanvasAsciiArtStore.holdLastEditAA = value;
    localStorage.setItem(constLocalStorage.TAG_NAME.HOLD_LAST_EDIT, e.target.value);
}
const showCredit = ():void => {
    visibleCredit.value = true;
}
const hideCredit = ():void => {
    visibleCredit.value = false;
}
const showSetting = () => {
    init();
    visibleSetting.value = true;
}
const hideSetting = () => {
    visibleSetting.value = false;
}
</script>

<template>
    <div class="base">
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
        <ButtonWithIcon :value="'設定'" v-on:click="showSetting">
            <IconBase>
                <IconSetting/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'情報'" v-on:click="showCredit">
            <IconBase>
                <IconInfo/>
            </IconBase>
        </ButtonWithIcon>

        <input
            style="display: none;"
            ref="inputAaListButton"
            type="file"
            accept=".txt"
            v-on:change="openAaList">   
        
        <DialogSelect v-show="visibleSetting">
            <div>
                <div>[最終編集AAの保持]</div>
                <select name="holdLastEditAA" v-on:change="changeHoldLastEditAA" ref="holdLastEditAaElem">
                    <option value="true">する</option>
                    <option value="false">しない</option>
                </select>           
            </div>
            <div>
                <div>[画像プレビュー位置]</div>
                <select name="isLeftPicture" v-on:change="changePictureViewPosition" ref="previewPositionElem">
                    <option value="left">左</option>
                    <option value="right">右</option>
                </select>
            </div>
            <div>
                <div>[グリッドの表示]</div>
                <select name="hasGrid" v-on:change="changeColumnGrid" ref="hasGridElem">
                    <option value="true">する</option>
                    <option value="false">しない</option>
                </select>           
            </div>
            <div>
                <div>[配色]</div>
                <select name="colorScheme" v-on:change="changeColorScheme" ref="colorSchemeElem">
                    <option value="test">テスト</option>
                    <option value="light">ライト</option>
                    <option value="dark">ダーク</option>
                    <option value="classic">クラシック</option>
                </select>
            </div>
            <ButtonText :value="'とじる'" v-on:click="hideSetting"/>
        </DialogSelect>

        
        <DialogSelect v-show="visibleCredit" >
            <div>info</div>
            <img src="@/assets/images/logo.png" alt="logo">
            <ButtonText :value="'とじる'" v-on:click="hideCredit"/>
        </DialogSelect>

        <span class="asciiArt sizeRef" ref="sizeRefElem">{{ textSizeRef }}</span>
    </div>


</template>

<style scoped>
    .base{
        display: flex;
        flex-direction: row;
        color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    }
</style>