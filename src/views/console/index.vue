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
import {inject, onMounted, onUnmounted, provide, ref} from 'vue'
import 'animate.css'
import {post} from '@/utils/request.js'
import ApiPath from '@/common/ApiPath.js'
import { userStore } from '@/store/userStore.js'
import _ from 'lodash'
import {useRoute} from 'vue-router'
import connectSocke from '@/utils/connectSocket.js'
import moment from 'moment'
const show = ref(true)
const store = userStore()

const globalClick = () => {
  document.querySelector('html').click()
}
onMounted(() => {
  connectWs()
  window.addEventListener('resize', globalClick)
  Promise.all([
    post(ApiPath.USER_LOGIN_STATUS, {}).then((res) => {
      store.updateUserInfo(res.user_info)
    }),
    post(ApiPath.USER_GET_FRIEND, {}).then(res => {
      store.updateFriendInfos(res.friends)
    }),
    post(ApiPath.USER_ADD_HISTORY, {}).then(res => {
      store.updateAddHistory(res.add_friend_histories)
    }),
    post(ApiPath.USER_GET_GROUP_LIST, {}).then(async res => {
      store.updateGroupInfos(res.groups)
      await getAllGroupMember(res.groups)
    })
  ]).then(() => {
    getUserMsg()
    setInterval(() => {
      // getFriendInfos()
      getUserMsg()
      // getAllGroup()
      // getAddHistory()
    }, 10000)
  })
})
onUnmounted(() => {
  window.addEventListener('resize', globalClick)
})
provide('globalFunc', {
  getUserMsg: async () => getUserMsg(),
  getFriendInfos: async () => getFriendInfos(),
  getAllGroup: () => getAllGroup(),
  getAddHistory: () => getAddHistory()
})

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
    Object.assign(store.badges, badges)
    if(res.msgs?.length > 0) {
      store.updateSequence(Number(res.msgs[res.msgs.length - 1].sequence))
      const obj = _.cloneDeep(store.msgs) || {}
      res.msgs.forEach(e => {
        const {from_type, to_type, from_username,to_username, msg_type, text_msg, client_sequence, sequence, group_id, timestamp} = e
        if(new Date(Number(timestamp)).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
          e.formatTime = moment(new Date(Number(timestamp))).format('HH:mm')
        } else {
          e.formatTime = moment(new Date(Number(timestamp))).format('YYYY-MM-DD HH:mm')
        }
        if (from_type === 1 && to_type === 1) {
          const friendUsername = userInfo.username === from_username ? to_username : from_username
          const idx = friendInfos.findIndex(user => user.username === friendUsername)
          if (idx > -1) {
            const friend = friendInfos[idx]
            if(!obj[friendInfos[idx].username]) {
              obj[friend.username] = {
                type: 1,
                nickname: friend.nickname,
                avatar: friend.avatar,
                lastMsg: msg_type === 1 ? text_msg.text : msg_type === 2 ? '[图片]' : '',
                username: friend.username,
                msgList: [e],
                lastTime: timestamp
              }
            } else {
              obj[friend.username].lastTime = timestamp
              obj[friend.username].lastMsg = msg_type === 1 ? text_msg.text : msg_type === 2 ? '[图片]' : ''
              const i = obj[friend.username].msgList.findIndex(v => String(v.client_sequence) === String(client_sequence))
              if(client_sequence && i > -1) {
                obj[friend.username].msgList[i].wait = false
                return
              }
              if(obj[friend.username].msgList.findIndex(v => String(v.sequence) === String(sequence)) === -1) {
                obj[friend.username].msgList.push(e)
              }
            }
          }
        } else if((from_type === 1 || from_type === 4) && to_type === 2) {
          const idx = store.groupInfos.findIndex(v => v.group_id === to_username)
          if (idx > -1) {
            const groupInfo = store.groupInfos[idx]
            if(!obj[to_username]) {
              obj[to_username] = {
                type: 2,
                nickname: groupInfo.group_name,
                avatar: groupInfo.group_avatar,
                lastUsername: from_username,
                lastMsg:msg_type === 1 ? text_msg.text : msg_type === 2 ? '[图片]' : '',
                username: group_id,
                msgList: from_type === 4 ? [
                  {
                    ...e,
                    isSystemMsg: true,
                  }] : [e],
                lastTime: timestamp
              }
            } else {
              obj[to_username].lastTime = timestamp
              obj[to_username].lastUsername = from_username
              obj[to_username].lastMsg = msg_type === 1 ? text_msg.text : msg_type === 2 ? '[图片]' : ''
              const i = obj[to_username].msgList.findIndex(v => String(v.client_sequence) === String(client_sequence))
              if(client_sequence && i > -1) {
                obj[to_username].msgList[i].formatTime = e.formatTime
                obj[to_username].msgList[i].wait = false
                return
              }
              if(obj[to_username].msgList.findIndex(v => String(v.sequence) === String(sequence)) === -1) {
                obj[to_username].msgList.push(from_type === 4 ? {
                  ...e, isSystemMsg: true,
                } : e)
              }
            }
          }
        }
      })
      const arr = []
      Object.keys(obj).forEach((e, i) => {
        arr[i] = {
          [e]: obj[e]
        }
      })
      const newArr = arr.sort((v1, v2) => {
        return Number(v2[Object.keys(v2)[0]].lastTime) - Number(v1[Object.keys(v1)[0]].lastTime)
      })
      const newObj = {}
      newArr.forEach(e => {
        newObj[Object.keys(e)[0]] = e[Object.keys(e)[0]]
      })
      Object.keys(newObj).forEach(v => {
        if(newObj[v].type === 2) {
          newObj[v].msgList.filter(e => e.from_type !== 4).forEach(e => {
            if(!store.groupMember[e.to_username]?.[e.from_username] && !store.cacheUser[e.from_username]) {
              post(ApiPath.USER_GET_INFO, {
                username: e.from_username
              }).then(res => {
                if (res.code === 0) {
                  store.cacheUser[res.user_info.username] = res.user_info
                }
              })
            }
          })
        }
      })
      console.log(newArr)
      store.updateMsgs(newObj)
      if(res.msgs.length > 100) {
        getUserMsg()
      }

    }
  }
}
const connectWs = () => {
  let lockReconnect = false
  let tt
  const route = useRoute()
  let timer = null
  let ws
  let wsUrl = 'wss://im.sotz.cc/otz/im/web_proxy/sync_notify'
  function createWebSocket() {
    try {
      ws = new WebSocket(wsUrl)
      init()
    } catch(e) {
      reconnect(wsUrl)
    }
  }
  function init() {
    ws.onopen = function () {
      //心跳检测重置
      heartCheck.start()
    }
    ws.onmessage = ({ data }) => {
      if (data === 'otz_pong') {
        heartCheck.start()
        return
      }

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
    ws.onclose = function () {
      console.log('ws已关闭')
      reconnect(wsUrl)
    }
    ws.onerror = function() {
      console.log('ws发生异常')
      reconnect(wsUrl)
    }

  }
  function reconnect(url) {
    if(lockReconnect) {
      return
    }
    lockReconnect = true
    //没连接上会一直重连，设置延迟避免请求过多
    tt && clearTimeout(tt)
    tt = setTimeout(function () {
      createWebSocket(url)
      lockReconnect = false
    }, 4000)
  }
  let heartCheck = {
    timeout: 10000,
    timeoutObj: null,
    serverTimeoutObj: null,
    start: function() {
      let self = this
      console.log('ws ===>', ws)
      this.timeoutObj && clearTimeout(this.timeoutObj)
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
      this.timeoutObj = setTimeout(function() {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        ws.send('otz_ping')
        self.serverTimeoutObj = setTimeout(function() {
          ws.close()
        }, self.timeout)
      }, this.timeout)
    }
  }
  const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
  IS_PROD && createWebSocket()
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
  background-color: rgb(245, 245, 245);
  flex: 1;
}
</style>
