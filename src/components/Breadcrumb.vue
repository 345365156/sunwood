<template>
  <el-card shadow="hover" class="breadcrumb-container">
    <div class="box-card">
      <!--面包屑导航-->
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/collect' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in realList" :to="item.path" :key="item.path">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--功能按钮-->
      <div>
        <el-button v-if="addArr.includes(pageName)" type="primary" plain icon="el-icon-plus" @click="addUser">添加</el-button>
        <el-button v-if="refreshArr.includes(pageName)" type="primary" plain icon="el-icon-refresh" @click="refreshTable">刷新</el-button>
        <el-button v-if="selectArr.includes(pageName)" type="primary" plain icon="el-icon-search" @click="toggleCondition">筛选</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'breadcrumb',
  props: ['pageName'], // 接收页面名称
  data () {
    return {
      addArr: ['user', 'business', 'channelTemplate'], // 添加按钮显示的页面集合
      refreshArr: ['collect', 'user', 'channelTemplate'], // 刷新按钮显示的页面集合
      selectArr: ['user'], // 筛选按钮显示的页面集合
      realList: []
    }
  },
  created () {
    this.getRoutePath()
  },
  methods: {
    addUser () {
      this.$emit('addUser')
    },
    refreshTable () {
      this.$emit('refresh')
    },
    toggleCondition () {
      this.$emit('toggleCondition')
    },
    getRoutePath () {
      this.realList = this.$route.meta.routeList
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   next((vm) => {
  //     vm.realList = to.meta.routeList
  //   })
  // },
  watch: {
    $route: function (newV, oldV) {
      this.realList = newV.meta.routeList
    }
  }
}
</script>

<style scoped>
.breadcrumb-container{
  width: 100%;
  margin-bottom: 10px;
}
.box-card{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
