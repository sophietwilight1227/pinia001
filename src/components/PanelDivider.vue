<script setup lang="ts">
  import {ref, type Ref} from "vue";
  import { useLayoutStore } from "@/stores/layout";
    const props = defineProps<{
    order: number,
    layoutName: string,
    }>()

    const myElement: Ref<HTMLElement | null> = ref(null);
    const layoutStore = useLayoutStore();

    const move = (e: DragEvent): void => {
        if( e.x != 0 && myElement.value != null){
          if(myElement.value.parentElement != null){
            layoutStore.editLayout(props.layoutName, props.order, (e.x - myElement.value?.parentElement.getBoundingClientRect().x ) / myElement.value?.parentElement.offsetWidth * 100);
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
    background-color: lightgray;
    cursor:w-resize;
    z-index: 500;
  }

</style>
