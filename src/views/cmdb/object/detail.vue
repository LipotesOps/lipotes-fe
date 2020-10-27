<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">详情 - {{ objectId }}</h4>
    </div>
    <div class="app-content-container">
      <p>属性</p>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="object_schema"
        border
        fit
        highlight-current-row
        @sort-change="sortChange"
      >
        <el-table-column label="属性名称" min-width="150">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.name.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性ID" min-width="150">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.name.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="值类型" min-width="150">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.name.type }}</span>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
import { fetchCmdbObjectDetail } from '@/api/micro-cmdb'

export default {
  data() {
    return {
      listLoading: false,
      tableKey: 0,
      objectId: this.$route.params.object_id,
      object_schema: []
    }
  },
  created() {
    this.getObjectDetail()
  },
  methods: {
    getObjectDetail() {
      const params = {}
      fetchCmdbObjectDetail(params, this.objectId)
        .then(resp => {
          if (resp.status === 200) {
            const schema = this.$_.get(resp.data, 'object_schema', {})
            this.object_schema.push(schema)
          }
        })
    },
    handleUpdate() {},
    sortChange() {}
  }

}
</script>

<style>

</style>
