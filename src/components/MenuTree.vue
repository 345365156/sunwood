<template>
  <div class="el-menu--horizontal">
    <template v-for="tab in this.tabs" >
      <el-menu-item v-if="tab.navs.length === 0" :index="tab.name" :key="tab.code">{{ tab.name }}</el-menu-item>
      <el-submenu v-else :index="tab.name" :key="tab.code">
        <template slot="title">{{ tab.name}}</template>
        <Menu :tabs="tab.navs"></Menu>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: ['tabs'],
  data () {
    return {
    }
  },
  methods: {
  },
  created () {
  }
}
</script>

<style scoped>
.el-menu{
  border-bottom: none;
}
li:hover{
  color: #409EFF!important;
}
</style>
