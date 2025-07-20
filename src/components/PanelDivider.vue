<script setup lang="ts">
import {onMounted, ref, type Ref} from "vue";
import { useLayoutStore } from "@/stores/layout";
import { useColorStore } from '@/stores/color';
import constColor from '@/consts/constColor';

const colorStore = useColorStore();

    const props = defineProps<{
    order: number,
    layoutName: string,
    }>()

    const myElement: Ref<HTMLElement | null> = ref(null);
    const layoutStore = useLayoutStore();

    const initSize = ():void => {
      if( myElement.value != null){
        if(myElement.value.parentElement != null){
          const width:number = myElement.value?.parentElement.getBoundingClientRect().width;
          const height: number = myElement.value?.parentElement.getBoundingClientRect().height;
          layoutStore.initSize(height, width, props.order);        
        }
      }
    }
    onMounted(() => {
      initSize();
    })
   

    const move = (e: DragEvent): void => {
        if( e.x != 0 && myElement.value != null){
          if(myElement.value.parentElement != null){
            const percentage: number = (e.x - myElement.value?.parentElement.getBoundingClientRect().x ) / myElement.value?.parentElement.getBoundingClientRect().width * 100;
            const width:number = myElement.value?.parentElement.getBoundingClientRect().width;
            const height: number = myElement.value?.parentElement.getBoundingClientRect().height;
            layoutStore.editLayout(props.layoutName, props.order, percentage, height, width);
          }
        }
    }
    const onDragStart = (e:any) => {
      console.log("mouse down");
      layoutStore.isDragging = true;
    }
    const onDragEnd = (e:any) => {
      console.log("mouse up");
      layoutStore.isDragging = false;
    }

</script>

<template>
    <span class="divider" 
          v-on:drag="move"
          v-on:dragstart="onDragStart"  
          v-on:dragend="onDragEnd"
          ref="myElement"></span>
</template>

<style scoped>
  .divider {
    width: 10px;
    height: 100%;
    cursor:w-resize;
    z-index: 500;
    background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.PRIMARY));
  }

</style>
