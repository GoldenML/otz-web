<template>
  <div style="line-height: 60px;padding: 0 10px">
    <el-input placeholder="请输入关键字" style="width: 200px;margin-right: 10px;"></el-input>
    <el-icon style="vertical-align: middle"><Plus /></el-icon>
  </div>
  <div class="friend__item" :class="{'friend__item--active': active === index}" v-for="(item, index) in chatList" :key="index" @click="setActive(item, index)">
    <img :src="item.avatar" :width="40" :height="40"  style="margin: 5px"  alt=""/>
   <div style="display: inline-block; position: absolute; top: 0; margin-left: 3px">{{item.nickname}}</div>
  </div>
</template>
<script setup lang="js">
import {getCurrentInstance, inject, onBeforeMount, onMounted, reactive, ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";
import {post} from "@/utils/request.js";
import ApiPath from "@/common/ApiPath.js";

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const active = route.params.id ? ref(route.params.id - 1) : ref(-1)
defineEmits(['changeFriend'])

const setActive = (item, val) => {
  active.value = val
  proxy.$emit('changeFriend', chatList[val])
  // router.push(`/console/chats/${item.username}`)
}
const globalFunc = inject('globalFunc')
const friendInfos = globalFunc.getFriendInfos()

const chatList = reactive([])
onMounted(async () => {
  getUserMsg()
})
const getUserMsg = () => {
  post(ApiPath.USER_GET_MSGS, {
    sequence: 0
  }).then(res => {
    if(res.code === 0) {
      res.msgs?.forEach(e => {
        const idx = friendInfos.findIndex(user => user.username === e.from_username || user.username === e.to_username)
        console.log(idx)
        chatList.push({
          nickname: friendInfos[idx].nickname,
          avatar: friendInfos[idx].avatar,
          msg: e.text_msg.text,
          username: friendInfos[idx].username
        })
      })
    }
  })
}
</script>
<style lang="scss" scoped>
.friend__item{
  background-color: #eceaea;
  line-height: 50px;
  height: 50px;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  &--active{
    background-color: #babebe;
  }
}
</style>
