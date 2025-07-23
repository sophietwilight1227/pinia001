<script setup lang="ts">
  import { usePictureViewStore } from "@/stores/pictureView";
import {onMounted, ref, watch} from "vue";
    const props = defineProps<{
    id: string,
    name: string,
    max: number,
    min: number,
    initialValue: number
    }>()

    const emit = defineEmits(['change']);

    const pictureViewSrtore = usePictureViewStore();

    const currentValue = ref(props.initialValue)
    //watch(currentValue, (newValue) => {
    //    emit("change",props.id ,newValue);
    //})

    const changeValue = (newValue: number):void => {
        currentValue.value = newValue;
    }
    defineExpose({ changeValue });
    
    const increment = ():void => {
      currentValue.value ++;
    }
    const decrement = ():void => {
      currentValue.value --;
    } 
    const onChange = () => {
      emit("change",props.id ,currentValue.value);
    }

    onMounted(()=> {
      changeValue(pictureViewSrtore.getValue(props.id))
    })
</script>

<template>
    <div class="menu_content">
        <span>{{ props.name }}</span>
        <button v-on:click="decrement">◀</button>
        <input type="range" :min="props.min" :max="props.max" v-model="currentValue" v-on:input="onChange"/> 
        <button v-on:click="increment">▶</button>
        <input v-model="currentValue" class="text_value"/>
    </div>
</template>

<style scoped>
.menu_content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  white-space: nowrap;
}
.text_value {
  width: 100%;
  min-width: 20px;
}
</style>
