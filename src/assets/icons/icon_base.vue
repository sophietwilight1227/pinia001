<script setup lang="ts">
import { useColorStore } from '@/stores/color';
import constColor from '@/consts/constColor';
import { ref, type Ref } from 'vue';

const colorStore = useColorStore();
const color: Ref<string> = ref("");

    export interface Props {
        size?: number,
        color?: string,
        weight?: number,
        filled?: boolean,
        addClass?: string,
        viewBox?: string
    }
    const props = withDefaults(defineProps<Props>(),
            {size: 40,
            color:  "default",
            weight: 16,
            filled: false,
            addClass: '',
            viewBox:  '0 0 256 256'
    } )

    const initColor = () => {
      if(props.color == "default"){
        color.value = colorStore.getColor(constColor.COLOR_NAME.TEXT);
      }else{
        color.value = props.color;
      }
    }
    initColor();

</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="image1"
    :width="size"
    :height="props.size"
    :viewBox="props.viewBox"
    :class="props.addClass"
    :stroke="color"
    :stroke-width="props.filled ? '0' : props.weight"
    :fill="filled ? color : ''"
  >
    <slot></slot>
  </svg>
    
</template>
<style scoped>
    .image1 {
        display: flex;
        justify-content:center;
        width: 100%;
    }
</style>