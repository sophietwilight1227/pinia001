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
    const dividerWidth = 5; //5px
    if(props.order == 0){
      width.value = "calc(" + layoutStore.widthDic.get(props.name)![0] + "vw - " + dividerWidth + "px )"; 
    }else{
      width.value = "calc(" + (layoutStore.widthDic.get(props.name)![props.order] - layoutStore.widthDic.get(props.name)![props.order - 1]) + "vw - " + (dividerWidth * (props.order + 1)) + "px )";
    }
    console.log(width.value);
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
