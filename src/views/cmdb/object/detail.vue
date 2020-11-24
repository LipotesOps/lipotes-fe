<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">{{ object_definition.name }} - {{ objectId }} - 属性列表</h4>
    </div>

    <div class="btn-area">
      <el-button type="info" :plain="true" icon="user-secret" @click="$router.go(-1)"><fa-icon :icon="['fas','reply']" /></el-button>
      <el-button type="success" icon="check" :loading="committing" class="save-btn" @click="handleCreate"><fa-icon :icon="['fas','plus']" /></el-button>
    </div>

    <div class="app-content-container">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="object_schema"
        border
        fit
        highlight-current-row
        @sort-change="sortChange"
      >
        <el-table-column fixed label="属性" prop="id" sortable="true" align="center" min-width="30">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="ID" prop="id" sortable="true" align="center" min-width="30">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="类型" prop="id" sortable="true" align="center" min-width="30">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="必填" prop="id" sortable="true" align="center" min-width="30">
          <template slot-scope="{row}">
            <div v-if="row.required===true" class="col-select-icon-wrapper icon-select">
              <svg-icon icon-class="select" class-name="col-select-icon" />
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed label="唯一" prop="id" sortable="true" align="center" min-width="30">
          <template slot-scope="{row}">
            <div v-if="row.unique===true" class="col-select-icon-wrapper icon-select">
              <svg-icon icon-class="select" class-name="col-select-icon" />
            </div>
          </template>
        </el-table-column>

        <el-table-column fixed label="操作" align="center" min-width="30">
          <template slot-scope="{row}">
            <el-button size="mini" type="success" @click="handleUpdate(row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="rowTemp" label-position="left" label-width="70px" style="width: 80%; margin-left:50px;">
        <el-form-item label="属性" prop="name" :label-width="formLabelWidth">
          <el-input v-model="rowTemp.name" placeholder="" />
        </el-form-item>
        <el-form-item label="ID" prop="id" :label-width="formLabelWidth">
          <el-input v-model="rowTemp.id" :disabled="dialogStatus==='update'?true:false" width="500px" />
        </el-form-item>
        <el-form-item label="类型" prop="type" :label-width="formLabelWidth">
          <el-select v-model="rowTemp.type" value-key="type" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in typeOptions" :key="item.name" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="校验规则" prop="limit" :label-width="formLabelWidth">

          <el-checkbox v-model="rowTemp.unique" label="唯一">唯一</el-checkbox>
          <el-checkbox v-model="rowTemp.required" label="必填">必填</el-checkbox>
        </el-form-item>

        <el-form-item label="Remark" :label-width="formLabelWidth">
          <el-input v-model="rowTemp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createAttr():updateAttr()">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除实例" :visible.sync="dialogDelVisible">
      <el-form ref="dataDel" :model="delTemp" label-position="left" label-width="100px" style="width: 80%; margin-left:50px;">
        <el-form-item label="删除实例数量" prop="delNum" fixed>
          <el-input v-model="delNum" placeholder="Please input" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false">
          取消
        </el-button>
        <el-button type="danger" @click="deleteAttr()">
          确认删除
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchResourceObjectDetail, updateResourceObject } from '@/api/resource'

const typeOptions = [
  {
    name: '字符型',
    value: 'string'
  }
]

export default {
  inject: ['reload'],
  data() {
    return {
      object_definition: {},
      listLoading: false,
      tableKey: 0,
      objectId: this.$route.params.object_id,
      object_schema: [],

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
        type: 'string',
        required: true,
        unique: false,
        remark: ''
      },
      rules: {
        name: [{ required: true, message: 'this item is required', trigger: 'blur' }],
        id: [{ required: true, message: 'this item is required', trigger: 'blur' }],
        type: [{ required: true, message: 'this item is required', trigger: 'change' }],
        limit: [{ required: false, message: 'this item is required', trigger: 'blur' }],
        remark: [{ required: false, message: 'this item is required', trigger: 'blur' }]
      },

      delTemp: {},
      delNum: 0,
      dialogDelVisible: false
    }
  },
  created() {
    this.getObjectDetail()
  },
  methods: {
    getObjectDetail() {
      this.listLoading = true
      const params = {}
      fetchResourceObjectDetail(params, this.objectId)
        .then(resp => {
          if (resp.status === 200) {
            this.object_schema = this.$_.get(resp.data, 'object_schema', {})
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
      this.rowTemp = {
        name: '',
        id: '',
        type: 'string',
        required: true,
        unique: false,
        remark: ''
      }
    },
    handleUpdate(row) {
      this.resetRowTemp()
      this.rowTemp = Object.assign({}, row) // copy obj

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.rowTemp = Object.assign({}, row) // copy obj

      this.dialogDelVisible = true
      this.delNum = 0

      this.$nextTick(() => {
        this.$refs['dataDel'].clearValidate()
      })
    },
    handleCreate() {
      this.resetRowTemp()
      // this.rowTemp = Object.assign({}, {}) // copy obj

      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createAttr() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.rowTemp)
          delete tempData.isTrusted

          const tempSchema = Object.assign([], this.object_schema)
          tempSchema.push(tempData)

          const patchData = {}
          patchData.object_schema = tempSchema

          // 使用patch更新资源定义的CI项
          const id = this.object_definition._id
          const etag = this.object_definition._etag
          updateResourceObject(id, patchData, etag).then((response) => {
            this.dialogFormVisible = false
            if (response.status === 200) {
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

    deleteAttr() {
      this.$refs['dataDel'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.rowTemp)
          const attrIndex = this.object_schema.indexOf(tempData)
          this.object_schema.splice(attrIndex, 1)

          const tempSchema = Object.assign([], this.object_schema)

          const patchData = {}
          patchData.object_schema = tempSchema

          // 使用patch更新资源定义的CI项
          const id = this.object_definition._id
          const etag = this.object_definition._etag
          updateResourceObject(id, patchData, etag).then((response) => {
            this.dialogFormVisible = false
            if (response.status === 200) {
              this.$notify({
                title: 'Success',
                message: 'Delete Successfully',
                type: 'success',
                duration: 2000
              })
              this.reload()
            }
          })
        }
      })
    },

    updateAttr() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.rowTemp)
          const attrIndex = this.object_schema.indexOf(tempData)

          delete tempData.isTrusted

          const tempSchema = Object.assign([], this.object_schema)
          tempSchema.splice(attrIndex, 1, tempData)

          const patchData = {}
          patchData.object_schema = tempSchema

          // 使用patch更新资源定义的CI项
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
      })
    }
  }

}
</script>

<style lang="less" scoped>
 @import url("./../../../assets/css/variables.less");

.col-select-icon-wrapper {

  .col-select-icon {
    height: 15px;
    width: 15px;

    position: relative;
    overflow: hidden;
    color: white;
    background: green;
    border-radius: 8px;

    box-shadow: .809px .809px rgb(236, 226, 226), -.9px -.9px rgb(236, 226, 226);
    border-color: rgb(255, 0, 0);

  }
}

.btn-area {
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: @flying;
  }

</style>

