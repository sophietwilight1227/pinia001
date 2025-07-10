<script setup lang="ts">
import { nextTick, ref, type Ref } from 'vue';
import IconBase from '@/assets/icons/icon_base.vue';
import { useColorStore } from '@/stores/color';
import constColor from '@/consts/constColor';

const emit = defineEmits(['click', "change"]);

const props = defineProps<{
    value: string
}>()

const colorStore = useColorStore();
const name: Ref<string> = ref(props.value);
const className: Ref<string> = ref("mouseout");

const onButtonClick = () => {
    //点滅アニメーションがあるといいかも
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
    <div class="button1"
         v-bind:class="className"
         v-on:click="onButtonClick"
         v-on:mouseover="onMouseOver"
         v-on:mouseout="onMouseOut">
        <slot></slot>
        <span>{{ name }}</span>
    </div>

</template>

<style scoped>
    .button1 {
        padding: 0px 5px 0px 5px;
        user-select: none;
        display: flex;
        flex-direction: column;
        justify-content:center;
        align-items: stretch;
        text-align: center;
        color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    }
    .mouseout {
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
    }
    .mouseover {
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.ACCENT));
    }
</style>