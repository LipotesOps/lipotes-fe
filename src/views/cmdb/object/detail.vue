<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">资源详情</h4>
    </div>
    <div class="app-content-container">
      <el-row>
        京津冀
      </el-row>
    </div>
  </div>
</template>

<script>
import { fetchCmdbObject } from '@/api/micro-cmdb'

export default {
  data: function() {
    return {
      objectList: { _id: 'ddd', name: '主机', objecId: 'HOST', to: 'production_application', icon: 'el-icon-wind-power', style: 'background: rgb(30, 30, 30)' }
    }
  },
  created() {
    this.getObjectList()
  },
  methods: {
    getObjectList() {
      fetchCmdbObject()
        .then(resp => {
          if (resp.status === 200) {
            this.objectList = resp.data._items
            console.log(resp)
          }
        })
    }
  }
}
</script>

<style scoped lang='less'>
</style>
