<template>
  <div class="friend-list">
    <template v-if="isAdd">
      <div class="search-input">
        <el-input v-model="searchText" clearable placeholder="用户名" style="width: 190px;margin-right: 10px;"></el-input>
        <span @click.prevent="cancelAdd" type="text" class="btn-words">取消</span>
      </div>
      <div v-if="searchStatus === 2" class="no-user">
        无法找到该用户，请检查你输入的用户名是否正确
      </div>
      <div class="search-button" @click.stop="searchUser" v-if="searchText">
        <div class="search-button_content">搜索：{{searchText}}</div>
        <div class="search-button_icon">
          <el-icon><ArrowRight></ArrowRight></el-icon>
        </div>
      </div>
      <div @click.stop v-if="searchStatus === 1" class="search-result">
        <div class="search-result_description">
          <div style="padding-top: 20px;display: flex; line-height: 20px">
            <div>
              <img :src="userInfo.avatar" width="55" height="55" alt="" />
            </div>

            <div style="margin-left: 15px">
              <div style="display: inline-block; line-height: 20px">{{userInfo.nickname}}
                <el-icon color="rgb(16, 174, 255)">
                  <UserFilled />
                </el-icon>
              </div>
              <div style="display: inline-block;line-height: 20px;color: rgb(158, 158, 158);font-size: 13px">地区：{{userInfo.city}}</div><br />
            </div>
          </div>
        </div>
        <div class="search-result_operate">
          <el-button @click="addUser" class="btn-conditional">添加到通讯录</el-button>
        </div>

      </div>
    </template>
    <template v-else>
      <div class="search-input">
        <el-input v-model="keyword" clearable placeholder="请输入关键字" style="width: 190px;margin-right: 15px;"></el-input>
        <el-icon @click.prevent="addFriend" style="vertical-align: middle; cursor:pointer;"><Plus /></el-icon>
      </div>

    </template>

  </div>
  <div style="font-size: 14px; color: rgb(153, 153, 153); margin: 5px 10px">新的朋友</div>
  <div class="friend__item">
    <img  :width="30" :height="30"  style="margin: 10px"  alt="" />
    <div style="display: inline-block; position: absolute; top: 0; margin-left: 5px">新的朋友</div>
  </div>
  <div style="font-size: 14px; color: rgb(153, 153, 153); margin: 5px 10px">全部朋友</div>
  <div class="friend__item" :class="{'friend__item--active': active === index}" v-for="(item, index) in list" :key="index" @click="setActive(index)">
    <img  :width="30" :height="30"  style="margin: 10px"  alt="" :src="item.avatar" />
    <div style="display: inline-block; position: absolute; top: 0; margin-left: 5px">{{item.nickname}}</div>
  </div>
</template>
<script setup lang="js">
import {defineAsyncComponent, defineComponent, onBeforeUnmount, onMounted, onUnmounted, reactive, ref} from "vue";
import {ArrowRight, Plus, UserFilled} from "@element-plus/icons-vue";
import { post } from "@/utils/request.js";
import ApiPath from "@/common/ApiPath.js";
import { getCurrentInstance } from 'vue'
import {useRouter} from "vue-router";
const router = useRouter()
const { proxy } = getCurrentInstance()

const searchText = ref('')
const keyword = ref('')

defineEmits(['changeFriend'])

// 当前选中的用户
const active = ref(-1)
const setActive = (val) => {
  active.value = val
  proxy.$emit('changeFriend', list[val])
  // router.push(`/console/contacts/${list[val].username}`)
}
const currentUser = ref({})
// 用户列表
const list = reactive([])
onMounted(() => {
  post(ApiPath.USER_LOGIN_STATUS, {}).then(response => {
    currentUser.value = response.user_info
  })
  post(ApiPath.USER_GET_FRIEND, {}).then(response => {
    if(response.code === 0) {
      response.friends.forEach(e => {
        list.push(e)
      })
    }
  })
})

/*************************************/
onMounted(() => {
  window.addEventListener('click', resetSearchStatus)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', resetSearchStatus)
})
const resetSearchStatus = () => {
  searchStatus.value = 0
}
/**********************************/
const isAdd = ref(false)
const addFriend = () => {
  isAdd.value = true
  searchText.value = ''
}
const cancelAdd = () => {
  isAdd.value = false
  keyword.value = ''
}
const searchStatus = ref(0)
const userInfo = ref({})
const searchUser = () => {
  // searchStatus.value = 1
  post(ApiPath.USER_GET_INFO, {
    username: searchText.value
  }).then(response => {
    if (response.code === 0) {
      searchStatus.value = 1
      userInfo.value = response.user_info
    } else {
      searchStatus.value = 2
    }
  })
}
const addUser = () => {
  post(ApiPath.USER_ADD_FRIEND, {
    username: currentUser.value.username,
    friend_username: userInfo.value.username
  })
}
</script>
<style lang="scss" scoped>
.friend-list {
  line-height: 60px;
  background-color: rgb(247, 247, 247);
  .search-input{
    border-bottom: 1px solid rgb(233, 233, 233);padding: 0 10px;
  }
  .no-user{
    text-align: center;
    line-height: 20px;
    padding: 10px;
    color: rgb(158, 158, 158);
  }
  .search-button{
    padding: 0 10px;
    position: relative;
    height: 60px;
    font-size: 14px;
    &_content{
      width: 200px;
      display: inline-block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    &_icon{
      cursor: pointer;
      display: inline-block;
      float: right;
      vertical-align: middle;
    }
    &:hover{
      background-color: rgb(237, 237, 237);
      cursor: pointer;
    }

  }
  .search-result{
    position: absolute;
    background-color: rgb(255, 255, 255);
    z-index: 10;
    width: 265px;
    height: 181px;
    left: 313px;
    top: 61px;
    &_description{
      height: 100px;
      margin: 0 30px;
      border-bottom: 1px solid rgb(243, 243, 243);
    }
    &_operate{
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

}
.friend__item{
  background-color: #eceaea;
  line-height: 50px;
  height: 50px;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  &--active{
    background-color: #babebe;
  }
}
</style>
