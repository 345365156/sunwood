<template>
  <div class="content">
    <div class="cs-center">
      <Breadcrumb :pageName="pageName" @addUser="addUser" @refresh="getUserData" @toggleCondition="showCondition = !showCondition"></Breadcrumb>
    </div>
    <div style="position: relative">
      <!--筛选条件-->
      <transition name="condition-slide">
        <div v-if="showCondition" class="select-con">
          <div class="condition-container">
            <span>用户姓名：<el-input type="text" placeholder="请输入用户姓名" v-model="name" style="width: 192px"></el-input></span>
            <span>登录账号：<el-input type="text" placeholder="请输入登录账号" v-model="account" style="width: 192px"></el-input></span>
            <span>
            有效应用：
            <el-select v-model="valid" placeholder="请选择有效应用" style="margin-left: -5px;">
              <el-option
                v-for="option in validOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
          </span>
            <span>
            用户状态：
            <el-select v-model="isFreeze" placeholder="请选择用户状态" style="margin-left: -5px;">
              <el-option
                v-for="option in statusOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
          </span>
          </div>
          <div class="btn-con">
            <el-button @click="showCondition = false">取消</el-button>
            <el-button type="primary" @click="getUserData()">查询</el-button>
          </div>
        </div>
      </transition>
      <!--用户列表-->
      <el-card>
        <div class="table-container">
          <el-table
            v-loading="loading"
            :data="userData"
            size="mini"
            max-height="441"
            @row-click="rowSelect"
            border
            stripe
            style="width: 100%">
            <el-table-column
              type="index"
              align="center"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="name"
              align="center"
              label="用户姓名">
            </el-table-column>
            <el-table-column
              prop="account"
              align="center"
              :formatter="nullFormatter"
              label="登录账号">
            </el-table-column>
            <el-table-column
              prop="genre"
              align="center"
              :formatter="genreFormatter"
              label="用户类型">
            </el-table-column>
            <el-table-column
              prop="valid"
              align="center"
              :formatter="validFormatter"
              label="有效应用">
            </el-table-column>
            <el-table-column
              prop="isFreeze"
              align="center"
              :formatter="freezeFormatter"
              label="用户状态">
            </el-table-column>
            <el-table-column
              prop="createTime"
              align="center"
              label="创建时间">
            </el-table-column>
            <el-table-column
              fixed="right"
              align="center"
              label="操作">
              <template slot-scope="scope">
                <el-button @click.stop="userEdit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                <el-button v-if="!(scope.row.isFreeze)" @click.stop="userChannel(scope.$index, scope.row)" type="text" size="small">渠道</el-button>
                <el-button v-if="!(scope.row.isFreeze)" @click.stop="userFreeze(scope.$index, scope.row, true)" type="text" size="small">冻结</el-button>
                <el-button v-if="scope.row.isFreeze" @click.stop="userFreeze(scope.$index, scope.row, false)" type="text" size="small">恢复</el-button>
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
            :total="totalCount">
          </el-pagination>
        </div>
      </el-card>
      <!--添加、编辑用户dialog-->
      <el-dialog :title="dialogTitle" :visible.sync="editUserDialogVisibility" width="420px">
        <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px">
          <el-form-item label="用户姓名" prop="name">
            <el-input v-model="userForm.name" placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item label="登录账号" prop="account">
            <el-input v-model="userForm.account" placeholder="请输入登录账号"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input type="password" v-model="userForm.password" placeholder="默认密码为123456"></el-input>
          </el-form-item>
          <el-form-item label="用户类型" prop="genre">
            <el-radio-group v-model="userForm.genre">
              <el-radio :label="0">普通</el-radio>
              <el-radio :label="1">渠道</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="有效应用" prop="valid">
            <el-radio-group v-model="userForm.valid">
              <el-radio :label="1" :disabled="validDisable">征询查询</el-radio>
              <el-radio :label="2" :disabled="validDisable">钱包到</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否冻结" prop="isFreeze">
            <el-radio-group v-model="userForm.isFreeze">
              <el-radio :label="false">正常</el-radio>
              <el-radio :label="true">冻结</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="负责BD">
            <el-select v-model="userForm.businessId" placeholder="请选择BD">
              <el-option v-for="bd in BDList" :key="bd.id" :label="bd.name" :value="bd.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editUserDialogVisibility = false">取 消</el-button>
          <el-button type="primary" @click="submitRoleForm">确 定</el-button>
        </div>
      </el-dialog>
      <!--渠道汇总Dialog-->
      <el-dialog title="渠道汇总" :visible.sync="channelDialog" width="820px">
        <div>
          <el-button class="btn-create-channel" type="primary" @click="addChannel">添加渠道</el-button>
        </div>
        <el-table
          :data="channelData"
          stripe
          v-loading="loading"
          max-height="300"
          style="width: 100%">
          <el-table-column
            align="center"
            :formatter="nullFormatter"
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            align="center"
            :formatter="nullFormatter"
            prop="name"
            label="渠道名称">
          </el-table-column>
          <el-table-column
            prop="code"
            align="center"
            :formatter="nullFormatter"
            label="渠道编码">
          </el-table-column>
          <el-table-column
            align="center"
            prop="mode"
            width="150"
            label="合作模式">
            <template slot-scope="scope">
              <span>{{ (scope.row.mode) === 1 ? '实注册' : '预注册' }} :: {{ (scope.row.currentMode) === 1 ? '实注册' : '预注册' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="100"
            label="计算峰值">
            <template slot-scope="scope">
              <span>{{ scope.row.peakValue }} :: {{ scope.row.currentPeakValue }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :formatter="nullFormatter"
            width="120"
            label="计算因子">
            <template slot-scope="scope">
              <span>{{ scope.row.factor }} :: {{ scope.row.currentFactor }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :formatter="nullFormatter"
            prop="univalent"
            label="渠道单价">
          </el-table-column>
          <el-table-column
            align="center"
            :formatter="validFormatter"
            prop="valid"
            label="有效应用">
          </el-table-column>
          <el-table-column
            align="center"
            :formatter="urlFormatter"
            prop="pageUrl"
            width="300"
            label="渠道链接">
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button @click.stop="editChannel(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="channelDialog = false">取 消</el-button>
          <el-button type="primary" @click="channelDialog = false">确 定</el-button>
        </div>
      </el-dialog>
      <!--添加渠道dialog-->
      <el-dialog title="添加渠道" :visible.sync="addChannelDialog" width="480px">
        <el-form ref="channelForm" label-width="90px">
          <el-form-item label="渠道名称" prop="name">
            <el-input v-model="channelForm.channelName" placeholder="请输入渠道名称"></el-input>
          </el-form-item>
          <el-form-item label="模式" prop="">
            <el-radio-group v-model="channelForm.channelScope">
              <el-radio :label="0">APP</el-radio>
              <el-radio :label="1">H5</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--征询查询应用显示'生成渠道链接'-->
          <div class="right-btn-container" v-if="this.user.valid === 1">
            <el-button :disabled="btnDisable" type="primary" @click="createChannelURL">生成渠道链接</el-button>
          </div>
          <el-form-item label="渠道号" prop="code"  v-if="this.user.valid === 1">
            <el-input id="channelCodeInput" disabled="disabled" placeholder="请生成渠道链接" v-model="channelForm.code" style="width: 289px;"></el-input>
            <el-button @click="copyInputText(channelForm.code, '已将渠道号复制进剪切板')">复制</el-button>
          </el-form-item>
          <el-form-item label="渠道链接" prop="pageURL"  v-if="this.user.valid === 1">
            <el-input id="channelURLInput" disabled="disabled" placeholder="请生成渠道链接" v-model="channelForm.pageURL" style="width: 289px;"></el-input>
            <el-button @click="copyInputText(channelForm.pageURL, '已将渠道链接复制进剪切板')">复制</el-button>
          </el-form-item>
          <!--钱包到应用显示'输入渠道号'-->
          <el-form-item label="渠道号" prop="code"  v-else>
            <el-input placeholder="请输入渠道号" v-model="channelForm.code" style="width: 289px;"></el-input>
          </el-form-item>
          <hr>
          <el-form-item label="合作模式" prop="mode">
            <el-radio-group v-model="addChannelForm.mode">
              <el-radio :label="1">实注册</el-radio>
              <el-radio :label="2">预注册</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="计算峰值" prop="peakValue">
            <el-input type="number" v-model="addChannelForm.peakValue" min="0"></el-input>
          </el-form-item>
          <el-form-item label="计算因子" prop="factor">
            <el-input type="number" v-model="addChannelForm.factor" step="0.01" min="0" max="1"></el-input>
          </el-form-item>
          <el-form-item label="渠道单价" prop="univalent">
            <el-input type="number" v-model="addChannelForm.univalent" step="0.01" min="0"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addChannelDialog = false">取 消</el-button>
          <el-button :disabled="btnSubDisable" type="primary" @click="submitChannelMsg">确 定</el-button>
        </div>
      </el-dialog>
      <!--渠道编辑dialog-->
      <el-dialog title="编辑渠道" :visible.sync="channelEditDialog" width="500px">
        <el-form ref="channelForm" label-width="90px">
          <el-form-item label="渠道名称">
            <el-input placeholder="请输入渠道名称" v-model="channelEdit.name"></el-input>
          </el-form-item>
          <el-form-item label="渠道编码">
            <el-input placeholder="请输入渠道编码" v-model="channelEdit.code"></el-input>
          </el-form-item>
          <el-form-item label="合作模式" prop="mode">
            <el-radio-group v-model="channelEdit.mode">
              <el-radio :label="1">实注册</el-radio>
              <el-radio :label="2">预注册</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="计算峰值" prop="peakValue">
            <el-input type="number" v-model="channelEdit.peakValue" min="0"></el-input>
          </el-form-item>
          <el-form-item label="计算因子" prop="factor">
            <el-input type="number" v-model="channelEdit.factor" step="0.01" min="0" max="1"></el-input>
          </el-form-item>
          <el-form-item label="渠道单价" prop="univalent">
            <el-input type="number" v-model="channelEdit.univalent" step="0.01" min="0"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="channelEditDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitChannelEdit">确 定</el-button>
        </div>
      </el-dialog>
      <!--选择落地页版本dialog-->
      <el-dialog title="请选择落地页版本" :visible.sync="editionDialog" width="420px">
        <el-form ref="editionForm" label-width="90px">
          <el-form-item label="版本" prop="genre">
            <el-radio-group v-model="edition">
              <el-radio v-for="edition in editionData" :key="edition.id" :label=edition.id>{{ edition.pageName }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--下拉框模式-->
          <!--<el-form-item label="版本">-->
            <!--<el-select v-model="editionForm.edition" placeholder="请选择版本">-->
              <!--<el-option v-for="edition in editionData" :key="edition.id" :label=edition.pageName :value=edition.id>{{ edition.pageName }}</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitEdition">确 定</el-button>
          </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '../components/Breadcrumb'
export default {
  name: 'user',
  data () {
    return {
      dialogTitle: '用户编辑',
      user: {},
      name: '',
      loading: false,
      btnDisable: true,
      btnSubDisable: true,
      editionDialog: false,
      showCondition: true,
      addChannelDialog: false,
      channelEditDialog: false,
      editUserDialogVisibility: false,
      BDList: [],
      pageName: 'user',
      account: '',
      channelData: [],
      channelDialog: false,
      genre: 1,
      isFreeze: '',
      page: 1,
      size: 10,
      valid: '',
      userData: [],
      totalCount: 0,
      dialogFormVisible: false, // 默认Dialog不显示
      validDisable: false, // 默认应用可改变
      formLabelWidth: '80px',
      selectValid: '',
      channelEdit: {},
      validOptions: [
        {
          value: '',
          label: '全部'
        }, {
          value: 1,
          label: '征询查询'
        }, {
          value: 2,
          label: '钱包到'
        }
      ],
      selectStatus: '',
      statusOptions: [
        {
          label: '全部',
          value: ''
        }, {
          label: '正常',
          value: 0
        }, {
          label: '冻结',
          value: 1
        }
      ],
      editionData: [], // 版本列表数据
      channelForm: {
        channelName: '',
        channelTemplateId: '',
        channelScope: 0,
        code: '',
        pageURL: ''
      },
      addChannelForm: {
        code: '',
        factor: '', // 计算因子
        mode: 1,
        name: '', // 渠道名称
        peakValue: '', // 计算峰值
        univalent: '', // 渠道单价
        userId: null,
        valid: 1,
        pageUrl: '',
        channelTemplateId: null
      },
      edition: 0,
      userForm: {},
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入用户账号' }
        ],
        genre: [
          { required: true, message: '请选择用户类型' }
        ],
        isFreeze: [
          { required: true, message: '请选择是否冻结' }
        ],
        valid: [
          { required: true, message: '请选择有效应用' }
        ]
      }
    }
  },
  created () {
    this.getUserData()
  },
  methods: {
    handleSizeChange (val) {
      this.size = val
      this.getUserData()
    },
    handleCurrentChange (val) {
      this.page = val
      this.getUserData()
    },
    getUserData () {
      this.loading = true
      this.showCondition = false
      this.$api.post('api/user/obtainPaging', {
        account: this.account,
        genre: this.genre, //  0 普通  1 渠道
        isFreeze: this.isFreeze,
        name: this.name,
        page: this.page,
        size: this.size,
        valid: this.valid
      },
      response => {
        this.loading = false
        this.userData = response.data.data.data
        this.totalCount = response.data.data.totalCount
        this.$message.success('用户列表更新成功')
      })
    },
    editChannel (index, row) {
      this.channelEditDialog = true
      this.channelEdit = row
    },
    submitChannelEdit () {
      this.$api.post('api/user/channel/modify', this.channelEdit,
        response => {
          this.$message.success('渠道信息编辑成功')
          this.channelEditDialog = false
          this.userChannel('', this.user)
        })
    },
    submitRoleForm () {
      this.loading = true
      let url = ''
      if (this.dialogTitle === '添加用户') {
        url = '/api/user/addition'
      } else {
        url = '/api/user/modify'
      }
      this.$api.post(url, this.userForm,
        response => {
          this.loading = false
          if (response.data.code === 10500) {
            this.$message.error(response.data.msg)
            return
          }
          if (response.data.code !== 10001) {
            this.$message.error(response.data.result)
            return
          }
          this.$message.success('操作成功！')
          this.editUserDialogVisibility = false
          this.getUserData()
        })
    },
    rowSelect (row) {
      // console.log(row)
    },
    validFormatter (row, col, cellValue, index) {
      return cellValue === 1 ? '征询查询' : '钱包到'
    },
    genreFormatter (row, col, cellValue, index) {
      return cellValue === 1 ? '渠道' : '正常'
    },
    freezeFormatter (row, col, cellValue, index) {
      return cellValue ? '冻结' : '正常'
    },
    nullFormatter (row, col, cellValue, index) {
      return cellValue === 0 ? '无' : cellValue
    },
    urlFormatter (row, col, cellValue, index) {
      return cellValue === '' ? '--' : cellValue
    },
    addUser () {
      this.dialogTitle = '添加用户'
      this.userForm = {}
      this.validDisable = false
      this.editUserDialogVisibility = true
      this.getBD()
    },
    userEdit (index, row) {
      this.dialogTitle = '编辑用户'
      this.validDisable = true
      this.userForm = row
      this.userForm.password = ''
      this.editUserDialogVisibility = true
      this.getBD()
    },
    // 获取BD
    getBD () {
      this.$api.post('api/business/obtain', {status: 1},
        response => {
          if (response.data.code === 10500) {
            this.$message.error(response.data.msg)
            this.loading = false
            return
          }
          this.BDList = response.data.data
        })
    },
    // 渠道
    userChannel (index, row) {
      this.user = row
      this.channelDialog = true
      this.$api.post('api/user/channel/obtain', {
        userId: row.id
      },
      response => {
        this.loading = false
        this.channelData = response.data.data
      })
    },
    // 冻结、恢复用户
    userFreeze (index, row, isFreeze) {
      this.loading = true
      this.userForm = row
      this.userForm.isFreeze = isFreeze
      this.$api.post('/api/user/modify', this.userForm,
        response => {
          this.$message.success('操作成功！')
          this.getUserData()
        })
    },
    addChannel () {
      this.addChannelDialog = true
      this.channelForm.channelName = ''
      this.channelForm.code = ''
      this.channelForm.pageURL = ''
      this.addChannelForm.peakValue = ''
      this.addChannelForm.factor = ''
      this.addChannelForm.univalent = ''
    },
    createChannelURL () {
      this.editionDialog = true
      this.$api.post('api/channel-template/obtain', {
        status: 1
      },
      response => {
        this.editionData = response.data.data
        this.edition = response.data.data[0].id
      })
    },
    submitEdition () {
      this.channelForm.channelTemplateId = this.edition
      this.$api.post('api/user/channel/generateUrl', this.channelForm,
        response => {
          this.editionDialog = false
          this.channelForm.code = response.data.data.code
          this.channelForm.pageURL = response.data.data.pageUrl
        })
    },
    submitChannelMsg () {
      this.addChannelForm.name = this.channelForm.channelName
      this.addChannelForm.channelTemplateId = this.channelForm.channelTemplateId
      this.addChannelForm.pageUrl = this.channelForm.pageURL
      this.addChannelForm.code = this.channelForm.code
      this.addChannelForm.userId = this.user.id
      this.addChannelForm.valid = this.user.valid
      console.log(this.addChannelForm)
      this.$api.post('api/user/channel/addition', this.addChannelForm,
        response => {
          if (response.data.code === 10500) {
            this.$message.error(response.data.msg)
            this.loading = false
            return
          }
          if (response.data.code !== 10001) {
            this.$message(response.data.result)
            return
          }
          this.$message.success('添加渠道成功！')
          this.addChannelDialog = false
          this.loading = true
          this.$api.post('api/user/channel/obtain', {
            userId: this.addChannelForm.userId
          },
          response => {
            this.loading = false
            this.channelData = response.data.data
          })
        })
    },
    btnCheck () {
      if (this.objChannelName > 0) {
        this.btnDisable = false
      } else {
        this.btnDisable = true
      }
    },
    btnSubCheck () {
      if (this.btnDisable || this.objChannelPeakValue.length === 0 || this.objChannelFactor.length === 0 || this.objChannelUnivalent.length === 0 || this.objChannelCode.length === 0) {
        this.btnSubDisable = true
      } else {
        this.btnSubDisable = false
      }
    },
    copyInputText (text, message) {
      let oInput = document.createElement('input')
      oInput.setAttribute('id', 'tempInput')
      oInput.value = text
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      oInput.style.display = 'none'
      document.getElementById('tempInput').remove()
      this.$message.success(message)
    }
  },
  components: {
    Breadcrumb
  },
  computed: {
    objChannelName () {
      return this.channelForm.channelName.length
    },
    objChannelPeakValue () {
      return this.addChannelForm.peakValue
    },
    objChannelFactor () {
      return this.addChannelForm.factor
    },
    objChannelUnivalent () {
      return this.addChannelForm.univalent
    },
    objChannelCode () {
      return this.channelForm.code
    },
    objChannelUrl () {
      return this.channelForm.pageURL
    }
  },
  watch: {
    objChannelName: 'btnCheck',
    objChannelPeakValue: 'btnSubCheck',
    objChannelFactor: 'btnSubCheck',
    objChannelUnivalent: 'btnSubCheck',
    objChannelCode: 'btnSubCheck',
    objChannelUrl: 'btnSubCheck'
  },
  beforeCreate () {
  }
}
</script>

<style scoped>
.content{
  padding: 70px 20px 20px 20px;
  box-sizing: border-box;
  background-color: #fafafa;
}
.select-con{
  background-color: #f1f1f1;
  position: absolute;
  width: 100%;
  font-weight: 400;
  font-size: 14px;
  padding: 15px;
  z-index: 3001;
}
.condition-container{
  min-height: 120px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: flex-start;
}
.btn-con{
  text-align: center;
}
.pagination-container{
  margin: 10px 0;
}
.condition-slide-enter-active {
  transition: all .3s cubic-bezier(1.0, 0.8, 0.5, 1.0);
  opacity: 0;
}
.condition-slide-enter-to {
  opacity: 1;
}
.condition-slide-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.condition-slide, .condition-slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
hr{
  background-color: #ccc;
  height: 1px;
  border: none;
  margin-bottom: 20px;
}
.right-btn-container{
  text-align: right;
  width: 100%;
  margin-bottom: 20px;
}
.btn-create-channel {
  position: absolute;
  z-index: 3001;
  top: 54px;
  right: 20px;
}
</style>
