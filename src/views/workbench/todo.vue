<template>
  <div>
    <el-table>
      <el-table-column label="编号" prop="num" sortable="true" align="center" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.num }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Todo'

}
</script>

<style>

</style>
