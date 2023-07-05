<template>
  <div style="line-height: 60px;padding: 0 10px;background-color: rgb(247, 247, 247)">
    <el-input placeholder="请输入关键字" style="width: 190px;margin-right: 10px;" />
    <el-icon style="vertical-align: middle;cursor:pointer;" @click="handleShowSelectFriend"><Plus /></el-icon>
  </div>
  <div style="max-height: 739px; overflow-y: auto">
    <div v-for="(item, key) in store.msgs" :key="key" class="friend__item" :class="{'friend__item--active': store.operateUsername === key}" @click="setActive(key)">
      <div style="margin: 12px">
        <el-badge is-dot :hidden="!store.badges[key]">
          <img :src="item.avatar" :width="40" :height="40" alt="">
        </el-badge>
      </div>
      <div style="display: inline-block; margin-left: 3px;">
        <div style="line-height: 20px;width: 120px; margin-top: 10px; float: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; ">
          <!--          <template v-if="store.groupMember[item.to_username]"></template>-->
          {{ item.nickname }}
        </div>
        <div v-if="item.lastTime" style="float: right">
          <div style="color: rgb(153, 153, 153); font-size: 12px; text-align: right;margin-top: 10px; margin-right: 5px">
            {{ formatTime(item.lastTime) }}
          </div>
        </div>
        <div style="line-height: 20px;padding-top: 5px;color: rgb(165, 165, 165); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;width: 150px;font-size: 12px">
          <!--          <el-icon v-if="msg.wait" class="is-loading" style="margin-right: 5px;vertical-align: middle">-->
          <!--            <Loading />-->
          <!--          </el-icon>-->
          <template v-if="key !== store.operateUsername && store.messages[key]">
            <span style="color: rgb(221, 43, 43)">[草稿]：</span>{{ store.messages[key] }}
          </template>
          <template v-else-if="store.groupMember[key] && store.msgs[key].lastUsername">
            <span v-if="store.msgs[key].lastUsername === store.userInfo.username">我：{{ item.lastMsg }}</span>
            <span v-else-if="store.groupMember[key][store.msgs[key].lastUsername]?.nickname">{{ store.groupMember[key][store.msgs[key].lastUsername].nickname }}：{{ item.lastMsg }}</span>
            <span v-else>{{ item.lastMsg }}</span>
          </template>
          <template v-else>{{ item.lastMsg }}</template>
        </div>
      </div>
    </div>
  </div>
  <SelectFriend v-if="showSelectFriend" @scroll="scroll" @before-close="showSelectFriend = false" />
</template>
<script setup lang="js">
import {getCurrentInstance, inject, onBeforeMount, onMounted, reactive, ref, watch, watchEffect} from 'vue'
import {Loading, Plus} from '@element-plus/icons-vue'
import {useRoute, useRouter} from 'vue-router'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'
import {userStore} from '@/store/userStore.js'
import SelectFriend from '@/views/console/chats/components/SelectFriend.vue'
import moment from 'moment'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const active = route.params.id ? ref(route.params.id - 1) : ref(-1)
defineEmits(['changeFriend'])
const store = userStore()
const setActive = (username) => {
  store.updateBadges(Object.assign(store.badges, {
    [username]: false
  }))
  store.updateOperateUsername(username)
}
const showSelectFriend = ref(false)
const handleShowSelectFriend = () => {
  showSelectFriend.value = true
}
onMounted(() => {
  document.querySelector('.friend__item--active')?.scrollIntoView()
})
const scroll = () => {
  setTimeout(() => {
    document.querySelector('.friend__item--active')?.scrollIntoView()
  }, 300)
}
const formatTime = (timestamp) => {
  if(new Date(Number(timestamp)).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
    return moment(Number(timestamp)).format('HH:mm')
  }
  return moment(Number(timestamp)).format('YY/MM/DD')

}
</script>
<style lang="scss" scoped>
.friend__item{
  display: flex;
  background-color: #eceaea;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  &--active{
    background-color: rgb(202, 200, 198);
  }
}
</style>
