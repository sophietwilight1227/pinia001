<script setup lang="ts">
import { useMainCanvasStore } from '@/stores/mainCanvas';
import ToggleButton from './ToggleButton.vue';

const mainCanvasStore = useMainCanvasStore();

const setRectSelectMode = (value: boolean):void => {
    mainCanvasStore.setRecSelectMode(value);
}

</script>
<template>
    <div>
        <div>矩形選択切り替え</div>
        <ToggleButton v-on:click="setRectSelectMode"/>    
        <div>行末空白削除</div>        
    </div>
</template>

<style scoped>

</style>