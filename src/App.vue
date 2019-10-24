<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
  /*编写方法*/
  export default {
    name: 'App',
    data () {
      return {
        myVal: ''
      }
    }
  }
</script>

<style scoped>
  .app{
    height: 100%;
  }
</style>
