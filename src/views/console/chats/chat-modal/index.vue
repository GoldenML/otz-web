<template>
  <div v-if="drawer" id="drawer" class="drawer">
    <div style="margin-top: 10px">
      <div v-for="(userInfo, key) in store.groupMember[username]" :key="key" style="width: 40px; text-align: center;display: inline-block; padding: 5px">
        <img
          alt=""
          :width="30"
          :height="30"
          :src="userInfo.avatar"
          style="cursor:pointer;"
          @click.stop="handleShowGroupUserInfo($event, false, true, userInfo.username)"
        >
        <div style="font-size: 12px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">
          {{ userInfo.nickname }}
        </div>
      </div>
      <div style="width: 40px; text-align: center;display: inline-block; padding: 5px">
        <img style="cursor:pointer;" alt="" :width="30" :height="30" src="@/assets/img/plus.png">
        <div style="font-size: 12px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">
          添加
        </div>
      </div>
    </div>
  </div>

  <!--  <el-drawer-->
  <!--    v-model="drawer"-->
  <!--    size="250px"-->
  <!--    :with-header="false"-->
  <!--    custom-class="drawer"-->
  <!--    :modal="false"-->
  <!--  >-->
  <!--    <div style="margin-top: 10px">-->
  <!--      <div v-for="(userInfo, key) in store.groupMember[username]" :key="key" style="width: 40px; text-align: center;display: inline-block; padding: 5px">-->
  <!--        <img-->
  <!--          alt=""-->
  <!--          :width="30"-->
  <!--          :height="30"-->
  <!--          :src="userInfo.avatar"-->
  <!--          style="cursor:pointer;"-->
  <!--          @click="handleShowGroupUserInfo($event, false, true, userInfo.username)"-->
  <!--        >-->
  <!--        <div style="font-size: 12px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">-->
  <!--          {{ userInfo.nickname }}-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div style="width: 40px; text-align: center;display: inline-block; padding: 5px">-->
  <!--        <img style="cursor:pointer;" alt="" :width="30" :height="30" src="@/assets/img/plus.png">-->
  <!--        <div style="font-size: 12px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">-->
  <!--          添加-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </el-drawer>-->


  <div>
    <div class="chat-top">
      {{ store.msgs[username]?.nickname }}
      <div v-if="store.msgs[username].type === 2 " style="float: right;margin-right: 20px;cursor:pointer;" @click.stop="drawer = true">
        <el-icon><MoreFilled /></el-icon>
      </div>
    </div>

    <div id="chat-message" class="chat-message">
      <div v-if="store.msgs[username].type === 1">
        <div v-for="msg in store.msgs[username].msgList" :key="msg.username">
          <template v-if="msg.from_username === store.msgs[username].username">
            <div class="chat-message-left">
              <img
                alt=""
                style="float:left;vertical-align: middle; cursor: pointer"
                :src="store.msgs[username].avatar"
                :width="32"
                :height="32"
                @click.stop="handleShowInfo($event, false)"
              >
              <div class="chat-message-left__box">{{ msg.text_msg.text }}</div>
            </div>
          </template>
          <template v-else>
            <div class="chat-message-right">
              <div class="chat-message-right__box">{{ msg.text_msg.text }}</div>
              <img
                alt=""
                style="float: right; vertical-align: middle; cursor: pointer"
                :src="store.userInfo.avatar"
                :width="32"
                :height="32"
                @click.stop="handleShowInfo($event, true)"
              >
            </div>
          </template>
        </div>
      </div>
      <div v-else-if="store.msgs[username].type === 2">
        <div v-for="msg in store.msgs[username].msgList" :key="msg.username">
          <template v-if="msg.isSystemMsg">
            <div style="text-align: center; font-size: 12px;color: rgb(198, 173, 173)"> {{ msg.text_msg.text }}</div>
          </template>
          <template v-else-if="msg.from_username === store.userInfo.username">
            <div class="chat-message-right">

              <div class="chat-message-right__box">{{ msg.text_msg.text }}</div>
              <img
                alt=""
                style="float: right; vertical-align: middle; cursor: pointer"
                :src="store.userInfo.avatar"
                :width="32"
                :height="32"
                @click.stop="handleShowInfo($event, true, true)"
              >
            </div>

          </template>
          <template v-else>
            <div class="chat-message-left">
              <img
                alt=""
                style="float:left;vertical-align: middle; cursor: pointer"
                :src="store.groupMember[username][msg.from_username].avatar"
                :width="32"
                :height="32"
                @click.stop="handleShowInfo($event, false, true, msg.from_username)"
              >
              <div style="font-size: 12px; margin-left: 38px;position:relative; top: -8px;color: rgb(184, 184, 184)">{{ store.groupMember[username][msg.from_username].nickname }}</div>
              <div class="chat-message-left__box">{{ msg.text_msg.text }}</div>
            </div>
          </template>
        </div>
      </div>

      <div class="message-bottom" />
    </div>
    <div class="chat-tools">
      <el-popover
        placement="top"
        :width="300"
        trigger="click"
      >
        <template #default>
          <div style="color: #000000; font-size: 16px">
            全部表情
          </div>
          <div v-for="(emoji, index) in emojis" :key="index" class="emoji" @click="addEmoji(emoji.emoji)">
            <el-tooltip
              class="box-item"
              effect="dark"
              :show-after="500"
              :content="emoji.name"
            >
              {{ emoji.emoji }}
            </el-tooltip>
          </div>
        </template>
        <template #reference>
          <img width="30" height="30" alt="" src="@/assets/img/smile.png">
        </template>

      </el-popover>

    </div>
    <div class="chat-content" />
    <div class="chat-input">
      <el-input v-model="message" :autosize="{ minRows: 7, maxRows: 7 }" resize="none" type="textarea" @keydown.enter.exact.prevent="sendMessage" />
    </div>
    <div style="text-align: right; padding-right: 20px; margin-top:  13px; position: absolute; bottom: 15px; right: 20px">
      <el-button :disabled="!Boolean(message)" class="btn-send" @click="sendMessage">发送</el-button>
    </div>
  </div>
  <UserInfo ref="userInfoRef" />
