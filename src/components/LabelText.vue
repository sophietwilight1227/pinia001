
<script setup lang="ts">

import { useColorStore } from '@/stores/color';
import constColor from '@/consts/constColor';

const colorStore = useColorStore();

const props = defineProps<{
    value: string
}>()

</script>
<template>
    <div class="label1">{{ value }}</div>
</template>

<style scoped>
    .label1 {
        display: inline-block;
        padding: 0px 5px 0px 5px;
        user-select: none;
        color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    }
</style>