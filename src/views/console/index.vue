<template>
   <div  class="container">
     <transition enter-active-class="animate__animated animate__bounceIn">
       <div v-if="show" class="layout-container">
         <div class="sidebar">
           <Menu></Menu>
         </div>
         <div class="content">
           <router-view></router-view>
         </div>
       </div>
     </transition>
   </div>
</template>
<script setup lang="js">
import Menu from './Menu.vue'
import {onMounted, provide, ref} from "vue";
import 'animate.css'
import {post} from "@/utils/request.js";
import ApiPath from "@/common/ApiPath.js";
import {userStore} from "@/store/userStore.js";
import _ from 'lodash'
const show =ref(false)
const store =userStore()

onMounted(() => {
  setTimeout(() => {
    show.value = true
  },500)
  Promise.all([
    post(ApiPath.USER_LOGIN_STATUS, {}).then((res) => {
      store.updateUserInfo(res.user_info)
    }),
    post(ApiPath.USER_GET_FRIEND, {}).then(res => {
      store.updateFriendInfos(res.friends)
    })
  ]).then(() => {
    getAddHistory()
    getUserMsg()
    setInterval(() => {
      getUserMsg()
      getAddHistory()
    }, 10000)
  })
})
provide('globalFunc', {
  getUserMsg: async () => await getUserMsg(),
  getFriendInfos: async () => await getFriendInfos()
})
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

    res.msgs?.forEach(e => {
      if (userInfo.username === e.from_username) {
        const idx = friendInfos.findIndex(user => user.username === e.to_username)
        if (idx > -1) {
          const friend = friendInfos[idx]
          if (!obj[friend.username]) {
            obj[friend.username] = {
              nickname: friend.nickname,
              avatar: friend.avatar,
              myAvatar: userInfo.avatar,
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

      } else {
        const idx = friendInfos.findIndex(user => user.username === e.from_username)
        if (idx > -1) {
          const friend = friendInfos[idx]
          if (!obj[friend.username]) {
            obj[friend.username] = {
              nickname: friend.nickname,
              avatar: friend.avatar,
              myAvatar: userInfo.avatar,
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
