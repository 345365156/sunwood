<template>
  <div class="history-table-container">
    <div class="ds-nav">
      <span>历史记录</span>
    </div>
    <!--历史记录-->
    <el-row :gutter="0">
      <el-col :span="24">
        <div class="history-record-container">
          <!--表格-->
          <el-table
            :data="historyRecordData"
            v-loading="loading"
            border
            stripe
            max-height="500"
            style="width: 100%">
            <el-table-column
              sortable
              align="center"
              prop="time"
              :formatter="formatNull"
              label="日期">
            </el-table-column>
            <el-table-column
              sortable
              align="center"
              prop="content.handleCount"
              :formatter="formatNull"
              label="总处理量">
            </el-table-column>
            <el-table-column
              sortable
              align="center"
              prop="content.connectedCount"
              :formatter="formatNull"
              label="接通量">
            </el-table-column>
            <el-table-column
              sortable
              align="center"
              prop="content.validConnectCount"
              :formatter="formatNull"
              label="有效沟通量">
            </el-table-column>
            <el-table-column
              sortable
              align="center"
              prop="content.handleAvgTime"
              :formatter="formatNull"
              label="平均处理时间">
            </el-table-column>
            <el-table-column
              sortable
              align="center"
              prop="content.payAmount"
              :formatter="formatNull"
              label="转化支付总额">
            </el-table-column>
            <el-table-column
              sortable
              align="center"
              prop="content.payCount"
              :formatter="formatNull"
              label="转化支付用户量">
            </el-table-column>
            <el-table-column
              sortable
              align="center"
              prop="content.refundRate"
              :formatter="formatNull"
              label="用户退款率">
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              background
              :current-page="historyCurrentPage"
              @current-change="handleCurrentChange"
              layout="total, prev, pager, next"
              :total="totalItem">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'History',
  data () {
    return {
      userId: localStorage.getItem('userId'),
      historyCurrentPage: 1,
      loading: false,
      totalItem: 1,
      historyRecordData: []
    }
  },
  methods: {
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.getHistoryData(val, 10)
    },
    getHistoryData (page, size) {
      this.historyCurrentPage = page
      this.$api.post('api/statistic/obtainHistory', {
        userId: this.userId,
        page: page,
        size: size
      },
      response => {
        if (response.status >= 200 && response.status < 300) {
          if (response.data.code === 10500) {
            this.$message.error(response.data.msg)
            return
          }
          let tableData = response.data.data.data
          for (let i = 0; i < tableData.length; i++) {
            tableData[i].content = JSON.parse(tableData[i].content)
          }
          this.historyRecordData = tableData
          this.totalItem = response.data.data.totalCount
        }
      })
    },
    formatNull (row, col, cellValue, index) {
      return (cellValue !== null && cellValue !== '') ? cellValue : '--'
    }
  },
  created () {
    this.getHistoryData(1, 10)
  }
}
</script>

<style scoped>
.history-table-container{
  padding: 60px 20px 20px 20px;
  box-sizing: border-box;
  background-color: #fafafa;
}
.history-record-container{
  width: 100%;
  text-align: center;
}
.ds-nav{
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-between;
  border-bottom: solid 1px #ccc;
  margin-bottom: 10px;
}
.block{
  margin-top: 10px;
}
</style>
