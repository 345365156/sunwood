import axios from 'axios'
import { env } from './config'

let http = axios.create({
  baseURL: 'http://localhost:8080/',
  withCredentials: false
})

function apiAxios (method, url, params, response) {
  let baseURL = `${env.deploy.testMode.server}` // 请求地址 devMode：开发环境  testMode：测试环境  prodMode：生产环境
  http({
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Key': localStorage.getItem('userId'),
      'AccessToken': localStorage.getItem('accessToken')
    },
    method: method,
    url: baseURL + url,
    data: (method === 'POST' || method === 'PUT') ? JSON.stringify(params) : null,
    params: (method === 'GET' || method === 'DELETE') ? params : null
  }).then(function (res) {
    response(res)
    if (res.data.code === 10009) {
      this.$message('请重新登陆')
    }
  }).catch(function (err) {
    response(err)
  })
}

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
  }
}
