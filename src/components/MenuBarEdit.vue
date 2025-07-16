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

const charSetStore = useCharSetStore();
const mainCanvasStore = useMainCanvasStore();

const setRectSelectMode = (value: boolean):void => {
    mainCanvasStore.setRecSelectMode(value);
}

const addSpaceToEndOfLineToArrange = () => {
    const aa: Array<string> = mainCanvasStore.asciiArt.split("\n");
    const widthList: Array<number> = [];
    for(let i=0; i < aa.length; i++){
        widthList.push(charSetStore.calcStrWidth(aa[i]));
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

</script>
<template>
    <div class="base">
        <div>
            <div>矩形選択</div>
            <ToggleButton v-on:click="setRectSelectMode"/>                
        </div>
        <div>
            <div>挿入 / 上書</div>
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