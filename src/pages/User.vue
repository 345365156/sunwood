<template>
  <div class="content">
    <div class="cs-center">
      <div class="csm-nav">
        <span>客服中心</span>
        <span><el-button type="primary" icon="el-icon-circle-plus-outline" @click="dialogFormVisible=true">添加客服</el-button></span>
      </div>
      <div class="cs-container">
        <!--自定义tabs-->
        <ul class="tabs">
          <li :key="index" v-for="(tab, index) in tabs" :class="{active:index==curIndex}" @click="toggleTab(index)"><span>{{ tab }}</span></li>
        </ul>
        <div class="divTab">
          <UserTable :tableMode="curIndex + 1" :requestData="tableChangeCount">表格</UserTable>
        </div>
      </div>
      <!--添加客服Dialog-->
      <el-dialog title="添加客服" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="客服姓名" :label-width="formLabelWidth">
            <el-input type="text" v-model="form.name" autocomplete="off" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="登录账号" :label-width="formLabelWidth">
            <el-tooltip effect="dark" content="账号长度为4-15位包含字母和数字" placement="bottom">
              <el-input type="text" v-model="form.account" autocomplete="off" placeholder="请输入账号"></el-input>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCS">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import UserTableNormal from '../pages/views/UserTableNormal'

export default {
  name: 'user',
  data () {
    return {
      tableChangeCount: 1,
      curIndex: 0, // 默认选中第一个选项卡
      tabs: ['正常', '已冻结', '已离职'], // 选项卡项
      form: {
        name: '',
        account: ''
      },
      dialogFormVisible: false, // 默认Dialog不显示
      formLabelWidth: '80px'
    }
  },
  methods: {
    toggleTab (index) {
      this.curIndex = index
    },
    addCS () {
      this.$api.post('api/user/addition', this.form,
        response => {
          if (response.status >= 200 && response.status < 300) {
            if (response.data.code !== 10001) {
              console.log(response)
              this.$message({
                message: response.data.result,
                type: 'error'
              })
              this.tableChangeCount++
            }
            if (response.data.code === 10001) {
              this.dialogFormVisible = false
              this.$message({
                message: response.data.result,
                type: 'success'
              })
              this.tableChangeCount++// 刷新列表
            }
          } else {
            console.log(response.msg) // 请求失败，response为失败信息
          }
        })
    }
  },
  components: {
    UserTable: UserTableNormal
  }
}
</script>

<style scoped>
  .content{
    padding: 60px 20px 20px 20px;
    box-sizing: border-box;
    background-color: #fafafa;
  }
  .csm-nav{
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1px #ccc;
  }
  ul{
    padding: 20px;
  }
  .tabs{
    display: flex;
    justify-content: center;
  }
  .tabs li{
    display: inline-block;
  }
  .active{
    color: #409eff;
    border-bottom: solid 2px #409eff;
  }
  .tabs li span{
    padding: 6px 10px;
    cursor: pointer;
  }
</style>
