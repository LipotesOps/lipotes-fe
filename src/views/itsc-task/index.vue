<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in flowStatusOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
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
      <el-table-column label="ID" prop="uid" sortable="true" align="center" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.uuid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节点名称" min-width="100px">
        <template slot-scope="{row}">
          <el-tag>{{ row.name }}</el-tag>
          <span class="link-type" @click="handleUpdate(row)">{{ row.uniq_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="200" class-name="small-padding">
        <template slot-scope="{row}">
          <el-button size="mini" type="success" @click="handleAudit(row)">
            审批
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.category | categoryFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="流程版本" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.online_bpmn_key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="BPMN" width="110px" align="center">
        <template slot-scope="{row}">
          <el-link :href="'/#/flow-manage/flow/edit?bpmn_uniq_key='+row.online_bpmn_key+'&flow_uniq_key='+row.uniq_key" type="primary">查看</el-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTask" />

  </div>
</template>

<script>
import { fetchTask } from '@/api/itsc-flow'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const flowStatusOptions = [
  { key: 'draft', display_name: '草稿' },
  { key: 'online', display_name: '上线' },
  { key: 'offline', display_name: '下线' },
  { key: 'del', display_name: '删除' }
]

export default {
  name: 'TaskList',
  components: { Pagination },
  directives: { waves },
  filters: {
    categoryFilter(type) {
      return type
    }
  },
  data() {
    return {
      bpmnVersionKeyValue: {},
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
    this.getTask()
  },
  methods: {
    getTask() {
      this.listLoading = true
      fetchTask({}).then(response => {
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
      this.getTask()
    },
    handleAudit(row) {
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
