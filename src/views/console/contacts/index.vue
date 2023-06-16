<template>
  <div class="contacts">
    <div class="sidebar">
      <FriendList @changeFriend="handleChangeFriend"/>
    </div>
    <div class="content">
<!--      <router-view></router-view>-->
      <FriendInfo v-if="friendInfo" :data="friendInfo"></FriendInfo>
    </div>
  </div>

</template>
<script setup lang="ts">
import FriendList from "./FriendList.vue";
import FriendInfo from './FriendInfo/index.vue'
import {reactive, ref} from "vue";

const friendInfo = ref(null)

const handleChangeFriend = (info) => {
  friendInfo.value = info
}
</script>
<style lang="scss" scoped>
.card{
  background-color: #60afcc;
  display: flex;
  height: 100vh;
}
.contacts{
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
  background-color: rgb(234, 234, 234);
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgb(214, 214, 214);
}
.content {
  flex: 1;
  padding: 20px;
  background-color: rgb(245, 245, 245);
}
</style>
