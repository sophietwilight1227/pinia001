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
    <div class="loading">
        <span class="circle"></span>
    </div> 
</template>
<style scoped>
.loading {
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: #fdfdfd;
}
.loading.hide {
  opacity: 0;
  pointer-events: none;
  transition: opacity 500ms;
}
.loading.circle {
  display: block;
  position: relative;
  top: cacl(50% - 20px);
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border: 8px solid #e0e0e0;
  border-top: 7px solid #fffccc;
  border-radius: 50px;
  animation: loading 700ms linear 0ms infinite normal both;
}
@keyframes loading {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>