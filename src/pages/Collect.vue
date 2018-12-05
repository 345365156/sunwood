<template>
  <div class="content">
    <div class="main-contain">
      <Breadcrumb @refresh="getTableData" :pageName="pageName"></Breadcrumb>
    </div>
    <el-card>
      <div class="table-msg">
        <span @click="getTodayObtain" style="cursor: pointer">统计时间：{{ countTime }}</span>
        <span><span v-if="this.role === 'ldap'">预注册用户：{{ preRegisterUser }}</span>&nbsp;&nbsp;注册用户：{{ registeredUser }}</span>
        <span>
          <el-select v-if="this.role === 'ldap'" v-model="valid" placeholder="请选择">
            <el-option
              v-for="item in validOptions"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
          <el-select v-else v-model="channelCode" placeholder="请选择">
            <el-option
              v-for="item in channelCodeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </span>
      </div>
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="obtainData"
          max-height="441"
          @row-click="rowSelect"
          border
          stripe
          style="width: 100%">
          <el-table-column
            prop="countTime"
            align="center"
            label="数据日期">
          </el-table-column>
          <el-table-column
            v-if="this.role === 'ldap'"
            prop="preCount"
            align="center"
            :formatter="nullFormatter"
            label="预注册用户">
          </el-table-column>
          <el-table-column
            prop="count"
            align="center"
            :formatter="nullFormatter"
            label="注册用户">
          </el-table-column>
          <el-table-column
            v-if="this.role === 'ldap'"
            prop="valid"
            align="center"
            :formatter="validFormatter"
            label="有效应用">
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container" align="center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[5, 10, 20, 30, 40]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <!--渠道汇总Dialog-->
      <el-dialog title="渠道汇总" :visible.sync="dialogFormVisible" width="820px">
        <div>
          <el-button class="btn-create-channel" type="primary"><a :href="downLoadURL">导出</a></el-button>
        </div>
        <el-table
          :data="rowData"
          stripe
          max-height="400"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="countTime"
            label="数据日期">
          </el-table-column>
          <el-table-column
            align="center"
            prop="valid"
            :formatter="validFormatter"
            label="有效应用">
          </el-table-column>
          <el-table-column
            align="center"
            prop="channelCode"
            label="汇总渠道">
          </el-table-column>
          <el-table-column
            align="center"
            prop="preRegisterCount"
            label="预注册用户">
          </el-table-column>
          <el-table-column
            align="center"
            prop="registerCount"
            label="注册用户">
          </el-table-column>
          <el-table-column
            align="center"
            prop="count"
            width="100"
            label="注册用户因子">
          </el-table-column>
          <el-table-column
            align="center"
            prop="channelMode"
            :formatter="channelModeFormatter"
            label="合作模式">
          </el-table-column>
          <el-table-column
            align="center"
            prop="peakValue"
            label="计算峰值">
          </el-table-column>
          <el-table-column
            align="center"
            prop="channelFactor"
            label="计算因子">
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
      pageName: 'collect',
      role: '',
      loading: false,
      dialogFormVisible: false,
      countTime: '',
      preRegisterUser: '--',
      registeredUser: '--',
      channelCode: '',
      endTime: '',
      page: 1,
      size: 10,
      startTime: '',
      valid: '1',
      url: 'api/collect/realTime',
      obtainData: [],
      rowData: [],
      total: 0,
      validOptions: [
        {
          code: '1',
          id: '1',
          name: '征询查询'
        }, {
          code: '2',
          id: '2',
          name: '钱包到'
        }
      ],
      channelCodeOptions: [],
      downLoadURL: ''
    }
  },
  created () {
    this.role = localStorage.getItem('role')
    if (this.role === 'channel') {
      this.getChannelMsg()
    } else {
      this.getRealTimeData()
      this.getTableData()
    }
  },
  methods: {
    // 获取基本信息
    getChannelMsg () {
      this.$api.post('api/user/channel/obtain', {},
        response => {
          if (response.data.code === 10500) {
            this.$message.error(response.data.msg)
            return
          }
          this.valid = ''
          this.channelCode = response.data.data[0].code
          this.channelCodeOptions = response.data.data
          this.getRealTimeData()
          this.getTableData()
        })
    },
    // 获取管理员表格信息
    getTableData () {
      this.loading = true
      this.$api.post('api/collect/obtainPaging', {
        channelCode: this.channelCode,
        endTime: '',
        page: this.page,
        size: this.size,
        startTime: '',
        valid: this.valid
      },
      response => {
        if (response.data.code === 10500) {
          this.$message.error(response.data.msg)
          return
        }
        this.obtainData = response.data.data.data
        this.total = Number(response.data.data.totalCount)
        this.loading = false
        this.$message.success('统计数据列表更新成功')
      })
    },
    // 获取表格外信息
    getRealTimeData () {
      this.$api.post('api/collect/realTime', {
        channelCode: this.channelCode,
        endTime: '',
        page: 1,
        size: 10,
        startTime: '',
        valid: this.valid
      },
      response => {
        if (response.data.code === 10500) {
          this.$message.error(response.data.msg)
          return
        }
        this.countTime = response.data.data.countTime // 统计时间
        this.preRegisterUser = response.data.data.preCount // 预注册用户
        this.registeredUser = response.data.data.count // 注册用户
      })
    },
    getTodayObtain () {
      this.getObtainByCountTime(this.countTime, this.valid)
    },
    getObtainByCountTime (time, valid) {
      if (this.role !== 'ldap') {
        return
      }
      this.dialogFormVisible = true
      this.$api.post('api/collect/obtainByCountTime', {
        countTime: time,
        valid: valid
      },
      response => {
        if (response.data.code === 10500) {
          this.$message.error(response.data.msg)
          return
        }
        // 请求成功的回调
        this.rowData = response.data.data
      })
    },
    // 点击行触发
    rowSelect (row) {
      this.getObtainByCountTime(row.countTime, row.valid)
      let url = `${this.$api.getURL}collect/export/excel?valid=${row.valid}&countTime=${row.countTime}`
      this.downLoadURL = url
    },
    // 改变页码
    handleCurrentChange (val) {
      this.page = val
      this.getTableData()
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.size = val
      this.getTableData()
    },
    validChange () {
      this.getRealTimeData()
      this.getTableData()
    },
    validFormatter (row, col, cellValue, index) {
      return cellValue === 1 ? '征询查询' : '钱包到'
    },
    channelModeFormatter (row, col, cellValue, index) {
      return cellValue === 1 ? '实注册' : '预注册'
    },
    nullFormatter (row, col, cellValue, index) {
      return cellValue === 0 ? '无' : cellValue
    }
  },
  watch: {
    id: 'csGetStaticsData',
    url: 'changeURL',
    valid: 'validChange',
    channelCode: 'validChange'
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
.table-msg{
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 400;
}
.table-container{
  margin:10px 0;
}
.pagination-container{
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-create-channel {
  position: absolute;
  z-index: 3001;
  top: 54px;
  right: 20px;
}
.btn-create-channel a{
  color: #fff
}
</style>
