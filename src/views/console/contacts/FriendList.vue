<template>
  <div style="line-height: 60px;padding: 0 10px">
    <el-input placeholder="请输入关键字" style="width: 200px;margin-right: 10px;"></el-input>
    <el-icon style="vertical-align: middle"><Plus /></el-icon>
  </div>
  <div class="friend__item" :class="{'friend__item--active': active === index}" v-for="(item, index) in list" :key="index" @click="setActive(index)">
    {{item.name}}
  </div>
</template>
<script setup lang="js">
import {onMounted, reactive, ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import { post } from "@/utils/request.js";
import ApiPath from "@/common/ApiPath.js";
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const active = ref(-1)
const setActive = (val) => {
  active.value = val
}
onMounted(() => {
  post(ApiPath.USER_GET_INFO, {
    username: proxy.$cookies.get('otz_username')
  }).then(response => {
    console.log(111, response)
  })
})
const list = reactive([
  {name: '杨辉', path: ''},
  {name: '杨晨', path: ''},
])
</script>
<style lang="scss" scoped>
.friend__item{
  background-color: #eceaea;
  line-height: 50px;
  height: 50px;
  text-align: center;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  &--active{
    background-color: #babebe;
  }
}
</style>
