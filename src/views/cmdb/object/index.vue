<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">模型管理</h4>
    </div>
    <div class="app-content-container">
      <el-row>
        <el-col v-for="item in objectList" :key="item._id" :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
          <el-card class="object-card" shadow="hover">
            <i class="el-icon-cloudy" />
            <div slot="header">
              <span>{{ item.name }}</span>
            </div>
            <div class="card-btn-area">
              <el-button type="text" circle :plain="true" @click="$router.go(-1)"><i class="el-icon-coin el-icon--center" /></el-button>
              <el-button type="text" circle :plain="true" @click="$router.push({ name: 'object-detail', params: { object_id: item.object_id }})"><i class="el-icon-postcard el-icon--center" /></el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { fetchCmdbObject } from '@/api/micro-cmdb'

export default {
  data: function() {
    return {
      objectList: [
        { _id: 'ddd', name: '主机', objecId: 'HOST', to: 'production_application', icon: 'el-icon-wind-power', style: 'background: rgb(30, 30, 30)' },
        { _id: 'dddd', name: '应用', objecId: 'APP', to: 'domain_application', icon: 'el-icon-map-location', style: 'background: rgb(101, 196, 88)' }
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
.object-card {
    width: 350px;
    height: 216.3px;
    border-radius: 8px;
    margin: 25px;
    // margin-left: 25px;
    transition: all .8s;

    cursor: pointer;
    box-shadow: 1px 1px rgb(212, 204, 204), -.5px -.5px rgb(212, 204, 204);
    i {
        font-size: 50px;
        color: green;
        border-radius: 5px;
        box-shadow: .5px .5px rgba(39, 63, 172, 0.562), -.3px -.3px rgba(39, 63, 172, 0.562);
    }
    .card-btn-area {
      margin-top: 15px;
      // padding: 10px;
      // background-color: white;
      border-radius: 8px;
      // position: absolute;
      // top: 200px;
      // right: 20px;
      text-align: right;
      i {
        font-size: 22px;
        // border-radius: 5px;
        color: gray;
        box-shadow: 0px 0px rgba(39, 63, 172, 0.562), 0px 0px rgba(39, 63, 172, 0.562);
    }
    }
}
.el-card:hover{
  padding-left: 6.18px;
  padding-top: 10px;
}
</style>
