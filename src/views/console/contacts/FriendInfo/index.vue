<template>
  <div class="content">
    <div class="content1">
      <div>
        <img :src="data.avatar" :width="60" :height="60" alt="" />
      </div>
      <div style="font-size: 14px; margin-left: 10px">
        <div>{{data.nickname}}
          <el-icon color="rgb(16, 174, 255)" size="16">
            <UserFilled />
          </el-icon>
        </div>
        <div style="font-size: 12px">用户名：{{data.username}}</div>
        <div style="font-size: 12px">地区：{{data.city}}</div>

      </div>
      <div style="position: absolute; right: 0">
        <el-popover
            :popper-style="{padding: 0, width: '130px', 'min-width': '140px'}"
            placement="right-start"
            :width="200"
            trigger="click"
            content="this is content, this is content, this is content"
        >
          <template #default>
            <div @click="handleDeleteFriend(data)" class="more-item">删除联系人</div>
          </template>
          <template #reference>
            <el-icon style="cursor:pointer;"><MoreFilled ></MoreFilled></el-icon>
          </template>
        </el-popover>

      </div>
    </div>

    <el-divider></el-divider>
<!--    <div class="content2">-->
<!--      <div>备注名：</div>-->
<!--    </div>-->
<!--    <el-divider></el-divider>-->
    <div class="content3">
      <el-button @click="handleSendMsg" class="btn-conditional">发消息</el-button>
    </div>
  </div>

</template>
<script setup lang="js">
import {post} from "@/utils/request.js";
import ApiPath from "@/common/ApiPath.js";
import {useRoute, useRouter} from "vue-router";
import {MoreFilled, Smoking, UserFilled} from "@element-plus/icons-vue";
import {userStore} from "@/store/userStore.js";
import {inject} from "vue";

const route = useRoute()
const router = useRouter()
const props = defineProps({
  data: Object
})
const globalFunc = inject('globalFunc')
const store = userStore()
const handleSendMsg = () => {
  if (!store.msgs[props.data.username]){
    store.updateMsgs(Object.assign(store.msgs, {
      [props.data.username]: {
        msgList: [],
        nickname: props.data.nickname,
        avatar: props.data.avatar,
        myAvatar: store.userInfo.avatar,
        lastMsg: '',
        username: props.data.username,
      }
    }))
  }
  store.updateOperateUsername(props.data.username)
  router.push({
    path: '/console/chats'
  })
}
const handleDeleteFriend = (friend) => {
  const res = post(ApiPath.USER_DELETE_FRIEND, {
    friend_username: friend.username
  })
  if (res.code === 0) {
    globalFunc.getFriendInfos()
    globalFunc.getUserMsg()
  }
}
console.log(props.data)
</script>
<style lang="scss" scoped>
.content{
  position: absolute;
  left: 50%;
  width: 300px;
  .content1 {
    display: flex;
    margin-top: 200px
  }
  .content2{
    font-size: 14px;
  }
  .content3 {
    margin-top: 20px;
    text-align: center;
  }
}
.popover{
  padding: 0 !important;
}
.more-item{
  background-color: #ffffff;
  height: 26px;
  line-height: 26px;
  text-align: center;
  font-size: 14px;
  width: 140px;
  &:hover{
    cursor: pointer;
    background-color: rgb(226, 226, 226);
  }
}

</style>
