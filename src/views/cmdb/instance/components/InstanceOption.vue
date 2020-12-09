<template>
  <div>
    <el-select v-model="valueInstance" value-key="_id" class="filter-item" placeholder="Please select" multiple clearable @change="$emit('select-change', valueInstance)">
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
      valueInstance: this.valueIn,
      listQuery: {
        page: 1,
        sort: '_id'
      },
      resourcInstance: []
    }
  },
  computed: {
    // valueInstance: {
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
      this.valueInstance = this.valueIn
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

<style>

</style>
