<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">{{ flow.name }} - 表单绑定</h4>
    </div>
    <div class="app-content-container">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="tasks"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column label="任务名称" prop="name" sortable="true" align="center" min-width="50">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="表单名称" prop="name" sortable="true" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Rev." prop="name" sortable="true" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :rules="rules" :model="rowTemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <el-form-item label="Name" prop="name">
            <el-input v-model="rowTemp.name" placeholder="Please select" />
          </el-form-item>
          <el-form-item label="Remark">
            <el-input v-model="rowTemp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            Cancel
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            Confirm
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetchFlow, fetchTask } from '@/api/itsc-flow'

export default {
  name: 'FormBind',
  inject: ['reload'],
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      tableKey: 0,
      listLoading: true,
      flow_uuid: '',
      bpmn_uuid: '',
      flow: {},
      tasks: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      rowTemp: {
        id: undefined,
        uuid: '',
        name: '',
        category: '',
        bpmn: ''
      }
    }
  },
  created() {
    this.flow_uuid = this.$route.params.flow_uuid
    this.bpmn_uuid = this.$route.params.bpmn_uuid
    this.getFlow()
    this.getTask()
  },
  methods: {
    sortChange() {},
    getFlow() {
      const queryData = { uuid: this.flow_uuid }
      fetchFlow(queryData)
        .then(resp => {
          if (resp.status === 200) {
            console.log('dd')
            this.flow = resp.data.results[0]
          }
        })
        .finally(resp => {
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 200)
        })
    },
    getTask() {
      const queryData = { flow_bpmn: this.bpmn_uuid }
      fetchTask(queryData)
        .then(resp => {
          if (resp.status === 200) {
            this.tasks = resp.data.results
          }
        })
    },
    handleUpdate(row) {
      this.rowTemp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>

<style>

</style>
