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
  </div>
</template>

<script>
import { fetchTask } from '@/api/itsc-flow'

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
    }
  }

}
</script>

<style>

</style>
