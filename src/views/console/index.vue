<template>
  <div class="container">
    <transition enter-active-class="animate__animated animate__bounceIn">
      <div v-if="show" class="layout-container">
        <div class="sidebar">
          <Menu />
        </div>
        <div class="content">
          <router-view />
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="js">
import Menu from './Menu.vue'
import {inject, onMounted, provide, ref} from 'vue'
import 'animate.css'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'
import { userStore } from '@/store/userStore.js'
import _ from 'lodash'
import {useRoute} from 'vue-router'
const show = ref(false)
const store = userStore()

onMounted(() => {
  connectWs()

  setTimeout(() => {
    show.value = true
  },500)
  Promise.all([
    post(ApiPath.USER_LOGIN_STATUS, {}).then((res) => {
      store.updateUserInfo(res.user_info)
    }),
    post(ApiPath.USER_GET_FRIEND, {}).then(res => {
      store.updateFriendInfos(res.friends)
    }),
    post(ApiPath.USER_GET_GROUP_LIST, {}).then(async res => {
      store.updateGroupInfos(res.groups)
      await getAllGroupMember(res.groups)
    })
  ]).then(() => {
    getAddHistory()
    getUserMsg()
    // setInterval(() => {
    //   getUserMsg()
    //   getAddHistory()
    // }, 10000)
  })
})
provide('globalFunc', {
  getUserMsg: async () => getUserMsg(),
  getFriendInfos: async () => getFriendInfos(),
  getAllGroup: () => getAllGroup()
})
const connectWs = () => {
  const route = useRoute()
  const socket = inject('socket')
  const ws = socket('otz/im/web_proxy/sync_notify')
  ws.onopen = () => {
    console.log('websocket已连接')
  }
  ws.onmessage = ({ data }) => {
    console.log('websocket消息：', data)

    switch (JSON.parse(data).notify_type) {
    case 1:
      if(route.matched[1].path === '/console/chats') {
        store.updateContactBadge(true)
      }
      getAddHistory()
      break
    case 2:
      if(route.matched[1].path === '/console/contacts') {
        store.updateChatBadge(true)
      }
      getUserMsg()
      break
    default:
      break
    }
  }
  ws.onclose = () => {
    setTimeout(() => {
      connectWs()
    }, 10000)
    console.log('websocket连接已关闭')
  }
}
const getAllGroup = () => {
  post(ApiPath.USER_GET_GROUP_LIST, {}).then(async res => {
    store.updateGroupInfos(res.groups)
    await getAllGroupMember(res.groups)
  })
}
const getAllGroupMember = (groups) => {
  const groupMember = {}
  Promise.all(groups.map(e => {
    return post(ApiPath.USER_GROUP_GET_MEMBERS, {
      group_id:  e.group_id
    }).then(res => {
      groupMember[e.group_id] = {}
      res.members.forEach(v => [
        groupMember[e.group_id][v.username] = v
      ])
    })
  })).then(() => {
    store.updateGroupMember(groupMember)
  })

}
const getFriendInfos = async () => {
  const res = await post(ApiPath.USER_GET_FRIEND, {})
  if (res.code === 0) {
    store.updateFriendInfos(res.friends)
  }
}
const getAddHistory = async () => {
  const res = await post(ApiPath.USER_ADD_HISTORY, {})
  if(res.code === 0) {
    store.updateAddHistory(res.add_friend_histories)
  }
}
const getUserMsg = async () => {
  const userInfo = store.userInfo
  const friendInfos = store.friendInfos
  const res = await post(ApiPath.USER_GET_MSGS, {
    sequence: store.sequence
  })
  if(res.code === 0) {
    const obj = _.cloneDeep(store.msgs) || {}
    if (res.msgs.length > 0) {
      store.updateSequence(Number(res.msgs[res.msgs.length - 1].sequence))
    }
    const newMessage = res.msgs.map(e => {
      if (e.from_type === 1 && e.to_type === 1) {
        if (userInfo.username === e.from_username) {
          return e.to_username
        }
        return e.from_username
      }
      return e.to_username
    })
    const badges = {}
    Object.keys(store.msgs).forEach(v => {
      if(newMessage.includes(v) && store.operateUsername !== v) {
        badges[v] = true
      }
    })
    store.updateBadges(Object.assign(store.badges, badges))
    res.msgs?.forEach(e => {
      if (e.from_type === 1 && e.to_type === 1) {
        if (userInfo.username === e.from_username) {
          const idx = friendInfos.findIndex(user => user.username === e.to_username)
          if (idx > -1) {
            const friend = friendInfos[idx]
            if (!obj[friend.username]) {
              obj[friend.username] = {
                type: 1,
                nickname: friend.nickname,
                avatar: friend.avatar,
                lastMsg: e.text_msg.text,
                username: friend.username,
                msgList: [e],
              }
            } else if(obj[friend.username].msgList.findIndex(v => String(v.sequence) === String(e.sequence)) === -1) {
              obj[friend.username].lastMsg = e.text_msg.text
              obj[friend.username].msgList.push(e)
            }
          }

        } else {
          const idx = friendInfos.findIndex(user => user.username === e.from_username)
          if (idx > -1) {
            const friend = friendInfos[idx]
            if (!obj[friend.username]) {
              obj[friend.username] = {
                type: 1,
                nickname: friend.nickname,
                avatar: friend.avatar,
                lastMsg: e.text_msg.text,
                username: friend.username,
                msgList: [e],
              }
            } else {
              if(obj[friend.username].msgList.findIndex(v => String(v.sequence) === String(e.sequence)) === -1) {
                obj[friend.username].lastMsg = e.text_msg.text
                obj[friend.username].msgList.push(e)
              }
            }
          }
        }
      } else if(e.from_type === 1 && e.to_type === 2) {

        const idx = store.groupInfos.findIndex(v => v.group_id === e.to_username)
        if (idx > -1) {
          const groupInfo = store.groupInfos[idx]
          if(!obj[e.to_username]) {
            obj[e.to_username] = {
              type: 2,
              nickname: groupInfo.group_name,
              avatar: groupInfo.group_avatar,
              lastUsername: e.from_username,
              lastMsg: e.text_msg.text,
              username: e.group_id,
              msgList: [e],
            }
          } else {
            if(obj[e.to_username].msgList.findIndex(v => String(v.sequence) === String(e.sequence)) === -1) {
              obj[e.to_username].lastUsername = e.from_username
              obj[e.to_username].lastMsg = e.text_msg.text
              obj[e.to_username].msgList.push(e)
            }
          }
        }

      } else if(e.from_type === 4 && e.to_type === 2) {
        const idx = store.groupInfos.findIndex(v => v.group_id === e.to_username)
        if (idx > -1) {
          const groupInfo = store.groupInfos[idx]
          if (!obj[e.to_username]) {
            obj[e.to_username] = {
              type: 2,
              nickname: groupInfo.group_name,
              avatar: groupInfo.group_avatar,
              lastUsername: e.from_username,
              lastMsg: e.text_msg.text,
              username: e.group_id,
              msgList: [{...e, isSystemMsg: true,}],
            }
          }
        } else {
          if(obj[e.to_username].msgList.findIndex(v => String(v.sequence) === String(e.sequence)) === -1) {
            obj[e.to_username].lastUsername = e.from_username
            obj[e.to_username].lastMsg = e.text_msg.text
            obj[e.to_username].msgList.push({...e, isSystemMsg: true,})
          }
        }
      }
    })

    store.updateMsgs(obj)
  }
}
</script>
<style lang="scss" scoped>
.container{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1000px;
  height: 800px;
  transform: translate(-50% ,-50%);
}
.layout-container {
  display: flex;
  width: 1000px;
  height: 800px;
  @include scrollBar(#868788, #606266, transparent);
}

.sidebar {
  width: 62px;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
}
</style>
