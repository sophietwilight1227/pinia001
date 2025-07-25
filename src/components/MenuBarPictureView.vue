<script setup lang="ts">
import ButtonWithIcon from './ButtonWithIcon.vue';
import IconBase from '@/assets/icons/icon_base.vue';
import IconImage from '@/assets/icons/icon_image.vue';
import PictureEditer from './PictureEditer.vue';
import constColor from '@/consts/constColor';
import { useColorStore } from '@/stores/color';
import DialogSelect from './DialogSelect.vue';
import { nextTick, onMounted, ref, type Ref } from 'vue';
import { usePictureViewStore } from '@/stores/pictureView';
import IconReload from '@/assets/icons/icon_reload.vue';
import ButtonText from './ButtonText.vue';
import { connect, put, get } from "@/scripts/indexeddb"

const pictureViewStore = usePictureViewStore();
const colorStore = useColorStore();
const openImageElem: any = ref(null);
const imageUrl: Ref<string> = ref("");
const visibleModalMenu: Ref<boolean> = ref(false);
const inputLocalImageButton: any = ref(null); 

const openImage = async () => {
    pictureViewStore.setImage(imageUrl.value);
    hideModalMenu();
    saveUrl();
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
        saveCurrentImage();
    } 
}
const saveCurrentImage = async () => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');
    const image:any = await loadImage(imageUrl.value);
    canvas.height = image.height;
    canvas.width = image.width;
    ctx.drawImage(image, 0, 0);
    const blob: any = await new Promise(resolve => canvas.toBlob(resolve));
    const reader: any = await readFile(blob);
    const db: any = await connect("ahoge_editor", 1, "trace_picture", "id");
    await put(db,"trace_picture" , {id: "prev", value: reader.result})
}
const loadImage = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

const readFile = (value: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(value);
  });
}
const loadPrevImage = async () => {
    const db: any = await connect("ahoge_editor", 1, "trace_picture", "id");
    //await put(db,"trace_picture" , {id: "prev", value: "test_name"})
    const obj: {id: string, value: string} = await get(db, "trace_picture", "prev");
    imageUrl.value = obj.value;
    openImage();
}
const saveUrl = async () => {
    const db: any = await connect("ahoge_editor", 1, "trace_picture", "id");
    await put(db,"trace_picture" , {id: "prev", value: imageUrl.value})
}
const setURL = (e: any) => {
    imageUrl.value = e.target.value;
}
onMounted(() => {
    loadPrevImage();
})

</script>

<template>
    <div class="base">
        <ButtonWithIcon :value="'開く'" v-on:click="showModalMenu">
            <IconBase >
                <IconImage/>
            </IconBase>
        </ButtonWithIcon>
        <ButtonWithIcon :value="'設定初期化'" v-on:click="pictureViewStore.resetParams">
            <IconBase>
                <IconReload/>
            </IconBase>
        </ButtonWithIcon>
        <PictureEditer/>
        <DialogSelect v-show="visibleModalMenu" :title="'画像選択'">
            <div>
                <div>ウェブ</div>
                <input type="text" v-on:change="setURL"/>
                <ButtonText :value="'開く'" v-on:click="openImage"/>    
            </div>
            <div>
                <div>ローカル</div>
                <ButtonText :value="'参照(ローカル)'" v-on:click="onClickOpenLocalImage"/>
            </div>
            <ButtonText :value="'キャンセル'" v-on:click="hideModalMenu"/>
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