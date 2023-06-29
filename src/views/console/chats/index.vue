<template>
  <div class="chats">
    <div class="sidebar">
      <FriendList />
    </div>
    <div class="content">
      <ChatModal v-if="store.operateUsername" :username="store.operateUsername" />
    </div>
  </div>

</template>
<script setup lang="js">
import FriendList from './FriendList.vue'
import ChatModal from './chat-modal/index.vue'
import {userStore} from '@/store/userStore.js'
const store = userStore()
</script>
<style lang="scss" scoped>
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
  border-right: 1px solid rgb(214, 214, 214);
}
.content {
  flex: 1;
  background: rgb(245, 245, 245);
  //padding: 20px;
}
</style>
