import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
    state: () => ({
        friendInfos: [],
        msgs: {},
        userInfo: {},
        operateUsername: '',
        addHistory: [],
        sequence: 0,
        messages: {}
    }),
    getters: {

    },
    actions: {
        updateFriendInfos(friendInfos) {
            this.friendInfos = friendInfos
        },
        updateMsgs(msgs){
            this.msgs = msgs
        },
        updateUserInfo(userInfo){
            this.userInfo = userInfo
        },
        updateOperateUsername(username) {
            this.operateUsername = username
        },
        updateAddHistory(history){
            this.addHistory = history
        },
        updateSequence(sequence) {
            this.sequence = sequence
        },
        updateMessages(messages){
            this.messages = messages
        }
    }
})
