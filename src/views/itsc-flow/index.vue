<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in flowStatusOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
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
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="true" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.uuid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程名称" min-width="150px">
        <template slot-scope="{row}">
          <el-tag>{{ row.status | typeFilter }}</el-tag>
          <span class="link-type" @click="handleUpdate(row)">{{ row.uname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="success" @click="handleDeploy(row)">
            Deploy
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.category_id | categoryFilter(flowCategoryKV) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="版本" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id | versionFilter(bpmnVersionKeyValue) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="BPMN" width="110px" align="center">
        <template slot-scope="{row}">
          <router-link :to="'/flow-manage/flow/edit?id='+row.id+'&flow_uid='+row.id+'&uname='+row.uname">查看/创建</router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Status" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in flowStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Name" prop="uname">
          <el-input v-model="temp.uname" placeholder="Please select" />
        </el-form-item>
        <el-form-item label="Category" prop="category_id">
          <el-select v-model="temp.category_id" class="filter-item" placeholder="Please select">
            <el-option v-for="item in flowCategoryOptions" :key="item.uuid" :label="item.uname" :value="item.uuid" />
          </el-select>
        </el-form-item>
        <el-form-item label="BPMN" prop="id">
          <el-select v-model="temp.version_id" class="filter-item" placeholder="Please select">
            <el-option v-for="item in versionOption" :key="item.id" :label="item.version" :value="item.uuid" />
          </el-select>
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
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
import { fetchFlows, updateFlow, createFlow, fetchCategory, fetchBpmn, updateBpmn } from '@/api/itsc-flow'
import { createDeployment, apiGetProcessDefinitions } from '@/api/flowable-rest'
import uuid from '@/utils/guid'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const flowStatusOptions = [
  { key: 'draft', display_name: '草稿' },
  { key: 'online', display_name: '上线' },
  { key: 'offline', display_name: '下线' },
  { key: 'del', display_name: '删除' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const flowStatusKeyValue = flowStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
},
{})

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
    typeFilter(category_id) {
      return flowStatusKeyValue[category_id]
    },
    categoryFilter(type, flowCategoryKeyValue) {
      return flowCategoryKeyValue[type]
    },
    versionFilter(id, bpmnVersionKeyValue) {
      return bpmnVersionKeyValue[id]
    }
  },
  data() {
    return {
      versionOption: [],
      bpmnVersionKeyValue: {},
      bpmnVersionOptions: [],
      flowCategoryKeyValue: {},
      flowCategoryOptions: [],
      tableKey: 0,
      list: null,
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
      flowStatusOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        uuid: '',
        uname: '',
        category_id: '',
        status: '',
        version_id: ''
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
    flowCategoryKV: function() {
      return this.flowCategoryKeyValue
    }
  },
  created() {
    this.getBpmn()
    this.getCategory()
    this.getList()
  },
  methods: {
    getCategory() {
      const queryData = {}
      fetchCategory(queryData).then(
        response => {
          if (response.status === 200) {
            this.flowCategoryOptions = response.data
            this.flowCategoryKeyValue = this.flowCategoryOptions.reduce((acc, cur) => {
              acc[cur.uuid] = cur.uname
              return acc
            },
            {})
          }
        }
      )
    },
    getBpmn(queryData = {}) {
      fetchBpmn(queryData).then(
        response => {
          if (response.status === 200) {
            this.bpmnVersionOptions = response.data
            this.bpmnVersionKeyValue = this.bpmnVersionOptions.reduce((acc, cur) => {
              acc[cur.id] = cur.version
              return acc
            },
            {})
          }
        }
      )
    },
    versionOptionFilter(id) {
      var versionOption = []
      for (const i of this.bpmnVersionOptions) {
        if (i.id === id || i.flow_definition_id === '' || i.flow_definition_id === null) {
          versionOption.push(i)
        }
      }
      return versionOption
    },
    getList() {
      this.listLoading = true
      fetchFlows(this.listQuery).then(response => {
        this.list = response.data.results
        this.total = response.data.count

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDeploy(row) {
      const deployData = {}
      createDeployment(deployData)
        // 部署成功
        .then()
        // sync deployment
        .then()
        // sync definition
        .then()
    },
    getOneBpmn(params) {
      return new Promise((resolve, reject) => {
        fetchBpmn(params).then(resp => {
          if (resp.status === 200) {
            resolve(resp.data)
          }
        })
      })
    },
    handleDeploy_(row) {
      const params = {
        id: row.id
      }
      fetchBpmn(params).then(
        response => {
          if (response.status === 200) {
            this.bpmn_object = response.data[0]
            const bpmn_id = response.data[0].id
            const bpmn_content = response.data[0].content
            const filename = `${row.uname}.bpmn20.xml`
            const deployData = new FormData()
            // 1.先将字符串转换成Buffer
            const fileContent = Buffer.from(bpmn_content)
            var blob = new Blob([fileContent], { type: 'text/xml' })
            var file = new window.File([blob], filename, { type: 'text/xml' })
            // 2.补上文件meta信息
            deployData.append('file', file)
            createDeployment(deployData).then(
              resp => {
                if (resp.status === 201) {
                  const deploymentId = resp.data.id
                  this.getProcessDefinitionId(bpmn_id, deploymentId)
                  this.$message({
                    message: 'flowable deploy success',
                    type: 'success'
                  })
                }
              }
            )
          }
        }
      )
    },
    getProcessDefinitionId(bpmn_id, deploymentId) {
      const queryData = {
        deploymentId: deploymentId
      }
      apiGetProcessDefinitions(queryData).then(resp => {
        if (resp.status === 200) {
          const definitionId = resp.data.data[0].id
          const flowable_id = this.bpmn_object['flowable_id']
          if (!(flowable_id === '' || flowable_id === null)) {
            this.$message({
              message: 'already deployed',
              type: 'warning'
            })
            return
          }
          this.bpmn_object['flowable_id'] = definitionId
          updateBpmn(bpmn_id, this.bpmn_object).then(resp => {
            if (resp.status === 200) {
              this.$message({
                message: 'update bpmn flowable_id success',
                type: 'success'
              })
            }
          })
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
      this.temp = {
        id: undefined,
        uuid: '',
        uname: '',
        category_id: '',
        status: '',
        version_id: ''
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
          this.temp.uuid = uuid()
          const tempData = Object.assign({}, this.temp)
          createFlow(tempData).then((response) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            if (response.status === 200) {
              this.$notify({
                title: 'Success',
                message: 'Create Successfully',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.versionOption = Object.assign([], this.versionOptionFilter(row.id))
      // this.versionOption = this.versionOptionFilter(row.id)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          const id = tempData.id
          updateFlow(id, tempData).then((response) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            if (response.status === 200) {
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
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
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
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
