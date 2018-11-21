import Vue from 'vue'
import Router from 'vue-router'

import Home from '../pages/Home'
import Task from '../pages/Task'
import Statistics from '../pages/Statistics'
import User from '../pages/User'
import History from '../pages/History'
import Workbench from '../pages/Workbench'
import TaskDetail from '../pages/TaskDetail'
import Login from '../components/Login'
import Config from '../pages/Config'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: '/login',
      component: Login,
      meta: {title: '安牛跟单系统-登录'}
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {title: '欢迎'},
      // redirect: '/config',
      children: [
        {
          path: '/task/mine',
          name: '/task/mine',
          meta: {title: '我的任务'},
          component: Task
        },
        {
          path: '/task/detail',
          name: 'detail',
          meta: {title: '任务详情'},
          component: TaskDetail
        },
        {
          path: '/statistics',
          name: '/statistical/realTime',
          meta: {title: '实时统计'},
          component: Statistics
        },
        {
          path: '/history',
          name: '/statistical/history',
          meta: {title: '历史统计'},
          component: History
        },
        {
          path: '/user',
          name: '/user',
          meta: {title: '客服中心'},
          component: User
        },
        {
          path: '/config',
          name: '/task/config',
          meta: {title: '任务配置'},
          component: Config
        },
        {
          path: '/workbench',
          name: '/workbench',
          meta: {title: '工作台'},
          component: Workbench
        }
      ]
    }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if (from.path === '/' && to.path === '/task/detail') {
    next('/task/mine')
  }
  next()
})

export default router
