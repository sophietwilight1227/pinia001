<script setup lang="ts">
import { nextTick, ref, type Ref } from 'vue';

const emit = defineEmits(['click', "change"]);

const props = defineProps<{
    value: string
}>()

const name: Ref<string> = ref(props.value);
const className: Ref<string> = ref("mouseout");

const onButtonClick = ():void => {
    emit("click");
}

const onMouseOver = ():void => {
    className.value = "mouseover"
}
const onMouseOut = ():void => {
    className.value = "mouseout"
}

</script>

<template>
    <span class="button1"
         v-bind:class="className"
         v-on:click="onButtonClick"
         v-on:mouseover="onMouseOver"
         v-on:mouseout="onMouseOut">
        <span>{{ name }}</span>
    </span>

</template>

<style scoped>
    .button1 {
        user-select: none;
        background-color: aliceblue;
    }
    .mouseout {
        background-color: hotpink;
    }
    .mouseover {
        background-color: khaki;
    }
</style>