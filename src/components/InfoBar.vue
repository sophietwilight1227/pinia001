<script setup lang="ts">
import { useCharSetStore } from '@/stores/charSet';
import { useMainCanvasStore } from '@/stores/mainCanvas';
import { ref, type Ref } from 'vue';
import { useColorStore } from "@/stores/color";
import constColor from "@/consts/constColor";

const colorStore = useColorStore();

const currentRow: Ref<number> = ref(1);
const maxRow: Ref<number> = ref(1);
const currentDot: Ref<number> = ref(0);
const mainCanvasStore = useMainCanvasStore();
const charSetStore = useCharSetStore();

mainCanvasStore.$subscribe((mutation, state) => {
  currentRow.value = mainCanvasStore.currentRow;
  maxRow.value = state.maxRow;
  currentDot.value = charSetStore.calcStrWidth(mainCanvasStore.halfStrCurrentRow);
})

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
        <span>　[ここに操作の説明など]</span>
    </div>
</template>

<style scoped>
    .base {
        color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.PRIMARY));
    }
</style>