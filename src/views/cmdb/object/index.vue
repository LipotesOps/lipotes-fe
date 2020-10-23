<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">模型管理</h4>
    </div>
    <div class="app-content-container">
      <el-card v-for="item in objectList" :key="item._id" class="object-card" shadow="hover">
        <i class="el-icon-cloudy" />
        <div slot="header">
          <span>{{ item.name }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { fetchCmdbObject } from '@/api/micro-cmdb'

export default {
  data: function() {
    return {
      objectList: [
        { _id: 'ddd', name: '主机', objecId: 'HOST' },
        { _id: 'dddd', name: '应用', objecId: 'APP' }
      ]
    }
  },
  created() {
    this.getObjectList()
  },
  methods: {
    getObjectList() {
      fetchCmdbObject()
        .then(resp => {
          console.log(resp)
        })
    }
  }
}
</script>

<style scoped lang='less'>
.object-card {
    width: 350px;
    height: 216.3px;
    border-radius: 8px;
    margin: 25px;
    i {
        font-size: 30px;
        color: white;
        background: rgb(110, 110, 243);
        border-radius: 5px;
    }
}
</style>
