import axios from 'axios'
import { MessageBox, Notification } from 'element-ui'
import router from '@/router'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 9000, // request timeout
})

// request interceptor
instance.interceptors.request.use(
  (config) => {
    // do something before request is sent

    const token = getToken()
    if (token) {
      // let each request carry token
      // ['X-Access-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Access-Token'] = token
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log('request.js request error', error) // for debug
    return Promise.reject(error)
  },
)

// response interceptor
instance.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    return response.data
  },
  (error) => {
    // 不在 2xxx范围的error
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 403:
          Notification.error({
            title: '系统提示',
            message: '拒绝访问',
          })
          break
        case 500:
          MessageBox.alert('很抱歉，登录已过期，请重新登录', '登录过期', {
            confirmButtonText: '重新登陆',
            showClose: false,
            type: 'warning',
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              if (router.currentRoute.path !== '/login') {
                location.reload()
              }
            })
          })
          break
        case 401:
          MessageBox.error('未授权，请登录', '系统提示', {
            confirmButtonText: '登陆',
            showClose: false,
            type: 'warning',
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
          break
        case 404:
          Notification.error({
            title: '系统提示',
            message: '很抱歉，资源未找到',
          })
          break
        case 504:
          Notification.error({
            title: '系统提示',
            message: '网络超时',
          })
          break
        default:
          Notification.error({
            title: '系统提示',
            message: error.response.data.message,
          })
          break
      }
    } else {
      Notification.error({
        title: '系统错误',
        message: error.message,
      })
    }

    console.log('request.js response error', error) // for debug
    return Promise.reject(error)
  },
)

export default instance
