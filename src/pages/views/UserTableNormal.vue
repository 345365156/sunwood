<template>
  <div class="table-container">
    <!--表格-->
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      stripe
      max-height="500"
      style="width: 100%">
      <el-table-column
        sortable
        align="center"
        prop="account"
        label="客服账号">
      </el-table-column>
      <el-table-column
        sortable
        align="center"
        prop="name"
        label="客服姓名">
      </el-table-column>
      <el-table-column
        sortable
        align="center"
        prop="createTime"
        label="创建时间">
      </el-table-column>
      <el-table-column align="center" label="操作" v-if="this.tableMode == 1">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleFrozen(scope.$index, scope.row)">冻结</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleQuit(scope.$index, scope.row)">离职</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" v-if="this.tableMode == 2">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click="handleThaw(scope.$index, scope.row)">解冻</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleQuit(scope.$index, scope.row)">离职</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" v-if="this.tableMode == 3">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination-container" align="center">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total=dataLength >
      </el-pagination>
    </div>
    <!--修改客服Dialog-->
    <el-dialog title="编辑客服信息" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editForm">
        <el-form-item label="客服姓名" :label-width="formLabelWidth">
          <el-input type="text" v-model="editForm.name" autocomplete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" :label-width="formLabelWidth">
          <el-input type="text" v-model="editForm.account" autocomplete="off" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserTableNormal',
  props: ['tableMode', 'requestData'],
  data () {
    return {
      editForm: { // 编辑表格信息
        name: '',
        account: ''
      },
      editDialogVisible: false, // dialog默认不显示
      formLabelWidth: '80px', // dialog左侧描述长度
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      loading: false, // loading遮罩
      tableData: [] // 表格数据
    }
  },
  created () {
    this.requestTableData()
  },
  computed: {
    dataLength () {
      return this.tableData.length
    }
  },
  watch: {
    tableMode (oldValue, newValue) {
      if (oldValue !== newValue) {
        this.requestTableData()
      }
    },
    requestData () {
      this.requestTableData()
    }
  },
  methods: {
    // 请求表格数据
    requestTableData () {
      this.loading = true
      this.$api.post('api/user/obtainPaging',
        {
          page: this.currentPage,
          size: this.pageSize,
          status: this.tableMode
        },
        response => {
          if (response.status >= 200 && response.status < 300) {
            this.loading = false
            // console.log(response.data.data) // 请求成功，response为成功信息参数
            this.tableData = response.data.data.data
          } else {
            console.log(response.msg) // 请求失败，response为失败信息
            this.loading = false
          }
        }
      )
    },
    // 改变每页条数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.requestTableData()
    },
    // 选择当前页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.requestTableData()
    },
    // 客服编辑
    handleEdit (index, row) {
      this.editDialogVisible = true
      this.editForm = row
      console.log(this.editForm)
    },
    // 提交编辑
    confirmEdit () {
      this.editDialogVisible = false
      this.$api.post('api/user/modify',
        {
          id: this.editForm.id,
          name: this.editForm.name
        },
        response => {
          if (response.status >= 200 && response.status < 300) {
            this.loading = false
            console.log(response) // 请求成功，response为成功信息参数
            this.tableData = response.data.data.data
          } else {
            console.log(response) // 请求失败，response为失败信息
            this.loading = false
          }
        }
      )
    },
    // 客服冻结
    handleFrozen (index, row) {
      console.log(index, row)
      let curThis = this
      this.$options.methods.handleConfirm(curThis, '您确定要冻结此用户吗？', '', '冻结成功！', '已取消冻结', row, 2)
    },
    // 客服解冻
    handleThaw (index, row) {
      console.log(index, row)
      let curThis = this
      this.$options.methods.handleConfirm(curThis, '您确定要解冻此用户吗？', '', '用户解冻成功！', '取消解冻处理', row, 1)
    },
    // 客服离职
    handleQuit (index, row) {
      console.log(index, row)
      let curThis = this
      this.$options.methods.handleConfirm(curThis, '您确定要为此用户做离职处理吗？', '', '离职处理成功！', '取消离职处理', row, 3)
    },
    // 客服删除
    handleDelete (index, row) {
      console.log(index, row)
      let curThis = this
      this.$options.methods.handleConfirm(curThis, '您确定要删除此用户吗？', '', '删除用户成功！', '取消删除', row)
    },
    // 表格操作确认及提示
    handleConfirm (target, text, title, successMsg, catchMsg, row, status) {
      target.$confirm(text, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        target.loading = true
        console.log(row, status)
        target.$api.post('api/user/modify',
          {
            id: row.id,
            status: status
          },
          response => {
            if (response.data.code === 10001) {
              target.requestTableData()
              target.loading = false
              target.$message({
                type: 'success',
                message: successMsg
              })
              console.log(response) // 请求成功，response为成功信息参数
            } else {
              console.log(response) // 请求失败，response为失败信息
              target.loading = false
              target.$message({
                type: 'info',
                message: '信息修改失败...'
              })
            }
          }
        )
      }).catch(() => {
        target.$message({
          type: 'info',
          message: catchMsg
        })
      })
    }
  }
}
</script>

<style scoped>
.pagination-container{
  padding: 10px 0;
}
</style>
