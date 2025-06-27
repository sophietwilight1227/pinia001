<script setup lang="ts">
import { ref, type Ref } from "vue";
import PictureEditer from "./PictureEditer.vue";
import IconFile from "@/assets/icons/icon_file.vue";
import IconFolder from "@/assets/icons/icon_folder.vue";
import IconBase from "@/assets/icons/icon_base.vue";
import IconImage from "@/assets/icons/icon_image.vue";
import { usePictureViewStore } from "@/stores/pictureView";

const pictureViewSrtore = usePictureViewStore();

const visibleList: Ref<Map<string, boolean>> = ref(new Map())

const initSetting = ():void => {
    visibleList.value.set("file", false);
    visibleList.value.set("image", false);
}   
initSetting();

const changeMenu = (id: string): void => {
    for (let [key, value] of visibleList.value){
        visibleList.value.set(key, false);
    }
    visibleList.value.set(id, true);
}

const openImage = () => {
    pictureViewSrtore.setImage('https://ap1.sozaitamago.com/common/img/tamago/sample/image/Sisk0111.jpg');
}
</script>

<template>
  <div class="base">
    <div>
        <span v-on:click="changeMenu('file')">ファイル</span>
        <span v-on:click="changeMenu('image')">画像</span>
    </div>
    <div v-show="visibleList.get('file')" class="hasSubMenu">
        <div>
            <IconBase>
                <IconFile/>
            </IconBase>
            <span>新規</span>
        </div>
        <div>
            <IconBase >
                <IconFolder/>
            </IconBase>
            <span>開く</span>
        </div>

    </div>
    <div v-show="visibleList.get('image')" class="hasSubMenu">
        <div v-on:click="openImage">
            <IconBase>
                <IconImage/>
            </IconBase>
            <span>開く</span>
        </div>
        <PictureEditer/>
    </div>
  </div>
</template>

<style scoped>

.base {
    background-color: antiquewhite;
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
</style>
