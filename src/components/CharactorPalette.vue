<script setup lang="ts">
import { useSettingStore } from "@/stores/settings";
import CharactorList from './CharactorList.vue';

const settingStore = useSettingStore();
settingStore.initCharPalette();

</script>

<template>
  <div class="base">    
    <CharactorList/>
  </div>
</template>

<style scoped>

.base {
  background-color: lightseagreen;
}

</style>
