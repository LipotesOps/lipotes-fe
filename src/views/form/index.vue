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
      :data="forms"
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
      <el-table-column label="表单名称" min-width="100">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="50" class-name="small-padding">
        <template slot-scope="{row}">
          <el-button :disabled="true" size="mini" type="success" @click="handleDeploy(row)">
            {{ row | statusFilter }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="所属流程" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag>
            {{ row | flowFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Rev." align="center" min-width="50">
        <template slot-scope="{row}">
          <span>{{ row | revFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="50">
        <template slot-scope="{row}">
          <router-link class="table-inline-router-link" :to="{name: 'form-design', params:{form_uuid: row.uuid}, query:{form_content: lodash.get(row, 'form_content.uuid', '')}}">查看/创建</router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getForm" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="rowTemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Name" prop="name">
          <el-input v-model="rowTemp.name" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="所属流程" prop="id">
          <el-select v-model="rowTemp.flow" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in flows" :key="item.id" :label="item.name" :value="item.uuid" />
          </el-select>
        </el-form-item>
        <el-form-item label="Rev." prop="id">
          <el-select v-model="rowTemp.form_content" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in formTagArray" :key="item.id" :label="item.tag" :value="item.uuid" />
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
import { fetchForm, fetchFormContent, fetchFlow, updateForm, createForm } from '@/api/itsc-flow'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
var _ = require('lodash')

const statusOptions = [
  { key: 'draft', display_name: '草稿' },
  { key: 'bound', display_name: '已绑定' },
  { key: 'del', display_name: '删除' }
]

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    flowFilter(row) {
      const name = _.get(row, 'flow.name', '未绑定')
      return name
    },
    statusFilter(row) {
      const status = _.get(row, 'form_content.status', '未绑定')
      return status
    },
    revFilter(row) {
      const rev = _.get(row, 'form_content.tag', '未绑定')
      return rev
    }
  },
  inject: ['reload'],
  data() {
    return {
      lodash: _,
      statusOptions,
      forms: [],
      formTagArray: [],
      flowCategoryOptions: [],
      tableKey: 0,
      flows: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      rowTemp: {
        id: undefined,
        uuid: '',
        name: '',
        form_content: '',
        flow: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getForm()
    this.getFlow()
  },
  methods: {
    getFormContent(query) {
      fetchFormContent(query)
        .then(resp => {
          if (resp.status === 200) {
            this.formTagArray = resp.data.results
          }
        })
    },
    getForm() {
      fetchForm(this.listQuery)
        .then(resp => {
          if (resp.status === 200) {
            this.forms = resp.data.results
            this.total = resp.data.count
          }
        })
        .finally(resp => {
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 200)
        })
    },
    getFlow() {
      fetchFlow({ limit: 100 })
        .then(resp => {
          this.flows = resp.data.results
        })
    },
    handleFilter() {},
    resetTemp() {
      this.rowTemp = {
        id: undefined,
        uuid: '',
        name: '',
        form_content: '',
        flow: ''
      }
    },
    handleDownload() {},
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      // get form_contents abouted
      const query = { form: row.uuid }
      this.getFormContent(query)
      this.rowTemp = Object.assign({}, row) // copy obj
      if (row.flow !== null) {
        this.rowTemp.flow = row.flow.uuid
      }
      if (row.form_content !== null) {
        this.rowTemp.form_content = row.form_content.uuid
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
          updateForm(id, tempData).then((response) => {
            const index = this.forms.findIndex(v => v.id === this.rowTemp.id)
            this.forms.splice(index, 1, this.rowTemp)
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.rowTemp)
          createForm(tempData).then((response) => {
            const index = this.forms.findIndex(v => v.id === this.rowTemp.id)
            this.forms.splice(index, 1, this.rowTemp)
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
    sortChange() {}
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

