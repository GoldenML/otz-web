<template>

</template>
<script setup lang="ts">

import {getCurrentInstance} from "vue";
const instance = getCurrentInstance()
const emit = () => {
  instance?.proxy?.$bus.$emit('')
}
</script>
<style lang="scss" scoped>

</style>
