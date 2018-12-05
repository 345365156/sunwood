/**
* 各个环境的API配置
*/

export const env = {
  deploy: {
    // 开发模式
    devMode: {
      server: 'http://172.100.11.16:8080/' // 开发环境地址
    },
    // 测试模式
    testMode: {
      server: 'http://dailibao-admin-api.int.anniu-inc.com/' // 测试环境地址
    },
    // 生产环境
    prodMode: {
      server: 'http://dailibao-admin-api.kongapi.com/' // 生产环境地址
    }
  }
}
