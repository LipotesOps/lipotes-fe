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
      <el-table-column label="工单编号" prop="num" sortable="true" align="center" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.flow_instance.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名称" prop="name" sortable="true" align="center" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工单标题" prop="flow_instance.name" sortable="true" align="center" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.flow_instance.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工单创建时间" prop="flow_instance.ctime" sortable="true" align="center" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.flow_instance.ctime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTask" />
  </div>
</template>

<script>
import { fetchTask } from '@/api/itsc-flow'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Todo',
  components: { Pagination },
  data() {
    return {
      list: [],
      tableKey: 0,
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
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
      fetchTask(this.listQuery)
        .then(resp => {
          if (resp.status === 200) {
            this.list = resp.data.results
            this.total = resp.data.count
          }
        })
        .finally(resp => {
          this.listLoading = false
        })
    },
    sortChange() {

    }
  }

}
</script>

<style>

</style>
