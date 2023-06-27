<template>
  <div style="position:relative;height: 100%">
    <div class="group-info-top">
      群聊
    </div>
    <div style="margin: 10px 50px;max-height: 600px; overflow: scroll">
      <div v-for="item in members" :key="item.username" style="float: left; padding: 0 10px">
        <img :src="item.avatar" :width="60" :height="60" alt="">
        <div style="width: 60px; overflow: hidden;text-overflow: ellipsis;white-space: nowrap">{{ item.nickname }}</div>
      </div>

    </div>
    <div style="position: absolute; left: 50%; transform: translate(-50%); bottom: 50px">
      <el-button class="btn-group-send">发消息</el-button>
    </div>
  </div>
</template>
<script setup lang="js">
import {onMounted, onUpdated, ref, watch} from 'vue'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'

const props = defineProps({
  groupId: String
})
const members = ref(null)
onMounted(async () => {
  const res = await post(ApiPath.USER_GROUP_GET_MEMBERS, {
    group_id: props.groupId
  })
  if (res.code === 0) {
    members.value = res.members
  }
})
watch(props, async (newVal) => {
  const res = await post(ApiPath.USER_GROUP_GET_MEMBERS, {
    group_id: newVal.groupId
  })
  if (res.code === 0) {
    members.value = res.members
  }
})
</script>
<style lang="scss" scoped>
.group-info-top{
  padding-left: 20px;
  line-height: 60px;
  height: 60px;
  background-color: rgb(245,245,245);
}
</style>
