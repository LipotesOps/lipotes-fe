<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">资源模型</h4>
    </div>
    <div class="btn-area">
      <el-select v-model="selectedVersion" placeholder="Tag" clearable class="filter-item" popper-class="select-option" style="width: 130px; margin-right: 11px" />
      <el-button type="info" :plain="true" icon="fa-undo" @click="$router.go(-1)"><fa-icon :icon="['fas','reply']" /></el-button>
      <el-button type="success" icon="check" :loading="committing" class="save-btn" @click="handleCreate"><fa-icon :icon="['fas','plus']" /></el-button>
    </div>
    <div class="app-content-container">
      <el-row>
        <el-col v-for="(item, index) in objectList" :key="item._id" :xs="24" :sm="12" :md="12" :lg="8" :xl="6">
          <span @mouseenter="mouseOnOff(true, index)" @mouseleave="mouseOnOff(false, index)">
            <el-card class="object-card" shadow="hover">
              <fa-icon
                :icon="['fas',item.icon || 'cloud']"
                :style="{color: item.color, 'width': '50px', 'height': '50px','border-radius': '5px', 'box-shadow': '.5px .5px rgba(39, 63, 172, 0.562), -.3px -.3px rgba(39, 63, 172, 0.562)'}"
              />
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
          <el-input v-model="rowTemp.object_id" :disabled="dialogStatus==='update'?true:false" width="500px" />
        </el-form-item>
        <el-form-item label="Category" prop="id" :label-width="formLabelWidth">
          <el-select v-model="rowTemp.category" value-key="_id" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in categoryOptions" :key="item.name" :label="item.name" :value="{'_id': item._id, '_version': item._version, 'name': item.name}" />
          </el-select>
        </el-form-item>

        <el-form-item label="icon" prop="icon" :label-width="formLabelWidth">
          <el-select v-model="rowTemp.icon" value-key="_id" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in iconOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="Remark" :label-width="formLabelWidth">
          <el-input v-model="rowTemp.memo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchCmdbObject, fetchObjectCategory, updateObject, createObject } from '@/api/resource'

export default {
  inject: ['reload'],
  filters: {
    categoryFilter(category_id) {
      return {}
    }
  },
  data: function() {
    return {
      committing: false,
      selectedVersion: '',
      recipients: {},
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
        name: '',
        icon: 'plus',
        color: 'green'
      },
      rules: {
        name: [{ required: true, message: 'this field is required', trigger: 'change' }],
        object_id: [{ required: true, message: 'this field is required', trigger: 'change' }],
        icon: [{ required: false, message: 'this field is required', trigger: 'change' }]
      },
      objectList: [],
      categoryOptions: [],
      // fa-icon arr
      iconOptions: ['ad', 'address-book', 'adjust', 'air-freshener']
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
    handleUpdate(row) {
      this.rowTemp = Object.assign({}, row) // copy obj

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.rowTemp)

          const id = tempData._id
          const etag = tempData._etag

          delete tempData._created
          delete tempData._deleted
          delete tempData._etag
          delete tempData._links
          delete tempData._updated

          updateObject(id, tempData, etag).then((response) => {
            const index = this.objectList.findIndex(v => v.id === this.rowTemp.id)
            this.objectList.splice(index, 1, this.rowTemp)
            this.dialogFormVisible = false
            if (response.status === 200) {
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
              this.reload()
            }
          })
        }
      })
    },
    handleCreate(row) {
      this.rowTemp = Object.assign({}, row) // copy obj

      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.rowTemp)
          delete tempData.isTrusted
          tempData.object_schema = [
            {
              'id': 'name',
              'name': '名称',
              'type': 'string',
              'required': true,
              'unique': true
            }
          ]

          createObject(tempData).then((response) => {
            const index = this.objectList.findIndex(v => v.id === this.rowTemp.id)
            this.objectList.splice(index, 1, this.rowTemp)
            this.dialogFormVisible = false
            if (response.status === 201) {
              this.$notify({
                title: 'Success',
                message: 'Create Successfully',
                type: 'success',
                duration: 2000
              })
              this.reload()
            }
          })
        }
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

<style scoped lang='less'>
 @import url("./../../../assets/css/variables.less");

.object-card {
    width: 350px;
    height: 216.3px;
    border-radius: 8px;
    margin: 25px;
    // margin-left: 25px;
    transition: all .618s;

    cursor: pointer;
    box-shadow: .809px .809px rgb(236, 226, 226), -.5px -.5px rgb(236, 226, 226);

    // 保存 后续使用
    // &:hover {
    //   box-shadow: .809px .809px rgb(236, 226, 226), -.5px -.5px rgb(236, 226, 226);
    //   transition: all 0.618s;
    //   padding: 1px;
    // }
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
  padding: 6.18px;
  // padding-left: 6.18px;
  // padding-top: 10px;
}
.el-form .el-input {
    width: 100%;
  }

.btn-area {
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: @flying;
  }
</style>
