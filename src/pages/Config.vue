<template>
  <div class="container">
    <el-row>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearFix">
            <span>配置项</span>
          </div>
          <div class="text card-body">
            <el-form ref="form" :model="form" label-width="120px">
              <el-form-item
                label="任务订单周期"
                prop="taskOrderDuration"
                :rules="[
                  { required: true, message: '不能为空'},
                  { type: 'number', message: '必须为数字'}
                ]">
                <el-input type="age" v-model.number="form.taskOrderDuration" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="目标追踪周期"
                prop="targetTrackDuration"
                :rules="[
                  { required: true, message: '不能为空'},
                  { type: 'number', message: '必须为数字'}
                ]">
                <el-input type="age" v-model.number="form.targetTrackDuration" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="退款追踪周期"
                prop="refundTrackDuration"
                :rules="[
                  { required: true, message: '不能为空'},
                  { type: 'number', message: '必须为数字'}
                ]">
                <el-input type="age" v-model.number="form.refundTrackDuration" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item class="btn-con">
                <el-button type="primary" @click="onSubmit">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Config',
  data () {
    return {
      form: {
        id: 1,
        taskOrderDuration: 0,
        targetTrackDuration: 0,
        refundTrackDuration: 0
      }
    }
  },
  methods: {
    onSubmit () {
      this.$api.post('api/task/taskConf', this.form,
        response => {
          if (response.status >= 200 && response.status < 300) {
            console.log(response)
            if (response.data.code === 10001) {
              this.$message({
                message: '提交配置成功！',
                type: 'success'
              })
            }
          } else {
            console.log(response.msg) // 请求失败。
          }
        })
    }
  },
  created () {
    this.$api.post('api/task/obtainTaskConf', '',
      response => {
        if (response.status >= 200 && response.status < 300) {
          this.form.taskOrderDuration = response.data.data.taskOrderDuration
          this.form.targetTrackDuration = response.data.data.targetTrackDuration
          this.form.refundTrackDuration = response.data.data.refundTrackDuration
        } else {
          console.log(response.msg) // 请求失败，response是失败信息
        }
      })
  }
}
</script>

<style scoped>
.container{
  box-sizing: border-box;
  background-color: #fafafa;
}
.btn-con{
  text-align: right;
}
</style>
