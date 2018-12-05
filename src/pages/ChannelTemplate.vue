<template>
  <div class="content">
    <div class="main-contain">
      <Breadcrumb @refresh="getChannelData" :pageName="pageName" @addUser="addChannel"></Breadcrumb>
    </div>
    <el-card>
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="channelData"
          size="mini"
          max-height="441"
          border
          stripe
          style="width: 100%">
          <el-table-column
            prop="pageName"
            align="center"
            label="页面名称">
          </el-table-column>
          <el-table-column
            prop="templateUrl"
            align="center"
            :formatter="nullFormatter"
            label="模板链接">
          </el-table-column>
          <el-table-column
            prop="source"
            align="center"
            :formatter="nullFormatter"
            label="来源值">
          </el-table-column>
          <el-table-column
            align="center"
            width="120"
            label="关联渠道">
            <template slot-scope="scope">
              <div style="cursor:pointer;" @click.stop="showChannelList(scope.row)">
                {{ scope.row.channelList.length }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            align="center"
            width="120"
            :formatter="statusFormatter"
            label="状态">
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button @click.stop="channelEdit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
              <el-button v-if="scope.row.status" @click.stop="channelSwitch(scope.$index, scope.row, 0)" type="text" size="small">停用</el-button>
              <el-button v-else @click.stop="channelSwitch(scope.$index, scope.row, 1)" type="text" size="small">启用</el-button>
              <!--<el-button @click.stop="channelDelete(scope.$index, scope.row)" type="text" size="small">删除</el-button>-->
            </template>
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
      <!--关联渠道Dialog-->
      <el-dialog title="关联渠道" :visible.sync="channelListDialog" width="360px">
        <ul>
          <li v-for="channel in channelList" :key="channel.id">{{ channel.name }}</li>
        </ul>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="channelListDialog = false">确 定</el-button>
        </div>
      </el-dialog>
      <!--添加、编辑Dialog-->
      <el-dialog title="渠道信息" :visible.sync="addEditDialog" width="420px">
        <el-form :model="channelForm" ref="channelForm" label-width="100px" :label-position="position">
          <el-form-item label="页面名称：">
            <el-input v-model="channelForm.pageName"></el-input>
          </el-form-item>
          <el-form-item label="页面链接模板：">
            <el-input :disabled="!isAdd" type="textarea" v-model="channelForm.templateUrl"></el-input>
          </el-form-item>
          <el-form-item label="来源：">
            <el-input :disabled="!isAdd" v-model="channelForm.source"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addEditDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitChannelForm">确 定</el-button>
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
      pageName: 'channelTemplate',
      loading: false,
      page: 1,
      size: 10,
      total: null,
      channelData: [],
      channelList: [],
      channelListDialog: false,
      addEditDialog: false,
      position: 'top',
      isAdd: true,
      channelForm: {
        pageName: '',
        templateUrl: '',
        source: '',
        status: 1
      }
    }
  },
  created () {
    this.getChannelData()
  },
  methods: {
    // 获取渠道列表信息
    getChannelData () {
      this.loading = true
      this.$api.post('api/channel-template/obtainPaging', {
        pageName: '',
        templateUrl: '',
        source: '',
        status: '',
        page: this.page,
        size: this.size
      },
      response => {
        if (response.data.code === 10500) {
          this.$message.error(response.data.msg)
          return
        }
        this.channelData = response.data.data.data
        this.total = Number(response.data.data.totalCount)
        this.loading = false
        this.$message.success('渠道列表更新成功！')
      })
    },
    // 显示关联渠道
    showChannelList (row) {
      this.channelListDialog = true
      this.channelList = row.channelList
    },
    // 添加
    addChannel () {
      this.isAdd = true
      this.addEditDialog = true
    },
    // 编辑
    channelEdit (index, row) {
      this.isAdd = false
      this.addEditDialog = true
      console.log(row)
      this.channelForm.pageName = row.pageName
      this.channelForm.templateUrl = row.templateUrl
      this.channelForm.source = row.source
      this.channelForm.id = row.id
    },
    // 增加、编辑提交
    submitChannelForm () {
      this.loading = true
      console.log(this.channelForm)
      let url = (this.isAdd) ? 'api/channel-template/add' : 'api/channel-template/modify'
      this.$api.post(url, this.channelForm,
        response => {
          if (response.data.code === 10500) {
            this.$message.error(response.data.msg)
            this.loading = false
            return
          }
          this.loading = false
          this.addEditDialog = false
          this.$message.success('渠道信息提交成功！')
          for (let key in this.channelForm) { // 清空表单
            this.channelForm[key] = ''
          }
          this.getChannelData()
        })
    },
    // 改变页码
    handleCurrentChange (val) {
      this.page = val
      this.getChannelData()
    },
    // 改变每页条数
    handleSizeChange (val) {
      this.size = val
      this.getChannelData()
    },
    // 停用,启用
    channelSwitch (index, row, status) {
      row.status = status
      this.$api.post('api/channel-template/modify', row,
        response => {
          if (response.data.code === 10500) {
            this.$message.error(response.data.msg)
            this.loading = false
            return
          }
          this.loading = false
          this.getChannelData()
        })
    },
    nullFormatter (row, col, cellValue, index) {
      return cellValue === 0 ? '无' : cellValue
    },
    statusFormatter (row, col, cellValue, index) {
      return cellValue === 1 ? '正常' : '停用'
    }
  },
  watch: {
    id: 'csGetStaticsData',
    url: 'changeURL',
    valid: 'validChange'
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
</style>
