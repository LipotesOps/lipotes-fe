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
    </div>
  </div>
</template>

<script>
import { fetchFlow, fetchTask } from '@/api/itsc-flow'

export default {
  name: 'FormBind',
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      flow_uuid: '',
      bpmn_uuid: '',
      flow: {},
      tasks: []
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
    }
  }
}
</script>

<style>

</style>
