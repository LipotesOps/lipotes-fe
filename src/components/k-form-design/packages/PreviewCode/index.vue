<template>
  <div>
    <div class="json-box-9136076486841527">
      <codemirror
        ref="myEditor"
        style="height:100%;"
        :value="editorJson"
      />
    </div>
    <div class="copy-btn-box-9136076486841527">
      <a-button
        type="primary"
        class="copy-btn"
        data-clipboard-action="copy"
        :data-clipboard-text="editorJson"
        @click="handleCopyJson"
      >
        复制数据
      </a-button>
      <a-button type="primary" @click="handleExportJson">
        导出代码
      </a-button>
    </div>
  </div>
</template>
<script>
// 剪切板组件
import Clipboard from 'clipboard'
import { codemirror } from 'vue-codemirror-lite'
export default {
  name: 'PreviewCode',

  components: {
    codemirror
  },
  props: {
    fileFormat: {
      type: String,
      default: 'json'
    },
    editorJson: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    exportData(data, fileName = `demo.${this.fileFormat}`) {
      let content = 'data:text/csv;charset=utf-8,'
      content += data
      var encodedUri = encodeURI(content)
      var actions = document.createElement('a')
      actions.setAttribute('href', encodedUri)
      actions.setAttribute('download', fileName)
      actions.click()
    },
    handleExportJson() {
      // 导出JSON
      this.exportData(this.editorJson)
    },
    handleCopyJson() {
      // 复制数据
      const clipboard = new Clipboard('.copy-btn')
      clipboard.on('success', () => {
        this.$message.success('复制成功')
      })
      clipboard.on('error', () => {
        this.$message.error('复制失败')
      })
      setTimeout(() => {
        // 销毁实例
        clipboard.destroy()
      }, 122)
    }
  }
}
</script>
