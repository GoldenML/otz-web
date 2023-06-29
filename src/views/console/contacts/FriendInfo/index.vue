<template>
  <div class="content">
    <div class="content1">
      <div>
        <img :src="data.avatar" :width="60" :height="60" alt="">
      </div>
      <div style="font-size: 14px; margin-left: 10px">
        <div>{{ data.nickname }}
          <el-icon color="rgb(16, 174, 255)" size="16">
            <UserFilled />
          </el-icon>
        </div>
        <div style="font-size: 12px">用户名：{{ data.username }}</div>
        <div style="font-size: 12px">地区：{{ area }}</div>

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
            <div class="more-item" @click="handleDeleteFriend(data)">删除联系人</div>

          </template>
          <template #reference>
            <el-icon style="cursor:pointer;"><MoreFilled /></el-icon>
          </template>
        </el-popover>

      </div>
    </div>

    <el-divider />
    <!--    <div class="content2">-->
    <!--      <div>备注名：</div>-->
    <!--    </div>-->
    <!--    <el-divider></el-divider>-->
    <div class="content3">
      <el-button class="btn-conditional" @click="handleSendMsg">发消息</el-button>
    </div>
  </div>

</template>
<script setup lang="js">
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'
import {useRoute, useRouter} from 'vue-router'
import {MoreFilled, Smoking, UserFilled} from '@element-plus/icons-vue'
import {userStore} from '@/store/userStore.js'
import {computed, inject} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {codeToText} from 'element-china-area-data'


const route = useRoute()
const router = useRouter()
const props = defineProps({
  data: Object
})
const area = computed(() => {
  return codeToText[props.data.province] && codeToText[props.data.city] && codeToText[props.data.district] ? `${codeToText[props.data.province]}/${codeToText[props.data.city]}/${codeToText[props.data.district]}` : ''
})
const globalFunc = inject('globalFunc')
const store = userStore()
const handleSendMsg = () => {
  if (!store.msgs[props.data.username]) {
    store.updateMsgs(Object.assign(store.msgs, {
      [props.data.username]: {
        type: 1,
        msgList: [],
        nickname: props.data.nickname,
        avatar: props.data.avatar,
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
  ElMessageBox.confirm(
    '即将删除选中的联系人，并同时删除与该联系人的聊天记录',
    '删除联系人',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      post(ApiPath.USER_DELETE_FRIEND, {
        friend_username: friend.username
      }).then(res => {
        if (res.code === 0) {
          globalFunc.getFriendInfos()
          globalFunc.getUserMsg()
        }
      })
    })

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
