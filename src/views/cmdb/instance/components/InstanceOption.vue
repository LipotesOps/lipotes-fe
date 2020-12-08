<template>
  <div>
    <el-select v-model="value" value-key="_id" class="filter-item" placeholder="Please select" clearable>
      <el-option v-for="item in instanceOption" :key="item.name" :label="item.name" :value="{'_id': item._id, '_version': item._version, 'name': item.name}" />
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: function() {
        return { }
      }
    }
  },
  data() {
    return {
      instanceOption: [
        {
          name: '航天',
          _id: '2020',
          _verson: 1
        }
      ]
    }
  }
}
</script>

<style>

</style>
