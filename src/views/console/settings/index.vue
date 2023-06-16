<template>
  <div class="otz-modal">
    <div class="content">
      <div class="header">
        <div class="header__title">
          设置
        </div>
        <div class="header__icon">
          <el-icon><Close></Close></el-icon>
        </div>

      </div>
      <div class="body">
        <div class="body__left">
          <div>
            <div style="margin-bottom: 15px" v-for="(item,index) in list" :key="index">
              {{item}}
              <div style="height: 14px;margin-top: 3px;border-right: 1px solid rgb(61, 206, 61); float:right;margin-left: 20px;z-index:10"></div>
            </div>
          </div>
          <div style="height: 100%;border-right: 1px solid rgb(227, 227, 227); float:right;"></div>
        </div>
        <div class="body__right">

        </div>
      </div>
      <div class="footer"></div>
    </div>
  </div>
</template>
<script setup lang="js">
import {getCurrentInstance, reactive} from "vue";
import {Close} from "@element-plus/icons-vue";

const { proxy } = getCurrentInstance()

const list = reactive([
    '账号设置', '关于OTZ'
])
const props = defineProps({
  title: String,
  width: String
})
defineEmits(['before-close'])
const handleCancel = () => {
  proxy.$emit('before-close')
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
    height: 470px;
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
      margin-top: 110px;
      display: flex;
      font-size: 14px;
      height: calc(100% - 110px - 15px);
      &__left{
        display: flex;
      }
      &__right{
      }
    }
  }
}
</style>
