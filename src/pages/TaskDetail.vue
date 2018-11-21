<template>
  <div class="container">
    <el-row class="table-container">
      <el-col :span="11" :offset="0">
        <el-card class="box-card">
          <div slot="header" class="clearFix">
            <span>任务信息</span>
          </div>
          <div class="text card-body">
            <div class="task-table">
              <table class="base-table">
                <tr>
                  <td>任务编号</td>
                  <td>{{ task.serialNumber | nullCheck }}</td>
                </tr>
                <tr>
                  <td>用户id</td>
                  <td>{{ task.userId | nullCheck }}</td>
                </tr>
                <tr>
                  <td>状态</td>
                  <td>{{ task.status | nullCheck | taskStatusFormatter }}</td>
                </tr>
                <tr>
                  <td>有效应用</td>
                  <td>{{ task.valid | nullCheck | taskAPPFormatter}}</td>
                </tr>
                <tr>
                  <td>创建时间</td>
                  <td>{{ task.createTime | nullCheck }}</td>
                </tr>
                <tr>
                  <td>领取时间</td>
                  <td>{{ task.receiveTime | nullCheck }}</td>
                </tr>
                <tr>
                  <td>处理时间</td>
                  <td>{{ task.handleTime | nullCheck }}</td>
                </tr>
                <tr>
                  <td>处理时长</td>
                  <td>{{ task.handleDuration | nullCheck }}</td>
                </tr>
                <tr>
                  <td>处理标签</td>
                  <td>{{ task.handleTag | nullCheck }}</td>
                </tr>
                <tr>
                  <td>处理结果</td>
                  <td>{{ task.handleResult | nullCheck | dealResultFormatter}}</td>
                </tr>
              </table>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" :offset="1">
        <el-card class="box-card">
          <div slot="header" class="clearFix">
            <span>用户信息</span>
          </div>
          <div class="text card-body">
            <div>
              <table class="base-table">
                <tr>
                  <td>用户姓名</td>
                  <td>{{ taskTarget.userName | nullCheck }}</td>
                </tr>
                <tr>
                  <td>用户性别</td>
                  <td>{{ taskTarget.userSex | nullCheck | sexFormatter }}</td>
                </tr>
                <tr>
                  <td>用户年龄</td>
                  <td>{{ taskTarget.userAge | nullCheck }}</td>
                </tr>
                <tr>
                  <td>用户手机</td>
                  <td>{{ taskTarget.userPhone | nullCheck }}</td>
                </tr>
                <tr>
                  <td>用户身份证号</td>
                  <td>{{ taskTarget.userIdCard | nullCheck }}</td>
                </tr>
                <tr>
                  <td>用户来源</td>
                  <td>{{ taskTarget.proChannel | nullCheck }}</td>
                </tr>
                <tr>
                  <td>用户注册时间</td>
                  <td>{{ taskTarget.registerTime | nullCheck }}</td>
                </tr>
                <tr>
                  <td>追踪状态</td>
                  <td>{{ taskTarget.status | nullCheck | trackStatusFormatter}}</td>
                </tr>
                <tr>
                  <td>追踪周期</td>
                  <td>{{ taskTarget.trackDuration | nullCheck }}</td>
                </tr>
                <tr>
                  <td>追踪终止时间</td>
                  <td>{{ taskTarget.terminationTime | nullCheck }}</td>
                </tr>
              </table>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearFix">
            <span>子任务列表</span>
          </div>
          <div class="text card-body">
            <div>
              <el-table
                :data="subTaskList"
                v-loading="loading"
                border
                stripe
                max-height="500"
                style="width: 100%">
                <el-table-column
                  sortable
                  align="center"
                  prop="serialNumber"
                  label="任务编号">
                </el-table-column>
                <el-table-column
                  sortable
                  align="center"
                  prop="taskId"
                  label="主任务ID">
                </el-table-column>
                <el-table-column
                  sortable
                  align="center"
                  prop="receiveTime"
                  label="领取时间">
                </el-table-column>
                <el-table-column
                  sortable
                  align="center"
                  prop="handleTime"
                  label="处理时间">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="handleTag"
                  :formatter="formatResult"
                  label="处理标签">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="handleResult"
                  :formatter="formatResult"
                  label="处理结果">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="status"
                  :formatter="formatSubTaskStatus"
                  label="任务状态">
                </el-table-column>
              </el-table>
              <!--分页-->
              <div class="pagination-container" align="center">
                <el-pagination
                  :page-size="pageSize"
                  layout="total, prev, pager, next"
                  :total=this.subTaskList.length >
                </el-pagination>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearFix">
            <span>订单列表</span>
          </div>
          <div class="text card-body">
            <div>
              <el-table
                :data="taskTargetTrackList"
                v-loading="loading2"
                border
                stripe
                max-height="500"
                style="width: 100%">
                <el-table-column
                  sortable
                  align="center"
                  prop="orderNumber"
                  label="订单编号">
                </el-table-column>
                <el-table-column
                  sortable
                  align="center"
                  prop="goodsName"
                  label="产品名称">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="createTime"
                  label="创建时间">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="orderStatus"
                  :formatter="formatOrderStatus"
                  label="订单状态">
                </el-table-column>
                <el-table-column
                  sortable
                  align="center"
                  prop="orderMoney"
                  label="订单金额">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="status"
                  :formatter="formatTrackStatus"
                  label="追踪状态">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="realTimeStatus"
                  :formatter="formatRealTimeStatus"
                  label="实时状态">
                </el-table-column>
              </el-table>
              <!--分页-->
              <div class="pagination-container" align="center">
                <el-pagination
                  :current-page="currentPage2"
                  :page-size="pageSize2"
                  layout="total, prev, pager, next"
                  :total=this.taskTargetTrackList.length >
                </el-pagination>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="display: none">
      <el-col :span="24">
        <el-card class="box-card">
          <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/dataZoom')
