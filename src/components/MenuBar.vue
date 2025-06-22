<script setup lang="ts">
import { ref, type Ref } from "vue";
const visibleList: Ref<Map<string, string>> = ref(new Map())

const initFiles = ():void => {
    visibleList.value.set("files", "none");
    visibleList.value.set("files_menu1", "none");
    visibleList.value.set("edit", "none");
    visibleList.value.set("setting", "none");
}   
  const onMouseOver = (name: string):void => {
    visibleList.value.set(name, "block");
  }
  const onMouseOut = (name: string):void => {
    visibleList.value.set(name, "none");
  }

initFiles();

</script>

<template>
  <div class="base">    
    <span v-on:mouseover="onMouseOver('files')" v-on:mouseout="onMouseOut('files')" >
        <span>ファイル</span>
        <p class="baloon" :style="{display: visibleList.get('files')}">
            <span class="hasSubMenu" v-on:mouseover="onMouseOver('files_menu1')" v-on:mouseout="onMouseOut('files_menu1')" >
                <span>メニュー1</span>
                <span :style="{display: visibleList.get('files_menu1')}">
                    <div>メニュー1-1</div>
                    <div>メニュー1-2</div>
                </span>
            </span>
            <div>メニュー2</div>
            <div>メニュー3</div>
            <div>メニュー4</div>
        </p>
    </span>
    <span v-on:mouseover="onMouseOver('edit')" v-on:mouseout="onMouseOut('edit')" >
        <span>編集</span>
        <p class="baloon" :style="{display: visibleList.get('edit')}">
            <div>メニュー2</div>
            <div>メニュー3</div>
            <div>メニュー4</div>
        </p>
    </span>
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
