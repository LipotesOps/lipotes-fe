<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">{{ object_definition.name }} - {{ objectId }} - 关系列表</h4>
    </div>

    <div class="btn-area">
      <el-button type="info" :plain="true" icon="user-secret" @click="$router.go(-1)"><fa-icon :icon="['fas','reply']" /></el-button>
      <el-button type="info" :plain="true" icon="fa-undo" @click="$router.push({ name: 'resource-attribute', params: { object_id: objectId }})"><fa-icon :icon="['fas','toggle-off']" /></el-button>

      <el-button type="success" icon="check" :loading="committing" class="save-btn" @click="handleCreate"><fa-icon :icon="['fas','plus']" /></el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="relation_schema"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column fixed label="关系名称" prop="id" sortable="true" align="center" min-width="30">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed label="ID" prop="id" sortable="true" align="center" min-width="30">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed label="两端" prop="id" sortable="true" align="center" min-width="30">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed label="操作" align="center" min-width="30">
        <template slot-scope="{row}">
          <el-button size="mini" type="success" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <div>

        <el-row style="margin-bottom: 30px; align: middle">
          <el-col :span="4" :offset="5">
            <div class="fa-icon-resource" :style="{color: left.color, 'width': '53px', 'height': '53px','border-radius': '10px', 'box-shadow': left.color, 'box-shadow': '2.8px 1.7304px 2.8px 1.7304px, -.8090px -.5px .8090px .5px'}">
              <fa-icon
                :icon="['fas', left.icon || 'cloud']"
                :style="{color: left.color, 'width': '50px', 'height': '50px','border-radius': '10px', 'margin': '1.5px 1.5px 1.5px 1.5px'}"
              />
            </div>
            <div style="margin-left: 12.5px">
              <span style="opacity: 0.7">{{ objectId }}</span>
            </div>
          </el-col>

          <el-col :span="4" :offset="10">
            <div class="fa-icon-resource" :style="{color: right.color, 'width': '53px', 'height': '53px','border-radius': '10px', 'box-shadow': right.color, 'box-shadow': '2.8px 1.7304px 2.8px 1.7304px, -.8090px -.5px .8090px .5px'}">
              <fa-icon
                :icon="['fas', right.icon || 'cloud']"
                :style="{color: right.color, 'width': '50px', 'height': '50px','border-radius': '10px', 'margin': '1.5px 1.5px 1.5px 1.5px'}"
              />
            </div>
            <div style="margin-left: 12.5px">
              <span style="opacity: 0.7">{{ objectId }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <!--------------------------------------------------------------- left --------------------------------------------------------------->
            <el-form ref="leftForm" :rules="rules" :model="rowTemp" label-position="left" label-width="70px" style="width: 80%; margin-left:50px;">
              <el-form-item prop="left.name" label="关系名称" :label-width="formLabelWidth">
                <el-input v-model="rowTemp.left.name" placeholder="" />
              </el-form-item>
              <el-form-item label="ID" prop="left.id" :label-width="formLabelWidth">
                <el-input v-model="rowTemp.left.id" :disabled="dialogStatus==='update'?true:false" width="500px" />
              </el-form-item>
              <el-form-item label="类型" prop="left.type" :label-width="formLabelWidth">
                <el-select v-model="rowTemp.left.type" class="filter-item" placeholder="Please select" clearable disabled>
                  <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="资源ID" prop="left.resourceId" :label-width="formLabelWidth">
                <el-select v-model="rowTemp.left.resourceId" disabled value-key="object_id" class="filter-item" placeholder="Please select" clearable>
                  <el-option v-for="item in resourceList" :key="item.object_id" :label="item.object_id" :value="item.object_id" />
                </el-select>
              </el-form-item>

              <el-form-item label="Remark" prop="left.remark" :label-width="formLabelWidth">
                <el-input v-model="rowTemp.left.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
              </el-form-item>
            </el-form>
          </el-col>
          <!--------------------------------------------------------------- right --------------------------------------------------------------->
          <el-col :span="12">
            <el-form ref="rightForm" :rules="rules" :model="rowTemp" label-position="left" label-width="70px" style="width: 80%; margin-left:50px;">
              <el-form-item label="关系名称" prop="right.name" :label-width="formLabelWidth">
                <el-input v-model="rowTemp.right.name" placeholder="" />
              </el-form-item>
              <el-form-item label="ID" prop="right.id" :label-width="formLabelWidth">
                <el-input v-model="rowTemp.right.id" :disabled="dialogStatus==='update'?true:false" width="500px" />
              </el-form-item>
              <el-form-item label="类型" prop="right.type" :label-width="formLabelWidth">
                <el-select v-model="rowTemp.right.type" value-key="key" class="filter-item" placeholder="Please select" clearable disabled>
                  <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="资源ID" prop="right.resourceId" :label-width="formLabelWidth">
                <el-select v-model="rowTemp.right.resourceId" value-key="object_id" class="filter-item" placeholder="Please select" clearable>
                  <el-option v-for="item in resourceList" :key="item.object_id" :label="item.object_id" :value="item.object_id" />
                </el-select>
              </el-form-item>

              <el-form-item label="Remark" prop="right.remark" :label-width="formLabelWidth">
                <el-input v-model="rowTemp.right.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createRelation():updateRelation()">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除关系" :visible.sync="dialogDelVisible">
      <el-form ref="dataDel" :model="delTemp" label-position="left" label-width="100px" style="width: 80%; margin-left:50px;">
        <el-form-item label="删除关系数量" prop="delNum" fixed>
          <el-input v-model="delTemp.delNum" placeholder="Please input" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false">
          取消
        </el-button>
        <el-button type="danger" :disabled="delTemp.delNum !== '1'" @click="deleteRelation()">
          确认删除
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchResourceDefinition, fetchResourceDefinitionDetail, updateResourceObject } from '@/api/resource'

