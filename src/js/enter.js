import '../style/s2.css'
import '../style/s1.scss'
import '../style/common.scss'
import '../style/iconfont/iconfont.css'

import Vue from 'vue'
// import VueRouter from 'vue-router'
// import { router } from '../js/route.js'
// import "./creatSocket.js";

// import store from '../js/store.js'

import App from '../modules/app.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
// Vue.use(VueRouter)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  // router,
  // store,
  render: h => h(App)
})
