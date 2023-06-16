<template>
  <div class="otz-modal">
    <div class="otz-modal__content" :style="{ width }">
      <div class="otz-modal__content-header">
        <div class="otz-modal__header-description">
          <slot name="header"></slot>
          <div class="otz-modal__header-icon" @click="handleCancel">
            <el-icon><Close></Close></el-icon>
          </div>
        </div>
      </div>
      <div class="otz-modal__content-body">
        <slot name="content"></slot>
      </div>
      <div class="otz-modal__content-footer">
        <slot name="footer"></slot>
      </div>
      <slot name="other"></slot>
    </div>
  </div>
</template>
<script setup lang="js">
import { getCurrentInstance } from "vue";
import {Close} from "@element-plus/icons-vue";

const { proxy } = getCurrentInstance()
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

  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    width: 600px;
    border-radius: 6px;
    &-header {
      border-radius: 6px 6px 0 0;
      background: #ebedf0;
      height: 52px;
      border-bottom: 1px solid #e4e6f4;
    }
    &-body {
      background: #ffffff;
      padding: 20px 20px 3px 20px;
      overflow: auto;
      max-height: 520px;
    }
    &-footer {
      min-height: 68px;
      text-align: right;
      padding: 20px;
      .btn-cancel {
        width: 80px;
        height: 28px;
        padding: 0;
        font-size: 14px;
        border-radius: 4px;
        border: 1px solid #dce1e5;
        color: #000000;
        letter-spacing: 1px;
      }
      .btn-ok {
        width: 80px;
        height: 28px;
        padding: 0;
        font-size: 14px;
        border-radius: 4px;
        background: #2385f1;
        color: #ffffff;
        letter-spacing: 1px;
      }
      .btn-ok:disabled {
        color: #b4b4b4 !important;
        background: rgba(191, 191, 191, 0.17) !important;
      }
    }
  }
  &__header {
    &-description {
      font-size: 16px;
      line-height: 20px;
      padding: 16px;
      letter-spacing: 1px;
      font-weight: 500;
      color: #000000;
    }
    &-icon {
      position: absolute;
      right: 21px;
      font-size: 16px;
      cursor: pointer;
      top: 20px;
    }
  }
}
.el-icon-error {
  color: #afc1d6;
  font-size: 16px;
  position: absolute;
  top: 18px;
}
</style>
