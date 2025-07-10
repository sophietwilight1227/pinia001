<script setup lang="ts">
//import {defineProps} from "vue"
import { MutationType  } from "pinia"
import {ref, computed ,type Ref} from "vue";
import { useLayoutStore } from "@/stores/layout";
import { useColorStore } from '@/stores/color';
import constColor from '@/consts/constColor';

const colorStore = useColorStore();

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
      width.value = "calc(" + layoutStore.widthDic.get(props.name)![0].widthRatio + "vw - " + dividerWidth + "px )"; 
    }else{
      width.value = "calc(" + (layoutStore.widthDic.get(props.name)![props.order].widthRatio - layoutStore.widthDic.get(props.name)![props.order - 1].widthRatio) + "vw - " + (dividerWidth * (props.order + 1)) + "px )";
    }
  }
  calcWidth();


</script>

<template >
  <div class="base" ref="myElement">     
    <slot></slot>
  </div>
</template>

<style scoped>

.base {
  max-height: 100%;
  width: v-bind(width);
  overflow: hidden;
  flex-grow: 1;
  background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.MAIN_CANVAS_BACKGROUND));
}

</style>
