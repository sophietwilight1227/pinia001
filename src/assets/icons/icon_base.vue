<script setup lang="ts">

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
            color: '#000000',
            weight: 16,
            filled: false,
            addClass: '',
            viewBox:  '0 0 256 256'
    } )

</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="image1"
    :width="size"
    :height="props.size"
    :viewBox="props.viewBox"
    :class="props.addClass"
    :stroke="props.color"
    :stroke-width="props.filled ? '0' : props.weight"
    :fill="filled ? props.color : ''"
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