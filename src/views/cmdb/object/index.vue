<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">资源模型</h4>
    </div>
    <div class="app-content-container">
      <el-row>
        <el-col v-for="(item, index) in objectList" :key="item._id" :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
          <span @mouseenter="mouseOnOff(true, index)" @mouseleave="mouseOnOff(false, index)">
            <el-card class="object-card" shadow="hover">
              <i class="el-icon-cloudy" />
              <div slot="header">
                <span>{{ item.name }}</span>
              </div>
              <transition name="el-fade-in-linear">
                <div v-show="index === show" class="card-btn-area">
                  <el-button type="text" circle :plain="true" @click="$router.push({ name: 'object-detail', params: { object_id: item.object_id }})"><i class="el-icon-coin el-icon--center" /></el-button>
                  <el-button type="text" circle :plain="true" @click="handleUpdate(item)"><i class="el-icon-postcard el-icon--center" /></el-button>
                </div>
              </transition>
            </el-card>
          </span>

        </el-col>
      </el-row>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="rowTemp" label-position="left" label-width="70px" style="width: 80%; margin-left:50px;">
        <el-form-item label="Name" prop="name" :label-width="formLabelWidth">
          <el-input v-model="rowTemp.name" placeholder="Please select" />
        </el-form-item>
        <el-form-item label="ObjectId" prop="ObjectId" :label-width="formLabelWidth">
          <el-input v-model="rowTemp.object_id" disabled width="500px" />
        </el-form-item>
        <el-form-item label="Category" prop="id" :label-width="formLabelWidth">
          <el-select v-model="rowTemp.category" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in categoryOptions" :key="item._id" :label="item.name" :value="item._id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Remark" :label-width="formLabelWidth">
          <el-input v-model="rowTemp.memo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchCmdbObject, fetchObjectCategory } from '@/api/micro-cmdb'

export default {
  data: function() {
    return {
      show: false,
      showFlags: [],
      formLabelWidth: '90px',
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rowTemp: {
        _id: undefined,
        name: ''
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      objectList: [
        { _id: 'ddd', name: '主机', objecId: 'HOST', to: 'production_application', icon: 'el-icon-wind-power', style: 'background: rgb(30, 30, 30)' },
        { _id: 'dddd', name: '应用', objecId: 'APP', to: 'domain_application', icon: 'el-icon-map-location', style: 'background: rgb(101, 196, 88)' }
      ],
      categoryOptions: []
    }
  },
  created() {
    this.getObjectList()
    this.getObjectCategory()
  },
  methods: {
    getObjectList() {
      fetchCmdbObject()
        .then(resp => {
          if (resp.status === 200) {
            this.objectList = resp.data._items
          }
        })
    },
    getObjectCategory() {
      fetchObjectCategory()
        .then(resp => {
          if (resp.status === 200) {
            this.categoryOptions = resp.data._items
          }
        })
    },
    handleUpdate(resource) {
      this.rowTemp = Object.assign({}, resource) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    mouseOnOff(showing, index) {
      if (showing) {
        this.show = index
        return
      }
      this.show = index + 1.1
    }
  }
}
</script>

<style scoped lang='scss'>
.object-card {
    width: 350px;
    height: 216.3px;
    border-radius: 8px;
    margin: 25px;
    // margin-left: 25px;
    transition: all .618s;

    cursor: pointer;
    box-shadow: .809px .809px rgb(236, 226, 226), -.5px -.5px rgb(236, 226, 226);
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
      // display: none;
      i {
        font-size: 22px;
        // border-radius: 5px;
        color: gray;
        box-shadow: 0px 0px rgba(39, 63, 172, 0.562), 0px 0px rgba(39, 63, 172, 0.562);
      }
      }
    // 当鼠标经过兄弟元素brother-showing时，也就是经过父级father的时候。父级获得hover状态，在父级hover的基础上写element的样式：
    // &:hover .card-btn-area {
    //     display: block;
    //     transition: transform ease-out 1.3s;
    //   }
}

// 虚浮/阴影card
.el-card:hover{
  padding-left: 6.18px;
  padding-top: 10px;
}
.el-form .el-input {
    width: 100%;
  }

</style>
