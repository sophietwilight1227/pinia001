<script setup lang="ts">
import ButtonWithIcon from './ButtonWithIcon.vue';
import IconBase from '@/assets/icons/icon_base.vue';
import IconFolder from '@/assets/icons/icon_folder.vue';
import IconSave from '@/assets/icons/icon_save.vue';
import { useMainCanvasStore } from '@/stores/mainCanvas';
import { ref, type Ref } from 'vue';
import { openText, writeAaTextFile } from '@/scripts/fileIO';
import constColor from '@/consts/constColor';
import { useColorStore } from '@/stores/color';
import { useDialogStore } from '@/stores/dialog';
import DialogSelect from './DialogSelect.vue';
import ButtonText from './ButtonText.vue';
import { decodeNumericEntity } from '@/scripts/encode';

const colorStore = useColorStore();
const dialogStore = useDialogStore();
const mainCanvasStore = useMainCanvasStore();

const openLocalText = async (e: any) => {
    const text = (await openText(["txt" ,"mlt", "ast", "aaa"]));
    if(text.isValid){
        if(!mainCanvasStore.readText(text.filename, text.content)){
            dialogStore.error("不正な拡張子です。読み込みに失敗しました");
        }
    }else{
        dialogStore.error(text.errorMessage);
    }
}

const writeFile = () => {
    let textContent = {fileName: "", asciiArt: ""};
    switch(selectedFileType.value){
        case "txt":
            textContent = mainCanvasStore.writeText();
            break;
        case "mlt":
            textContent = mainCanvasStore.writeMLT();
            break;
        case "ast":
            textContent = mainCanvasStore.writeAST();
            break;
        case "aaa":
            textContent = mainCanvasStore.writeAAA();
            break;
    }
    writeAaTextFile(textContent.asciiArt, textContent.fileName,selectedFileType.value , selectedEncode.value);
    dialogStore.info("ダウンロードフォルダに保存しました");
    hideModalMenu();
}

const selectedFileType: Ref<string> = ref("mlt");
const optionsFileType = [{value: "txt", label: "txt: 現在編集中のAAを保存します"},
                        {value: "mlt", label: "mlt: 現在編集中のファイルを保存します(AA見出しなし)"},
                        {value: "ast", label: "ast: 現在編集中のファイルを保存します(AA見出しあり)"},
                        {value: "aaa", label: "aaa: 現在編集中のファイルを保存します(編集履歴含む)"}]
const selectedEncode: Ref<string> = ref("utf-8");
const optionsEncode = [{value: "utf-8", label: "utf-8: 最近の形式"},
                        {value: "shift-jis", label: "shift-jis: （´д｀）Edit 等で編集したい場合の形式"}]

const saveFileElem: any = ref(null);
const showModalMenu = () => {
    saveFileElem.value.show();
}
const hideModalMenu = () => {
    saveFileElem.value.hide();
}
</script>

<template>
    <div>
        <div class="base">
            <ButtonWithIcon :value="'開く'" v-on:click="openLocalText">
                <IconBase>
                    <IconFolder/>
                </IconBase>
            </ButtonWithIcon>
            <ButtonWithIcon :value="'保存'" v-on:click="showModalMenu">
                <IconBase >
                    <IconSave/>
                </IconBase>
            </ButtonWithIcon>
        </div>

        <DialogSelect ref="saveFileElem">
            <div>出力設定</div>
            <div>
                <div>ファイル形式</div>
                <label v-for="(option, index) in optionsFileType" :key="index">
                    <input
                    type="radio"
                    v-model="selectedFileType"
                    :value="option.value"
                    > {{ option.label }}<br>
                </label>     
            </div>
            <div>
                <div>エンコード</div>
                <label v-for="(option, index) in optionsEncode" :key="index">
                    <input
                    type="radio"
                    v-model="selectedEncode"
                    :value="option.value"
                    > {{ option.label }}<br>
                </label>   
            </div>
            <ButtonText :value="'保存'" v-on:click="writeFile"/>
            <ButtonText :value="'キャンセル'" v-on:click="hideModalMenu"/>     
        </DialogSelect>        
    </div>

</template>

<style scoped>
    .base{
        display: flex;
        flex-direction: row;
        color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    }
</style>