const typeOptions = [
  {
    name: '关系',
    value: 'relation',
    key: 1
  }
]

export default {
  inject: ['reload'],
  data() {
    return {
      left: {},
      right: {},
      object_definition: {},
      resourceList: [],
      listLoading: false,
      tableKey: 0,
      objectId: this.$route.params.object_id,
      relation_schema: [],

      committing: false,
      formLabelWidth: '90px',
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '添加'
      },
      typeOptions: typeOptions,
      rowTemp: {
        name: '',
        id: '',
        type: 'relation',
        remark: '',
        left: { name: '', id: '', type: 'list', resourceId: this.objectId, max: 1, min: 0, remark: '' },
        right: { name: '', id: '', type: 'list', resourceId: '', max: 1, min: 0, remark: '' }
      },
      rules: {
        name: [{ required: true, message: 'this item is required', trigger: 'blur' }],
        id: [{ required: true, message: 'this item is required', trigger: 'blur' }],
        type: [{ required: true, message: 'this item is required', trigger: 'blur' }],

        'left.name': [{ required: true, message: 'this item is required', trigger: 'blur' }],
        'left.id': [{ required: true, message: 'this item is required', trigger: 'blur' }],
        'left.type': [{ required: true, message: 'this item is required', trigger: 'blur' }],
        'left.resourceId': [{ required: true, message: 'this item is required', trigger: 'blur' }],
        'left.remark': [{ required: false, message: 'this item is required', trigger: 'blur' }],

        'right.name': [{ required: true, message: 'this item is required', trigger: 'blur' }],
        'right.id': [{ required: true, message: 'this item is required', trigger: 'blur' }],
        'right.type': [{ required: true, message: 'this item is required', trigger: 'blur' }],
        'right.resourceId': [{ required: true, message: 'this item is required', trigger: 'blur' }],
        'right.remark': [{ required: false, message: 'this item is required', trigger: 'blur' }]
      },

      delTemp: {
        delNum: 0
      },
      dialogDelVisible: false
    }
  },
  created() {
    this.getObjectDetail()
    this.getResourceDefinition()
  },
  methods: {
    getResourceDefinition() {
      fetchResourceDefinition()
        .then(resp => {
          if (resp.status === 200) {
            this.resourceList = resp.data._items
          }
        })
    },
    getObjectDetail() {
      this.listLoading = true
      const params = {}
      fetchResourceDefinitionDetail(params, this.objectId)
        .then(resp => {
          if (resp.status === 200) {
            this.relation_schema = this.$_.get(resp.data, 'relation_schema', [])
            this.left = this.$_.get(resp, 'data', {})
            this.object_definition = resp.data
          }
        })
        .finally(resp => {
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 200)
        })
    },
    sortChange() {},
    resetRowTemp() {
      const rowTemp = {
        name: '',
        id: '',
        type: 'relation',
        remark: '',
        left: { name: '', id: '', type: 'relation', resourceId: this.objectId, max: 1, min: 0, remark: '' },
        right: { name: '', id: '', type: 'relation', resourceId: '', max: 1, min: 0, remark: '' }
      }
      this.rowTemp = Object.assign({}, rowTemp)
    },
    resetDelTemp() {
      this.delTemp = {
        delNum: 0
      }
    },

    handleCreate() {
      this.resetRowTemp()
      // this.rowTemp = Object.assign({}, {}) // copy obj

      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['leftForm'].clearValidate()
        this.$refs['rightForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.resetDelTemp()
      this.rowTemp = Object.assign({}, row) // copy obj

      this.dialogDelVisible = true

      this.$nextTick(() => {
        this.$refs['dataDel'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.resetRowTemp()
      this.rowTemp = Object.assign({}, row) // copy obj

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['leftForm'].clearValidate()
        this.$refs['rightForm'].clearValidate()
      })
    },

    createRelation() {
      this.$refs['leftForm'].validate((leftValid) => {
        if (!leftValid) {
          return
        }
        this.$refs['rightForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.rowTemp)
            delete tempData.isTrusted

            const tempRelation = Object.assign([], this.relation_schema)
            tempRelation.push(tempData)

            // 使用patch更新资源定义的CI项
            this.dispatchAction(tempRelation)
          }
        })
      })
    },
    deleteRelation() {
      this.$refs['dataDel'].validate((valid) => {
        if (valid) {
          if (this.delTemp.delNum !== '1') {
            return
          }
          const tempData = Object.assign({}, this.rowTemp)
          const relationIndex = this.relation_schema.indexOf(tempData)
          this.relation_schema.splice(relationIndex, 1)

          const tempRelation = Object.assign([], this.relation_schema)

          // 使用patch更新资源定义的CI项
          this.dispatchAction(tempRelation)
        }
      })
    },
    updateRelation() {
      this.$refs['leftForm'].validate((leftValid) => {
        if (!leftValid) {
          return
        }
        this.$refs['rightForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.rowTemp)
            const relationIndex = this.relation_schema.indexOf(tempData)

            delete tempData.isTrusted

            const tempRelation = Object.assign([], this.relation_schema)
            tempRelation.splice(relationIndex, 1, tempData)

            // 使用patch更新资源定义的CI项
            this.dispatchAction(tempRelation)
          }
        })
      })
    },

    dispatchAction(tempRelation) {
      const patchData = {}
      patchData.relation_schema = tempRelation
      // create && update && delete
      const id = this.object_definition._id
      const etag = this.object_definition._etag
      updateResourceObject(id, patchData, etag).then((response) => {
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
  }

}
</script>

<style lang="less" scoped>
 @import url("./../../../assets/css/variables.less");

.btn-area {
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: @flying;
  }

.el-select {
  width: 100%;
}

</style>

