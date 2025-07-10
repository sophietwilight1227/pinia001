<script setup lang="ts">
import { ref, type Ref } from 'vue';
import IconBase from "@/assets/icons/icon_base.vue";
import IconInfo from "@/assets/icons/icon_info.vue";
import IconAlert from "@/assets/icons/icon_alert.vue";
import IconError from "@/assets/icons/icon_error.vue";
import constDialog from '@/consts/constDialog';
import ButtonText from './ButtonText.vue';
import { useColorStore } from '@/stores/color';
import constColor from '@/consts/constColor';

const BUTTON_TYPE = {ok: "ok", cancel: "cancel"};
const colorStore = useColorStore();
const props = defineProps<{
                            //onClickOk: Function
                        }>()

const sentence: Ref<string> = ref("");
const isShown: Ref<boolean> = ref(false);
const resolve: Ref<Function> = ref(() => {});
const type: Ref<string> = ref("");


const confirm = (text: string, messageType: string): Promise<boolean> => {
      sentence.value = text;
      isShown.value = true;
      type.value = messageType;
      return new Promise((resolve_: (v: boolean) => void) => {
        resolve.value = resolve_;
      });
}
defineExpose({ confirm });

const showImage = (messageType: string): boolean => {
    return type.value == messageType;
}
const showButton = (buttonType: string): boolean => {
    switch(type.value){
        case constDialog.DIALOG_TYPE.INFO:
            switch(buttonType){
                case BUTTON_TYPE.ok:
                    return true;
                case BUTTON_TYPE.cancel:
                    return false;
            }
        case constDialog.DIALOG_TYPE.ALERT:
            switch(buttonType){
                case BUTTON_TYPE.ok:
                    return true;
                case BUTTON_TYPE.cancel:
                    return true;
            }
        case constDialog.DIALOG_TYPE.ERROR:
            switch(buttonType){
                case BUTTON_TYPE.ok:
                    return true;
                case BUTTON_TYPE.cancel:
                    return false;
            }
    }   
    return false;
}

const onClickOk = (): void => {
    reset();
    resolve.value(true);
}
const onClickCancel = (): void => {
    reset();
    resolve.value(false);
}
const reset = ():void => {
    sentence.value = "";
    isShown.value = false;
}
</script>

<template>
    <div class="base" v-show="isShown">
        <div class="title">*確認*</div>
        <div>
            <IconBase  v-show="showImage(constDialog.DIALOG_TYPE.INFO)">
                <IconInfo/>
            </IconBase>
            <IconBase  v-show="showImage(constDialog.DIALOG_TYPE.ALERT)">
                <IconAlert/>
            </IconBase>
            <IconBase  v-show="showImage(constDialog.DIALOG_TYPE.ERROR)">
                <IconError/>
            </IconBase>
        </div>
        <div>{{ sentence }}</div>
        <div class="button_frame">
            <ButtonText 
                class="button"
                :value="'OK'" 
                v-on:click="onClickOk" 
                v-show="showButton(BUTTON_TYPE.ok)" />
            <ButtonText 
                class="button"
                :value="'キャンセル'" 
                v-on:click="onClickCancel" 
                v-show="showButton(BUTTON_TYPE.cancel)" />        
        </div>
    </div>
</template>

<style scoped>
    .base {
        position:absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 2010;
        box-shadow: 0 10px 25px 0 rgba(0, 0, 0, .5);
        color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
    }
    .title {
        border-bottom: 1px solid;
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.PRIMARY));
    }
    .button_frame {
        background-color: aqua;
        display: flex;
        flex-direction: row;
    }
    .button {
        width: 100%;
    }
</style>