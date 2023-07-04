<template>
  <div style="position:relative;height: 100%">
    <div class="group-info-top">
      {{ groupName }}（{{ members.length }}）
    </div>
    <div style="margin: 10px 50px;max-height: 600px; overflow: scroll">
      <div v-for="item in members" :key="item.username" style="float: left; padding: 0 10px">
        <img
          :src="item.avatar"
          :width="60"
          :height="60"
          alt=""
          style="cursor:pointer;"
          @click.stop="handleShowInfo($event, false, item.username)"
        >
        <div style="width: 60px; overflow: hidden;text-overflow: ellipsis;white-space: nowrap">{{ item.nickname }}</div>
      </div>

    </div>
    <div style="position: absolute; left: 50%; transform: translate(-50%); bottom: 50px">
      <el-button class="btn-group-send" @click="sendMessage">发消息</el-button>
    </div>
  </div>
  <UserInfo ref="userInfoRef" />
</template>
<script setup lang="js">
import {onMounted, onUpdated, ref, watch} from 'vue'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'
import {userStore} from '@/store/userStore.js'
import {useRouter} from 'vue-router'
import {User} from '@element-plus/icons-vue'
import UserInfo from '@/components/UserInfo.vue'
const userInfoRef = ref()

const props = defineProps({
  groupId: String,
  groupName: String
})
const members = ref([])
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
const store = userStore()
const router = useRouter()
const sendMessage = () => {
  const idx = store.groupInfos.findIndex(e => e.group_id === props.groupId)
  if(!store.msgs[props.groupId]) {
    store.msgs[props.groupId] = {
      type:2,
      nickname: store.groupInfos[idx].group_name,
      avatar: store.groupInfos[idx].group_avatar,
      lastUsername: '',
      lastMsg: '',
      username: props.groupId,
      msgList: [],
    }
  }
  store.updateOperateUsername(props.groupId)
  router.push({
    path: '/console/chats'
  })
}
const handleShowInfo = (e, left, username) => {
  store.updateLookUserInfo(store.groupMember[props.groupId][username])

  userInfoRef.value.handleShowInfo(e, left)
}
</script>
<style lang="scss" scoped>
.group-info-top{
  padding-left: 20px;
  line-height: 60px;
  height: 60px;
  background-color: rgb(245,245,245);
}
</style>
