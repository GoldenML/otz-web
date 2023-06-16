<template>
  <div class="login">
    <transition enter-active-class="animate__animated animate__fadeIn" >
        <el-form v-if="show" :model="loginForm" ref="ruleFormRef" :rules="rules" class="login-form">
          <div class="login-form__title">OTZ <div class="login-form__title-text">tfsb，tfsb，tfsb，重要的事情说三遍</div></div>
          <el-form-item prop="email">
            <el-input v-model="loginForm.email" placeholder="邮箱" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="loginForm.code" type="password" placeholder="验证码" style="width: 300px">
              <template v-slot:suffix>
                <el-button :disabled="buttonDisabled" @click="sendVerifyCode(ruleFormRef)" v-if="timer === 0" class="btn-send" style="margin-right: -10px">发送验证码</el-button>
                <el-button disabled v-else class="btn-send" style="margin-right: -10px">剩余{{timer}}秒</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item >

          </el-form-item>
          <div style="text-align: center">
            <el-button @click="login(ruleFormRef)" class="btn-primary" style="width: 300px;height: 40px;font-size: 16px">登 录</el-button>
          </div>
          <div style="text-align: center">
            <el-button type="text">注册用户</el-button>
          </div>
        </el-form>
    </transition>

  </div>

</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import { useRouter } from 'vue-router'
import { post } from "../utils/request.js";
import ApiPath from "../common/ApiPath.js";
import { FormInstance } from "element-plus";
import { FormRules } from "element-plus/lib/components";
import { getCurrentInstance } from 'vue'
import 'animate.css'
const { proxy } = getCurrentInstance()

const show = ref(false)
onMounted(() => {
  setTimeout(() => {
  show.value = true
  }, 500)
})
const loginForm = reactive({
  email: '',
  code: ''
})
const rules = reactive<FormRules>({
  email: [{
    required: true,
    message: '请输入邮箱',
    trigger: 'change'
  }],
  code: [{
    required: true,
    message: '请输入验证码',
    trigger: 'change'
  }]
})
const ruleFormRef = ref<FormInstance>()

const router = useRouter()
const login = async (formEl: FormInstance | undefined) => {
  if(!formEl)return
  console.log(978777)
  await formEl.validate((valid:any) => {
    if (valid) {
      post(ApiPath.USER_LOGIN, {
        login_type:2,
        email: loginForm.email,
        verify_code: loginForm.code
      }).then(async (response) => {
        if (response.code === 0) {
          show.value = false
          proxy.$notify({
            title: '登陆成功',
            message: `欢迎您，${response?.user_info?.nickname}`,
            showClose: true,
            type: 'success'
          })
          await router.push({
            name: 'console'
          })

        }
      })
    }
  })
}
const timer = ref(0)
const buttonDisabled = ref(false)
let interval = ref<number>()
const sendVerifyCode = async (formEl: FormInstance | undefined) => {
  if(!formEl)return
  await formEl.validateField('email',  async (valid:any) => {
    if(valid){

      buttonDisabled.value = true
      const response = await post(ApiPath.SEND_VERIFY_CODE, {
        email: loginForm.email
      })
      buttonDisabled.value = false
      if (response.code === 0) {
        proxy.$message({
          type: 'success',
          message: '发送成功'
        })
        timer.value = 59
        interval.value = setInterval(() => {
          timer.value--
          if (timer.value === 0) {
            clearInterval(interval.value)
          }
        }, 1000)
      }
    }
  })

}
</script>

<style lang="scss"  scoped>
.login{
  padding: 0;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 600px;
  width: 400px;
  transform: translate(-50% ,-50%);
  background: rgba(255,255,255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  &-form{
    &__title{
      text-align: center;
      font-size: 26px;margin-bottom: 50px;
      &-text{
        display: inline-block;
        font-size: 14px
      }
    }
    .el-input input {
      color: #fff
    }
    :deep .el-input__wrapper{
      height: 34px;
      line-height: 34px;
      background-color: unset;
    }
    :deep .el-form-item{
      margin-bottom: 30px;
    }
    :deep .el-input__inner {
      color:#fff;
      height: 34px;
      line-height: 34px;
      background-color: rgba(255, 255, 255, 0) !important;
    }
    :deep(.el-input__inner::placeholder){
      color:#fff
    }
  }

}
</style>

