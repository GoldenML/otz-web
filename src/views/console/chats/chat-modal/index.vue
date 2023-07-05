<template>
  <div v-if="drawerVisible" id="drawer" ref="drawerRef" class="drawer">
    <Drawer :username="username" />
  </div>
  <div>
    <div class="chat-top">
      {{ store.msgs[username]?.nickname }}<span v-if="store.msgs[username].type === 2">（{{ Object.keys(store.groupMember[store.operateUsername]).length }}）</span>
      <div v-if="store.msgs[username].type === 2 " style="float: right;margin-right: 20px;cursor:pointer;" @click.stop="drawerVisible = true">
        <el-icon><MoreFilled /></el-icon>
      </div>
    </div>

    <div id="chat-message" class="chat-message">
      <div v-if="store.msgs[username].type === 1">
        <div v-for="msg in store.msgs[username].msgList" :key="msg.sequence">
          <template v-if="msg.from_username === store.msgs[username].username">
            <div style="text-align: center; font-size: 12px;color: rgb(168,166,166)"> {{ msg.formatTime }}</div>
            <div class="chat-message-left">
              <img
                alt=""
                style="float:left;vertical-align: middle; cursor: pointer"
                :src="store.msgs[username].avatar"
                :width="32"
                :height="32"
                @click.stop="handleShowInfo($event, false)"
              >
              <div v-if="msg.msg_type === 2" class="chat-message-left__img">
                <img v-viewer :width="300" :src="msg.image_msg.image_url" alt="">
              </div>
              <div v-else class="chat-message-left__box">
                {{ msg.text_msg?.text }}
              </div>
            </div>
          </template>
          <template v-else>
            <div style="text-align: center; font-size: 12px;color: rgb(168,166,166)"> {{ msg.formatTime }}</div>
            <div class="chat-message-right">
              <el-icon v-if="msg.wait" class="is-loading" style="margin-right: 5px;vertical-align: middle">
                <Loading />
              </el-icon>
              <div v-if="msg.msg_type === 2" class="chat-message-right__img">
                <img v-viewer :width="300" :src="msg.image_msg.image_url" alt="">
              </div>
              <div v-else class="chat-message-right__box">
                {{ msg.text_msg?.text }}
              </div>
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
            <div style="text-align: center; font-size: 12px;color: rgb(198, 173, 173)"><div style="text-align: center; font-size: 12px;color: rgb(168,166,166)"> {{ msg.formatTime }}</div> {{ msg.text_msg?.text }}</div>
          </template>
          <template v-else-if="msg.from_username === store.userInfo.username">
            <div style="text-align: center; font-size: 12px;color: rgb(168,166,166)"> {{ msg.formatTime }}</div>
            <div class="chat-message-right">
              <el-icon v-if="msg.wait" class="is-loading" style="margin-right: 5px;vertical-align: middle">
                <Loading />
              </el-icon>
              <div v-if="msg.msg_type === 2" class="chat-message-right__img">
                <img v-viewer :width="300" :src="msg.image_msg.image_url" alt="">
              </div>
              <div v-else class="chat-message-right__box">
                {{ msg.text_msg?.text }}
              </div>
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
            <div style="text-align: center; font-size: 12px;color: rgb(168,166,166)"> {{ msg.formatTime }}</div>
            <div class="chat-message-left">

              <img
                alt=""
                style="float:left;vertical-align: middle; cursor: pointer"
                :src="store.groupMember[username][msg.from_username] ? store.groupMember[username][msg.from_username].avatar : store.cacheUser[msg.from_username]?.avatar"
                :width="32"
                :height="32"
                @click.stop="handleShowInfo($event, false, true, msg.from_username)"
              >
              <div style="font-size: 12px; margin-left: 38px;position:relative; top: -8px;color: rgb(184, 184, 184)">{{ store.groupMember[username][msg.from_username] ? store.groupMember[username][msg.from_username].nickname : store.cacheUser[msg.from_username]?.nickname }} </div>
              <div v-if="msg.msg_type === 2" class="chat-message-left__img">
                <img v-viewer :width="300" :src="msg.image_msg.image_url" alt="">
              </div>
              <div v-else class="chat-message-left__box">
                {{ msg.text_msg?.text }}
              </div>

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
          <!--          <div style="color: #000000; font-size: 14px">-->
          <!--            全部表情-->
          <!--          </div>-->
          <!--          <div v-for="(emoji, index) in emojis" :key="index" class="emoji" @click="addEmoji(emoji.emoji)">-->
          <!--            <el-tooltip-->
          <!--              class="box-item"-->
          <!--              effect="dark"-->
          <!--              :show-after="500"-->
          <!--              :content="emoji.name"-->
          <!--            >-->
          <!--              {{ emoji.emoji }}-->
          <!--            </el-tooltip>-->
          <!--          </div>-->
          <!--          <Picker :data="emojiIndex" :native="true" set="twitter" @select="showEmoji" />-->
          <EmojiPicker :native="true" @select="onSelectEmoji" />
        </template>
        <template #reference>
          <img width="30" height="30" alt="" src="@/assets/img/smile.png">
        </template>

      </el-popover>

    </div>
    <div class="chat-content" />
    <div class="chat-input">
      <el-input
        id="edit"
        v-model="message"
        :autosize="{ minRows: 7, maxRows: 7 }"
        resize="none"
        type="textarea"
        @keydown.enter.exact.prevent="sendMessage"
      />
    </div>
    <div style="text-align: right; padding-right: 20px; margin-top:  13px; position: absolute; bottom: 15px; right: 20px">
      <el-button ref="buttonRef" class="btn-send" @click="sendMessage">发送</el-button>
      <el-popover
        ref="popoverRef"
        :visible="visible"
        :virtual-ref="buttonRef"
        trigger="click"
        virtual-triggering
        :auto-close="2000"
        placement="top-start"
      >
        <span> 不能发送空白消息 </span>
      </el-popover>
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
  onUnmounted, computed, unref
} from 'vue'
import emojiList from './emojis.js'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'
import {userStore} from '@/store/userStore.js'
import UserInfo from '@/components/UserInfo.vue'
import _ from 'lodash'
import {CircleClose, Loading, MoreFilled} from '@element-plus/icons-vue'
import data from 'emoji-mart-vue-fast/data/all.json'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
import EmojiPicker from 'vue3-emoji-picker'
import Drawer from '../components/Drawer.vue'
import 'vue3-emoji-picker/css'
import {nanoid} from 'nanoid'
import moment from 'moment'


