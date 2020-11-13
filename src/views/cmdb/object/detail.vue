<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">{{ objectId }}</h4>
    </div>
    <div class="app-content-container">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="object_schema"
        border
        fit
        highlight-current-row
        @sort-change="sortChange"
      >
        <el-table-column fixed label="配置名" prop="id" sortable="true" align="center" min-width="30">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="ID" prop="id" sortable="true" align="center" min-width="30">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="类型" prop="id" sortable="true" align="center" min-width="30">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="默认值" prop="id" sortable="true" align="center" min-width="30">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="必填" prop="id" sortable="true" align="center" min-width="30">
          <template slot-scope="{row}">
            <div v-if="row.required" class="col-select-icon-wrapper icon-select">
              <svg-icon icon-class="select" class-name="col-select-icon" />
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed label="唯一" prop="id" sortable="true" align="center" min-width="30">
          <template slot-scope="{row}">
            <div v-if="row.unique" class="col-select-icon-wrapper icon-select">
              <svg-icon icon-class="select" class-name="col-select-icon" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { fetchCmdbObjectDetail } from '@/api/resource'

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
            this.object_schema = this.$_.get(resp.data, 'object_schema', {})
          }
        })
    },
    handleUpdate() {},
    sortChange() {}
  }

}
</script>

<style lang="less" scoped>
.col-select-icon-wrapper {

  .col-select-icon {
    height: 15px;
    width: 15px;

    position: relative;
    overflow: hidden;
    color: white;
    background: green;
    border-radius: 8px;

    box-shadow: .809px .809px rgb(236, 226, 226), -.9px -.9px rgb(236, 226, 226);
    border-color: rgb(255, 0, 0);

  }
}

</style>

