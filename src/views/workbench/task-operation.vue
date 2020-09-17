<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">{{ taskDetail | flowNameFilter }} - {{ taskDetail.name }}</h4>
    </div>
    <div class="app-content-container">
      <el-form :inline="true">
        <el-form-item label="表单">
          <el-input v-model="Title" required="true" />
        </el-form-item>
      </el-form>
    </div>
    <div class="service-btn-area">
      <el-button type="info" :plain="true" icon="fa-undo" @click="$router.go(-1)">返回</el-button>
      <el-button type="success" icon="check" :loading="committing" class="save-btn" @click="handleApprove">通过<i class="el-icon-upload el-icon--right" /></el-button>
    </div>
  </div>
</template>

<script>
import { fetchTask } from '@/api/itsc-flow'
import { completeTask } from '@/api/itsc-flow'
import waves from '@/directive/waves' // waves directive
var _ = require('lodash')

export default {
  directives: { waves },
  filters: {
    flowNameFilter(taskDetail) {
      const flowName = _.get(taskDetail, 'flow_instance.flow_bpmn.flow.name', '未获取到流程定义名称')
      return flowName
    }
  },
  data() {
    return {
      Title: '',
      task_uuid: '',
      taskDetail: '',
      committing: false
    }
  },
  created() {
    this.task_uuid = this.$route.params.task_uuid
    this.getTaskDetail()
  },
  methods: {
    getTaskDetail() {
      const query = { uuid: this.task_uuid }
      fetchTask(query).then(resp => {
        if (resp.status === 200) {
          this.taskDetail = resp.data.results[0]
          console.log()
        }
      })
    },
    handleApprove() {
      const taskId = this.taskDetail.flowable_task_instance_id
      const data = { action: 'complete' }
      completeTask(taskId, data).then(resp => {
        if (resp.status === 200) {
          this.onSuccess()
        }
      })
    },
    onSuccess() {
      this.$router.go(-1)
    }
  }

}
</script>

<style lang="less" scoped>
.service-btn-area {
  margin-top: 15px;
  // padding: 10px;
  // background-color: white;
  border-radius: 8px;
  // position: absolute;
  // top: 200px;
  // right: 20px;
  text-align: right;
}
.el-button {
  align-content: right;
}
</style>
