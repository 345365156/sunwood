// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Axios from 'axios'
import Qs from 'qs'
import Api from './api/index'
import router from './router'
import Element from 'element-ui'
import App from './App'
import 'element-ui/lib/theme-chalk/index.css'

// filters
import checkFilter from './filters/checkFilter'

Vue.config.productionTip = false

Vue.filter('nullCheck', checkFilter.nullCheck)
Vue.filter('toPercent', checkFilter.percentCheck)
Vue.filter('sexFormatter', checkFilter.sexFormatter)
Vue.filter('taskStatusFormatter', checkFilter.taskStatusFormatter)
Vue.filter('taskAPPFormatter', checkFilter.taskAPPFormatter)
Vue.filter('dealResultFormatter', checkFilter.dealResultFormatter)
Vue.filter('trackStatusFormatter', checkFilter.trackStatusFormatter)

Vue.use(require('vue-wechat-title')) // 标题插件
Vue.use(Element, { size: 'small', zIndex: 3000 })
Vue.prototype.axios = Axios
Vue.prototype.qs = Qs
Vue.prototype.$api = Api

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
