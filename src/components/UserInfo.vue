<template>
  <teleport to="body">
    <div v-if="showInfo" class="user-info" :style="{left: left, top: top}" @click.stop>
      <div style="padding-top: 20px;display: flex; line-height: 20px">
        <div id="viewerjs">
          <img
            v-viewer
            :src="store.lookUserInfo.avatar"
            width="55"
            height="55"
            alt=""
            style="cursor: pointer"
          >
        </div>

        <div style="margin-left: 15px;  text-align: left">
          <div style=" line-height: 20px">{{ store.lookUserInfo.nickname }}
            <el-icon color="rgb(16, 174, 255)">
              <UserFilled />
            </el-icon>
          </div>
          <div style="line-height: 20px;color: rgb(158, 158, 158);font-size: 12px">用户名：{{ store.lookUserInfo.username }}</div>
          <div style="line-height: 20px;color: rgb(158, 158, 158);font-size: 12px">地区：{{ area }}</div>
        </div>

      </div>
      <template v-if="store.lookUserInfo.username !== store.userInfo.username && store.groupMember[store.operateUsername]">
        <el-divider />
        <div style="text-align: center">
          <el-button v-if="store.friendInfos.findIndex(e => e.username === store.lookUserInfo.username) > -1" class="btn-conditional" @click="sendMessage">发消息</el-button>
          <el-button v-else class="btn-conditional" @click.stop="addUser">添加到通讯录</el-button>
        </div>
      </template>
    </div>
    <AddFriend v-if="addFriendVisible" :data="store.lookUserInfo" @close="addFriendVisible = false" />
  </teleport>
</template>
<script setup lang="js">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {UserFilled} from '@element-plus/icons-vue'
import {userStore} from '@/store/userStore.js'
import { regionData, codeToText } from 'element-china-area-data'
import AddFriend from '@/components/AddFriend.vue'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'
const store = userStore()
const showInfo = ref(false)
const left = ref(0)
const top = ref(0)

const area = computed(() => {
  return codeToText[store.lookUserInfo.province] && codeToText[store.lookUserInfo.city] && codeToText[store.lookUserInfo.district] ? `${codeToText[store.lookUserInfo.province]}/${codeToText[store.lookUserInfo.city]}/${codeToText[store.lookUserInfo.district]}` : ''
})
const handleShowInfo = (event, b) => {
  console.log(event.clientX, event.clientY)
  left.value = (b ? event.clientX - 320 : event.clientX) + 'px'
  top.value = event.clientY + 'px'
  showInfo.value = true
}
onMounted(() => {
  post(ApiPath.USER_GET_INFO, {
    username: store.lookUserInfo.username
  })
  window.addEventListener('click', close)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', close)
})
const close = () => {
  showInfo.value = false
}
defineExpose({
  handleShowInfo
})
const zoomed = ref(false)
const toggleImageZoom = () => {
  zoomed.value = true
}
const sendMessage = () => {
  document.querySelector('html').click()
  if (!store.msgs[store.lookUserInfo.username]) {
    store.updateMsgs(Object.assign(store.msgs, {
      [store.lookUserInfo.username]: {
        type: 1,
        msgList: [],
        nickname: store.lookUserInfo.nickname,
        avatar: store.lookUserInfo.avatar,
        lastMsg: '',
        username: store.lookUserInfo.username,
      }
    }))
  }
  store.updateOperateUsername(store.lookUserInfo.username)
}
const addFriendVisible = ref(false)
const addUser = () => {
  addFriendVisible.value = true
  showInfo.value = false
  // document.querySelector('html').click()
}

</script>
<style lang="scss" scoped>
.user-info{
  background-color: #ffffff;
  width: 280px;
  z-index: 10000;
  position: absolute;
  padding: 0 20px 20px;
  border-radius: 4px;
}

.zoomed {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  object-fit: contain;
  cursor: zoom-out;
}
</style>
