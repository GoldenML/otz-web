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
import {onMounted, ref} from "vue";
import 'animate.css'
const show =ref(false)
onMounted(() => {
  setTimeout(() => {
    show.value = true
  },500)
})
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