export default {
  name: 'TaskDetail',
  data () {
    return {
      msg: {},
      task: {},
      taskTarget: {},
      subTaskList: [],
      taskTargetTrackList: [],
      loading: false,
      loading2: false,
      currentPage: 1,
      currentPage2: 1,
      pageSize: 10,
      pageSize2: 10,
      option: {
        title: {
          text: '一周气温变化',
          subtext: '纯属虚构'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['最高', '最低']
        },
        toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            dataZoom: {show: true},
            dataView: {show: true},
            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        calculable: true,
        dataZoom: [
          {
            id: 'dataZoomX',
            show: true,
            orient: 'horizontal',
            start: 0,
            end: 100,
            backgroundColor: 'rgba(0,0,0,0)',
            dataBackgroundColor: '#eee',
            fillerColor: 'rgba(144,197,237,0.2)',
            handleColor: 'rgba(70,130,180,0.8)',
            handleSize: 18
          },
          {
            id: 'dataZoomY',
            show: true,
            orient: 'vertical',
            start: 0,
            end: 100,
            backgroundColor: 'rgba(0,0,0,0)',
            dataBackgroundColor: '#eee',
            fillerColor: 'rgba(144,197,237,0.2)',
            handleColor: 'rgba(70,130,180,0.8)',
            handleSize: 18
          }
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [ '2018-11-09', '2018-11-10', '2018-11-11', '2018-11-12', '2018-11-13', '2018-11-14', '2018-11-15' ]
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '最高',
            type: 'line',
            data: [23, 45, 63, 67, 89, 54, 34]
          },
          {
            name: '最低',
            type: 'line',
            data: [12, 18, 17, 15, 10, 16, 13]
          }
        ]
      }
    }
  },
  computed: {
  },
  created () {
    this.msg = this.$route.query.param
    this.task = this.msg.task
    this.taskTarget = this.msg.taskTarget
    this.subTaskList = this.msg.subTaskList
    this.taskTargetTrackList = this.msg.taskTargetTrackList
  },
  mounted () {
    this.drawLine() // 挂载时渲染图表
  },
  methods: {
    drawLine () {
      let myChart = echarts.init(document.getElementById('myChart'), 'light')
      myChart.setOption(this.option)
      window.addEventListener('resize', () => { myChart.resize() })
    },
    formatSubTaskStatus (row, col, cellValue, index) {
      switch (cellValue) {
        case 1:
          return '待处理'
        case 2:
          return '已处理'
        case 3:
          return '未处理'
      }
    },
    formatResult (row, col, cellValue, index) {
      if (cellValue === 1) {
        return '已呼通'
      }
      if (cellValue === 2) {
        return '未呼通'
      }
    },
    formatOrderStatus (row, col, cellValue, index) {
      if (cellValue === 2) {
        return '支付失败'
      } else if (cellValue === 3) {
        return '支付成功'
      }
    },
    formatTrackStatus (row, col, cellValue, index) {
      switch (cellValue) {
        case 1:
          return '关联中'
        case 2:
          return '追踪中'
        case 3:
          return '追踪结束'
      }
    },
    formatRealTimeStatus (row, col, cellValue, index) {
      switch (cellValue) {
        case 1:
          return '关联中'
        case 2:
          return '支付成功'
        case 3:
          return '退款成功'
      }
    }
  },
  beforeUpdate () {
  }
}
</script>

<style scoped>
  .container{
    padding: 70px 20px 20px 20px;
    box-sizing: border-box;
    background-color: #fafafa;
    height: 100%;
  }
  .box-card{
    margin: 10px 0;
  }
  .base-table{
    width: 100%;
  }
  .base-table td{
    border: 1px solid #ddd;
    width: 50%;
    padding: 5px;
  }
  .base-table td:nth-child(even){
    color: #666;
  }
  .pagination-container{
    margin-top: 20px;
  }
</style>
