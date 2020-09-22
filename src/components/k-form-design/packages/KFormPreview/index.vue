<template>
  <a-modal
    title="预览"
    :visible="visible"
    style="top:20px;"
    ok-text="获取数据"
    cancel-text="关闭"
    :destroy-on-close="true"
    :width="`${previewWidth}px`"
    @ok="handleGetData"
    @cancel="handleCancel"
  >
    <k-form-build ref="KFormBuild" :value="jsonData" @submit="handleSubmit" />
    <jsonModel ref="jsonModel" />
  </a-modal>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 */
import jsonModel from '../KFormDesign/module/jsonModal'
export default {
  name: 'KFormPreview',
  components: {
    jsonModel
  },
  data() {
    return {
      visible: false,
      previewWidth: 850,
      jsonData: {}
    }
  },
  methods: {
    handleSubmit(p) {
      p.then(res => {
        console.log(res, '获取数据成功')
        this.$refs.jsonModel.jsonData = res
        this.$refs.jsonModel.visible = true
      }).catch(err => {
        console.log(err, '获取数据失败')
      })
    },
    handleGetData() {
      this.$refs.KFormBuild.getData()
        .then(res => {
          console.log(res, '获取数据成功')
          this.$refs.jsonModel.jsonData = res
          this.$refs.jsonModel.visible = true
        })
        .catch(err => {
          console.log(err, '获取数据失败')
        })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
