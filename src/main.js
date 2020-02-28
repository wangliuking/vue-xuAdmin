// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from './btnPermission'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'
import 'font-awesome/css/font-awesome.css'

import App from './App.vue'
import router from './router'
import store from './vuex'
import axios from 'axios'
import i18n from './i18n/i18n'
import Cookies from 'js-cookie'

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.prototype.$axios = axios

//http request 封装请求头拦截器
axios.interceptors.request.use(config => {
  let token = store.state.token
  if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers['Authorization'] = 'Bearer ' + token
    /*config.url += '&structure' + token*/
  }
  console.log('interceptors config=', config)
  return config
}, error => {
  return Promise.reject(error)
})

//  获取角色信息，根据用户权限动态加载路由
router.beforeEach((to, from, next) => {
  /*console.log(to)
  console.log(from)
  console.log(store)
  console.log(store.getters.token)
  console.log(store.getters.info)
  console.log(store.getters.info.role)*/
  // debugger

  if (store.getters.token) {
    store.dispatch('setToken', store.getters.token)
    console.log(store.getters)
    if (to.path === '/login') {
      next({path: '/'})
    } else {
      if (!store.getters.info.role) {
        // const role = ['/markdown', '/erji', '/erji2', '/siji', '/wuji']
        !async function getAddRouters() {
          await store.dispatch('getInfo', store.getters.token)
          await store.dispatch('newRoutes', store.getters.info.type)
          await router.addRoutes(store.getters.addRouters)
          next({path: '/index'})
        }()
      } else {
        let is404 = to.matched.some(record => {
          if (record.meta.role) {
            return record.meta.role > store.getters.info.type
          }
        })
        if (is404) {
          next({path: '/404'})
          return false
        }
        next()
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    }
    next({path: '/login'})
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  axios,
  i18n,
  render: h => h(App),
  components: {App},
  template: '<App/>'
})
