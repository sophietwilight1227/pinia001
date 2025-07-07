<script setup lang="ts">
import { nextTick, ref, type Ref } from 'vue';

const emit = defineEmits(['click', "change"]);

const props = defineProps<{
    value: string
}>()

const textarea: any = ref(null);
const name: Ref<string> = ref(props.value);
const className: Ref<string> = ref("notSelected");
const selected: Ref<boolean> = ref(false);
const isEdit: Ref<boolean> = ref(false);

const select = (isSelected: boolean):void => {
    selected.value = isSelected;
    if(isSelected){
        className.value = "selected"
    }else{
        className.value = "notSelected"
        //isEdit.value = false;
    }
}

defineExpose({ select });

const onButtonClick = ():void => {
    emit("click");
}
const onDoubleClick = async () => {
    isEdit.value = true;
    await nextTick();
    if(textarea.value != null){
        textarea.value.focus();
        textarea.value.setSelectionRange(0,name.value.length);
    }
}
const onMouseOver = ():void => {
    
}
const onMouseOut = ():void => {
    
}
const onFocusOutTextArea = ():void => {
    isEdit.value = false;
    emit("change", name.value);
}
const onKeyDown = (e: KeyboardEvent):void => {
	if(e.key === 'Enter'){
        if(textarea.value != null){
            textarea.value.blur();
        }
	}
}


</script>

<template>
    <div class="button1"
         v-bind:class="className"
         v-on:click="onButtonClick"
         v-on:dblclick="onDoubleClick"
         v-on:mouseover="onMouseOver"
         v-on:mouseout="onMouseOut">
        <span v-show="!isEdit">{{ name }}</span>
        <input type="text" 
                v-model="name" 
                v-show="isEdit" 
                v-on:keydown="onKeyDown"
                v-on:focusout="onFocusOutTextArea"
                ref="textarea">
    </div>

</template>

<style scoped>
    .button1 {
        user-select: none;
    }
    .selected {
        background-color: aqua;
    }
    .notSelected {
        background-color: violet;
    }
</style>