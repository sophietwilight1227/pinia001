<script setup lang="ts">
import {computed, ref, watch, type Ref} from "vue";
import RangeSlider from "./RangeSlider.vue"
import constPictureView from "@/consts/constPictureView";
import { useMainCanvasStore } from "@/stores/mainCanvas";
import MainCanvas from "./MainCanvas.vue";
import { usePictureViewStore } from "@/stores/pictureView";
import { useLayoutStore } from "@/stores/layout";

const layoutStore = useLayoutStore();
  layoutStore.$subscribe((mutation, state) => {
    canvasSize.value.height = state.canvasSize.height;
    canvasSize.value.width = state.canvasSize.width;
  })
  const canvasSize: Ref<{height: string, width: string}> = ref({height: "100%", width: "100%"})

</script>

<template>
  <div class="base">
      <MainCanvas/>
  </div>

</template>

<style scoped>
.base {
  overflow: hidden;
  position: relative;
  height: v-bind(canvasSize.height);
  width: v-bind(canvasSize.width);
}


</style>
