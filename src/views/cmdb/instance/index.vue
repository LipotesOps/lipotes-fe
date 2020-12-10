<template>
  <div class="app-container">

    <div class="app-content-title">
      <h4 style="margin:0px">{{ object_definition.name }} - {{ objectId }} - 实例列表</h4>
    </div>

    <div class="btn-area">
      <el-button type="info" :plain="true" icon="user-secret" @click="$router.go(-1)"><fa-icon :icon="['fas','reply']" /></el-button>
      <el-button type="success" icon="check" :loading="committing" class="save-btn" @click="handleCreate"><fa-icon :icon="['fas','plus']" /></el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="resourcInstance"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column
        v-for="(item) in object_schema"
        :key="item.name"
        fixed
        :label="item.name"
        :value="item.name"
        :prop="item.id"
        sortable="true"
        align="center"
        min-width="30"
      >
        <template slot-scope="{row}">
          <span>{{ row[item.id] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item) in relation_schema"
        :key="item.left.name"
        fixed
        :label="item.left.name"
        :value="item.left.name"
        :prop="item.left.id"
        sortable="true"
        align="center"
        min-width="30"
      >
        <template slot-scope="{row}">
          <el-tag v-for="i in row[item.left.id]" :key="i._id" style="margin: 1.5px">{{ i.name }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column fixed label="创建时间" prop="_created" sortable="true" align="center" min-width="30">
        <template slot-scope="{row}">
          <span>{{ row._created | localTimeZone }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed label="更新时间" prop="_updated" sortable="true" align="center" min-width="30">
        <template slot-scope="{row}">
          <span>{{ row._updated | localTimeZone }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed label="操作" align="center" min-width="30">
        <template slot-scope="{row}">
          <el-button size="mini" type="success" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.max_results" @pagination="getResourceInstance" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="rowTemp" label-position="left" label-width="70px" style="width: 80%; margin-left:50px;">
        <el-form-item
          v-for="(item) in object_schema"
          :key="item.id"
          :label="item.name"
          :prop="item.id"
          :label-width="formLabelWidth"
          fixed
        >
          <el-input v-model="rowTemp[item.id]" placeholder="Please input" />
        </el-form-item>
        <el-form-item
          v-for="(item) in relation_schema"
          :key="item.left.id"
          :label="item.left.name"
          :prop="item.left.id"
          :label-width="formLabelWidth"
          fixed
        >
          <instance-option v-model="rowTemp[item.left.id]" :resource-id="item.left.resourceId" placeholder="Please input" @select-change="handleSetActiveTabName(rowTemp[item.left.id])" />
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

    <el-dialog title="删除实例" :visible.sync="dialogDelVisible">
      <el-form ref="dataDel" :model="delTemp" label-position="left" label-width="100px" style="width: 80%; margin-left:50px;">
        <el-form-item label="删除实例数量" prop="delNum" fixed>
          <el-input v-model="delTemp.delNum" placeholder="Please input" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false">
          取消
        </el-button>
        <el-button type="danger" :disabled="delTemp.delNum !== '1'" @click="deleteData()">
          确认删除
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { fetchResourceDefinitionDetail, fetchResourceInstance, createResourceInstance, updateResourceInstance, delResourceInstance } from '@/api/resource'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import InstanceOption from './components/InstanceOption'

export default {
  components: { Pagination, InstanceOption },
  inject: ['reload'],
  data: function() {
    return {
      objectId: this.$route.params.object_id,
      object_definition: {},
      committing: false,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        max_results: 10,
        sort: '_id'
      },
      tableKey: 0,

      object_schema: [],
      relation_schema: [],

      textMap: {
        update: '编辑',
        create: '新建'
      },
      formLabelWidth: '90px',
      dialogStatus: '',
      dialogFormVisible: false,
      dialogDelVisible: false,

      resourcInstance: [],
      rowTemp: {},
      delTemp: {
        delNum: 0
      }

    }
  },
  computed: {
    rules() {
      var rules = {}
      this.object_schema.forEach((e, i) => {
        rules[e.id] = [{ required: e.required, message: 'this field is required', trigger: 'change' }]
      })
      return rules
    },
    rowTTemp() {
      var rowTemp = {}
      this.object_schema.forEach((e, i) => {
        rowTemp[e.id] = ''
      })
      return rowTemp
    }
  },

  created() {
    this.getObjectDetail()
    this.getResourceInstance()
  },
  methods: {
    handleSetActiveTabName(value, Temp) {
      Temp = value
    },
    getObjectDetail() {
      const params = {}
      fetchResourceDefinitionDetail(params, this.objectId)
        .then(resp => {
          if (resp.status === 200) {
            this.object_schema = this.$_.get(resp.data, 'object_schema', [])
            this.relation_schema = this.$_.get(resp.data, 'relation_schema', [])
            this.object_definition = resp.data
          }
        })
    },
    getResourceInstance() {
      this.listLoading = true
      fetchResourceInstance(this.listQuery, this.objectId)
        .then(resp => {
          if (resp.status === 200) {
            this.resourcInstance = resp.data._items
            this.total = resp.data._meta.total
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
      // this.rowTemp.forEach((e, i) => {

      // })
      this.rowTemp = {}
    },
    resetDelTemp() {
      this.delTemp = {
        delNum: 0
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
    handleCreate() {
      this.resetRowTemp()
      // this.rowTemp = Object.assign({}, {}) // copy obj

      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.resetDelTemp()

      this.rowTemp = Object.assign({}, row) // copy obj

      this.dialogDelVisible = true
      this.delNum = 0

      this.$nextTick(() => {
        this.$refs['dataDel'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.rowTemp)
          delete tempData.isTrusted

          delete tempData._id
          delete tempData._created
          delete tempData._deleted
          delete tempData._etag
          delete tempData._links
          delete tempData._updated

          delete tempData._latest_version
          delete tempData._version

          // 新建资源实例
          createResourceInstance(tempData, this.objectId).then((response) => {
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.rowTemp)
          delete tempData.isTrusted

          const etag = tempData._etag

          delete tempData._created
          delete tempData._deleted
          delete tempData._etag
          delete tempData._links
          delete tempData._updated

          delete tempData._latest_version
          delete tempData._version

          // 新建资源实例
          updateResourceInstance(tempData._id, etag, tempData, this.objectId).then((response) => {
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
    deleteData() {
      this.$refs['dataDel'].validate((valid) => {
        if (valid) {
          if (this.delTemp.delNum !== '1') {
            return
          }
          const tempData = Object.assign({}, this.rowTemp)
          delete tempData.isTrusted

          const etag = tempData._etag

          delete tempData._created
          delete tempData._deleted
          delete tempData._etag
          delete tempData._links
          delete tempData._updated

          delete tempData._latest_version
          delete tempData._version

          // 删除资源实例
          delResourceInstance(tempData._id, etag, this.objectId).then((response) => {
            this.dialogFormVisible = false
            if (response.status === 204) {
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

</style>
