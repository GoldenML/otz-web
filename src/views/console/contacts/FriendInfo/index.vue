<template>
  <div class="content">
    <div class="content1">
      <div>
        <img :src="data.avatar" :width="60" :height="60" alt="" />
      </div>
      <div style="font-size: 14px; margin-left: 10px">
        <div>{{data.nickname}}
          <el-icon color="rgb(16, 174, 255)" size="16">
            <UserFilled />
          </el-icon>
        </div>
        <div>地区：{{data.city}}</div>
      </div>
    </div>
    <el-divider></el-divider>
<!--    <div class="content2">-->
<!--      <div>备注名：</div>-->
<!--    </div>-->
<!--    <el-divider></el-divider>-->
    <div class="content3">
      <el-button @click="handleSendMsg" class="btn-conditional">发消息</el-button>
    </div>
  </div>

</template>
<script setup lang="js">
import {post} from "@/utils/request.js";
import ApiPath from "@/common/ApiPath.js";
import {useRoute, useRouter} from "vue-router";
import {UserFilled} from "@element-plus/icons-vue";

const route = useRoute()
const router = useRouter()
const props = defineProps({
  data: Object
})
const handleSendMsg = () => {
  router.push({
    path: '/console/chats',
    state: {
      friendInfo: props.data
    },
  })
}
console.log(props.data)
</script>
<style lang="scss" scoped>
.content{
  position: absolute;
  left: 50%;
  width: 200px;
  .content1 {
    display: flex;
    margin-top: 200px
  }
  .content2{
    font-size: 14px;
  }
  .content3 {
    margin-top: 20px;
    text-align: center;
  }
}

</style>
