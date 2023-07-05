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
      <div v-if="editName !== 'groupName'" style="font-size: 14px; color: rgb(127, 127, 127)">{{ groupName }} <el-icon style="vertical-align: middle;cursor:pointer;" @click.stop="handleEdit('groupName')"><Edit /></el-icon></div>
      <el-input v-else ref="groupNameRef" v-model="groupName" @blur="handleSave" @keydown.enter="handleSave" />
    </div>
    <div style="padding: 10px">
      <span style="font-size: 14px">群公告：</span>
      <div v-if="editName !== 'groupAnnouncement'" style="font-size: 14px; color: rgb(127, 127, 127)">{{ groupAnnouncement }} <el-icon style="vertical-align: middle;cursor:pointer;" @click.stop="handleEdit('groupAnnouncement')"><Edit /></el-icon></div>
      <el-input
        v-else
        ref="groupAnnouncementRef"
        v-model="groupAnnouncement"
        type="textarea"
        autosize
        @blur="handleSave"
        @keydown.enter="handleSave"
      />
    </div>
    <div style="padding: 10px">
      <span style="font-size: 14px">群简介：</span>
      <div v-if="editName !== 'groupIntro'" style="font-size: 14px; color: rgb(127, 127, 127)">{{ groupIntro }} <el-icon style="vertical-align: middle;cursor:pointer;" @click.stop="handleEdit('groupIntro')"><Edit /></el-icon></div>
      <el-input
        v-else
        ref="groupIntroRef"
        v-model="groupIntro"
        type="textarea"
        autosize
        @blur="handleSave"
        @keydown.enter="handleSave"
      />
    </div>
  </div>
  <UserInfo ref="userInfoRef" />
  <GroupAddFriend v-if="groupAddFriendVisible" @before-close="groupAddFriendVisible = false" />
  <GroupRemoveFriend v-if="groupRemoveFriendVisible" @before-close="groupRemoveFriendVisible = false" />
</template>
<script setup lang="js">
import {computed, getCurrentInstance, inject, onMounted, reactive, ref, toRefs, watch} from 'vue'
import {userStore} from '@/store/userStore.js'
import UserInfo from '@/components/UserInfo.vue'
import GroupAddFriend from '@/views/console/chats/components/GroupAddFriend.vue'
import GroupRemoveFriend from '@/views/console/chats/components/GroupRemoveFriend.vue'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'
import {Edit, Minus} from '@element-plus/icons-vue'

const {proxy} = getCurrentInstance()
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
const groupNameRef = ref()
const groupAnnouncementRef = ref()
const groupIntroRef = ref()

const editName = ref('')
const groupForm = reactive({
  groupName: '',
  groupIntro: '',
  groupAnnouncement: ''
})
const initGroupInfo = ref(null)
const { groupName, groupIntro, groupAnnouncement } = toRefs(groupForm)
watch(store.groupInfos, (list) => {
  const idx = list.findIndex(e => e.group_id === store.operateUsername)
  if (idx > -1) {
    initGroupInfo.value = list[idx]
    const groupInfo = list[idx]
    groupName.value = groupInfo.group_name
    groupIntro.value = groupInfo.groupIntro
    groupAnnouncement.value = groupInfo.group_notice
  }
}, {deep: true, immediate: true})
onMounted(() => {
  searchGroupInfo()
})
const searchGroupInfo = () => {
  post(ApiPath.USER_GROUP_GET_INFO, {
    group_id: props.username
  }).then(res => {
    if(res.code === 0) {
      const idx = store.groupInfos.findIndex(e => e.group_id === store.operateUsername)
      if (idx > -1) {
        store.groupInfos.splice(idx, 1, res.group_info)
      }
    }
  })
}
const userInfoRef = ref()
const handleShowGroupUserInfo = (e, left, isGroup, username) => {
  store.updateLookUserInfo(store.groupMember[props.username][username])
  userInfoRef.value.handleShowInfo(e, left)
}

const globalFunc = inject('globalFunc')
const handleSave = () => {
  if (!editName.value) {
    return
  }
  editName.value = ''
  post(ApiPath.GROUP_UPDATE_INFO, {
    group_info: {
      group_id: store.operateUsername,
      group_name: groupName.value,
      group_notice: groupAnnouncement.value,
      group_intro: groupIntro.value,
      talk_status: 1
    }
  }).then(res => {
    if(res.code === 0) {
      searchGroupInfo()
      store.msgs[store.operateUsername].nickname = groupName.value
    } else {
      groupName.value = initGroupInfo.value.group_name
      groupIntro.value = initGroupInfo.value.groupIntro
      groupAnnouncement.value = initGroupInfo.value.group_notice
    }
  })
}
const handleEdit = (name) => {
  editName.value = name
  proxy.$nextTick(() => {
    switch (name) {
    case 'groupName': groupNameRef.value.focus()
      break
    case 'groupAnnouncement': groupAnnouncementRef.value.focus()
      break
    case 'groupIntro': groupIntroRef.value.focus()
      break
    default:
      break
    }
  })
}

</script>
<style lang="scss" scoped>

</style>
