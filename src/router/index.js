import Vue from 'vue'
import Router from 'vue-router'
import layout from '../components/layout'
import index from '../view/home/index'
/*路由跳转页面*/

Vue.use(Router)

/*页面加载方法*/
export const constantRouterMap = [
  {
    path: '/',
    name: 'NavLayout',
    component: layout,
    redirect: '/index',
    hidden: true,
    children: [{
      path: 'index',
      component: index,
    }],
  }
]

export default new Router({
  routes: constantRouterMap,
  //mode: 'history'
})
