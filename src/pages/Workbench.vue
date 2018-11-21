<template>
  <div class="container">
    <el-row :gutter="12">
      <el-col :span="16">
        <div class="box-card" style="height: 600px;">
          <div class="box-card" v-if="getNewTask">
            <p><img class="logo" src="../assets/App.png"></p>
            <p>
              <el-button type="primary" @click="getTask">
                立即领取最新任务
              </el-button>
            </p>
          </div>
          <div class="box-card" v-else>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearFix">
                    <span>任务信息</span>
                  </div>
                  <div class="text card-body cs-msg">
                    <div>
                      <p>{{ taskTarget.userPhone }}</p>
                    </div>
                    <div class="cs-describe">
                      <span>{{ taskTarget.userName | nullCheck }}</span>
                      <span>{{ taskTarget.userSex | sexFormatter | nullCheck }}</span>
                      <span>{{ taskTarget.userAge | nullCheck }}岁</span>
                    </div>
                    <table class="task-msg">
                      <tr>
                        <td>身份证号</td>
                        <td>{{ taskTarget.userIdCard | nullCheck }}</td>
                      </tr>
                      <tr>
                        <td>下单时间</td>
                        <td>{{ taskTargetTrack.orderTime | nullCheck }}</td>
                      </tr>
                      <tr>
                        <td>用户注册时间</td>
                        <td>{{ taskTarget.registerTime | nullCheck }}</td>
                      </tr>
                      <tr>
                        <td>订单来源</td>
                        <td>{{ taskTargetTrack.orderChannel | nullCheck }}</td>
                      </tr>
                      <tr>
                        <td>任务创建时间</td>
                        <td>{{ taskData.createTime | nullCheck }}</td>
                      </tr>
                    </table>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card">
                  <div slot="header" class="clearFix">
                    <span>上报处理结果</span>
                  </div>
                  <div class="text card-body">
                    <h4>是否呼通？</h4>
                    <div class="radio-content">
                      <span>
                        <input type="radio" name="con" id="contact" v-model="contact" value="1">
                        <label for="contact" :class="{active:contact == 1}">已呼通</label>
                      </span>
                      <span>
                        <input type="radio" name="con" id="notContact" v-model="contact" value="2">
                        <label for="notContact" :class="{active:contact == 2}">未呼通</label>
                      </span>
                    </div>
                    <div class="item-content" v-show="contact == 1">
                      <h4>处理结果：</h4>
                      <p><input type="radio" name="contactResult" id="contactResult1" v-model="dealResult" value="Alr001"><label for="contactResult1" :class="{active:dealResult=='Alr001'}">未完成有效沟通</label></p>
                      <p><input type="radio" name="contactResult" id="contactResult2" v-model="dealResult" value="Alr002"><label for="contactResult2" :class="{active:dealResult=='Alr002'}">已沟通，无付费意愿</label></p>
                      <p><input type="radio" name="contactResult" id="contactResult3" v-model="dealResult" value="Alr003"><label for="contactResult3" :class="{active:dealResult=='Alr003'}">已沟通，有付费意愿</label></p>
                      <br>
                    </div>
                    <div class="item-content" v-show="contact == 2">
                      <h4>处理结果：</h4>
                      <p><input type="radio" name="dealResult" id="dealResult1" v-model="dealResult" value="Not006"><label for="dealResult1" :class="{active:dealResult=='Not006'}">无人接听</label></p>
                      <p><input type="radio" name="dealResult" id="dealResult2" v-model="dealResult" value="Not005"><label for="dealResult2" :class="{active:dealResult=='Not005'}">已关机</label></p>
                      <p><input type="radio" name="dealResult" id="dealResult3" v-model="dealResult" value="Not004"><label for="dealResult3" :class="{active:dealResult=='Not004'}">已停机</label></p>
                      <p><input type="radio" name="dealResult" id="dealResult4" v-model="dealResult" value="Not003"><label for="dealResult4" :class="{active:dealResult=='Not003'}">空号</label></p>
                      <p><input type="radio" name="dealResult" id="dealResult5" v-model="dealResult" value="Not002"><label for="dealResult5" :class="{active:dealResult=='Not002'}">占线</label></p>
                      <p><input type="radio" name="dealResult" id="dealResult6" v-model="dealResult" value="Not001"><label for="dealResult6" :class="{active:dealResult=='Not001'}">拒接</label></p>
                      <br>
                    </div>
                    <div class="btn-con">
                      <el-button type="primary" @click="submitGetTask">提交并领取最新任务</el-button>
                      <el-button type="primary" @click="submitTask">提交</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearFix">
            <span>子任务列表</span>
          </div>
          <div class="text card-body" v-show="hasSubTask">
            <ul>
              <li v-for="subTask in subTaskList" :key="'subTask' + subTask.id" class="sub-task-item">
                <div class="sub-task-item">
                  <p>{{ subTask.serialNumber }}</p>
                  <span><small><i>{{ subTask.createTime }}</i></small></span>
                </div>
                <div>
                  <el-button plain size="mini" @click="getSubTask(subTask.id)">领取任务</el-button>
                </div>
              </li>
            </ul>
          </div>
          <div class="no-sub-task" v-show="!hasSubTask">
            暂时没有子任务。
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Workbench',
  data () {
    return {
      hasSubTask: false, // 没有子任务时显示提示
      receiveData: {}, // 存储接收的任务data
      taskType: 0, // 任务类型，0：主任务 1：子任务
      taskData: {}, // 存储主任务信息
      subTaskData: {}, // 存储子任务信息
      taskTarget: {}, // 任务目标
      taskTargetTrack: {}, // 任务目标信息
      getNewTask: true, // 显示任务true 或者领取任务false
      contact: 1, // 是否呼通 1：呼通  2：未呼通
      dealResult: 'Alr001', // 处理结果
      subTaskList: [] // 子任务列表
    }
  },
  methods: {
    getTask () {
      this.$api.post('api/task/obtainTask', { // 获取主任务
        id: localStorage.getItem('userId') // 用户ID，从登陆获取
      },
      response => {
        if (response.status >= 200 && response.status < 300) {
          console.log(response.data)
          if (response.data.code === 500 || response.data.code === 10500) {
            this.$message(response.data.msg)
            return
          }
          this.taskType = response.data.data.taskType
          this.taskData = response.data.data.task
          this.subTaskData = response.data.data.subTask
          this.taskTarget = response.data.data.taskTarget
          this.taskTargetTrack = response.data.data.taskTargetTrack
          this.getNewTask = false
        } else {
          console.log(response.msg) // 请求失败，response为失败信息
        }
      })
    },
    closeTask () {
      this.getNewTask = true
      this.$api.post('api/task/obtainSubTaskList', {
        id: 1 // 用户ID，从登陆获取
      },
      response => {
        if (response.status >= 200 && response.status < 300) {
          this.subTaskList = response.data.data
        } else {
          console.log(response.msg) // 请求失败，response为失败信息
        }
      })
    },
    getSubTask (id) {
      console.log(id)
      this.$api.post('api/task/obtainSubTask', {
        id: id
      },
      response => {
        if (response.status >= 200 && response.status < 300) {
          console.log(response.data.data)
          this.subTask = response.data.data.subTask
          this.getNewTask = false
        } else {
          console.log(response.msg) // 请求失败，response为失败信息
        }
      })
    },
    result () {
      let sendData = {}
      if (this.taskType === 0) {
        sendData.taskType = 0
        sendData.id = this.taskData.id
      } else {
        sendData.taskType = 1
        sendData.id = this.subTaskData.id
      }
      sendData.userId = localStorage.getItem('userId')
      sendData.handleTag = this.dealResult
      sendData.handleResult = this.contact
      return sendData
    },
    // 提交沟通结果
    submitTask () {
      this.$api.post('api/task/submitTask', this.result(),
        response => {
          if (response.status >= 200 && response.status < 300) {
            if (response.data.code === 500) {
              this.$message(response.data.msg)
            }
            if (response.data.code === 10001) {
              this.$message({
                message: '成功上报处理结果！',
                type: 'success'
              })
              this.closeTask()
            }
          } else {
            console.log(response.msg) // 请求失败，response为失败信息
          }
        })
    },
    submitGetTask () { // 提交并领取新任务
      this.$api.post('api/task/submitTask', this.result(),
        response => {
          if (response.data.code === 500) {
            this.$message(response.data.msg)
          }
          if (response.data.code === 10001) {
            this.$message({
              message: '成功上报处理结果！',
              type: 'success'
            })
            this.closeTask()
            this.getTask()
          }
        })
    }
  },
  created () {
    // 获取子任务列表
    this.$api.post('api/task/obtainSubTaskList', {
      id: localStorage.getItem('userId') // 用户ID，从登陆获取
    },
    response => {
      if (response.status >= 200 && response.status < 300) {
        this.subTaskList = response.data.data
        if (response.data.data.length > 0) {
          this.hasSubTask = true
        } else {
          this.hasSubTask = false
        }
      } else {
        console.log(response.msg) // 请求失败，response为失败信息
      }
    })
    // 获取未完成任务列表
    this.$api.post('api/task/obtainRecTask', {
      id: localStorage.getItem('userId') // 用户ID，从登陆获取
    },
    response => {
      if (response.status >= 200 && response.status < 300) {
        if (response.data.data) {
          this.getNewTask = false
          this.taskType = response.data.data.taskType
          this.taskData = response.data.data.task
          this.subTaskData = response.data.data.subTask
          this.taskTarget = response.data.data.taskTarget
          this.taskTargetTrack = response.data.data.taskTargetTrack
        }
      } else {
        console.log(response.msg) // 请求失败，response为失败信息
      }
    })
  }
}
</script>

<style scoped>
.container{
  box-sizing: border-box;
  background-color: #fafafa;
  height: 100%;
}
.card-body{
  max-height: 600px;
}
p{
  text-align: center;
}
.box-card img{
  display: inline-block;
  margin: 100px 0 50px 0;
}
li.sub-task-item{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
li.sub-task-item p{
  text-align: left;
}
div.cs-msg p{
  text-align: center;
  font-size: 32px;
}
div.cs-describe{
  display: flex;
  justify-content: space-around;
  margin: 20px;
}
div.cs-describe span{
  font-size: 20px;
}
.task-msg{
  width: 100%;
}
.task-msg td{
  border: 1px solid #ddd;
  width: 50%;
  padding: 5px;
}
.task-msg td:nth-child(even){
  color: #666;
}
.radio-content{
  display: flex;
  justify-content: space-around;
}
div.item-content p{
  margin-bottom: 10px;
  padding-left: 20px;
}
.active{
  color: #409EFF;
}
.btn-con{
  text-align: right;
}
.item-content p {
  text-align: left;
}
.sub-task-item span{
  color: #6f7180;
}
  .no-sub-task{
    text-align: center;
    color: #6f7180;
    font-size: 14px;
  }
</style>
