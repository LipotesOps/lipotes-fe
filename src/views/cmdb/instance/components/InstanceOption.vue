<template>
  <div>
    <el-select v-model="valueOut" value-key="_id" class="filter-item" placeholder="Please select" multiple clearable @change="$emit('select-change', valueOut)">
      <el-option v-for="item in resourcInstance" :key="item.name" :label="item.name" :value="{'_id': item._id, '_version': item._version, 'name': item.name}" />
    </el-select>
  </div>
</template>

<script>
import { fetchResourceInstance } from '@/api/resource'

export default {
  model: {
    prop: 'valueIn',
    event: 'select-change'
  },
  props: {
    valueIn: {
      type: Array,
      default: function() {
        return []
      }
    },
    resourceId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      valueOut: this.valueIn,
      listQuery: {
        page: 1,
        sort: '_id'
      },
      resourcInstance: []
    }
  },
  computed: {
    // valueOut: {
    //   // getter
    //   get: function() {
    //     return this.valueIn
    //   }
    // setter
    // set: function(newValue) {
    //   console.log(newValue)
    // }
    // }
  },
  watch: {
    valueIn: function() {
      this.valueOut = this.valueIn
    }
  },
  created() {
    this.getResourceInstance()
  },
  methods: {
    getResourceInstance() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      fetchResourceInstance(this.listQuery, this.resourceId)
        .then(resp => {
          if (resp.status === 200) {
            this.resourcInstance = resp.data._items
          }
        })
        .finally(resp => {
          // Just to simulate the time of the request
          setTimeout(() => {
            loading.close()
          }, 1.5 * 200)
        })
    }
  }
}
</script>

<style scoped lang="less">
.filter-item{
  width: 100%;
}
/deep/ .el-tag.el-tag--info{
  background: rgba(171, 218, 212, 0.507)!important;
}
</style>
