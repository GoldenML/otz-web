<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>
<script setup lang="js">
import {post} from "@/utils/request.js";
import ApiPath from "@/common/ApiPath.js";
import {onMounted, provide, ref} from "vue";

const userInfo = ref(null)
const friendInfos = ref(null)
provide('globalFunc', {
  getUserInfo: () => userInfo.value,
  getFriendInfos: () => friendInfos.value
})
onMounted(() => {
  post(ApiPath.USER_LOGIN_STATUS, {}).then(response => {
    userInfo.value = response.user_info
  })
  post(ApiPath.USER_GET_FRIEND, {}).then(response => {
    if(response.code === 0) {
      friendInfos.value = response.friends
    }
  })
})


</script>

<style lang="scss" scoped>
.app{
  background: url("@/assets/img/beijing.jpg") no-repeat;
  background-size:cover;
  position: absolute;
  width: 100vw;
  height: 100vh;


}
</style>
