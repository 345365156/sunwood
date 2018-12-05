import axios from 'axios'
import { env } from './config'
import { Message } from 'element-ui'

// 超时时间
axios.defaults.timeout = 5000

function getURL () {
  let baseURL = `${env.deploy.testMode.server}` // 请求地址 devMode：开发环境  testMode：测试环境  prodMode：生产环境
  return baseURL
}

function apiAxios (method, url, params, response) {
  let baseURL = getURL()
  axios({
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Code': localStorage.getItem('code'),
      'Role': localStorage.getItem('role'),
      'AccessToken': localStorage.getItem('accessToken')
    },
    method: method,
    url: baseURL + url,
    data: (method === 'POST' || method === 'PUT') ? JSON.stringify(params) : null,
    params: (method === 'GET' || method === 'DELETE') ? params : null
  }).then(function (res) {
    response(res)
  }).catch(function (err) {
    response(err)
  })
}

// http 请求拦截器
axios.interceptors.request.use(
  config => {
    // console.log(JSON.parse(config.data)) // 请求参数
    return config
  },
  error => {
    Message.error('加载超时')
    return Promise.reject(error)
  })

// http 响应拦截器
axios.interceptors.response.use(
  res => {
    if (res.status >= 200 && res.status < 300) {
      if (res.data.code === 10008) { // token过期，提示重新登录
        Message.error(res.data.result)
        this.$router.push({name: '登录'})
      }
      return res // 返回
    } else {
      Message.error(res.data.result) // 请求失败
    }
  },
  error => {
    console.log(error)
    Message.error('加载失败')
    return Promise.reject(error)
  })

export default {
  get: function (url, params, response) {
    return apiAxios('GET', url, params, response)
  },
  post: function (url, params, response) {
    return apiAxios('POST', url, params, response)
  },
  put: function (url, params, response) {
    return apiAxios('PUT', url, params, response)
  },
  delete: function (url, params, response) {
    return apiAxios('DELETE', url, params, response)
  },
  getURL: getURL()
}
