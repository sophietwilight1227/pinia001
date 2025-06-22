<script setup lang="ts">
//import {defineProps} from "vue"
import { MutationType  } from "pinia"
import {ref, computed ,type Ref} from "vue";
import { useLayoutStore } from "@/stores/layout";
  const props = defineProps<{
    name: string,
    order: number,
  }>()

  const layoutStore = useLayoutStore();
  layoutStore.$subscribe((mutation, state) => {
    calcWidth();
  });
  const myElement:Ref<HTMLElement | null> = ref(null);
  const width = ref("0vw");
  const calcWidth = (): void => {
    let dividerWidth = 1;
    if(props.order == 0){
      width.value = layoutStore.widthDic.get(props.name)![0] - dividerWidth + "%"; 
    }else if(props.order < layoutStore.widthDic.get(props.name)!.length){
      width.value = (layoutStore.widthDic.get(props.name)![props.order] - layoutStore.widthDic.get(props.name)![props.order - 1])- dividerWidth + "%";
    }else if(props.order == layoutStore.widthDic.get(props.name)!.length){
      width.value = (100 - layoutStore.widthDic.get(props.name)![props.order - 1])  + "%";
    }else{
      width.value = "0vw";
    }
  }
  calcWidth();


</script>

<template>
  <div class="base" ref="myElement">     
    <slot></slot>
  </div>
</template>

<style scoped>

.base {
  width: v-bind(width);
  background-color: palegoldenrod;
}

</style>
