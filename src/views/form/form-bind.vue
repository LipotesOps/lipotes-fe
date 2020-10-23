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
        <el-table-column label="任务名称" prop="taskName" sortable="true" align="center" min-width="50">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="表单名称" prop="formName" sortable="true" align="center" min-width="50">
          <template slot-scope="{row}">
            <span>{{ row | formNameFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Rev." prop="formTag" sortable="true" align="center" min-width="110">
          <template slot-scope="{row}">
            <span>{{ row | formTagFilter }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :rules="rules" :model="rowTemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <el-form-item label="名称" prop="name">
            <el-input v-model="rowTemp.name" disabled placeholder="Please select" />
          </el-form-item>
          <el-form-item label="表单" prop="form">
            <el-select v-model="rowTemp.form" class="filter-item" placeholder="Please select" clearable>
              <el-option v-for="item in formArray" :key="item.id" :label="item.name" :value="item.uuid" />
            </el-select>
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
import { fetchFlow, fetchTask, fetchForm, updateTask } from '@/api/itsc-flow'

export default {
  name: 'FormBind',
  inject: ['reload'],
  filters: {
    formNameFilter(row) {
      return window._.get(row, 'form.name', '未绑定')
    },
    formTagFilter(row) {
      return window._.get(row, 'form.form_content.tag', '未绑定')
    }
  },
  data() {
    return {
      formArray: [],
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
        bpmn: '',
        form: ''
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
    getForm(query = {}) {
      fetchForm(query)
        .then(resp => {
          if (resp.status === 200) {
            this.formArray = resp.data.results
          }
        })
    },
    getFlow() {
      const queryData = { uuid: this.flow_uuid }
      fetchFlow(queryData)
        .then(resp => {
          if (resp.status === 200) {
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
      // get forms abouted
      const query = { flow: row.uuid }
      this.getForm(query)
      this.rowTemp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.rowTemp)
          const flow_bpmn = tempData.flow_bpmn.uuid
          tempData.flow_bpmn = flow_bpmn
          const id = tempData.id
          updateTask(id, tempData).then((response) => {
            const index = this.tasks.findIndex(v => v.id === this.rowTemp.id)
            this.tasks.splice(index, 1, this.rowTemp)
            this.dialogFormVisible = false
            if (response.status === 200) {
              this.$notify({
                title: 'Success',
                message: '表单绑定成功',
                type: 'success',
                duration: 2000
              })
              this.reload()
            }
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
