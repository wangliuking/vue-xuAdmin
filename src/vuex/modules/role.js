import store from '../index'
import router from '../../router/index'
import axios from 'axios'

export default {
  state: {
    info: ''  // 每次刷新都要通过token请求个人信息来筛选动态路由
  },
  mutations: {
    getInfo(state, res) {
      state.info = {
        role: res.data.data.role.role,
        permissions: res.data.data.role.name
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
      let res =  await axios.get('http://localhost:8081/auth/userByAccount?token=' + token)
      console.log(res)
      commit('getInfo', res)
    },
    setRole({commit}, options) {
      // 权限测试
      commit('setRole', options)
    }
  }
}
