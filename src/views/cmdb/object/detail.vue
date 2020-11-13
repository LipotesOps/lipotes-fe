<template>
  <div class="app-container">
    <div class="app-content-title">
      <h4 style="margin:0px">{{ objectId }}</h4>
    </div>

    <div class="btn-area">
      <el-button type="info" :plain="true" icon="user-secret" @click="$router.go(-1)"><fa-icon :icon="['fas','reply']" /></el-button>
      <el-button type="success" icon="check" :loading="committing" class="save-btn" @click="handleAdd"><fa-icon :icon="['fas','plus']" /></el-button>
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
        <el-table-column fixed label="配置名" prop="id" sortable="true" align="center" min-width="30">
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
            <div v-if="row.required" class="col-select-icon-wrapper icon-select">
              <svg-icon icon-class="select" class-name="col-select-icon" />
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed label="唯一" prop="id" sortable="true" align="center" min-width="30">
          <template slot-scope="{row}">
            <div v-if="row.unique" class="col-select-icon-wrapper icon-select">
              <svg-icon icon-class="select" class-name="col-select-icon" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="rowTemp" label-position="left" label-width="70px" style="width: 80%; margin-left:50px;">
        <el-form-item label="Name" prop="name" :label-width="formLabelWidth">
          <el-input v-model="rowTemp.name" placeholder="Please select" />
        </el-form-item>
        <el-form-item label="ObjectId" prop="ObjectId" :label-width="formLabelWidth">
          <el-input v-model="rowTemp.object_id" :disabled="dialogStatus==='update'?true:false" width="500px" />
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
import { fetchCmdbObjectDetail } from '@/api/resource'

export default {
  data() {
    return {
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
      rowTemp: {
        _id: undefined,
        name: ''
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
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
            this.object_schema = this.$_.get(resp.data, 'object_schema', {})
          }
        })
    },
    handleUpdate() {},
    sortChange() {},
    handleAdd(row) {
      this.rowTemp = Object.assign({}, row) // copy obj

      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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

