<script setup lang="ts">
  import {ref} from "vue";
  import { useLayoutStore } from "@/stores/layout";
    const props = defineProps<{
    order: number,
    }>()

    const layoutStore = useLayoutStore();

    const move = (e: DragEvent): void => {
        //layoutStore.widthLst[props.order] += (e.movementX * 5 / myElement.value?.offsetWidth);
        if( e.x != 0){
            layoutStore.widthLst[props.order] = ( e.x * 0.3 / myElement.value?.offsetWidth);
            console.log(layoutStore.widthLst[props.order] );
        }
    }
    const myElement = ref(null);
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
