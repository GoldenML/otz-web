<template>
  <div class="otz-modal" @click.stop>
    <div class="otz-modal__content" :style="{ width }">
      <div style="display: flex">
        <div style="width: 300px;">
          <el-input placeholder="搜索" style="margin-left: 20px; width: 260px" />
          <div style="color: rgb(170, 170, 170);font-size: 14px;padding: 10px 0 10px 20px">所有朋友</div>
          <div style="max-height: 420px; overflow: hidden">
            <el-checkbox-group v-for="item in store.friendInfos" :key="item.username" v-model="checked">
              <div class="friend-item">
                <el-checkbox :checked="store.groupMember[store.operateUsername][item.username]" :disabled="store.groupMember[store.operateUsername][item.username]" :label="item" style="margin-right: 0">
                  <img alt="" :src="item.avatar" :width="30" style="vertical-align: middle;margin: 0 5px" :height="30">{{ item.nickname }}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
        <div style="flex: 1;">
          <div style="height: 30px">
            <div style="font-size: 14px;float: left">选择联系人</div>
            <div v-if="selected.length > 0" style="float:right; margin-right: 20px;font-size: 12px;color: rgb(127, 127, 127)">已选择{{ selected.length }}个联系人</div>
          </div>
          <div v-for="friend in selected" :key="friend.username" style="width: 50px;text-align: center;float: left; padding: 5px;position:relative;">
            <el-icon style="position: absolute; left: 45px; top: -5px;cursor:pointer;color: rgb(153, 153, 153)" @click="handleRemove(friend.username)">
              <CircleClose />
            </el-icon>
            <img :src="friend.avatar" alt="" :width="40" :height="40">
            <div style="width: 50px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap">{{ friend.nickname }}</div>
          </div>
          <div style="position: absolute; right: 10px;bottom: 10px">
            <el-button class="btn-modal-ok" :disabled="selected.length === 0" @click="handleSubmit">确定</el-button>
            <el-button class="btn-modal-cancel" @click="handleCancel">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="js">
import {getCurrentInstance, inject, onMounted, reactive, ref, watch} from 'vue'
import {userStore} from '@/store/userStore.js'
import {CircleClose, Close} from '@element-plus/icons-vue'
import ApiPath from '@/common/ApiPath.js'
import {post} from '@/utils/request.js'

const store = userStore()
const selected = ref([])
const checked = ref([])
const { proxy } = getCurrentInstance()
const props = defineProps({
  title: String,
  width: String
})
onMounted(() => {
})
watch(checked, (newVal) => {
  selected.value = newVal.filter(e => !store.groupMember[store.operateUsername][e.username])
}, {deep: true})
const emits = defineEmits(['before-close', 'scroll'])
const handleCancel = () => {
  emits('before-close')
}
const handleRemove = (username) => {
  const idx = checked.value.findIndex(v => v.username === username)
  checked.value.splice(idx, 1)
}
const globalFunc = inject('globalFunc')
const handleSubmit = async () => {
  post(ApiPath.GROUP_ADD_USER, {
    group_id: store.operateUsername,
    member_usernames: selected.value.map(e => e.username)
  }).then(res => {
    proxy.$message({
      type: 'success',
      message: '添加成功'
    })
    emits('before-close')
    post(ApiPath.USER_GROUP_GET_MEMBERS, {
      group_id: store.operateUsername,
    }).then(res1 => {
      if (res1.code === 0) {
        const obj = {[store.operateUsername]: {}}
        res1.members.forEach(v => {
          obj[store.operateUsername][v.username] = v
        })
        store.updateGroupMember(Object.assign(store.groupMember, obj))
      }

    })
    globalFunc.getUserMsg()
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
    background: #fff;
    width: 600px;
    border-radius: 6px;
    box-shadow: 0 1px 10px 0 #e5e3e3;
    height: 500px;
    padding: 13px 0
  }
}
.friend-item{
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  :deep .el-checkbox {
    vertical-align: middle;
  }
  &:hover{
    background-color: rgb(232, 231, 231);
  }
}
</style>
