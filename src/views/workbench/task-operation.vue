<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">{{ taskDetail.flow_instance.flow_bpmn.flow.name }} - {{ taskDetail.name }}</h4>
    </div>
    <div class="app-content-container">
      <el-form :inline="true">
        <el-form-item label="工单标题">
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
import { flowableTaskAction } from '@/api/flowable-rest'

export default {
  data() {
    return {
      Title: '',
      task_uuid: '',
      taskDetail: ''
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
          console.log(this.taskDetail)
        }
      })
    },
    handleApprove() {
      const taskId = this.taskDetail.flowable_task_instance_id
      const data = { action: 'complete' }
      flowableTaskAction(taskId, data).then(resp => {
        console.log()
      })
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
