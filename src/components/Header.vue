<template>
  <div class="el-nav">
      <div class="wrapper">
        <img class="logo" src="../assets/sign.max.png">
        <el-menu
          :default-active="$route.name"
          class="el-menu-demo"
          mode="horizontal"
          active-text-color='#409EFF'
          text-color="#303133"
          @select="handleSelect">
          <Menu :tabs="tabs"></Menu>
        </el-menu>
      </div>
      <div class="header-right">
        <div class="header-user">
          <el-dropdown trigger='click'>
            <img src="../assets/mine.png" width="24">
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span>欢迎你 {{ userName }}</span>
              </el-dropdown-item>
              <el-dropdown-item command='logout'>
                <el-button type='text' @click="logout">退出登录</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
</template>

<script>
import Menu from '../components/MenuTree'
export default {
  name: 'Header',
  data () {
    return {
      userName: localStorage.getItem('name'),
      activeIndex: '1',
      activeIndex2: '1',
      tabs: []
    }
  },
  methods: {
    logout () {
      this.$router.push({name: '登录'})
      localStorage.clear()
    },
    handleSelect (index) {
      this.$router.push({
        name: index
      })
    }
  },
  created () {
    this.userName = localStorage.getItem('name')
    this.$api.post('api/menuTree', '',
      response => {
        if (response.status >= 200 && response.status < 300) {
          this.tabs = response.data.data
          if (response.data.code > 10005 && response.data.code < 10011) {
            this.$message.error(response.data.result)
            this.$router.push('/')
          }
        } else {
          console.log(response.msg) // 请求失败，response为失败信息
        }
      })
  },
  filters: {
    indexFormatter (index) {
      let arr = index.split('/')
      return arr[arr.length - 1]
    }
  },
  components: {
    Menu
  }
}
</script>

<style scoped>
.el-nav {
  font-family: 微软雅黑;
  position: fixed;
  z-index: 1000;
  display: flex;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  overflow: hidden;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12);
}
.wrapper{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  display: inline-block;
  cursor: pointer;
  height: 40px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 0 20px;
}
.header-right {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}
.header-user {
  position: relative;
  padding-left: 20px;
}
.header-user:after {
  content: "";
  position: absolute;
  left: 0;
  top: -6px;
  bottom: -6px;
  border-left: 1px solid #ccc;
}
</style>
