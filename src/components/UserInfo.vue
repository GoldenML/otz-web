<template>
  <teleport to="body">
    <div v-if="showInfo" class="user-info" :style="{left: left, top: top}" @click.stop>
      <div style="padding-top: 20px;display: flex; line-height: 20px">
        <div>
          <img :src="store.userInfo.avatar" width="55" height="55" alt="">
        </div>

        <div style="margin-left: 15px;  text-align: left">
          <div style=" line-height: 20px">{{ store.lookUserInfo.nickname }}
            <el-icon color="rgb(16, 174, 255)">
              <UserFilled />
            </el-icon>
          </div>
          <div style="line-height: 20px;color: rgb(158, 158, 158);font-size: 12px">用户名：{{ store.lookUserInfo.username }}</div>
          <div style="line-height: 20px;color: rgb(158, 158, 158);font-size: 12px">地区：{{ store.lookUserInfo.city }}</div>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script setup lang="js">
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {UserFilled} from '@element-plus/icons-vue'
import {userStore} from '@/store/userStore.js'

const store = userStore()
const showInfo = ref(false)
const left = ref(0)
const top = ref(0)
const handleShowInfo = (event, b) => {
  console.log(event.clientX, event.clientY)
  left.value = (b ? event.clientX - 320 : event.clientX) + 'px'
  top.value = event.clientY + 'px'
  showInfo.value = true
}
onMounted(() => {
  window.addEventListener('click', close)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', close)
})
const close = () => {
  showInfo.value = false
}
defineExpose({
  handleShowInfo
})
</script>
<style lang="scss" scoped>
.user-info{
  background-color: #ffffff;
  width: 280px;
  z-index: 10000;
  position: absolute;
  padding: 0 20px 20px;
  border-radius: 4px;
}
</style>
