<script setup lang="ts">
import { ref, type Ref } from "vue";
import PictureEditer from "./PictureEditer.vue";
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

</script>

<template>
  <div class="base">
    <div>
        <span v-on:click="changeMenu('file')">ファイル</span>
        <span v-on:click="changeMenu('image')">画像</span>
    </div>
    <div v-show="visibleList.get('file')">
        <span>開く</span>
        <span>メニュー1</span>
        <span>メニュー2</span>
    </div>
    <div v-show="visibleList.get('image')">
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
}
</style>
