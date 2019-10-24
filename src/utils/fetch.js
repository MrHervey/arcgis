import axios from 'axios'
//import {removeToken}  from './utils/util.js'
import {Message, MessageBox} from 'element-ui'
//import {Router} from '@/router/index'

// 创建axios实例
const service = axios.create({
  //baseURL: process.env.BASE_API, // api的base_url
  //timeout: 5000, // 请求超时时间
  withCredentials: true,
  headers: {'Cache-Control': 'no-cache', 'Pragma': 'no-cache'}
  //headers: {'Cache-Control': 'no-cache'}
});

//添加请求拦截器
service.interceptors.request.use(request => {
  request.url = encodeURI(request.url)
  return request
}, error => {
  //请求错误时做些事
  return Promise.reject(error)
})

//拦截返回的数据res,通过返回值直接获取到服务器的数据
service.interceptors.response.use(
  response => {
    const res = response.data
  	if (res.code === 200) {
      return res
    }
    if (res.code === 400) {
      Message({
        message: res.message,
        type: 'error'
      });
      /*if(res.message == '请先登录') {
        removeToken()
        location.reload()  // 为了重新实例化vue-router对象 避免bug
      }*/
      return Promise.reject('error');
    }
    if (res.code === 401) {
      if (window.location.href.indexOf('mx_sso_token') < 0) {
        // Router.push({
        //   path: '/login'
        // });
      } else {//外部登录
        return 
      }
      
    }
    if (res.code === 403) {
      Message({
        message: '当前用户无相关操作权限',
        type: 'error'
      });
      return Promise.reject('error');
    }
    if (res.code === 500) {
        Message({
          message: '服务器内部错误',
          type: 'error'
        });
        return Promise.reject('error');
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
)

//封装多个请求
export function sendAll(fnArray) {
  return Promise.all(fnArray)
}

export default service;
