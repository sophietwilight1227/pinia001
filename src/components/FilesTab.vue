<script setup lang="ts">
import { ref, type Ref } from "vue";
const testList: Ref<Array<string>> = ref([])

const initFiles = ():void => {
    for(let i=0; i < 3; i++){
        testList.value.push(" test" + i + " ")
    }
}   
const addFile = ():void => {
    testList.value.push(" test" + (testList.value.length + 1) + " ")
}
const deleteFile = (index: number):void => {
    testList.value.splice(index, 1);
}

initFiles();

</script>

<template>
  <div class="base">    
    <span v-for="(data, i) in testList" class="tab">
        <span class="tab">
            <span>{{ data }}</span>
            <span class="button" v-on:click="deleteFile(i)"> _delete_ </span>
        </span>
    </span>
    <span class="button" v-on:click="addFile"> _add_ </span>
  </div>
</template>

<style scoped>

.base {
    background-color: antiquewhite;
}

.tab {
    background-color: aqua;
}

.button{
    background-color: pink;
}
</style>
