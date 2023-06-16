<template>
  <el-menu :default-active="parentPath" class="menu" router>
    <div style="text-align: center;margin: 10px">
      <img alt="" :src="currentUser.avatar" :width="40" :height="40" />
    </div>
    <el-menu-item index="/console/chats">
      <el-icon class="menu-icon">
        <ChatLineRound />
      </el-icon>
    </el-menu-item>
    <el-menu-item index="/console/contacts"><el-icon class="menu-icon"><UserFilled /></el-icon></el-menu-item>
    <el-menu-item  class="bottom-item">
      <el-dropdown trigger="click" placement="top-end">
        <span>
          <el-icon class="menu-icon"><Tools /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click.native="showSetting" command="a">设置</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-menu-item>
  </el-menu>
  <setting v-if="false"></setting>
</template>
<script setup lang="js">

import {ChatLineRound, Tools, UserFilled} from "@element-plus/icons-vue";
import {nextTick, onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import setting from './settings/index.vue'
const router = useRouter()
const route = useRoute()
const parentPath = ref(route.matched[1].path)
const settingVisible = ref(false)
import { post } from "@/utils/request.js";
import ApiPath from "@/common/ApiPath.js";

const showSetting = () => {
  settingVisible.value = true
}
const currentUser = ref({})
onMounted(() => {
  post(ApiPath.USER_LOGIN_STATUS, {}).then(response => {
    currentUser.value = response.user_info
  }).then(res => {

  }).catch(error => {
    console.log(error.response)
  })
})

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

</style>
