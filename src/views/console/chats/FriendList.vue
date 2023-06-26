<template>
  <div style="line-height: 60px;padding: 0 10px">
    <el-input placeholder="请输入关键字" style="width: 200px;margin-right: 10px;" />
    <el-icon style="vertical-align: middle;cursor:pointer;" @click="handleShowSelectFriend"><Plus /></el-icon>
  </div>
  <div v-for="(item, key) in store.msgs" :key="key" class="friend__item" :class="{'friend__item--active': store.operateUsername === key}" @click="setActive(key)">
    <div>
      <img :src="item.avatar" :width="40" :height="40" style="margin: 12px" alt="">
    </div>
    <div style="display: inline-block; margin-left: 3px;">
      <div style="line-height: 20px;margin-top: 10px;">{{ item.nickname }}</div>
      <div style="line-height: 20px;margin-top: 5px;color: rgb(165, 165, 165); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;width: 150px">
        <template v-if="key !== store.operateUsername && store.messages[key]">
          <span style="color: rgb(221, 43, 43)">[草稿]</span>{{ store.messages[key] }}
        </template>
        <template v-else>{{ item.lastMsg }}</template>
      </div>
    </div>
  </div>
  <SelectFriend v-if="showSelectFriend" />
</template>
<script setup lang="js">
import {getCurrentInstance, inject, onBeforeMount, onMounted, reactive, ref, watchEffect} from 'vue'
import {Plus} from '@element-plus/icons-vue'
import {useRoute, useRouter} from 'vue-router'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'
import {userStore} from '@/store/userStore.js'
import SelectFriend from '@/views/console/chats/SelectFriend.vue'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const active = route.params.id ? ref(route.params.id - 1) : ref(-1)
defineEmits(['changeFriend'])
const store = userStore()
const setActive = (username) => {
  store.updateOperateUsername(username)
}
const showSelectFriend = ref(false)
const handleShowSelectFriend = () => {
  showSelectFriend.value = true
}

</script>
<style lang="scss" scoped>
.friend__item{
  display: flex;
  background-color: #eceaea;
  line-height: 65px;
  height: 65px;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  &--active{
    background-color: #babebe;
  }
}
</style>
