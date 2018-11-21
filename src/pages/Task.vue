<template>
  <div class="container">
    <div class="ds-nav">
      <span>我的任务</span>
    </div>
    <!--表格-->
    <el-table
      :data="taskData"
      v-loading="loading"
      border
      stripe
      max-height="500"
      class="task-table"
    >
      <el-table-column
        sortable
        align="center"
        prop="task.serialNumber"
        label="任务编号">
      </el-table-column>
      <el-table-column
        sortable
        align="center"
        prop="task.status"
        :formatter="formatTaskStatus"
        label="任务状态">
      </el-table-column>
      <el-table-column
        sortable
        align="center"
        prop="task.receiveTime"
        label="接收时间">
      </el-table-column>
      <el-table-column
        sortable
        align="center"
        prop="task.handleTime"
        :formatter="formatNull"
        label="处理时间">
      </el-table-column>
      <el-table-column
        sortable
        align="center"
        :formatter="formatNull"
        prop="task.handleDuration"
        label="处理用时">
      </el-table-column>
      <el-table-column
        sortable
        align="center"
        prop="task.handleResult"
        :formatter="formatResult"
        label="处理结果">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleDetail(scope.$index, scope.row)">详情</el-button>
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
        layout="total, sizes, prev, pager, next, jumper"
        :total=dataLength >
      </el-pagination>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'task',
  data () {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      taskData: []
    }
  },
  created () {
    this.requestTaskData()
  },
  computed: {
    dataLength () {
      return this.taskData.length
    }
  },
  methods: {
    formatTaskStatus (row, col, cellValue, index) {
      switch (cellValue) { // 1 待处理 , 2 已处理 , 3 追踪中 , 4 已完成.
        case 1:
          return '待处理'
        case 2:
          return '已处理'
        case 3:
          return '追踪中'
        case 4:
          return '已完成'
      }
      return (cellValue !== null && cellValue !== '') ? cellValue : '--'
    },
    formatResult (row, col, cellValue, index) {
      if (cellValue === 1) {
        return '已接通'
      }
      if (cellValue === 2) {
        return '未接通'
      }
      return (cellValue !== null && cellValue !== '') ? cellValue : '--'
    },
    formatNull (row, col, cellValue, index) {
      return (cellValue !== null && cellValue !== '') ? cellValue : '--'
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.requestTaskData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.requestTaskData()
    },
    handleDetail (index, data) {
      this.$router.push({
        path: 'detail',
        name: 'detail',
        query: {
          param: data
        }
      })
    },
    requestTaskData () {
      this.$api.post('api/task/obtainPaging', {
        userId: localStorage.getItem('userId'),
        page: this.currentPage,
        size: this.pageSize
      },
      response => {
        if (response.status >= 200 && response.status < 300) {
          this.taskData = response.data.data.data
        } else {
          console.log(response.msg) // 请求失败，response为失败信息
        }
      })
    }
  }
}
</script>

<style scoped>
.container{
  padding: 60px 20px 20px 20px;
  box-sizing: border-box;
  background-color: #fafafa;
}
.ds-nav{
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-between;
  border-bottom: solid 1px #ccc;
  margin-bottom: 10px;
}
.pagination-container{
  padding: 10px 0;
}
</style>
