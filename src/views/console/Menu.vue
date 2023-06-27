<template>
  <el-menu :default-active="parentPath" class="menu" router>
    <div style="text-align: center;margin: 10px">
      <img
        style="cursor: pointer"
        alt=""
        :src="store.userInfo.avatar"
        :width="40"
        :height="40"
        @click.stop="handleShowInfo"
      >
      <teleport to="body">
        <div v-if="showInfo" class="user-info" :style="{left: left, top: top}" @click.stop>
          <div style="padding-top: 20px;display: flex; line-height: 20px">
            <div>
              <img :src="store.userInfo.avatar" width="55" height="55" alt="">
            </div>

            <div style="margin-left: 15px;  text-align: left">
              <div style=" line-height: 20px">{{ store.userInfo.nickname }}
                <el-icon color="rgb(16, 174, 255)">
                  <UserFilled />
                </el-icon>
              </div>
              <div style="line-height: 20px;color: rgb(158, 158, 158);font-size: 12px">用户名：{{ store.userInfo.username }}</div>
              <div style="line-height: 20px;color: rgb(158, 158, 158);font-size: 12px">地区：{{ store.userInfo.city }}</div>
            </div>
          </div>
        </div>
      </teleport>


    </div>
    <el-menu-item index="/console/chats">

      <el-icon class="menu-icon">
        <el-badge is-dot :hidden="!store.chatBadge">
          <ChatLineRound />
        </el-badge>
      </el-icon>


    </el-menu-item>
    <el-menu-item index="/console/contacts"><el-icon class="menu-icon">
      <el-badge :is-dot="store.contactBadge"><UserFilled /></el-badge></el-icon></el-menu-item>
    <el-menu-item class="bottom-item">
      <el-dropdown trigger="click" placement="top-end">
        <span>
          <el-icon class="menu-icon"><Tools /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="a" @click.native="showSetting">设置</el-dropdown-item>
            <el-dropdown-item command="a" @click.native="logOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-menu-item>
  </el-menu>
  <setting v-if="false" />
  <UserInfo ref="userInfoRef" />
</template>
<script setup lang="js">

import {ChatLineRound, Tools, UserFilled} from '@element-plus/icons-vue'
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import setting from './settings/index.vue'
const router = useRouter()
const route = useRoute()
const parentPath = ref(route.matched[1].path)
const settingVisible = ref(false)
import { post } from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'
import {userStore} from '@/store/userStore.js'
import UserInfo from '@/components/UserInfo.vue'

const userInfoRef = ref()

onMounted(() => {
  window.addEventListener('click', close)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', close)
})
const close = () => {
  showInfo.value = false
}
const showInfo = ref(false)
watch(route, (newValue) => {
  parentPath.value = newValue.matched[1].path
})
const showSetting = () => {
  settingVisible.value = true
}
const store = userStore()
const logOut = async () => {
  const res = await post(ApiPath.USER_LOGOUT, {})
  if(res.code === 0) {
    await router.push('/login')
  }

}
const left = ref(0)
const top = ref(0)
const handleShowInfo = (e, left) => {
  document.querySelector('html').click()
  store.updateLookUserInfo(store.userInfo)
  userInfoRef.value.handleShowInfo(e, left)
}

</script>
<style lang="scss" scoped>
.menu{
  background: rgb(46, 46, 46);
  height: 100%;
  .el-menu-item:hover{
    background-color: rgb(46, 46, 46);
  }
  .el-menu-item.is-active{
    //background-color: #60afcc;
    color:#fff;
    .menu-icon{
      color: #97e71e;
    }
    .menu-icon::after{
      content: '';
      display: inline-block;
      background-color: #c6f381;
    }
  }
  .menu-icon{
    color: #ffffff
  }
}
.bottom-item {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
}
.user-info{
  background-color: #ffffff;
  width: 280px;
  z-index: 10000;
  position: absolute;
  padding: 0 20px 20px;
  border-radius: 4px;
}
</style>
