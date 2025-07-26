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
    <!-- ローディング画面 -->
    <div class="loading loaded" ref="loadingElem">
        <p class="loading-text">Loading...</p>
        <div class="spinner"></div>
    </div>
</template>
<style scoped>

</style>