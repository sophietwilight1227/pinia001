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

const colorStore = useColorStore();
const charSetStore = useCharSetStore();
const layoutStore = useLayoutStore();

const inputAaListButton: any = ref(null);
const textSizeRef: any = ref("");
const sizeRefElem: any = ref(null);
const visibleCredit: Ref<boolean> = ref(false);

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
}

const changeColorScheme = (e: any) => {
    colorStore.changeColorScheme(e.target.value);
}
const showCredit = ():void => {
    visibleCredit.value = true;
}
const hideCredit = ():void => {
    visibleCredit.value = false;
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
            <div>[info3]</div>
            <button v-on:click="showCredit">[表示]</button>            
        </div>


        <input
            style="display: none;"
            ref="inputAaListButton"
            type="file"
            accept=".txt"
            v-on:change="openAaList">   
        
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