<script setup lang="ts">
import ButtonWithIcon from './ButtonWithIcon.vue';
import IconBase from '@/assets/icons/icon_base.vue';
import IconAalist from '@/assets/icons/icon_aalist.vue';
import constColor from '@/consts/constColor';
import { useColorStore } from '@/stores/color';
import { nextTick, onMounted, reactive, ref, useTemplateRef, type Ref } from 'vue';
import { isValidFileType, openText } from '@/scripts/fileIO';
import { useCharSetStore } from '@/stores/charSet';
import { useLayoutStore } from '@/stores/layout';
import DialogSelect from './DialogSelect.vue';
import ButtonText from './ButtonText.vue';
import IconSetting from '@/assets/icons/icon_setting.vue';
import IconInfo from '@/assets/icons/icon_info.vue';
import { useMainCanvasStore } from '@/stores/mainCanvas';
import constLocalStorage from '@/consts/constLocalStorage';
import constLayout from '@/consts/constLayout';
import { useDialogStore } from '@/stores/dialog';
import router from '@/router';
import manualTxt from "@/assets/manual.txt"
import IconCopy from '@/assets/icons/icon_copy.vue';

const dialogStore = useDialogStore();
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
const spaceTypeElem: any = ref(null);
const useUnicodeSpaceElem: any = ref(null);
const showSpaceArrowElem: any = ref(null);
const child: any = ref(null);

