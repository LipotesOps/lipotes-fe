<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">详情 - {{ objectId }}</h4>
    </div>
    <div class="app-content-container">
      <p>属性</p>
      {{ object_schema }}

    </div>
  </div>
</template>

<script>
import { fetchCmdbObjectDetail } from '@/api/micro-cmdb'

export default {
  data() {
    return {
      objectId: this.$route.params.object_id,
      object_schema: {
        'name': { 'type': 'string' }
      }
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
            this.object_schema = this.$_.get(resp.data, 'object_schema', this.object_schema)
          }
        })
    }
  }

}
</script>

<style>

</style>