const emojiIndex = new EmojiIndex(data)
const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
const visible = ref(false)
const showEmoji = (emoji) => {
  message.value += emoji.native
}
const store = userStore()
const props = defineProps({
  username: String
})
watch(props, () => {
  message.value = store.messages[props.username] || ''
})
onMounted(() => {
  window.addEventListener('paste',handlePaste)
  window.addEventListener('click', closeDrawer)
  waitForAllImagesToLoad().then(() => {
    document.getElementById('chat-message').scrollTop = document.getElementById('chat-message').scrollHeight
  })
})

onUpdated(() => {
  store.updateMessages(Object.assign(store.messages, {
    [props.username]: message.value
  }))

  waitForAllImagesToLoad().then(() => {
    document.getElementById('chat-message').scrollTop = document.getElementById('chat-message').scrollHeight
  })
})
onUnmounted(() => {
  window.removeEventListener('paste',handlePaste)
  window.removeEventListener('click', closeDrawer)
})
const handlePaste = (e) => {
  let focusedElement = document.activeElement
  if(focusedElement?.tagName === 'TEXTAREA') {
    if(e.clipboardData.items.length > 0) {
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        const item = e.clipboardData.items[i]
        if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
          const file = item.getAsFile()
          let reader = new FileReader()
          reader.onload = (event) => {
            const client_sequence = nanoid()
            store.msgs[props.username].lastUsername = store.userInfo.username
            store.msgs[props.username].lastMsg = '[图片]'
            store.msgs[props.username].msgList.push({
              msg_type: 2,
              from_type: 1,
              to_type: 1,
              to_username: '',
              image_msg: {

                image_url: event.target.result
              },
              from_username: store.userInfo.username,
              wait: true,
              client_sequence
            })
            post(ApiPath.USER_UPLOAD_FILE, {
              file_name: file.name,
              file_data: event.target.result.replace(/^data:image\/\w+;base64,/, '')
            }).then(res => {
              if (res.code === 0) {
                post(ApiPath.USER_SEND_MSG, {
                  msg: {
                    msg_type: 2,
                    from_type: 1,
                    to_type: store.msgs[props.username].type,
                    to_username: props.username,
                    image_msg: {
                      image_url: res.absolute_file_path
                    },
                    client_sequence,
                    formatTime: moment().format('HH:mm')
                  }
                }).then(res => {
                  if (res.code === 0) {
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
            })
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }
}
const waitForAllImagesToLoad = () => {
  return new Promise((resolve) => {
    const images = Array.from(document.getElementsByTagName('img'))
    const totalImages = images.length
    let loadedImages = 0

    const handleImageLoad = () => {
      loadedImages++
      if (loadedImages === totalImages) {
        resolve()
      }
    }

    images.forEach((img) => {
      if (img.complete) {
        handleImageLoad()
      } else {
        img.addEventListener('load', handleImageLoad)
      }
    })
  })
}
const drawerVisible = ref(false)
const drawerRef = ref()
const closeDrawer = (e) => {
  if (drawerRef.value && drawerRef.value.contains(e.target)) {
    return
  }
  drawerVisible.value = false
}


const { proxy } = getCurrentInstance()
const message = ref('')
const emojis = reactive(emojiList)
const addEmoji = (emoji) => {
  message.value += emoji
}

const globalFunc = inject('globalFunc')
const sendMessage = _.debounce(() => {
  if (!message.value) {
    visible.value = true
    setTimeout(() => {
      visible.value = false
    }, 2000)
    return
  }
  const msg = message.value
  const client_sequence = nanoid()
  store.msgs[props.username].lastUsername = store.userInfo.username
  store.msgs[props.username].lastMsg = message.value
  store.msgs[props.username].msgList.push({
    msg_type: 1,
    from_type: 1,
    to_type: 1,
    to_username: '',
    text_msg: {
      text: message.value
    },
    from_username: store.userInfo.username,
    wait: true,
    client_sequence,
    formatTime: moment().format('HH:mm')
  })
  message.value = ''
  post(ApiPath.USER_SEND_MSG, {
    msg: {
      msg_type: 1,
      from_type: 1,
      to_type: store.msgs[props.username].type,
      to_username: props.username,
      text_msg: {
        text: msg
      },
      image_msg: {
        image_url: ''
      },
      client_sequence,
      formatTime: moment().format('HH:mm')
    }
  }).then(res => {
    if (res.code === 0) {
      globalFunc.getUserMsg()
    } else {
      proxy.$message({type: 'error', message: res.msg})
    }
  })
}, 300)

const userInfoRef = ref()
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
    &__img{
      text-align: left;
      display: inline-block;
      line-height: 32px;
      min-height: 32px;
      margin-left: 5px;
      padding:0 10px;
      border-radius:5px;
      font-size: 14px;
      white-space: pre-wrap;
    }
    &__box{
      max-width: 500px;
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
    &__img{
      text-align: left;
      display: inline-block;
      line-height: 32px;
      min-height: 32px;
      margin-right: 5px;
      padding:0 10px;
      border-radius:5px;
      font-size: 14px;
      white-space: pre-wrap;
    }
    &__box{
      max-width: 500px;
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
  right: -250px;
  z-index: 100;
  height: 100%;
  width: 250px;
  background-color: rgb(245, 245, 245);
  border-left: 1px solid rgb(236 ,236 ,236);
  :deep .el-drawer__header{
    margin: 0;
    padding: 0;
  }
}
</style>
