<template>
  <div class="otz-modal">
    <div class="content">
      <div class="header">
        <div class="header__title">
          个人设置
        </div>
        <div class="header__icon">
          <el-icon @click="handleCancel"><Close /></el-icon>
        </div>

      </div>
      <div class="body">
        <el-form label-width="80px">
          <el-form-item label="个人头像">
            <UserAvatar ref="userAvatarRef" />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="form.nickname" style="width:80%" />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="form.username" disabled style="width: 80%" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form.gender">
              <el-radio :label="0">未知</el-radio>
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.phone" style="width: 80%" />
          </el-form-item>
          <el-form-item label="个人邮箱">
            <el-input v-model="form.email" style="width: 80%" />
          </el-form-item>
          <el-form-item label="地区">
            <el-cascader
              ref="cascader"
              v-model="form.area"
              style="width: 80%"
              :options="options"
              :show-all-levels="true"
              placeholder="请选择"
              clearable
            />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="form.address" style="width: 80%" />
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker
              v-model="form.birthday"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 80%"
              type="date"
              placeholder="请选择"
            />
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="form.intro" type="textarea" style="width: 80%" rows="4" />
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <el-button class="btn-conditional" @click="handleSaveInfo">保存</el-button>
      </div>
    </div>
  </div>

  <div />
</template>
<script setup lang="js">
import {getCurrentInstance, onMounted, reactive, ref} from 'vue'
import {Close} from '@element-plus/icons-vue'
import UserAvatar from '@/views/console/settings/userAvatar.vue'
import {userStore} from '@/store/userStore.js'
import { regionData, codeToText } from 'element-china-area-data'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'

const { proxy } = getCurrentInstance()

const list = reactive([
  '账号设置', '关于OTZ'
])

const cascader = ref()
const userAvatarRef = ref()
const options = regionData
const store = userStore()
console.log(store.userInfo)
const form = reactive({
  nickname: store.userInfo.nickname,
  username: store.userInfo.username,
  address: store.userInfo.address,
  avatar: '',
  gender: store.userInfo.gender,
  intro: store.userInfo.intro,
  phone: store.userInfo.phone,
  email: store.userInfo.email,
  birthday: store.userInfo.birthday,
  area: [store.userInfo.province, store.userInfo.city, store.userInfo.district],
  city: store.userInfo.city,
  country: '',
  province: store.userInfo.province,
  district: store.userInfo.district
})
onMounted(() => {
  console.log(222 ,codeToText['11'])
})
const props = defineProps({
  title: String,
  width: String
})
defineEmits(['before-close'])
const handleCancel = () => {
  proxy.$emit('before-close')
}
const handleSaveInfo = () => {
  // console.log(form.area, proxy.$refs.cascader.getCheckedNodes()[0]?.pathLabels)
  // if (proxy.$refs.cascader.getCheckedNodes()[0]?.pathLabels) {
  //
  // }
  if (form.area?.length > 0) {
    form.province = form.area[0]
    form.city = form.area[1]
    form.district = form.area[2]
  }
  console.log(proxy.$refs.userAvatarRef.options)
  form.avatar = proxy.$refs.userAvatarRef.options?.absolute_path || store.userInfo.avatar
  post(ApiPath.USER_UPDATE, {
    user_info: form
  }).then(res => {
    if(res.code === 0) {
      post(ApiPath.USER_LOGIN_STATUS, {}).then((res) => {
        store.updateUserInfo(res.user_info)
      })
      proxy.$message({
        type: 'success',
        message: '修改成功'
      })
      proxy.$emit('before-close')
    }
  })
}
const handleChange = (v1, v2 ,v3) => {
  console.log(proxy.$refs.cascader.getCheckedNodes()[0].pathLabels)
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
  background-color: rgba(0, 0, 0, 0.3);

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgb(245,245,245);
    width: 550px;
    height: 550px;
    border-radius: 3px;
    padding: 10px;
    .header{
      &__title{
        font-size: 14px;
        display: inline-block;
        color: rgb(153,153,153)
      }
      &__icon{
        cursor: pointer;
        display: inline-block;
        float: right;
      }
    }
    .body{
      margin: 20px 50px;
      font-size: 14px;
      max-height: 450px;
      overflow: auto;
      &__left{
      }
      &__right{
      }
    }
    .footer{
      text-align: center;
    }
  }
}
</style>
