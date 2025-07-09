<script setup lang="ts">
import { ref, type Ref } from 'vue';

const props = defineProps<{
                            //onClickOk: Function
                        }>()
const sentence: Ref<string> = ref("");
const isShown: Ref<boolean> = ref(false);
const resolve: Ref<Function> = ref(() => {});


const confirm = (text: string): Promise<boolean> => {
      sentence.value = text;
      isShown.value = true;
      return new Promise((resolve_: (v: boolean) => void) => {
        resolve.value = resolve_;
      });
}
defineExpose({ confirm });

const onClickOk = (): void => {
    reset();
    resolve.value(true);
}
const onClickCancel = (): void => {
    reset();
    resolve.value(false);
}
const reset = ():void => {
    sentence.value = "";
    isShown.value = false;
}
</script>

<template>
    <div class="base" v-show="isShown">
        <div>{{ sentence }}</div>
        <div v-on:click="onClickOk">ok</div>
        <div v-on:click="onClickCancel">cancel</div>
    </div>
</template>

<style scoped>
    .base {
        background-color: white;
        position:absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 2010;
    }
</style>