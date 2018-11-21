<template>
  <div class="content">
    <div class="main-contain">
      <div class="ds-nav">
        <span><a :class="{ active: isActive }" @click="statisticSource(1)">实时统计</a> / <a :class="{ active: !isActive }" @click="statisticSource(2)">全局统计</a></span>
        <span class="update-time">数据更新时间：{{ updateTime }}</span>
        <span v-if="roleSelect">
          <el-select v-model="id" filterable style="width:120px" placeholder="请选择客服">
            <el-option
              v-for="cs in allCS"
              :key="cs.id"
              :label="cs.name"
              :value="cs.id">
            </el-option>
          </el-select>
        </span>
      </div>
      <div class="cards-container" :realTimeData="realTimeData">
        <!--人效数据-->
        <el-row :gutter="0">
          <el-col :span="24">
            <el-card class="box-card">
              <div slot="header" class="clearFix">
                <span>人效数据</span>
              </div>
              <div class="text card-body">
                <div>
                  <p class="data-num">{{ realTimeData.content.handleCount }}</p>
                  <p class="data-describe">处理量</p>
                </div>
                <div>
                  <p class="data-num">{{ realTimeData.content.handleAvgTime }}</p>
                  <p class="data-describe">平均每个任务处理时长(秒)</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!--呼叫结果数据-->
        <el-row :gutter="0">
          <el-col :span="24">
            <el-card class="box-card">
              <div slot="header" class="clearFix">
                <span>呼叫结果数据</span>
              </div>
              <div class="text card-body">
                <div>
                  <p class="data-num"> {{ realTimeData.content.connectedCount }} <span>/</span> {{ realTimeData.content.connectRate }} </p>
                  <p class="data-describe"> 接通量 <span>/</span> 接通率 </p>
                </div>
                <div>
                  <p class="data-num"> {{ realTimeData.content.validConnectCount }} <span>/</span> {{ realTimeData.content.validConnectRate }} <span>/</span> {{ realTimeData.content.validConnectRate }} </p>
                  <p class="data-describe"> 有效沟通量 <span>/</span> 有效沟通率 <span>/</span> 有效沟通率(全局) </p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!--归因结果数据-->
        <el-row :gutter="0">
          <el-col :span="24">
            <el-card class="box-card">
              <div slot="header" class="clearFix">
                <span>归因结果数据</span>
              </div>
              <div class="text card-body">
                <div>
                  <p class="data-num"> {{ realTimeData.content.payCount }} <span>/</span> {{ realTimeData.content.payAmount }} </p>
                  <p class="data-describe">转化支付量<span>/</span>转化支付金额</p>
                </div>
                <div>
                  <p class="data-num"> {{ realTimeData.content.payCount }} <span>/</span> {{ realTimeData.content.payRate }} </p>
                  <p class="data-describe">转化支付用户<span>/</span>付费用户转化率</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'user',
  data () {
    let updateTime = new Date()
    updateTime = updateTime.getFullYear() + '-' + updateTime.getMonth() + '-' + updateTime.getDate() + ' ' + updateTime.getHours() + ':' + updateTime.getMinutes() + ':' + updateTime.getSeconds()
    return {
      updateTime,
      userId: null,
      allCS: [],
      id: null,
      csId: this.userId,
      roleValue: null,
      role: '',
      url: 'api/statistic/obtainRealTime',
      roleSelect: true,
      isActive: true,
      defaultOption: [{
        role: this.role,
        id: localStorage.getItem('userId'),
        name: '全部'
      }],
      realTimeData: {
        content: {
          handleCount: '--', // 处理量
          handleAvgTime: '--', // 平均每个任务处理时长(秒)
          connectedCount: '--', // 接通量
          connectRate: '--', // 接通率
          validConnectCount: '--', // 有效沟通量
          validConnectRate: '--', // 有效沟通率
          payAmount: '--', // 转化支付金额
          payCount: '--', // 转化支付用户  转化支付量
          payRate: '--' // 付费用户转化率
        }
      }
    }
  },
  created () {
    this.id = this.userId = localStorage.getItem('userId')
    // 判读角色是否为管理员
    this.defaultOption[0].role = this.role = localStorage.getItem('role')
    if (this.role.indexOf('000') > -1 || this.role.indexOf('001') > -1) {
      this.roleSelect = true
      // 获取所有客服
      this.$api.post('api/user/obtainAll', {
        userId: this.userId
      },
      response => {
        if (response.status >= 200 && response.status < 300) {
          if (response.data.code === 10500) {
            this.$message.error(response.data.msg)
          }
          this.allCS = this.defaultOption.concat(response.data.data)
        } else {
          this.$message.error('请求客服数据失败。') // 请求失败。
        }
      })
    } else {
      this.roleSelect = false
    }
  },
  methods: {
    getStaticsData (id) {
      this.$api.post(this.url, {
        userId: id
      },
      response => {
        if (response.status >= 200 && response.status < 300) {
          if (response.data.code === 10500) {
            this.$message.error(response.data.msg)
            return
          }
          response.data.data.content = JSON.parse(response.data.data.content)
          this.realTimeData = response.data.data
        }
      })
    },
    statisticSource (source) {
      if (source === 1) {
        this.url = 'api/statistic/obtainRealTime'
      } else {
        this.url = 'api/statistic/obtainGlobal'
      }
    },
    csGetStaticsData (newVal, oldVal) {
      this.id = newVal
      this.getStaticsData(newVal)
    },
    changeURL (newVal, oldVal) {
      this.isActive = !(this.isActive)
      this.getStaticsData(this.id)
    }
  },
  watch: {
    id: 'csGetStaticsData',
    url: 'changeURL'
  },
  computed: {
  },
  components: {
  }
}
</script>

<style scoped>
.content{
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
}
.ds-nav>span>a{
  cursor: pointer;
}
.ds-nav>span>a:hover{
  color: #409fee;
}
.active{
  color: #409fee;
}
span.update-time{
  font-size: 12px;
  font-weight: 500;
  position: relative;
  top: 15px;
}
.box-card{
  margin: 10px 0;
}
.item {
  margin-bottom: 18px;
}
.clearFix:before,.clearFix:after {
  display: table;
  content: "";
}
.clearFix:after {
  clear: both
}
.box-card div.card-body{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.box-card p{
  text-align: center;
}
.box-card p.data-num{
  font-size: 28px;
  color: #57a9ff;
}
.box-card p.data-num span{
  color: #303133;
  margin: 0 5px;
  font-size: 28px;
  font-weight: 400;
}
.box-card p.data-describe{
  font-size: 14px;
}
.box-card p.data-describe span{
  /*color: #409EFF;*/
  margin: 0 5px;
  font-size: 18px;
  position: relative;
  top: 2px;
}
</style>
