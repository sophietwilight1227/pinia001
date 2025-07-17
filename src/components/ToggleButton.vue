<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useColorStore } from '@/stores/color';
import constColor from '@/consts/constColor';

    export interface Props {
        size?: number,
    }
    const props = withDefaults(defineProps<Props>(),
            {size: 20,
    } )

    const emit = defineEmits(['click']);

    const colorStore = useColorStore();
    const isActive: Ref<boolean> = ref(false);
    const onClick = () => {
        isActive.value = !isActive.value;
        emit("click", isActive.value);
    }
</script>

<template>
    <div class="switch_outer" 
        v-on:click="onClick"
        v-bind:class="{active: isActive}">
        <div class="toggle_switch" 
            v-bind:class="{active: isActive}"></div>
    </div>
</template>

<style scoped>
    .switch_outer {
        background-color: lightgray;
        position: relative;
        cursor: pointer;
        transition: background-color .2s ease-in-out;
        width: v-bind($props.size.valueOf() * 2 + "px");
        height: v-bind($props.size.valueOf() + "px");
        border-radius: v-bind($props.size.valueOf() / 2 + "px");;           
    }
    .switch_outer.active {
        background-color: v-bind(colorStore.getColor(constColor.COLOR_NAME.ACCENT));
    }
    .toggle_switch {
        border-radius: 50%;
        position: absolute;
        background-color: white;
        top: 0;
        bottom: 0;
        margin: auto;
        transition: left .3s ease-in-out;
        width: v-bind($props.size.valueOf() * 0.8 + "px");
        height: v-bind($props.size.valueOf() * 0.8 + "px");
        left: v-bind($props.size.valueOf() * 0.1 + "px"); /* (1 - 0.8) / 2 = 0.1 */
    }
    .toggle_switch.active {
        left: v-bind($props.size.valueOf() * 1.1 + "px");
    }

</style>