</template>
<script setup lang="js">
import {
  defineAsyncComponent,
  onMounted,
  reactive,
  ref,
  getCurrentInstance,
  inject,
  onUpdated,
  watch,
  onUnmounted
} from 'vue'
import emojiList from './emojis.js'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'
import {userStore} from '@/store/userStore.js'
import UserInfo from '@/components/UserInfo.vue'
import _ from 'lodash'
import {MoreFilled} from '@element-plus/icons-vue'

const props = defineProps({
  username: String
})

const drawer = ref(false)

const closeDrawer = (e) => {
  if(e.target.id === 'drawer') {
    return
  }
  drawer.value = false
}
const userInfoRef = ref()

const store = userStore()
const { proxy } = getCurrentInstance()
const message = ref('')
const emojis = reactive(emojiList)
const addEmoji = (emoji) => {
  message.value += emoji
}
const globalFunc = inject('globalFunc')

watch(props, () => {
  message.value = store.messages[props.username] || ''
})
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('click', closeDrawer)
  document.getElementById('chat-message').scrollTop = document.getElementById('chat-message').scrollHeight
})
onUpdated(() => {
  store.updateMessages(Object.assign(store.messages, {
    [props.username]: message.value
  }))

  document.getElementById('chat-message').scrollTop = document.getElementById('chat-message').scrollHeight
})
onUnmounted(() => {
  window.removeEventListener('click', closeDrawer)
  window.removeEventListener('keydown', handleKeydown)
})
const sendMessage = _.debounce(() => {
  if (store.msgs[props.username].type === 1) {
    post(ApiPath.USER_SEND_MSG, {
      msg: {
        msg_type: 1,
        from_type: 1,
        to_type: 1,
        to_username: props.username,
        text_msg: {
          text: message.value
        },
      }
    }).then(res => {
      if (res.code === 0) {
        message.value = ''
        globalFunc.getUserMsg().then(() => {
          proxy.$nextTick(() => {
            document.getElementById('chat-message').scrollTop = document.getElementById('chat-message').scrollHeight
          })
        })
      } else {
        proxy.$message({type: 'error', message: res.msg})
      }

    })
  } else if(store.msgs[props.username].type === 2) {
    post(ApiPath.USER_SEND_MSG, {
      msg: {
        msg_type: 1,
        from_type: 1,
        to_type: 2,
        to_username: props.username,
        text_msg: {
          text: message.value
        },
      }
    }).then(res => {
      if (res.code === 0) {
        message.value = ''
        globalFunc.getUserMsg().then(() => {
          proxy.$nextTick(() => {
            document.getElementById('chat-message').scrollTop = document.getElementById('chat-message').scrollHeight
          })
        })
      } else {
        proxy.$message({type: 'error', message: res.msg})
      }
    })
  }

}, 300)
const handleKeydown = (key) => {
}
const handleShowGroupUserInfo = (e, left, isGroup, username) => {
  store.updateLookUserInfo(store.groupMember[props.username][username])
  userInfoRef.value.handleShowInfo(e, left)
}
const handleShowInfo = (e, left, isGroup, username) => {
  document.querySelector('html').click()
  if (left) {
    store.updateLookUserInfo(store.userInfo)
  } else if (isGroup) {
    store.updateLookUserInfo(store.groupMember[props.username][username])
  } else {
    const idx = store.friendInfos.findIndex(e => e.username === props.username)
    store.updateLookUserInfo(store.friendInfos[idx])
  }

  userInfoRef.value.handleShowInfo(e, left)
}

