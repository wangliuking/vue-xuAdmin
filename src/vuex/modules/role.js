import store from '../index'
import router from '../../router/index'
import axios from 'axios'
import Cookies from "js-cookie";

export default {
  state: {
    info: ''  // 每次刷新都要通过token请求个人信息来筛选动态路由
  },
  mutations: {
    getInfo(state, res) {
      state.info = {
        role: res.data.data.power,
        userId: res.data.data.userId,
        userName: res.data.data.userName,
        type: res.data.data.type
      }
      sessionStorage.setItem('info', JSON.stringify(store.getters.info))
    },
    setRole(state, options) {  // 切换角色，测试权限管理
      state.info = {
        role: options.role,
        permissions: options.permissions
      }
      sessionStorage.setItem('info', JSON.stringify(store.getters.info));
      store.dispatch('newRoutes', options.role)
      router.addRoutes(store.getters.addRouters)

    }
  },
  actions: {
    async getInfo({commit}, token) {
      await axios.get('auth/userByAccount?token=' + token).then((res)=>{
        console.log("res!!!!!!!!!!!!!!!!")
        console.log(res)
        commit('getInfo', res);
      }).catch((mes)=>{
        Cookies.remove('token')
        location.reload()
      })

    },
    setRole({commit}, options) {
      // 权限测试
      commit('setRole', options)
    }
  }
}
