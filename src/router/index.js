import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/Login'
import Home from '../pages/Home'
import Collect from '../pages/Collect'
import User from '../pages/User'
import Business from '../pages/Business'
import ChannelTemplate from '../pages/ChannelTemplate'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: '登录',
      component: Login,
      meta: {title: '贷利宝-登录'}
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {title: '欢迎'},
      children: [
        {
          path: '/collect',
          name: '数据统计',
          meta: {title: '贷利宝-数据统计'},
          component: Collect
        },
        {
          path: '/user',
          name: '合作公司管理',
          meta: {title: '贷利宝-合作公司管理'},
          component: User
        },
        {
          path: '/business',
          name: 'BD管理',
          meta: {title: '贷利宝-BD管理'},
          component: Business
        },
        {
          path: '/channel-template',
          name: '渠道页版本管理',
          meta: {title: '贷利宝-渠道页版本管理'},
          component: ChannelTemplate
        }
      ]
    }
  ],
  mode: 'history'
})

let routeList = []
router.beforeEach((to, from, next) => {
  let index = -1
  for (let i = 0; i < routeList.length; i++) {
    if (routeList[i].name === to.name) {
      index = i
      break
    }
  }
  if (index !== -1) {
    // 如果存在路由列表，则把之后的路由都删掉
    routeList.splice(index + 1, routeList.length - index - 1)
  } else if (to.name !== '登录') {
    routeList.pop()
    routeList.push(
      {
        'name': to.name,
        'path': to.fullPath
      })
  }
  to.meta.routeList = routeList
  next()
})

export default router
