<script setup lang="ts">
//import {defineProps} from "vue"
import { MutationType  } from "pinia"
import {ref, computed } from "vue";
import { useLayoutStore } from "@/stores/layout";
  const props = defineProps<{
    order: number,
  }>()

  const layoutStore = useLayoutStore();
  layoutStore.$subscribe((mutation, state) => {
    calcWidth();
  });

  const width = ref("0vw");
  const calcWidth = (): void => {
    if(props.order == 0){
      width.value = layoutStore.widthLst[0] + "vw";
    }else if(props.order < layoutStore.widthLst.length){
      width.value = (layoutStore.widthLst[props.order] - layoutStore.widthLst[props.order - 1]) + "vw";
    }else if(props.order == layoutStore.widthLst.length){
      width.value = (100 - layoutStore.widthLst[props.order - 1]) + "vw";
    }else{
      width.value = "0vw";
    }
  }
  calcWidth();
</script>

<template>
  <div class="base">    
    <slot></slot>
  </div>
</template>

<style scoped>

.base {
  width: v-bind(width);
  background-color: palegoldenrod;
}

</style>
