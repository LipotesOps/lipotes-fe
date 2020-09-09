<template>
  <div class="app-container">
    <div class="app-content-container">
      <el-form :inline="true">
        <el-form-item label="工单标题">
          <el-input v-model="Title" required="true" />
        </el-form-item>
      </el-form>
    </div>
    <div class="service-btn-area">
      <el-button type="info" :plain="true" icon="fa-undo" @click="$router.go(-1)">返回</el-button>
      <el-button type="success" icon="check" :loading="committing" class="save-btn" @click="handleStart">提交<i class="el-icon-upload el-icon--right" /></el-button>
    </div>
  </div>
</template>

<script>
import { startFlowableProcessInstance, queryFlowableTask } from '@/api/flowable-rest'
import { fetchFlow, createFlowInst, createTaskInst } from '@/api/itsc-flow'
// import uuid from '@/utils/guid'

export default {
  name: 'Workbench',
  data() {
    return {
      Title: '',
      flowableProcessDefinitionId: '',
      committing: false
    }
  },
  created() {
    this.flow_uuid = this.$route.params.flow_uuid
    this.getBpmnInfo()
  },
  methods: {
    handleStart() {
      // step1
      this.startFlowableProcessInstance()
        // step2
        .then(this.createFlowInstance)
        // step3
        .then(this.queryTaskInstance)
        // step4
        .then(this.createTaskInstance)
        .then(this.onSuccess)
        .catch((err) => {
          console.log(err || 'promise error')
        })
    },
    startFlowableProcessInstance() {
      return new Promise((resolve, reject) => {
        const data = {
          'processDefinitionId': this.flowableProcessDefinitionId
        }
        // 启动一个flowable流程实例
        startFlowableProcessInstance(data).then(resp => {
          if (resp.status === 201) {
            resolve(resp.data)
          } else { reject(resp.err || 'flowable-rest error') }
        })
      })
    },
    createFlowInstance(flowableProcessInstanceData) {
      return new Promise((resolve, reject) => {
        const data = {
          // flowable instacne id
          flowable_process_instance_id: flowableProcessInstanceData.id,
          start_time: flowableProcessInstanceData.startTime,
          start_user_id: 'easyops'
        }
        createFlowInst(data).then(resp => {
          console.log()
          if (resp.status === 201) {
            resolve(data)
          } else {
            reject()
          }
        })
      })
    },
    queryTaskInstance(flowInstanceData) {
      return new Promise((resolve, reject) => {
        const flowableInstanceId = flowInstanceData.flowable_process_instance_id
        const data = {
          'processInstanceId': flowableInstanceId
        }
        queryFlowableTask(data).then(resp => {
          if (resp.status === 200) {
            resolve(resp.data)
          }
        })
      })
    },
    createTaskInstance(flowableTaskInstanceData) {
      console.log(flowableTaskInstanceData)
      const { id, taskDefinitionKey, name, createTime } = flowableTaskInstanceData.data[0]
      const data = {
        flowable_task_instance_id: id,
        task_definition_key: taskDefinitionKey,
        name: name,
        flowable_created_time: createTime
      }
      createTaskInst(data).then(resp => {
        if (resp.status === 200) {
          console.log('success')
        }
      })
    },
    onSuccess() {
      this.$router.go(-1)
    },
    getBpmnInfo() {
      const query = {
        uuid: this.flow_uuid
      }
      fetchFlow(query).then(resp => {
        if (resp.status === 200) {
          this.flowableProcessDefinitionId = resp.data.results[0].bpmn.flowable_process_definition_id
        }
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
