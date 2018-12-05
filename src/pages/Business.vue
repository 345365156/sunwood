<template>
  <div class="content">
    <div class="main-contain">
      <Breadcrumb @refresh="getBDData" :pageName="pageName" @addUser="addBD"></Breadcrumb>
    </div>
    <el-card>
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="BDData"
          size="mini"
          max-height="441"
          @row-click="rowSelect"
          border
          stripe
          style="width: 100%">
          <el-table-column
            prop="name"
            align="center"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="phone"
            align="center"
            :formatter="nullFormatter"
            label="手机号">
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            :formatter="nullFormatter"
            label="创建时间">
          </el-table-column>
          <el-table-column
            align="center"
            :formatter="nullFormatter"
            label="关联合作商">
            <template slot-scope="scope">
              <div style="cursor:pointer;" @click.stop="showUserList(scope.row)">
                {{ scope.row.userList.length }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            align="center"
            :formatter="statusFomatter"
            label="状态">
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button @click.stop="editBD(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
              <el-button v-if="scope.row.status === 1" @click.stop="userFireOrDelete(scope.$index, scope.row, 2)" type="text" size="small">离职</el-button>
              <el-button v-if="scope.row.userList.length === 0" @click.stop="userFireOrDelete(scope.$index, scope.row, 0)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container" align="center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[1, 5, 10, 20, 30, 40]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <!--关联合作商Dialog-->
      <el-dialog title="关联合作商" :visible.sync="userListDialogVisible" width="360px">
        <ul>
          <li v-for="user in userList.userList" :key="user.id">{{ user.name }}</li>
        </ul>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="userListDialogVisible = false">确 定</el-button>
        </div>
      </el-dialog>
      <!--添加、编辑Dialog-->
      <el-dialog title="BD信息" :visible.sync="addorEditDialog" width="360px">
        <el-form :model="bdForm" :rules="rules" ref="bdForm" label-width="100px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="bdForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="bdForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="公司邮箱" prop="email">
            <el-input v-model="bdForm.email"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addorEditDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitBDForm">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '../components/Breadcrumb'
export default {
  name: 'user',
  data () {
    return {
      pageName: 'business',
      loading: false,
      page: 1,
      size: 10,
      BDData: [],
      total: 0,
      userListDialogVisible: false,
      addorEditDialog: false,
      userList: [],
      url: '',
      bdForm: {
        name: '',
        phone: '',
        email: '',
        status: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入公司邮箱', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getBDData()
  },
  methods: {
    // 获取表格信息
    getBDData () {
      this.loading = true
      this.$api.post('api/business/obtainPaging', {
        name: '',
        phone: '',
        page: this.page,
        size: this.size,
        email: '',
        status: ''
      },
      response => {
        this.BDData = response.data.data.data
        this.total = Number(response.data.data.totalCount)
        this.loading = false
        this.$message.success('BD列表更新成功')
      })
    },
    // 显示关联合作商
    showUserList (row) {
      this.userListDialogVisible = true
      this.userList = row
    },
    // 点击行触发
    rowSelect (row) {
      console.log(row)
    },
    // 改变页码
    handleCurrentChange (val) {
      this.page = val
      this.getBDData()
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.size = val
      this.getBDData()
    },
    // 添加
    addBD () {
      this.addorEditDialog = true
      this.url = 'api/business/add'
    },
    // 编辑
    editBD (index, row) {
      console.log(row)
      this.addorEditDialog = true
      this.bdForm = row
      this.url = 'api/business/modify'
    },
    submitBDForm () {
      this.loading = true
      this.bdForm.status = 1
      this.$api.post(this.url, this.bdForm,
        response => {
          if (response.data.code === 10500) {
            this.$message.error(response.data.msg)
            return
          }
          this.loading = false
          this.addorEditDialog = false
          this.$message.success('提交成功！')
          this.getBDData()
          for (let key in this.bdForm) { // 清空表单
            this.bdForm[key] = ''
          }
        })
    },
    userFireOrDelete (index, row, status) {
      console.log(index, row)
      this.bdForm = row
      this.bdForm.status = status
      this.$api.post('api/business/modify', this.bdForm,
        response => {
          if (response.data.code === 10500) {
            this.$message.error(response.data.msg)
            return
          }
          this.loading = false
          this.$message.success('状态更改成功！')
          this.getBDData()
        })
    },
    nullFormatter (row, col, cellValue, index) {
      return cellValue === 0 ? '无' : cellValue
    },
    statusFomatter (row, col, cellValue, index) {
      return cellValue === 1 ? '正常' : '已离职'
    }
  },
  watch: {
    id: 'csGetStaticsData'
  },
  computed: {
  },
  components: {
    Breadcrumb
  }
}
</script>

<style scoped>
.content{
  padding: 70px 20px 20px 20px;
  box-sizing: border-box;
  background-color: #fafafa;
}
.table-container{
  margin:10px 0;
}
.pagination-container{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
