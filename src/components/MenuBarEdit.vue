<script setup lang="ts">
import { useMainCanvasStore } from '@/stores/mainCanvas';
import ToggleButton from './ToggleButton.vue';
import { useCharSetStore } from '@/stores/charSet';
import IconAddEnd from '@/assets/icons/icon_add_end.vue';
import IconBase from '@/assets/icons/icon_base.vue';
import ButtonWithIcon from './ButtonWithIcon.vue';
import IconDeleteEnd from '@/assets/icons/icon_delete_end.vue';
import IconAddHead from '@/assets/icons/icon_add_head.vue';
import IconDeleteHead from '@/assets/icons/icon_delete_head.vue';
import IconDeleteEmptyRow from '@/assets/icons/icon_delete_empty_row.vue';
import IconDeleteLast from '@/assets/icons/icon_delete_last.vue';
import IconArrangeEnd from '@/assets/icons/icon_arrange_end.vue';
import IconDisplay from '@/assets/icons/icon_display.vue';
import { createApp, ref, type Ref } from 'vue';
import Preview from './Preview.vue';
import textCss from '@/assets/manual.txt';
import { convertSjis } from '@/scripts/encode';
import IconCopy from '@/assets/icons/icon_copy.vue';
import { useDialogStore } from '@/stores/dialog';
import "../assets/base.css";
import router from '@/router';
import IconLeft from '@/assets/icons/icon_left.vue';
import IconRight from '@/assets/icons/icon_right.vue';
import LabelText from './LabelText.vue';

const charSetStore = useCharSetStore();
const mainCanvasStore = useMainCanvasStore();
const otherWindow: Ref<Window | null> = ref(null);
const previewInstance = ref();
const dialogStore = useDialogStore();
const child: any = ref(null);

mainCanvasStore.$subscribe((mutation, state) => {
    let resolvedRoute = router.resolve({
        name: "preview",
    });
    if(child.value != null){
        console.log(location.origin + resolvedRoute.href)
        child.value.postMessage(mainCanvasStore.asciiArt)
    }
})

const setRectSelectMode = (value: boolean):void => {
    mainCanvasStore.setRecSelectMode(value);
}

const addSpaceToEndOfLineToArrange = async () => {
    const aa: Array<string> = mainCanvasStore.asciiArt.split("\n");
    const widthList: Array<number> = [];
    for(let i=0; i < aa.length; i++){
        widthList.push(await charSetStore.calcStrWidth(aa[i]));
    }
    mainCanvasStore.addSpaceToLineEndToArrange(widthList);
}
const changeRectSelectType = (e: any) => {
    switch(e.target.value){ 
        case "insert":
            mainCanvasStore.isRectSelectInsertMode = true;
            break;
        case "update":
            mainCanvasStore.isRectSelectInsertMode = false;
            break;
    }   
}
const showPreview_ = async (e:any) => {
    otherWindow.value = window.open("", "preview", "width=960, height=1080");
    //otherWindow.value = window.open("/Preview", "_blank", "width=960, height=1080");
    if(otherWindow.value != null){
        const otherDiv = otherWindow.value.document.createElement("div");
        otherDiv.id = "other-app"
        otherDiv.className = "asciiArt"
        otherWindow.value.document.body.appendChild(otherDiv);

        const otherStyle = otherWindow.value.document.createElement("style");
        const response = await fetch(textCss);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        otherStyle.innerHTML = text;
        otherWindow.value.document.head.appendChild(otherStyle);
        // 3, vueインスタンスを生成しコンポーネントを乗せる （インスタンス情報はvue変数に代入する）
        previewInstance.value = createApp(Preview).mount(otherDiv);
    }else{
        dialogStore.error("プレビューが開けませんでした")
    }

}
const showPreview = () => {
    let resolvedRoute = router.resolve({
        name: "preview",
    });
    child.value = window.open(resolvedRoute.href, '_blank');
    const timer = setInterval(() => {
        child.value.postMessage(mainCanvasStore.asciiArt)
        clearInterval(timer);
    }, 100);
}

const copyToClipBoartWithShiftJis = async () => {
    if (!navigator.clipboard) {
        alert("残念。このブラウザは対応していません...");
        return;
    }
    const aa: string = mainCanvasStore.asciiArt;
    const sjisText = convertSjis(aa);
    navigator.clipboard.writeText(sjisText);
    dialogStore.info("クリップボードにコピーしました")
}
const copyToClipBoartWithUtf8 = async () => {
    if (!navigator.clipboard) {
        alert("残念。このブラウザは対応していません...");
        return;
    }
    const aa: string = mainCanvasStore.asciiArt;
    navigator.clipboard.writeText(aa);
    dialogStore.info("クリップボードにコピーしました")
}

</script>
<template>
    <div class="base">
        <ButtonWithIcon :value="'1ドット左'" v-on:click="mainCanvasStore.changeDot(-1)">
            <IconBase>
                <IconLeft/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'1ドット右'" v-on:click="mainCanvasStore.changeDot(1)">
            <IconBase>
                <IconRight/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'コピー(Shift-JIS)'" v-on:click="copyToClipBoartWithShiftJis">
            <IconBase>
                <IconCopy/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'コピー(UTF-8)'" v-on:click="copyToClipBoartWithUtf8">
            <IconBase>
                <IconCopy/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'プレビュー'" v-on:click="showPreview">
            <IconBase>
                <IconDisplay/>
            </IconBase>
        </ButtonWithIcon>
        <div>
            <LabelText :value="'矩形選択'"/>
            <ToggleButton v-on:click="setRectSelectMode"/>                
        </div>
        <div>
            <LabelText :value="'挿入 / 上書'"/>
            <select name="rectSelectType" v-on:change="changeRectSelectType">
                <option value="insert">挿入</option>
                <option value="update">上書</option>
            </select>  
        </div>
        <ButtonWithIcon :value="'空白追加'" v-on:click="mainCanvasStore.addSpaceToEndOfLine">
            <IconBase>
                <IconAddEnd/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'行末空白削除'" v-on:click="mainCanvasStore.deleteSpaceAtEnd">
            <IconBase>
                <IconDeleteEnd/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'行頭空白追加'" v-on:click="mainCanvasStore.addSpaceToLineHead">
            <IconBase>
                <IconAddHead/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'行頭空白削除'" v-on:click="mainCanvasStore.deleteSpaceFromLineHead">
            <IconBase>
                <IconDeleteHead/>
            </IconBase>
        </ButtonWithIcon>
         <ButtonWithIcon :value="'空行削除'" v-on:click="mainCanvasStore.deleteEmptyLine">
            <IconBase>
                <IconDeleteEmptyRow/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'行末を揃える'" v-on:click="addSpaceToEndOfLineToArrange">
            <IconBase>
                <IconArrangeEnd/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'行末から1文字削除'" v-on:click="mainCanvasStore.deleteLastCharFromAllLine">
            <IconBase>
                <IconDeleteLast/>
            </IconBase>
        </ButtonWithIcon>
    </div>
</template>

<style scoped>
    .base {
        max-height: 100%;
        max-width: 100%;
        overflow: hidden;
        display: flex;
        align-items: flex-start;
    }
</style>