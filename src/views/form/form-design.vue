<template>
  <div class="app-container">
    <!-- <div class="app-content-title">
      <h4 style="margin:0px">表单配置</h4>
    </div> -->
    <div class="app-content-container">
      <k-form-design ref="kfd" @save="handleSave" />
    </div>
  </div>
</template>

<script>
import { fetchForm, updateFormContent, createFormContent } from '@/api/itsc-flow'
import newFormContent from '@/utils/k-form/new.json'
var _ = require('lodash')

export default {
  name: 'FormDesign',
  data() {
    return {
      form_uuid: '',
      form_content_uuid: '',
      form_content: newFormContent,
      formData: {},
      isHaveFormData: false
    }
  },
  created() {
    this.form_uuid = this.$route.params.form_uuid
    this.form_content_uuid = this.$route.params.form_content_uuid
    this.getForm()
  },
  mounted() {},
  methods: {
    importData() {
      this.$refs.kfd.handleSetData(this.form_content)
    },
    getForm() {
      const params = { uuid: this.form_uuid }
      fetchForm(params)
        .then(resp => {
          if (resp.status === 200) {
            this.formData = resp.data.results[0]
            this.formContentObj = this.formData.form_content
            this.form_content = _.get(this.formData, 'form_content.content', newFormContent)
            this.isHaveFormData = _.has(this.formData, 'form_content.content')
            if (this.isHaveFormData) {
              this.form_content = JSON.parse(this.form_content)
            }
            this.importData()
          }
        })
    },
    handleSave(values) {
      if (this.isHaveFormData) {
        const tempContentObj = Object.assign({}, this.formContentObj)
        tempContentObj.content = values
        this.updateData(tempContentObj)
      } else {
        this.createData(values)
      }
    },
    updateData(formContentData) {
      const id = formContentData.id
      formContentData.form = this.form_uuid
      updateFormContent(id, formContentData)
        .then(resp => {
          if (resp.status === 200) {
            this.$message({
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.$router.go(-1)
          }
        })
    },
    createData(formContent) {
      const newFormContentObj = {}
      newFormContentObj.content = formContent
      newFormContentObj.form = this.form_uuid
      createFormContent(newFormContentObj)
        .then(resp => {
          if (resp.status === 201) {
            this.$message({
              message: 'Create Successfully',
              type: 'success',
              duration: 2000
            })
            this.$router.go(-1)
          }
        })
    }
  }
}
</script>

<style>

</style>
