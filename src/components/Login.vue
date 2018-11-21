<template>
  <div class="login-wrap">
    <div class="form-con">
      <div class="ms-title">
        <img width="240" src="../assets/sign.max.png" alt="">
      </div>
      <div class="ms-login">
        <div class="ms-title-zx">
          <h2>跟单系统</h2>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
          <el-form-item prop="account" class="form-item">
            <el-input v-model="ruleForm.account" placeholder="账户名"></el-input>
          </el-form-item>
          <el-form-item prop="password" class="form-item" v-if="!login">
            <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
          </el-form-item>
          <div class="login-btn">
            <el-button :loading="loadingStatus" type="danger" @click="submitForm()">登录</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      login: true,
      loadingStatus: false,
      ruleForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账户名', trigger: 'change' }
        ],
        password: [
          { required: false, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      if (this.ruleForm.account === '') {
        this.$message('请完善用户名。')
        return
      }
      this.$api.post('oauth/login', this.ruleForm,
        response => {
          if (response.data.code === 10500) {
            this.$message.error(response.data.msg)
            return
          }
          if (response.data.code !== 10007) {
            this.$message.error(response.data.msg)
            this.login = false
            return
          }
          let msg = response.data.data
          localStorage.setItem('name', msg.name)
          localStorage.setItem('alias', msg.alias)
          localStorage.setItem('accessToken', msg.accessToken)
          localStorage.setItem('userId', msg.userId)
          localStorage.setItem('role', msg.role)
          this.$router.push({name: '/statistical/realTime'})
        })
    }
  },
  created () {
    document.title = '安牛科技'
    this.$emit('toggleHeader', 0)
  }
}
</script>

<style scoped>
  .login-wrap{
    position: absolute;
    width:100%;
    height:100%;
    background-color: #324157;;
  }
  .form-con{
    position: absolute;
    width: 400px;
    top: 50%;
    left: 50%;
    text-align: center;
    margin-left: -200px;
    margin-top: -200px;
  }
  .ms-title{
    position: relative;
    width:100%;
    text-align: center;
    font-size:30px;
    margin-top: -30px;
    margin-bottom: 30px;
    color: #fff;
  }
  .ms-login{
    position: relative;
    display: inline-block;
    width:360px;
    text-align: center;
    padding: 10px 40px 40px 40px;
    border-radius: 5px;
    background: #fff;
    text-align: center;
  }
  .login-btn{
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
  }
</style>
