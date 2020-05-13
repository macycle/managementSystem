import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'

//添加请求拦截
axios.interceptors.request.use(config=>{
  //为请求头对象添加token验证的authorization字段
  config.headers.Authorization=window.sessionStorage.getItem('token');
  return config
})

Vue.prototype.$http=axios; 

//导入iconfont字体图标
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable) //注册为全局组件
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
