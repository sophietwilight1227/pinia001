<script setup lang="ts">
import constColor from '@/consts/constColor';
import { useColorStore } from '@/stores/color';
import { ref, type Ref } from 'vue';

const colorStore = useColorStore();
const props = defineProps<{
                            title: string
                        }>()

const visibleModalMenu: Ref<boolean> = ref(false);

const show = (): void => {
    visibleModalMenu.value = true;
}
const hide = (): void => {
    visibleModalMenu.value = false;
}
defineExpose({ show, hide });

</script>

<template>
    <div v-show="visibleModalMenu" class="modalMenuFrame">
        <div class="modalMenuBackground"></div>

        <div class="modalMenu">
            <div class="title">{{ props.title }}</div>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .title {
        border-bottom: 1px solid;
        padding-left: 10px;
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.PRIMARY));
    }
    .modalMenu {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 2000;
        box-shadow: 0 10px 25px 0 rgba(0, 0, 0, .5);
        color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.SECONDARY));
    }
    .content {
        padding: 10px;
    }
    .modalMenuBackground {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: white;
        opacity: 0.5;
        z-index: 1900;
        background-position: center;
    }
    .modalMenuFrame {
    display: flex;
    justify-content: center;
    }
</style>