<template>
  <a-modal
    title="JSON数据"
    :footer="null"
    :visible="visible"
    style="top:20px;"
    :destroy-on-close="true"
    wrap-class-name="code-modal-9136076486841527"
    width="850px"
    @cancel="handleCancel"
  >
    <previewCode :editor-json="editorJson" />
  </a-modal>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 * description 生成json Modal
 */
import previewCode from '../../PreviewCode/index'
export default {
  name: 'JsonModal',
  components: {
    previewCode
  },
  data() {
    return {
      visible: false,
      editorJson: '',
      jsonData: {}
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.editorJson = JSON.stringify(this.jsonData, null, '\t')
      }
    }
  },
  methods: {
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
