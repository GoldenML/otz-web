<template>
  <div class="chats">
    <div class="sidebar">
      <FriendList />
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>

</template>
<script setup lang="ts">
import FriendList from "./FriendList.vue";
</script>
<style lang="scss" scoped>
.card{
  background-color: #60afcc;
  display: flex;
  height: 100vh;
}
.chats{
  display: flex;
  height: 100%;
}
.layout-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  height: 100%;
  width: 250px;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
  //padding: 20px;
}
</style>
