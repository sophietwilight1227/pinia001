<script setup lang="ts">
  import {ref, type Ref} from "vue";
  import { useLayoutStore } from "@/stores/layout";
    const props = defineProps<{
    order: number,
    layoutName: string,
    }>()

    const layoutStore = useLayoutStore();
    //const emit = defineEmits(['dragDivider']);

    const move = (e: DragEvent): void => {
       
        //layoutStore.widthLst[props.order] += (e.movementX * 5 / myElement.value?.offsetWidth);
        if( e.x != 0){
          //console.log(props)
          layoutStore.editLayout(props.layoutName, props.order, e.x / window.innerWidth * 100);
        }
    }

    const onMouseDown = (e: MouseEvent): void => {

    }
    const onMouseUp = (e: MouseEvent): void => {

    }
    const onMouseMove = (e: MouseEvent): void => {
    }
    const onMouseOut = (e:MouseEvent):void => {
      console.log("out: " + e.movementX);
    }
</script>

<template>
    <div class="divider" v-on:mousedown="onMouseDown" v-on:mouseup="onMouseUp" v-on:mousemove="onMouseMove" v-on:drag="move" v-on:mouseout="onMouseOut"></div>
</template>

<style scoped>
  .divider {
    width: 5px;
    background-color: lightgray;
    cursor:w-resize;
    z-index: 500;
  }

</style>
