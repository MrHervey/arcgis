// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/index'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/style.css';


Vue.use(ElementUI)
Vue.use(VueAxios,axios)
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, //使用store
  components: { App },
  template: '<App/>'
})
