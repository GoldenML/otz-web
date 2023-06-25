<template>
  <div class="chats">
    <div class="sidebar">
      <FriendList @changeFriend="handleChangeFriend"/>
    </div>
    <div class="content">
<!--      <router-view></router-view>-->
      <ChatModal @updateMessage="updateMessage" v-if="store.operateUsername" :username="store.operateUsername"></ChatModal>
    </div>
  </div>

</template>
<script setup lang="js">
import FriendList from "./FriendList.vue";
import {onMounted, ref} from "vue";
import ChatModal from './chat-modal/index.vue'
import {useRoute, useRouter} from "vue-router";
import {userStore} from "@/store/userStore.js";
const username = ref(null)
const route = useRoute()
const store = userStore()
const updateMessage = () => {

}
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
  background: rgb(245, 245, 245);
  //padding: 20px;
}
</style>
