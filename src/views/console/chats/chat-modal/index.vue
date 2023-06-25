<template>
  <div>
    <div class="chat-top">
      {{store.msgs[username]?.nickname}}
    </div>

    <div id="chat-message" class="chat-message">
      <div v-for="msg in store.msgs[username].msgList" :key="msg.username">
        <template v-if="msg.from_username === store.msgs[username].username" >
          <div style="text-align: left; margin-left: 30px;margin-bottom: 10px;">
            <img @click.stop="handleShowInfo($event, false)" alt="" style="vertical-align: middle; cursor: pointer" :src="store.msgs[username].avatar" :width="32" :height="32">
            <div style="display: inline-block; line-height: 32px;height: 32px; background-color: rgb(255, 255, 255); margin-left: 5px; padding:0 10px; border-radius:5px; font-size: 14px">{{msg.text_msg.text}}</div>
          </div>
        </template>
        <template v-else >
          <div style="text-align: right; margin-right: 30px;margin-bottom: 10px;">
            <div style="display: inline-block; line-height: 32px;min-height: 32px; margin-right: 5px;background-color: rgb(149, 236, 105);padding:0 10px; border-radius:5px; font-size: 14px; white-space: pre-wrap">{{msg.text_msg.text}}</div>
            <img @click.stop="handleShowInfo($event, true)" alt="" style="float: right; vertical-align: middle; cursor: pointer" :src="store.msgs[username].avatar" :width="32" :height="32">
          </div>
        </template>
      </div>
      <div class="message-bottom"></div>
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
          <div class="emoji" v-for="(emoji, index) in emojis" :key="index" @click="addEmoji(emoji.emoji)">
            <el-tooltip
                class="box-item"
                effect="dark"
                :show-after='500'
                :content="emoji.name"
            >
              {{ emoji.emoji }}
            </el-tooltip>
          </div>
        </template>
        <template #reference>
          <img width="30" height="30" alt="" src="@/assets/img/smile.png"/>
        </template>

      </el-popover>

    </div>
    <div class="chat-content">

    </div>
    <div class="chat-input">
      <el-input @keydown.enter.exact.prevent="sendMessage" :autosize="{ minRows: 7, maxRows: 7 }" resize="none" v-model="message" type="textarea"></el-input>
    </div>
    <div style="text-align: right; padding-right: 20px; margin-top:  13px; position: absolute; bottom: 15px; right: 20px">
      <el-button @click="sendMessage"  :disabled="!Boolean(message)" class="btn-send">发送</el-button>
    </div>
  </div>
  <UserInfo ref="userInfoRef" />
</template>
<script setup lang="js">
import {defineAsyncComponent, onMounted, reactive, ref, getCurrentInstance, inject, onUpdated, watch} from "vue";
import emojiList from './emojis.js'
import {post} from "@/utils/request.js";
import ApiPath from "@/common/ApiPath.js";
import {userStore} from "@/store/userStore.js";
import UserInfo from '@/components/UserInfo.vue'

const props = defineProps({
  username: String
})

const userInfoRef = ref()

const store = userStore()
const { proxy } = getCurrentInstance()
const message = ref('')
const emojis = reactive(emojiList)
const addEmoji = (emoji) => {
  message.value += emoji
}
const globalFunc = inject('globalFunc')

watch(props, (val) => {
  console.log(store.messages)
  message.value = store.messages[props.username] || ''
})
onMounted(() => {
  console.log(3333, document.getElementById('chat-message').scrollHeight)
  window.addEventListener('keydown', handleKeydown)
  document.getElementById('chat-message').scrollTop = document.getElementById('chat-message').scrollHeight
})
onUpdated(() => {
  store.updateMessages(Object.assign(store.messages, {
    [props.username]: message.value
  }))
  window.removeEventListener('keydown', handleKeydown)
  document.getElementById('chat-message').scrollTop = document.getElementById('chat-message').scrollHeight
})
const sendMessage = () => {
  post(ApiPath.USER_SEND_MSG, {
    msg: {
      msg_type: 1,
      from_type: 1,
      to_type: 1,
      to_username: store.msgs[props.username].username,
      text_msg: {
        text: message.value
      },
    }
  }).then(res => {
    if (res.code === 0) {
      message.value = ''
      globalFunc.getUserMsg().then(() => {
        proxy.$nextTick(() => {
          console.log(3333, document.getElementById('chat-message').scrollHeight)
          document.getElementById('chat-message').scrollTop = document.getElementById('chat-message').scrollHeight
        })
      })
    } else {
      proxy.$message({type: 'error', message: res.msg})
    }

  })
}
const handleKeydown = (key) => {
  console.log(key)
}
const handleShowInfo = (e, left) => {
  console.log(1111)
  console.log(e, left)
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
</style>
