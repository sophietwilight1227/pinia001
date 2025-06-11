<script setup lang="ts">
  import {ref, type Ref} from "vue";
  import { useLayoutStore } from "@/stores/layout";
    const props = defineProps<{
    order: number,
    }>()

    const layoutStore = useLayoutStore();

    const move = (e: DragEvent): void => {
        //layoutStore.widthLst[props.order] += (e.movementX * 5 / myElement.value?.offsetWidth);
        if( e.x != 0){
          if(myElement.value == null){
            layoutStore.widthLst[props.order] = 0;
          }else{
            layoutStore.widthLst[props.order] = ( e.x * 0.3 / myElement.value.offsetWidth);
          }
            
            console.log(layoutStore.widthLst[props.order] );
        }
    }
    const myElement:Ref<HTMLElement | null> = ref(null);
</script>

<template>
    <div class="divider" v-on:drag="move"  ref="myElement"></div>
</template>

<style scoped>
  .divider {
    width: 0.3vw;
    background-color: lightgray;
    cursor:w-resize;
  }

</style>
