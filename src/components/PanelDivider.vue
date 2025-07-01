<script setup lang="ts">
  import {onMounted, ref, type Ref} from "vue";
  import { useLayoutStore } from "@/stores/layout";
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

</script>

<template>
    <span class="divider" v-on:drag="move"  ref="myElement"></span>
</template>

<style scoped>
  .divider {
    width: 10px;
    height: 100%;
    background-color: lightgray;
    cursor:w-resize;
    z-index: 500;
  }

</style>