const isTrue = (value: string | null): boolean => {
    if(value == null){
        return true;
    }else{
        return value == "true";
    }
}
const isFalse = (value: string | null): boolean => {
    if(value == null){
        return false;
    }else{
        return value == "true";
    }
}
const init = () => {
    mainCanvasAsciiArtStore.holdLastEditAA = isTrue(localStorage.getItem(constLocalStorage.TAG_NAME.HOLD_LAST_EDIT));
    layoutStore.isLeftPictureView = isTrue(localStorage.getItem(constLocalStorage.TAG_NAME.SETTING.IMAGE_PREVIEW_POSITION));
    layoutStore.changeColumnGrid(isTrue(localStorage.getItem(constLocalStorage.TAG_NAME.SETTING.SHOW_GRID)));

    mainCanvasAsciiArtStore.showSpaceWithText = isTrue(localStorage.getItem(constLocalStorage.TAG_NAME.SETTING.SPACE_TYPE));
    mainCanvasAsciiArtStore.useUnicodeSpace = isFalse(localStorage.getItem(constLocalStorage.TAG_NAME.SETTING.USE_UNICODE_SPACE));
    mainCanvasAsciiArtStore.showSpaceArrow = isTrue(localStorage.getItem(constLocalStorage.TAG_NAME.SETTING.SHOW_SPACE_ARROW));

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
const openAaList = async (e: any) => {
    const text = (await openText(["txt" ,"aal"]));
    if(text.isValid){
        if(!charSetStore.readText(text.filename, text.content)){
            dialogStore.error("不正な拡張子です。読み込みに失敗しました");
        }
    }else{
        dialogStore.error(text.errorMessage);
    }
}
const writeAaListAsJson = () => {
    charSetStore.writeAAL();
    dialogStore.info("ダウンロードフォルダに保存しました");
}

const writeAaListAsJson_ = async () => {
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
    layoutStore.isLeftPictureView = isTrue(e.target.value);
    localStorage.setItem(constLocalStorage.TAG_NAME.SETTING.IMAGE_PREVIEW_POSITION, e.target.value.toString());
}

const changeColorScheme = (e: any) => {
    colorStore.changeColorScheme(e.target.value);
    localStorage.setItem(constLocalStorage.TAG_NAME.SETTING.COLOR_SCHEME, e.target.value);
}
const changeColumnGrid = (e: any) => {
    localStorage.setItem(constLocalStorage.TAG_NAME.SETTING.SHOW_GRID, layoutStore.hasColumnGrid.toString());
}
const changeHoldLastEditAA = (e: any) => {
    localStorage.setItem(constLocalStorage.TAG_NAME.HOLD_LAST_EDIT, mainCanvasAsciiArtStore.holdLastEditAA.toString());
}
const changeSpeceType = (e:any) => {
    localStorage.setItem(constLocalStorage.TAG_NAME.SETTING.SPACE_TYPE, mainCanvasAsciiArtStore.showSpaceWithText.toString());
}
const changeUseUnicodeSpace = (e:any) => {
    localStorage.setItem(constLocalStorage.TAG_NAME.SETTING.USE_UNICODE_SPACE, mainCanvasAsciiArtStore.useUnicodeSpace.toString());
}
const changeShowSpaceArrow = (e:any) => {
    localStorage.setItem(constLocalStorage.TAG_NAME.SETTING.SHOW_SPACE_ARROW, mainCanvasAsciiArtStore.showSpaceArrow.toString());
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
const showManual = async () => {

    const response = await fetch(manualTxt);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();

    let resolvedRoute = router.resolve({
        name: "manual",
    });
    child.value = window.open(resolvedRoute.href, '_blank');
    const timer = setInterval(() => {
        child.value.postMessage(text);
        clearInterval(timer);
    }, 100);
}
</script>

<template>
    <div class="base">
        <ButtonWithIcon :value="'aalist読み込み'" v-on:click="openAaList">
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
        <ButtonWithIcon :value="'マニュアル'" v-on:click="showManual">
            <IconBase>
                <IconCopy/>
            </IconBase>
        </ButtonWithIcon>

        <input
            style="display: none;"
            ref="inputAaListButton"
            type="file"
            accept=".txt"
            v-on:change="openAaList">   
        
        <DialogSelect :title="'設定'" v-show="visibleSetting">
            <div class="table">
                <div class="row">
                    <div class="cell">Unicode空白の使用(ドットずらし時)</div>
                    <div class="cell">
                        <input type="radio" id="useUnicodeSpace_true" value=true v-model="mainCanvasAsciiArtStore.useUnicodeSpace" v-on:change="changeUseUnicodeSpace"/>
                        <label for="useUnicodeSpace_true">使う　</label>
                        <input type="radio" id="useUnicodeSpace_false" value=false v-model="mainCanvasAsciiArtStore.useUnicodeSpace" v-on:change="changeUseUnicodeSpace"/>
                        <label for="useUnicodeSpace_false">使わない</label>                               
                    </div>
                </div>
                <div class="row">
                    <div class="cell">空白の強調表示・行末表示</div>
                    <div class="cell">
                        <input type="radio" id="showSpaceArrow_true" value=true v-model="mainCanvasAsciiArtStore.showSpaceArrow" v-on:change="changeShowSpaceArrow"/>
                        <label for="showSpaceArrow_true">する(重い)　</label>
                        <input type="radio" id="showSpaceArrow_false" value=false v-model="mainCanvasAsciiArtStore.showSpaceArrow" v-on:change="changeShowSpaceArrow"/>
                        <label for="showSpaceArrow_false">エラー時のみ(軽い)</label>                               
                    </div>                      
                </div>
                <div class="row">
                    <div class="cell" ref="cellHeaderElem_2">空白の強調表示方法</div>
                    <div class="cell">
                        <input type="radio" id="spaceType_true" value=true v-model="mainCanvasAsciiArtStore.showSpaceWithText" v-on:change="changeSpeceType"/>
                        <label for="spaceType_true">テキスト(軽い)　</label>
                        <input type="radio" id="spaceType_false" value=false v-model="mainCanvasAsciiArtStore.showSpaceWithText" v-on:change="changeSpeceType"/>
                        <label for="spaceType_false">DOM要素(重い)</label>                               
                    </div>                        
                </div>
                <div class="row">
                    <div class="cell">[最終編集AAの保持]</div>
                    <div class="cell">
                        <input type="radio" id="holdLastEditAA_true" value=true v-model="mainCanvasAsciiArtStore.holdLastEditAA" v-on:change="changeHoldLastEditAA"/>
                        <label for="holdLastEditAA_true">する　</label>
                        <input type="radio" id="holdLastEditAA_false" value=false v-model="mainCanvasAsciiArtStore.holdLastEditAA" v-on:change="changeHoldLastEditAA"/>
                        <label for="holdLastEditAA_false">しない</label>                               
                    </div>                             
                </div>
                <div class="row">
                    <div class="cell">[画像プレビュー位置]</div>
                    <div class="cell">
                        <input type="radio" id="isLeftPicture_true" value=true v-model="layoutStore.isLeftPictureView" v-on:change="changePictureViewPosition"/>
                        <label for="isLeftPicture_true">左　　</label>
                        <input type="radio" id="isLeftPicture_false" value=false v-model="layoutStore.isLeftPictureView" v-on:change="changePictureViewPosition"/>
                        <label for="isLeftPicture_false">右</label>                               
                    </div>    
                </div>
                <div class="row">
                    <div class="cell">[グリッドの表示]</div>
                    <div class="cell">
                        <input type="radio" id="changeColumnGrid_true" value=true v-model="layoutStore.hasColumnGrid" v-on:change="changeColumnGrid"/>
                        <label for="changeColumnGrid_true">する　</label>
                        <input type="radio" id="changeColumnGrid_false" value=false v-model="layoutStore.hasColumnGrid" v-on:change="changeColumnGrid"/>
                        <label for="changeColumnGrid_false">しない</label>                               
                    </div>          
                </div>
                <div class="row">
                    <div class="cell">[配色]</div>
                    <select class="cell" name="colorScheme" v-on:change="changeColorScheme" ref="colorSchemeElem">
                        <option value="test">テスト</option>
                        <option value="light">ライト</option>
                        <option value="dark">ダーク</option>
                        <option value="classic">クラシック</option>
                    </select>
                </div>
            </div>
            <div class="underBar" >
                <ButtonText :value="'とじる'" v-on:click="hideSetting" style="justify-content: flex-end; margin: 10px;"/>
            </div>
        </DialogSelect>

        
        <DialogSelect :title="'info'" v-show="visibleCredit" >
            <div class="table">
                <img src="@/assets/images/logo.png" alt="logo"><br>
                <div>ver 0.0.7</div>
                <div>by North Tail</div>
            </div>
            <div class="underBar">
                <ButtonText :value="'とじる'" v-on:click="hideCredit"/>
            </div>
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
    .table {
        padding: 10px;
    }
    .row {
        display: flex;
    }
    .cell {
        white-space: nowrap;
        display: flex;
        flex: 1;
        justify-content:left;
        align-items: center;
        width: 300px;
    }
    .underBar {
        width: 100%; 
        display: flex; 
        justify-content: flex-end;
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.PRIMARY));
    }
</style>