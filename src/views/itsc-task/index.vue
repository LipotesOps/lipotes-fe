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
      <el-table-column label="ID" prop="id" sortable="true" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程名称" min-width="150px">
        <template slot-scope="{row}">
          <el-tag>{{ row.status | typeFilter }}</el-tag>
          <span class="link-type" @click="handleUpdate(row)">{{ row.uniq_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="success" @click="handleLaunch(row)">
            Launch
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.category | categoryFilter(flowCategoryKV) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="版本" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.online_bpmn_key | versionFilter(bpmnVersionKeyValue) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="BPMN" width="110px" align="center">
        <template slot-scope="{row}">
          <el-link :href="'/#/flow-manage/flow/edit?bpmn_uniq_key='+row.online_bpmn_key+'&flow_uniq_key='+row.uniq_key" type="primary">查看/创建</el-link>
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
        <el-form-item label="Name" prop="uniq_name">
          <el-input v-model="temp.uniq_name" placeholder="Please select" />
        </el-form-item>
        <el-form-item label="Category" prop="category">
          <el-select v-model="temp.category" class="filter-item" placeholder="Please select">
            <el-option v-for="item in flowCategoryOptions" :key="item.uniq_key" :label="item.annotation" :value="item.uniq_key" />
          </el-select>
        </el-form-item>
        <el-form-item label="BPMN" prop="online_bpmn_key">
          <el-select v-model="temp.online_bpmn_key" class="filter-item" placeholder="Please select">
            <el-option v-for="item in versionOption" :key="item.uniq_key" :label="item.version" :value="item.uniq_key" />
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
import { updateFlow, createFlow, fetchCategory, fetchBpmn } from '@/api/itsc-flow'
import { startProcessInstance } from '@/api/flowable-rest'
import { fetchServices } from '@/api/itsc-service'
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
    typeFilter(category) {
      return flowStatusKeyValue[category]
    },
    categoryFilter(type, flowCategoryKeyValue) {
      return flowCategoryKeyValue[type]
    },
    versionFilter(uniq_key, bpmnVersionKeyValue) {
      return bpmnVersionKeyValue[uniq_key]
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
        uniq_key: '',
        uniq_name: '',
        category: '',
        online_bpmn_key: '',
        status: ''
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
              acc[cur.uniq_key] = cur.annotation
              return acc
            },
            {})
          }
        }
      )
    },
    getBpmn() {
      const queryData = {}
      fetchBpmn(queryData).then(
        response => {
          if (response.status === 200) {
            this.bpmnVersionOptions = response.data
            this.bpmnVersionKeyValue = this.bpmnVersionOptions.reduce((acc, cur) => {
              acc[cur.uniq_key] = cur.version
              return acc
            },
            {})
          }
        }
      )
    },
    versionOptionFilter(uniq_key) {
      var versionOption = []
      for (const i of this.bpmnVersionOptions) {
        if (i.flow_uniq_key === uniq_key || i.flow_uniq_key === '') {
          versionOption.push(i)
        }
      }
      return versionOption
    },
    getList() {
      this.listLoading = true
      fetchServices(this.listQuery).then(response => {
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
    handleLaunch(row) {
      const bpmnData = {
        bpmn_uniq_key: row.online_bpmn_key
      }
      fetchBpmn(bpmnData).then(
        response => {
          if (response.status === 200) {
            const launchData = { processDefinitionKey: row.uniq_key }

            startProcessInstance(launchData).then(
              resp => {
                if (resp.status === 201) {
                  console.log(resp)
                  this.$message({
                    message: 'launch success',
                    type: 'success'
                  })
                }
              }
            )
          }
        }
      )
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
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
        uniq_key: '',
        uniq_name: '',
        category: '',
        online_bpmn_key: '',
        status: ''
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
          this.temp.uniq_key = uuid()
          this.temp.online_bpmn_key = 'first'
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
      this.versionOption = Object.assign([], this.versionOptionFilter(row.uniq_key))
      // this.versionOption = this.versionOptionFilter(row.uniq_key)
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
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
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
