<script setup lang="ts">
import { ref, type Ref } from 'vue';

const emit = defineEmits(['dragstart', "dragend", "dragenter", "dragleave"]);

const positionDeltaY: Ref<string> = ref("0px");
const isDragging: Ref<boolean> = ref(false);
const isMove: Ref<boolean> = ref(false);
const draggableNodeElem: any = ref(null);


const getHeight = (): string => {
    return draggableNodeElem.value.scrollHeight + "px";
}

const setDrag = (isDrag: boolean, deltaY: string): void => {
    isDragging.value = isDrag;
    positionDeltaY.value = deltaY;
    isMove.value = false;
}
const move = (isMoved: boolean): void => {
    isMove.value = isMoved;
}
defineExpose({ getHeight, setDrag, move });

const onDragStart = (e: Event): void => {
    emit("dragstart");
}
const onDragEnd = (e: Event): void => {
    emit("dragend");
}
const onDragEnter = (e:Event): void => {
    emit("dragenter");
}
const onDragLeave = (e:Event): void => {
    emit("dragleave");
}

</script>

<template>
    <div draggable="true" 
        ref="draggableNodeElem"
        class="base"
        v-bind:class="{transition: isDragging, transform: isMove}"
        v-on:dragstart="onDragStart"
        v-on:dragend="onDragEnd"
        v-on:dragenter="onDragEnter"
        v-on:dragleave="onDragLeave">
        <slot></slot>
    </div>
</template>

<style scoped>
    .base {
        width: 100%;
    }
    .transition {
        transition-property: transform;
        transition-duration: 0.5s;
        transition-timing-function: ease;        
    }
    .transform {
        transform: translateY(v-bind(positionDeltaY));
    }
</style>