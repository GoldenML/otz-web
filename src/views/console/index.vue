<template>
  <div class="layout-container">
    <div class="sidebar">
      <Menu></Menu>
    </div>
    <div class="content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script setup lang="ts">
import Menu from './Menu.vue'
</script>
<style lang="scss" scoped>
.layout-container {
  display: flex;
  height: 100vh;
  @include scrollBar(#868788, #606266, transparent);
}

.sidebar {
  width: 62px;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
}
</style>
