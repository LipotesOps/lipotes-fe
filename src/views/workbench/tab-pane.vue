<template>
  <div>
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
      <el-table-column label="工单编号" prop="num" sortable="true" align="center" min-width="30px">
        <template slot-scope="{row}">
          <router-link class="table-inline-router-link" :to="{ name: 'task-operation', params: { task_uuid: row.uuid }}">{{ row.flow_instance.num }}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="工单标题" prop="flow_instance.name" sortable="true" align="center" min-width="30px">
        <template slot-scope="{row}">
          <span>{{ row.flow_instance.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前任务" prop="name" sortable="true" align="center" min-width="30px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指派人" prop="name" sortable="true" align="center" min-width="30px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="name" sortable="true" align="center" min-width="30px">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工单创建时间" prop="flow_instance.ctime" sortable="true" align="center">
        <template slot-scope="{row}">
          <span>{{ row.flow_instance.ctime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTask" />
  </div>
</template>

<script>
import { fetchTaskInstance } from '@/api/itsc-flow'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'TabPane',
  components: { Pagination },
  props: {
    status: {
      type: String,
      required: true,
      default: 'running'
    }
  },
  data() {
    return {
      list: [],
      tableKey: 0,
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        status: this.status,
        title: undefined,
        type: undefined,
        sort: '+id'
      }

    }
  },
  created() {
    this.getTask()
  },
  methods: {
    getTask() {
      this.listLoading = true
      fetchTaskInstance(this.listQuery)
        .then(resp => {
          if (resp.status === 200) {
            this.list = resp.data.results
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
    sortChange() {

    }
  }

}
</script>

<style>

</style>
