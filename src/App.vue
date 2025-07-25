<script setup lang="ts">

</script>

<template>
  <main>
    <RouterLink to="/"></RouterLink>
    <router-view></router-view>
  </main>
</template>

<style scoped>
  .main {
    background-color: darkcyan;
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .container {
    display: flex;
    flex-direction: row;
    height: 100%;
    max-width: none;
    overflow: hidden;
    flex-grow: 1;
    align-items: stretch;
  }
</style>
