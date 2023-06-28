<template>
  <div class="user-info-head" @click="editCropper()">
    <img
      alt=""
      :width="70"
      :height="70"
      :src="options.img"
      title="点击上传头像"
      class="img-circle img-lg"
    >
    <el-dialog
      v-model="open"
      :title="title"
      width="800px"
      append-to-body
      @opened="modalOpened"
      @close="closeDialog"
    >
      <el-row>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <vue-cropper
            v-if="visible"
            ref="cropper"
            :img="options.img"
            :info="true"
            :auto-crop="options.autoCrop"
            :auto-crop-width="options.autoCropWidth"
            :auto-crop-height="options.autoCropHeight"
            :fixed-box="options.fixedBox"
            :output-type="options.outputType"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <div class="avatar-upload-preview">
            <img alt="" :src="options.previews.url" :style="options.previews.img">
          </div>
        </el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload
            action="#"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <el-button>
              选择
              <el-icon class="el-icon--right"><Upload /></el-icon>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{ span: 1, offset: 2 }" :md="2">
          <el-button :icon="Plus" @click="changeScale(1)" />
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button :icon="Minus" @click="changeScale(-1)" />
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button :icon="RefreshLeft" @click="rotateLeft()" />
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button :icon="RefreshRight" @click="rotateRight()" />
        </el-col>
        <el-col :lg="{ span: 2, offset: 6 }" :md="2">
          <el-button type="primary" @click="uploadImg()">提 交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup lang="js">
import 'vue-cropper/dist/index.css'
import {VueCropper} from 'vue-cropper'
import {getCurrentInstance, nextTick, onMounted, reactive, ref} from 'vue'
import {userStore} from '@/store/userStore.js'
import {Minus, Plus, RefreshLeft, RefreshRight, Upload} from '@element-plus/icons-vue'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'


const store = userStore()
const userInfo = store.userInfo
const { proxy } = getCurrentInstance()

const open = ref(false)
const visible = ref(false)
const title = ref('修改头像')

//图片裁剪数据
const options = reactive({
  img: store.userInfo.avatar, // 裁剪图片的地址
  absolute_path: store.userInfo.avatar,
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixedBox: true, // 固定截图框大小 不允许改变
  outputType: 'png', // 默认生成截图为PNG格式
  previews: {}, //预览数据
})
defineExpose({
  options
})
/** 编辑头像 */
function editCropper() {
  open.value = true
}
/** 打开弹出层结束时的回调 */
function modalOpened() {
  nextTick(() => {
    visible.value = true
  })
}
/** 覆盖默认上传行为 */
const requestUpload = () => {

}
/** 向左旋转 */
function rotateLeft() {
  proxy.$refs.cropper.rotateLeft()
}
/** 向右旋转 */
function rotateRight() {
  proxy.$refs.cropper.rotateRight()
}
/** 图片缩放 */
function changeScale(num) {
  num = num || 1
  proxy.$refs.cropper.changeScale(num)
}
const uploadFile = ref(null)
/** 上传预处理 */
const beforeUpload = (file) => {
  uploadFile.value = file
  if (file.type.indexOf('image/') === -1) {
    proxy.$message({
      type: 'error',
      message: '文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。'
    })
  } else {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      options.img = reader.result
    }
  }
}
/** 上传图片 */
function uploadImg() {
  // 获取截图的 base64 数据
  proxy.$refs.cropper.getCropData((data) => {
    let img = new Image()
    img.src = data
    img.onload = () => {
      let _data = compress(img)
      post(ApiPath.USER_UPLOAD_FILE, {
        file_name: uploadFile.value.name,
        file_data: _data.replace(/^data:image\/\w+;base64,/, '')
      }).then(res => {
        if (res.code === 0) {
          options.img = _data
          options.absolute_path = res.absolute_file_path
          open.value = false
          proxy.$message({
            type: 'success',
            message: '修改成功'
          })
          visible.value = false

        }
      })
    }
  })
}
// 压缩图片
function compress(img) {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  // let initSize = img.src.length;
  let width = img.width
  let height = img.height
  canvas.width = width
  canvas.height = height
  // 铺底色
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, width, height)
  // 进行压缩
  return canvas.toDataURL('image/jpeg', 0.8)
}
/** 实时预览 */
function realTime(data) {
  options.previews = data
}
/** 关闭窗口 */
function closeDialog() {
  options.visible = false
}
</script>

<style lang="scss" scoped>
.user-info-head {
  position: relative;
  display: inline-block;
  height: 70px;
}

.user-info-head:hover:after {
  content: "+";
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 70px;
  //border-radius: 50%;
}
</style>
