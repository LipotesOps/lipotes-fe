<template>
  <div class="app-container">

    <div class="app-content-title">
      <h4 style="margin:0px">{{ object_definition.name }} - {{ objectId }} - 实例列表</h4>
    </div>

    <div class="btn-area">
      <el-button type="info" :plain="true" icon="user-secret" @click="$router.go(-1)"><fa-icon :icon="['fas','reply']" /></el-button>
      <el-button type="success" icon="check" :loading="committing" class="save-btn" @click="handleCreate"><fa-icon :icon="['fas','plus']" /></el-button>
    </div>

    <div class="app-content-container">
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

        <el-table-column fixed label="创建时间" prop="_created" sortable="true" align="center" min-width="30">
          <template slot-scope="{row}">
            <span>{{ row._created }}</span>
          </template>
        </el-table-column>

      </el-table>
    </div>

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
import { fetchResourceObjectDetail, fetchResourceInstance, createResourceInstance } from '@/api/resource'

export default {
  inject: ['reload'],
  data: function() {
    return {
      objectId: this.$route.params.object_id,
      object_definition: {},
      committing: false,
      listLoading: false,
      tableKey: 0,

      object_schema: [],

      textMap: {
        update: '编辑',
        create: '新建'
      },
      formLabelWidth: '90px',
      dialogStatus: '',
      dialogFormVisible: false,

      resourcInstance: [],
      rowTemp: {}

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
    getObjectDetail() {
      const params = {}
      fetchResourceObjectDetail(params, this.objectId)
        .then(resp => {
          if (resp.status === 200) {
            this.object_schema = this.$_.get(resp.data, 'object_schema', {})
            this.object_definition = resp.data
          }
        })
    },
    getResourceInstance() {
      this.listLoading = true
      const params = {}
      fetchResourceInstance(params, this.objectId)
        .then(resp => {
          if (resp.status === 200) {
            this.resourcInstance = resp.data._items
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
    },
    handleUpdate() {},
    handleCreate() {
      this.resetRowTemp()
      // this.rowTemp = Object.assign({}, {}) // copy obj

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
