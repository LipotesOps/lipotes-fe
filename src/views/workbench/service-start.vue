<template>
  <div class="app-container">
    <div class="service-container" style="margin: 0px; padding: 10px; background-color:White; border-radius: 8px">
      <el-form :inline="true">
        <el-form-item label="工单标题">
          <el-input v-model="Title" required="true" />
        </el-form-item>
      </el-form>
    </div>
    <div class="service-btn-area">
      <el-button type="info" :plain="true" icon="fa-undo" @click="$router.go(-1)">返回</el-button>
      <el-button type="success" icon="check" :loading="committing" class="save-btn" @click="startProcessInstancePromise">提交<i class="el-icon-upload el-icon--right" /></el-button>
    </div>
  </div>
</template>

<script>
import { apiStartProcessInstance } from '@/api/flowable-rest'
import { fetchBpmn, createFlowInst, createTaskInst } from '@/api/itsc-flow'
import uuid from '@/utils/guid'

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
    this.bpmn_uid = this.$route.params.bpmn_uid
    this.getBpmnInfo()
  },
  methods: {
    startProcessInstancePromise() {
      return new Promise((resolve, reject) => {
        const data = {
          'processDefinitionId': this.flowableProcessDefinitionId
        }
        // 启动一个flowable流程实例
        apiStartProcessInstance(data).then(resp => {
          if (resp.status === 201) {
            resolve(resp.data)
          } else { reject(resp.err || 'flowable-rest error') }
        })
      }).then(this.createFlowInstance, () => {
        console.log('failure')
      }).then(this.queryTaskInstance
      ).then(this.createTaskInst
      ).catch((err) => {
        console.log(err || 'promise error')
      })
    },
    createFlowInstance(flowableProcessInstanceData) {
      return new Promise((resolve, reject) => {
        const data = {
          uid: uuid(),
          bpmn_uid: flowableProcessInstanceData.id,
          start_time: flowableProcessInstanceData.startTime,
          start_user_id: 'easyops'
        }
        createFlowInst(data).then(resp => {
          console.log()
          if (resp.status === 201) {
            resolve(data)
            this.$router.go(-1)
          } else {
            reject()
          }
        })
      }).then()
    },
    createTaskInstance() {
      const data = {}
      createTaskInst(data)
    },
    queryTaskInstance() {},
    getBpmnInfo() {
      const query = {
        bpmn_uid: this.bpmn_uid
      }
      fetchBpmn(query).then(resp => {
        if (resp.status === 200) {
          console.log()
          const flowable_process_definition_id = resp.data[0].flowable_id
          this.flowableProcessDefinitionId = flowable_process_definition_id
          return
        }
      })
    },
    startProcessInstance() {
      const data = {
        'processDefinitionId': this.flowableProcessDefinitionId
      }
      apiStartProcessInstance(data).then(resp => {
        if (resp.status === 201) {
          console.log('201')
          const data = {
            uid: uuid(),
            bpmn_uid: resp.data.id,
            start_time: resp.data.startTime,
            start_user_id: 'easyops'
          }
          createFlowInst(data).then(resp => {
            console.log()
            if (resp.status === 201) {
              this.$router.go(-1)
            }
          })
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
