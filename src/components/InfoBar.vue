<script setup lang="ts">
import { useCharSetStore } from '@/stores/charSet';
import { useMainCanvasStore } from '@/stores/mainCanvas';
import { ref, type Ref } from 'vue';
import { useColorStore } from "@/stores/color";
import constColor from "@/consts/constColor";
import FilesTab from './FilesTab.vue';
import { useExplanationStore } from '@/stores/explanation';

const colorStore = useColorStore();

const currentRow: Ref<number> = ref(1);
const maxRow: Ref<number> = ref(1);
const currentDot: Ref<number> = ref(0);
const fileSize: Ref<number> = ref(0);
const mainCanvasStore = useMainCanvasStore();
const charSetStore = useCharSetStore();

mainCanvasStore.$subscribe(async (mutation, state) => {
  currentRow.value = mainCanvasStore.currentRow;
  maxRow.value = state.maxRow;
  currentDot.value = await charSetStore.calcStrWidth(mainCanvasStore.halfStrCurrentRow);
  fileSize.value = new Blob([mainCanvasStore.asciiArt]).size;
})

const explanationStore = useExplanationStore();

</script>

<template>
    <div class="base">
        <span>
            <span>　[row]: </span>
            <span>
                {{ currentRow + " / " + maxRow }}
            </span>
        </span>
        <span>
            <span>　[dot]: </span>
            <span>{{ currentDot }}</span>
        </span>
        <span>
            <span>　[file size]: </span>
            <span>{{ fileSize }}</span>
            <span> byte</span>
        </span>
        <span>　[detail]</span>
        <span>{{ explanationStore.sentence }}</span>
    </div>
</template>

<style scoped>
    .base {
        color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.PRIMARY));
        border-top: 1px solid v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    }
</style>