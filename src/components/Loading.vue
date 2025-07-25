<script setup lang="ts">
import { useColorStore } from '@/stores/color';
import { computed, ref, type Ref } from 'vue';
import constColor from '@/consts/constColor';

const colorStore = useColorStore();
const loadingElem: any = ref(null);
const text: Ref<string> = ref("loading...")

const show = (txt: string) => {
  text.value = txt;
  loadingElem.value.classList.remove("loaded");
}
const hide = () => {
  loadingElem.value.classList.add("loaded");
}
defineExpose({ show, hide });

</script>
<template>
  <div class="loading loaded" ref="loadingElem">
    <p class="loading-text">{{ text }}</p>
    <div class="spinner"></div>
  </div>
</template>
<style scoped>

    .loading {
    /*ローディング画面の縦横幅を画面いっぱいになるように指定*/
    width: 100vw;
    height: 100vh;
    /*ローディング画面の表示位置を固定*/
    position: fixed;
    top: 0;
    left: 0;
    background: v-bind(colorStore.getColor(constColor.COLOR_NAME.PRIMARY));
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /*ローディング画面を0.5秒かけて非表示にする*/
    transition: all 0.5s linear;
    z-index: 4000;
    }

    /*ローディング画面を非表示にする*/
    .loading.loaded {
    /*0.5秒かけてopacityを0にする*/
    opacity: 0;
    visibility: hidden;
    }

    .loading-text {
    color: v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 30px;
    text-align: center;
    }

    .spinner {
    display: block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 4px solid v-bind(colorStore.getColor(constColor.COLOR_NAME.TEXT));
    border-left-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.PRIMARY));
    /* アニメーションを1秒かけて実行 */
    animation: spinner-rotation 1s linear infinite;
    }

    /* アニメーションの設定 */
    @keyframes spinner-rotation {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
    }

    .content {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    }

    .content-text {
    color:#333;
    }
</style>