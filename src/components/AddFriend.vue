<template>
  <div class="otz-modal" @click.stop>
    <div class="otz-modal__content">
      <div class="otz-modal__content-header">申请添加朋友</div>
      <div class="otz-modal__content-line" />
      <div class="otz-modal__content-body">
        <div class="greeting">发送添加朋友申请</div>
        <el-input v-model="greeting" />
        <div class="remark">备注名</div>
        <el-input v-model="remark" />
      </div>
      <div class="otz-modal__content-footer">
        <el-button class="btn-modal-ok" @click.stop="handleSubmit">确定</el-button>
        <el-button class="btn-modal-cancel" @click.stop="proxy.$emit('close')">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="js">
import {getCurrentInstance, onMounted, ref} from 'vue'
import {userStore} from '@/store/userStore.js'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'

const props = defineProps({
  data: Object
})

const {proxy} = getCurrentInstance()
const greeting = ref('')
const remark = ref('')
const store = userStore()
onMounted(() => {
  greeting.value = `我是${store.userInfo.nickname}`
  remark.value = `${props.data.nickname}`
})
const handleSubmit = () => {
  post(ApiPath.USER_ADD_FRIEND, {
    friend_username: props.data.username,
    greeting: greeting.value
  }).then(res => {
    if(res.code === 0) {
      proxy.$message({
        type: 'success',
        message: '发送成功'
      })
      proxy.$emit('close')
    } else {
      proxy.$message({
        type: 'error',
        message: res.msg
      })
    }
  })
}
</script>
<style lang="scss" scoped>
.otz-modal {
  z-index: 2002;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0);
  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgb(237, 237, 237);
    width: 360px;
    border-radius: 6px;
    box-shadow: 0 1px 5px 5px #bebebe;
    height: 500px;
    &-header{
      height: 42px;
      line-height: 42px;
      text-align: center;
      font-size: 14px;
    }
    &-line{
      border-bottom: 1px solid rgb(226, 226, 226);
    }
    &-body{
      padding: 0 20px;
      font-size: 12px;
      line-height: 35px;
      color: rgb(158, 158, 158);
      .greeting{
      }
      .remark{
      }
    }
    &-footer{
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translate(-50%);
    }
  }
}
</style>
