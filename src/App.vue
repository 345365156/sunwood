<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title"></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isLogin: true,
      userName: '',
      tabs: []
    }
  },
  methods: {
  },
  created () {
    this.userName = localStorage.getItem('userName') ? localStorage.getItem('userName') : 'userName'
  },
  name: 'App'
}
</script>

<style>
  h1, h2, h3, h4, h5, h6{ font-size:100%; }
  address, cite, dfn, em, var { font-style:normal; }
  code, kbd, pre, samp { font-family:couriernew, courier, monospace; }
  small{ font-size:12px; }
  ul, ol, li{ list-style:none; margin: 0; padding: 0;}
  a { text-decoration:none; }
  a:hover { text-decoration: none; }
  p { padding: 0;margin: 0; }
  body { font-family: 微软雅黑;padding: 0; margin: 0;height: 100%;width: 100%; }
  div {box-sizing: border-box; }
  sup { vertical-align:text-top; }
  sub{ vertical-align:text-bottom; }
  legend { color:#000; }
  fieldset, img { border:0; }
  button, input, select, textarea { font-size:100%; }
  table { border-collapse:collapse; border-spacing:0; }
  #app{width: 100%;height: 100%;}
</style>
