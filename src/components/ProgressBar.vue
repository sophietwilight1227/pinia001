<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';


const maxValue: Ref<number> = ref(100);
const currentValue: Ref<number> = ref(0); 

const setMax = (value: number) => {
    maxValue.value = value;
}
const setValue = (value: number) => {
    currentValue.value = value;
}
defineExpose({ setValue, setMax });

const percentage = computed(() => {
    return currentValue.value / maxValue.value * 100 + "%";
})
</script>
<template>
    <div class="progress">
        <div class="progressBar"></div>
    </div>        
</template>
<style scoped>
.progress{
    position: relative;
    width: 100%;
    height: 40px;
    background-color: white;
}
.progressBar{
        position:absolute;
        top: 0px;
        left: 0px;
        height: 100%;
        background-color: red;
        width: v-bind(percentage);
}
</style>