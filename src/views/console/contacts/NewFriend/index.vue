<template>
  <div class="new-friend-top">
    新的朋友
  </div>
  <div v-for="item in store.addHistory" :key="item.work_id" class="new-friend__item">
    <div style="display: flex;line-height: 70px">
      <div style="flex: 1; font-size: 12px">
        <img style="float: left;margin-top: 10px" :src="item.peer_user_info.avatar" :width="48" :height="48" alt="">
        <div style="line-height: 30px;margin-top: 5px; margin-left: 60px">
          <div>{{ item.peer_user_info.nickname }}</div>
          <div>{{ item.greeting }}</div>
        </div>
      </div>
      <div v-if="item.from_username === store.userInfo.username && item.friend_add_status === 2" style="font-size: 14px">
        已添加
      </div>
      <div v-else-if="item.from_username === store.userInfo.username && item.friend_add_status === 1" style="font-size: 14px">
        已发送
      </div>
      <div v-else-if="item.to_username === store.userInfo.username && item.friend_add_status === 1" style="font-size: 14px">
        <el-button class="btn-accept" @click="acceptFriend(item)">接受</el-button>
      </div>
      <div v-else-if="item.to_username === store.userInfo.username && item.friend_add_status === 2" style="font-size: 14px">
        已添加
      </div>

    </div>
    <div style="border-bottom: 1px solid rgb(234, 234, 234)" />
  </div>
</template>
<script setup lang="js">
import {userStore} from '@/store/userStore.js'
import {inject, onMounted} from 'vue'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'

const store = userStore()

const globalFunc = inject('globalFunc')
const acceptFriend = async (v) => {
  const res = await post(ApiPath.USER_ADD_HANDLE, {
    work_id: v.work_id,
    add_friend_reply_status: 1
  })
  if (res.code === 0) {
    globalFunc.getFriendInfos()
    globalFunc.getUserMsg()
  }
}

</script>
<style lang="scss" scoped>
.new-friend-top{
  padding-left: 20px;
  line-height: 60px;
  height: 60px;
  background-color: rgb(245,245,245);
}
.new-friend__item{
  padding: 0  60px;
  line-height: 70px;
  height: 70px;
}
</style>