</script>
<style lang="scss" scoped>
.chat-top{
  padding-left: 20px;
  line-height: 60px;
  height: 60px;
  background-color: rgb(245,245,245);
}
.chat-message{
  height: calc(800px - 300px);
  max-height: calc(800px - 300px);
  overflow: auto;
  background-color: rgb(245,245,245);
  &-left{
    margin-top: 10px;
    margin-left: 30px;
    padding-bottom: 10px;
    &__box{
      text-align: left;
      display: inline-block;
      line-height: 32px;
      min-height: 32px;
      background-color: rgb(255, 255, 255);
      margin-left: 5px;
      padding:0 10px;
      border-radius:5px;
      font-size: 14px;
      white-space: pre-wrap;
    }
  }
  &-right{
    text-align: right;
    margin-top: 10px;
    margin-right: 30px;
    padding-bottom: 10px;
    &__box{
      text-align: left;
      display: inline-block;
      line-height: 32px;
      min-height: 32px;
      margin-right: 5px;
      background-color: rgb(149, 236, 105);
      padding:0 10px;
      border-radius:5px;
      font-size: 14px;
      white-space: pre-wrap;
    }
  }
}
.chat-tools{
  display: flex;
  align-items: center;
  line-height: 40px;
  height: 40px;
  border-top: 1px solid #ded7d7;
  padding: 0 15px;
  img{
    cursor: pointer;
  }
}
.chat-input{
  padding: 0 20px;
  min-height: 100px;
  background-color: rgb(245, 245, 245);
}
.emoji{
  cursor: pointer;
  margin: 4px 3px;
  display: inline-block;
  font-size: 20px;
}
:deep(.el-textarea__inner) {
  padding: 0;
  box-shadow: 0 0 0 0;
  height: 140px;
  max-height: 140px;
  background-color: rgb(245, 245, 245);
}
:deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 0;
}
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 0;
}

.drawer{
  // .el-drawer__body{
  //  background-color: rgb(245, 245, 245);
  //}
  position: absolute;
  right: 0;
  z-index: 100;
  height: 100%;
  width: 250px;
  background-color: rgb(245, 245, 245);
  border-left: 1px solid rgb(236 ,236 ,236);
}
</style>
