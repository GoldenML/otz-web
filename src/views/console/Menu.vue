<template>
  <el-menu :default-active="parentPath" class="menu" router>
    <div style="text-align: center;margin: 10px">
      <img alt="" src="@/assets/img/login.png" :width="40" :height="40" />
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
            <el-dropdown-item command="a">关于otz</el-dropdown-item>
            <el-dropdown-item command="b">退出用户</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </el-menu-item>
  </el-menu>
</template>
<script setup lang="ts">

import {ChatLineRound, Tools, UserFilled} from "@element-plus/icons-vue";
import {nextTick, onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
const router = useRouter()
const route = useRoute()
const parentPath = ref(route.matched[1].path)
</script>
<style lang="scss" scoped>
.menu{
  background: #413f3f;
  height: 100%;
  .el-menu-item:hover{
    background-color: #413f3f;
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
