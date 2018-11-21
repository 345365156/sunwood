<template>
  <div>
    <Header @selectDefaultNav="defaultNavTab"></Header>
    <router-view class="container"></router-view>
  </div>
</template>

<script>
import Header from '../components/Header'
export default {
  name: 'Home',
  components: {
    Header
  },
  methods: {
    defaultNavTab (name) {
      this.$router.push({name: name})
    }
  }
}
</script>

<style scoped>
.container{
  padding: 70px 20px 20px 20px;
}
</style>
