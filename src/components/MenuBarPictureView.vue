<script setup lang="ts">
import ButtonWithIcon from './ButtonWithIcon.vue';
import IconBase from '@/assets/icons/icon_base.vue';
import IconImage from '@/assets/icons/icon_image.vue';
import PictureEditer from './PictureEditer.vue';
import constColor from '@/consts/constColor';
import { useColorStore } from '@/stores/color';
import DialogSelect from './DialogSelect.vue';
import { ref, type Ref } from 'vue';
import { usePictureViewStore } from '@/stores/pictureView';

const pictureViewStore = usePictureViewStore();
const colorStore = useColorStore();
const openImageElem: any = ref(null);
const imageUrl: Ref<string> = ref("");
const visibleModalMenu: Ref<boolean> = ref(false);
const inputLocalImageButton: any = ref(null); 

const openImage = () => {
    pictureViewStore.setImage(imageUrl.value);
    hideModalMenu();
}

const showModalMenu = ():void => {
    if(openImageElem.value != null){
        openImageElem.value.show();
    }
}
const hideModalMenu = ():void => {
    if(openImageElem.value != null){
        openImageElem.value.hide();
    }
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

</script>

<template>
    <div class="base">
        <ButtonWithIcon :value="'開く'" v-on:click="showModalMenu">
            <IconBase >
                <IconImage/>
            </IconBase>
        </ButtonWithIcon>
        <PictureEditer/>
        <DialogSelect ref="openImageElem">
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
        </DialogSelect>

        <input
            style="display: none;"
            ref="inputLocalImageButton"
            type="file"
            accept=".jpeg, .jpg, .png"
            v-on:change="openLocalFileImage">  
    </div>
</template>

<style scoped>
    .base{
        display: flex;
        flex-direction: row;
        color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    }
</style>