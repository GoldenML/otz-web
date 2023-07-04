<template>
  <div style="margin-top: 10px">
    <div v-for="(userInfo, key) in store.groupMember[username]" :key="key" style="width: 40px; text-align: center;display: inline-block; padding: 5px">
      <img
        alt=""
        :width="30"
        :height="30"
        :src="userInfo.avatar"
        style="cursor:pointer;"
        @click.stop="handleShowGroupUserInfo($event, false, true, userInfo.username)"
      >
      <div style="font-size: 12px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">
        {{ userInfo.nickname }}
      </div>
    </div>
    <div style="width: 40px; text-align: center;display: inline-block; padding: 5px">
      <img
        style="cursor:pointer;"
        alt=""
        :width="30"
        :height="30"
        src="@/assets/img/plus.png"
        @click.stop="groupAddFriendVisible = true"
      >
      <div style="font-size: 12px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">
        添加
      </div>
    </div>
    <div v-if="removeShow" style="width: 40px; text-align: center;display: inline-block; padding: 5px">
      <img
        style="cursor:pointer;"
        alt=""
        :width="30"
        :height="30"
        src="@/assets/img/minus.png"
        @click.stop="groupRemoveFriendVisible = true"
      >
      <div style="font-size: 12px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden">
        移出
      </div>
    </div>
    <div style="padding: 10px">
      <span style="font-size: 14px">群名称：</span>
      <el-input v-model="groupName" />
    </div>
  </div>
  <UserInfo ref="userInfoRef" />
  <GroupAddFriend v-if="groupAddFriendVisible" @before-close="groupAddFriendVisible = false" />
  <GroupRemoveFriend v-if="groupRemoveFriendVisible" @before-close="groupRemoveFriendVisible = false" />
</template>
<script setup lang="js">
import {computed, onMounted, reactive, ref, toRefs} from 'vue'
import {userStore} from '@/store/userStore.js'
import UserInfo from '@/components/UserInfo.vue'
import GroupAddFriend from '@/views/console/chats/components/GroupAddFriend.vue'
import GroupRemoveFriend from '@/views/console/chats/components/GroupRemoveFriend.vue'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'
import {Minus} from '@element-plus/icons-vue'

const groupAddFriendVisible = ref(false)
const groupRemoveFriendVisible = ref(false)
const removeShow = computed(() => {
  const idx = store.groupInfos.findIndex(v => v.group_id === props.username)
  if (idx > -1) {
    return store.groupInfos[idx].admin_username === store.userInfo.username
  }
  return true
})

const store = userStore()
const props = defineProps({
  username: String
})

const groupForm = reactive({
  groupName: ''
})
const {groupName} = toRefs(groupForm)
onMounted(() => {
  post(ApiPath.USER_GROUP_GET_INFO, {
    group_id: props.username
  }).then(res => {
    if(res.code === 0) {
      groupName.value = res.group_info.group_name
    }
  })
})

const userInfoRef = ref()
const handleShowGroupUserInfo = (e, left, isGroup, username) => {
  store.updateLookUserInfo(store.groupMember[props.username][username])
  userInfoRef.value.handleShowInfo(e, left)
}


</script>
<style lang="scss" scoped>

</style>
