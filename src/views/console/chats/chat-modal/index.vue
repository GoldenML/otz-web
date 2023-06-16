<template>
  <div>
    <div class="chat-top">
      杨晨
    </div>

    <div class="chat-message"></div>
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
      <el-input :autosize="{ minRows: 7, maxRows: 7 }" resize="none" v-model="message" type="textarea"></el-input>
    </div>
    <div style="text-align: right; padding-right: 20px; margin-top:  13px; position: absolute; bottom: 15px; right: 20px">
      <el-button @click="sendMessage" :disabled="!Boolean(message)" class="btn-send">发送</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from "vue";
import emojiList from './emojis.js'

const message = ref('')
const emojis = reactive(emojiList)
const addEmoji = (emoji) => {
  message.value += emoji
}
const sendMessage = () => {
  message.value = ''
}
</script>
<style lang="scss" scoped>
.chat-top{
  padding-left: 20px;
  line-height: 60px;
  height: 60px;
  background-color: #eae5e5;
}
.chat-message{
  height: calc(100vh - 300px)
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
}
:deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 0;
}
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 0;
}
</style>
