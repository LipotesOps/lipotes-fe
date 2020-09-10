<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in flowCategoryOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="flows"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="true" align="center" min-width="110">
        <template slot-scope="{row}">
          <span>{{ row.uuid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程名称" min-width="100">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" min-width="50" class-name="small-padding">
        <template slot-scope="{row}">
          <el-button :disabled="row | isDeployedFilter" size="mini" type="success" @click="handleDeploy(row)">
            <!-- {{ (row.bpmn ? ((row.bpmn.status==='deployed')? false:true): false) ?'Deploy' : 'Deployed' }} -->
            {{ row | isDeployedTextFilter }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" min-width="50">
        <template slot-scope="{row}">
          <el-tag>{{ row.category | categoryFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Rev." align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row.bpmn | bpmnFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="BPMN" width="110px" align="center">
        <template slot-scope="{row}">
          <router-link :to="'/flow-manage/flow/edit?id='+row.id+'&uuid='+row.uuid+'&name='+row.name">查看/创建</router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getFlow" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="rowTemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Name" prop="name">
          <el-input v-model="rowTemp.name" placeholder="Please select" />
        </el-form-item>
        <el-form-item label="Category" prop="id">
          <el-select v-model="rowTemp.category" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in flowCategoryOptions" :key="item.id" :label="item.name" :value="item.uuid" />
          </el-select>
        </el-form-item>
        <el-form-item label="BPMN" prop="id">
          <el-select v-model="rowTemp.bpmn" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in bpmnTagArray" :key="item.id" :label="item.tag" :value="item.uuid" />
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
</template>

<script>
import { fetchFlow, updateFlow, createFlow, fetchCategory, fetchBpmn, updateBpmn } from '@/api/itsc-flow'
import { createDeployment, listProcessDefinitions } from '@/api/flowable-rest'
import uuid from '@/utils/guid'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'FlowList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    categoryFilter(category) {
      if (category) {
        return category.name
      }
      return '未分类'
    },
    bpmnFilter(bpmn) {
      if (bpmn) {
        return bpmn.tag
      }
      return '未绑定'
    },
    isDeployedFilter(row) {
      if (row.bpmn !== null) {
        if (row.bpmn.status === 'deployed') {
          return true
        }
      }
      if (row.bpmn === null) {
        return true
      }
      return false
    },
    isDeployedTextFilter(row) {
      if (row.bpmn !== null) {
        if (row.bpmn.status === 'deployed') {
          return 'Deployed'
        }
      }
      if (row.bpmn === null) {
        return 'No Bpmn'
      }
      return 'Deploy'
    }

  },
  inject: ['reload'],
  data() {
    return {
      bpmnTagArray: [],
      flowCategoryOptions: [],
      tableKey: 0,
      flows: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      rowTemp: {
        id: undefined,
        uuid: '',
        name: '',
        category: '',
        bpmn: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
  },
  created() {
    this.getFlow()
    this.getCategory()
  },
  methods: {
    getCategory() {
      const queryData = {}
      fetchCategory(queryData).then(
        response => {
          if (response.status === 200) {
            this.flowCategoryOptions = response.data.results
          }
        }
      )
    },
    getBpmn(queryData = {}) {
      this.bpmnTagArray = []
      fetchBpmn(queryData).then(
        response => {
          if (response.status === 200) {
            this.bpmnTagArray = response.data.results
          }
        }
      )
    },
    getFlow() {
      this.listLoading = true
      fetchFlow(this.listQuery).then(response => {
        this.flows = response.data.results
        this.total = response.data.count

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getFlow()
    },
    handleDeploy(row) {
      this.rowTemporary = row
      this.constructBpmnFile(row)
        // 部署
        .then(this.makeDeployment)
        // get flowable definition
        .then(this.getFlowableProcessDefinition)
        // sync flowable definition
        .then(this.syncProcessDefinition)
    },
    constructBpmnFile(row) {
      return new Promise((resolve, reject) => {
        // 构建bpmnFile
        const filename = `${row.name}.bpmn20.xml`
        const content = row.bpmn.content
        const deployData = new FormData()
        // 1.先将字符串转换成Buffer
        const fileContent = Buffer.from(content)
        var blob = new Blob([fileContent], { type: 'text/xml' })
        var file = new window.File([blob], filename, { type: 'text/xml' })
        // 2.补上文件meta信息
        deployData.append('file', file)
        resolve(deployData)
      })
    },
    makeDeployment(deployData) {
      return new Promise((resolve, reject) => {
        createDeployment(deployData).then(
          resp => {
            if (resp.status === 201) {
              this.$message({
                message: 'flowable deploy success',
                type: 'success'
              })
              resolve(resp.data)
            }
          }
        )
      })
    },
    getFlowableProcessDefinition(deploymentData) {
      return new Promise((resolve, reject) => {
        const deploymentId = deploymentData.id
        const query = { deploymentId: deploymentId }
        listProcessDefinitions(query).then(resp => {
          if (resp.status === 200) {
            const definitionInfo = resp.data.data[0]
            resolve(definitionInfo)
          }
        })
      })
    },
    syncProcessDefinition(definitionInfo) {
      console.log(this.rowTemporary)
      const bpmnObject = this.rowTemporary.bpmn
      const id = bpmnObject.id
      bpmnObject.flowable_process_definition_id = definitionInfo.id
      updateBpmn(id, bpmnObject).then(resp => {
        if (resp.status === 200) {
          console.log(resp)
        }
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.rowTemp = {
        id: undefined,
        uuid: '',
        name: '',
        category: '',
        bpmn: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.rowTemp.uuid = uuid()
          const tempData = Object.assign({}, this.rowTemp)
          createFlow(tempData).then((response) => {
            const index = this.flows.findIndex(v => v.id === this.rowTemp.id)
            this.flows.splice(index, 1, this.rowTemp)
            this.dialogFormVisible = false
            if (response.status === 201) {
              this.$notify({
                title: 'Success',
                message: 'Create Successfully',
                type: 'success',
                duration: 2000
              })
              this.reload()
            }
          })
        }
      })
    },
    handleUpdate(row) {
      // get bpmns abouted
      const query = { flow: row.uuid }
      this.getBpmn(query)
      this.rowTemp = Object.assign({}, row) // copy obj
      if (row.category !== null) {
        this.rowTemp.category = row.category.uuid
      }
      if (row.bpmn !== null) {
        this.rowTemp.bpmn = row.bpmn.uuid
      }
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
          const id = tempData.id
          updateFlow(id, tempData).then((response) => {
            const index = this.flows.findIndex(v => v.id === this.rowTemp.id)
            this.flows.splice(index, 1, this.rowTemp)
            this.dialogFormVisible = false
            if (response.status === 200) {
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
              this.reload()
            }
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-flows'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.flows.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
