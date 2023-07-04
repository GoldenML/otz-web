<template>
  <div class="contacts">
    <div class="sidebar">
      <FriendList @handleChange="handleChangeFriend" />
    </div>
    <div class="content">
      <!--      <router-view></router-view>-->
      <FriendInfo v-if="identity === 'friend'" :data="friendInfo" />
      <NewFriend v-else-if="identity === 'new_friend'" />
      <GroupInfo v-else-if="identity === 'group'" :group-id="groupInfo.group_id" :group-name="groupInfo.group_name" />
    </div>
  </div>

</template>
<script setup lang="js">
import FriendList from './FriendList.vue'
import FriendInfo from './FriendInfo/index.vue'
import NewFriend from './NewFriend/index.vue'
import GroupInfo from './GroupInfo/index.vue'
import {reactive, ref} from 'vue'
import {userStore} from '@/store/userStore.js'

const friendInfo = ref(null)
const showNewFriend = ref(false)
const store = userStore()
const groupInfo = ref(null)
const identity = ref('')
const handleChangeFriend = (type, val, idx) => {
  identity.value = type
  if (type === 'new_friend') {
    showNewFriend.value = true
  } else if(type === 'friend') {
    friendInfo.value = store.friendInfos[idx]
  } else if(type === 'group') {
    groupInfo.value = store.groupInfos[idx]
  }
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
  //padding: 20px;
  background-color: rgb(245, 245, 245);
}
</style>
