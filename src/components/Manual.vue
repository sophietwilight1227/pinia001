<script setup lang="ts">
import { ref, type Ref } from 'vue';
import constColor from '@/consts/constColor';
import { useColorStore } from '@/stores/color';
const colorStore = useColorStore();

const text: Ref<string> = ref("");
// 子が親からのメッセージを受信する場合
window.addEventListener("message", (event) => {
    if(typeof event.data == "string"){
      text.value = event.data;
    }
})

</script>
<template>
    <div class="base">
        <div class="title">AHoge Editor マニュアル</div>
        <div class="manual">{{ text }}</div>        
    </div>
</template>
<style scoped>
.base {
    padding: 30px;
    background-color: white;
}
.title {
    background-color: white;
}
.manual {
    white-space: pre;
}
</style>