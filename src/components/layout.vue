<template>
  <el-container>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </el-container>
</template>
<script>
  export default {
    data() {
      return { };
    },
    computed: {

    },
    methods: {

    }
  }
</script>

<style scoped>

</style>
