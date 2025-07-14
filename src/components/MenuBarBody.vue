<script setup lang="ts">
import { ref, type Ref } from 'vue';
import constMenu from '@/consts/constMenu';
import constColor from '@/consts/constColor';
import { useColorStore } from '@/stores/color';
import ButtonText from './ButtonText.vue';
import MenuBarFiles from './MenuBarFiles.vue';
import MenuBarPictureView from './MenuBarPictureView.vue';
import MenuBarSetting from './MenuBarSetting.vue';
import MenuBarExportImage from './MenuBarExportImage.vue';
import MenuBarExportMovie from './MenuBarExportMovie.vue';
import MenuBarEdit from './MenuBarEdit.vue';

const colorStore = useColorStore();
const menuButtons: any = ref(null);
const visibleList: Ref<Map<string, boolean>> = ref(new Map());

const initSetting = ():void => {
    for(let i=0; i < constMenu.BUTTONS_INFO.length; i++){
        visibleList.value.set(constMenu.BUTTONS_INFO[i].id, false);
    }
}   
initSetting();

const changeMenu = (id: string): void => {
    for (let [key, value] of visibleList.value){
        if(key == id){
            visibleList.value.set(id, !visibleList.value.get(id));
        }else{
            visibleList.value.set(key, false);
        }
    }

    for(let i=0; i < constMenu.BUTTONS_INFO.length; i++){
        if(menuButtons.value != null && menuButtons.value[i] != null){
            if(constMenu.BUTTONS_INFO[i].id == id && visibleList.value.get(id)){
                menuButtons.value[i].select(true);
            }else{
                menuButtons.value[i].select(false);
            }
        }
    }
}

</script>

<template>
    <div class="base">
        <div class="mainMenu">
            <ButtonText 
                v-for="data in constMenu.BUTTONS_INFO" 
                ref="menuButtons"
                :value="data.name" 
                v-on:click="changeMenu(data.id)"/>
        </div>
        <MenuBarFiles v-show="visibleList.get('file')"/>
        <MenuBarEdit v-show="visibleList.get('edit')"/>
        <MenuBarPictureView v-show="visibleList.get('image')"/>
        <MenuBarSetting v-show="visibleList.get('setting')"/>
        <MenuBarExportImage v-show="visibleList.get('export_image')"/>
        <MenuBarExportMovie v-show="visibleList.get('export_movie')"/>
        <div class="divider"></div>
    </div>
</template>

<style scoped>
    .base {
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
    }
    .divider {
        height: 1px;
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    }
    .mainMenu {
        width: 100%;
        color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.PRIMARY));
    }
    .divider {
        height: 1px;
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    }
</style>