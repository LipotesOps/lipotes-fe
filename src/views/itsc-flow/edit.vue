<template>
  <div id="bpmn-editor">
    <div id="bpmn-canvas" />
    <div id="properties-panel" />
    <div class="widget-area">
      <el-button icon="el-icon-folder-opened" circle @click="handleOpenFile" />
      <el-button icon="el-icon-download" circle @click="handleDownloadXml" />
      <el-button icon="el-icon-picture-outline" circle @click="saveImg" />
      <el-button icon="el-icon-refresh-left" circle @click="handleUndo" />
      <el-button icon="el-icon-refresh-right" circle @click="handleRedo" />
      <el-button icon="el-icon-zoom-in" circle @click="handleZoomIn" />
      <el-button icon="el-icon-zoom-out" circle @click="handleZoomOut" />
    </div>
    <div class="color-picker">
      <el-color-picker v-model="color" @active-change="colorChange" />
    </div>
    <div class="btn-area">
      <el-button type="info" :plain="true" icon="fa-undo" @click="$router.go(-1)">返回</el-button>
      <el-tooltip v-if="!isNew" content="新建并归属至流程" placement="top">
        <el-button type="warning" icon="check" :loading="committing" class="save-btn" @click="createXML">新建<i class="el-icon-document-add el-icon--right" /></el-button>
      </el-tooltip>
      <el-button v-if="isNew" type="success" icon="check" :loading="committing" class="save-btn" @click="updateXML">更新<i class="el-icon-upload el-icon--right" /></el-button>
    </div>
    <footer class="credit">
      <img :src="logoSrc">
      <p>© Web-based tooling for BPMN, DMN and CMMN diagrams powered by <a href="http://bpmn.io">bpmn.io</a>.</p>
    </footer>
  </div>
</template>

<script>
import newBpmnXML from './resources/newDiagram'
import uuid from '@/utils/guid'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json'
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

import { fetchBpmn, updateBpmn, createBpmn } from '@/api/itsc-flow'

export default {
  data() {
    return {
      hasBpmn: true,
      color: null,
      element: {},
      circle: true,
      newScale: 1,
      bpmn_id: null,
      bpmnModeler: null,
      committing: false,
      logoSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAMAAADypuvZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFiMte9PrwldFwfcZPqtqN0+zEyOe1XLgjvuKncsJAZ70y6fXh3vDT////UrQV////G2zN+AAAABB0Uk5T////////////////////AOAjXRkAAAHDSURBVHjavJZJkoUgDEBJmAX8979tM8u3E6x20VlYJfFFMoL4vBDxATxZcakIOJTWSmxvKWVIkJ8jHvlRv1F2LFrVISCZI+tCtQx+XfewgVTfyY3plPiQEAzI3zWy+kR6NBhFBYeBuscJLOUuA2WVLpCjVIaFzrNQZArxAZKUQm6gsj37L9Cb7dnIBUKxENaaMJQqMpDXvSL+ktxdGRm2IsKgJGGPg7atwUG5CcFUEuSv+CwQqizTrvDTNXdMU2bMiDWZd8d7QIySWVRsb2vBBioxOFt4OinPBapL+neAb5KL5IJ8szOza2/DYoipUCx+CjO0Bpsv0V6mktNZ+k8rlABlWG0FrOpKYVo8DT3dBeLEjUBAj7moDogVii7nSS9QzZnFcOVBp1g2PyBQ3Vr5aIapN91VJy33HTJLC1iX2FY6F8gRdaAeIEfVONgtFCzZTmoLEdOjBDfsIOA6128gw3eu1shAajdZNAORxuQDJN5A5PbEG6gNIu24QJD5iNyRMZIr6bsHbCtCU/OaOaSvgkUyDMdDa1BXGf5HJ1To+/Ym6mCKT02Y+/Sa126ZKyd3jxhzpc1r8zVL6YM1Qy/kR4ABAFJ6iQUnivhAAAAAAElFTkSuQmCC'
    }
  },

  computed: {
    isNew() {
      return this.$route.query.bpmn_uniq_key && this.hasBpmn // 是否新建
    },
    computed_flow_uniq_key() {
      return this.$route.query.flow_uniq_key
    },
    computed_flow_uniq_name() {
      return this.$route.query.uniq_name
    }
  },

  mounted() {
    const customTranslate = {
      translate: ['value', require('./customTranslate/customTranslate')]
    }
    this.$nextTick(() => {
      this.bpmnModeler = new BpmnModeler({
        container: '#bpmn-canvas',
        propertiesPanel: {
          parent: '#properties-panel'
        },
        additionalModules: [
          propertiesPanelModule,
          propertiesProviderModule,
          customTranslate
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      })
      // 导入 BPMN
      this.createDiagram()
      const eventBus = this.bpmnModeler.get('eventBus')
      // console.log(eventBus)
      eventBus.on('element.changed', (e) => {
        const reg = /Task/
        if (reg.test(e.element)) {
          // console.log(e.gfx)
          // console.log(e.element.id)
        }
      })
      const _this = this
      this.bpmnModeler.on('commandStack.changed', function() {
        _this.saveBmap()
      })
      this.handleModeler()
    })
  },
  methods: {
    handleModeler() {
      // 监听节点选择变化
      this.bpmnModeler.on('selection.changed', e => {
        // 更新process基本信息，id + name，保证一致
        this.bpmnModeler._definitions.rootElements[0].id = this.computed_flow_uniq_key
        this.bpmnModeler._definitions.rootElements[0].name = this.computed_flow_uniq_name
        const element = e.newSelection[0]
        this.element = element
        // console.log(this.element)
        // if (!element) return
        // this.form = {
        //   ...element.businessObject,
        //   ...element.businessObject.$attrs
        // }
        // if (this.form.userType === 'candidateUsers') {
        //   this.form['candidateUsers'] =
        //     this.form['candidateUsers'].split(',') || []
        // }
      })

      //  监听节点属性变化
      this.bpmnModeler.on('element.changed', e => {
        const { element } = e
        if (!element) return
        //  新增节点需要更新回属性面板
        // if (element.id === this.form.id) {
        //   this.form.name = element.businessObject.name
        //   this.form = { ...this.form }
        // }
      })
    },
    // 属性面板颜色，更新回流程节点
    colorChange(color) {
      const modeling = this.bpmnModeler.get('modeling')
      modeling.setColor(this.element, {
        fill: null,
        stroke: color
      })
      modeling.updateProperties(this.element, { color: color })
    },
    async importXML(xml) {
      try {
        const result = await this.bpmnModeler.importXML(xml)
        const { warnings } = result
        console.log(warnings)
      } catch (err) {
        console.log(err.message, err.warnings)
      }
      // this.bpmnModeler.importXML(xml, err => {
      //
      // if (err) console.log(err)
      // this.bpmnModeler.get('canvas').zoom('fit-viewport')
      // document.getElementsByClassName('bjs-powered-by')[0].outerHTML = ''
      // this.customizeEditor()
    },

    createDiagram() {
      const queryDate = {
        bpmn_uniq_key: this.$route.query.bpmn_uniq_key,
        flow_uniq_key: this.$route.query.flow_uniq_key
      }

      //  ff
      fetchBpmn(queryDate).then(resp => {
        if (resp.status === 200) {
          // 将字符串转换成图显示出来
          if (resp.data.length === 0) {
            this.$notify({
              title: 'Failed',
              message: 'FetchBpmn Failed!',
              type: 'warning',
              duration: 2000
            })
            this.hasBpmn = false
            const bpmn_content = newBpmnXML
            this.uniq_key = uuid('B')
            this.flow_uniq_key = this.$route.query.flow_uniq_key
            this.importXML(bpmn_content)
            return
          }
          const bpmn_content = resp.data[0].bpmn_content
          this.bpmn_id = resp.data[0].id
          this.uniq_key = resp.data[0].uniq_key
          this.flow_uniq_key = resp.data[0].flow_uniq_key
          this.importXML(bpmn_content)
          return
        }
      },
      errResp => {
        return (errResp.response)
      }
      )
    },

    async createXML() {
      try {
        const result = await this.bpmnModeler.saveXML({ format: true })
        const { xml } = result

        const postData = {
          'uniq_key': this.uniq_key,
          'flow_uniq_key': this.flow_uniq_key,
          'bpmn_content': xml,
          'version': '1.0.5'
        }
        this.committing = true
        createBpmn(postData).then((res) => {
          if (res.status === 200 || res.status === 201) {
            this.$message.success('新建成功！')
            this.$router.replace('/flow-manage/flow')
          }
          this.committing = false
        }).catch(() => {
          this.committing = false
        })
      } catch (err) {
        this.$message.error(`发生错误：${err}`)
        console.log(err)
      }
    },

    async updateXML() {
      try {
        const result = await this.bpmnModeler.saveXML({ format: true })
        const { xml } = result

        const id = this.bpmn_id
        const postData = {
          'uniq_key': this.uniq_key,
          'flow_uniq_key': this.$route.query.flow_uniq_key,
          'bpmn_content': xml,
          'version': '1.0.5'
        }
        this.committing = true
        updateBpmn(id, postData).then((res) => {
          if (res.status === 200 || res.status === 201) {
            this.$message.success('保存成功！')
            this.$router.replace('/flow-manage/flow')
          }
          this.committing = false
        }).catch(() => {
          this.committing = false
        })
      } catch (err) {
        this.$message.error(`发生错误：${err}`)
        console.log(err)
      }
    },

    // 实时保存
    async saveBmap() {
      const vm = this
      try {
        const result = await vm.bpmnModeler.saveXML({ format: true })
        const { xml } = result
        vm.xmlStr = xml
      } catch (err) {
        console.log(err)
      }
      try {
        const result = await vm.bpmnModeler.saveSVG({ format: true })
        const { svg } = result
        vm.svg = svg
        // console.log(svg)
      } catch (err) {
        console.log(err)
      }
    },
    // 上传文件
    handleOpenFile(e) {
      const vm = this
      const input = document.createElement('input')
      input.type = 'file'
      input.click()// 打开文件选择框
      input.onchange = function() {
        const file = input.files[0]
        if (window.FileReader) {
          try {
            var fr = new FileReader()
            fr.readAsText(file) // 将文件读取为文本
            fr.onload = function(e) {
              vm.xmlStr = fr.result
              vm.importXML(vm.xmlStr)
            }
          } catch (e) {
            // console.log(e.toString())
          }
        } else {
          console.log('您的浏览器可能不支持此操作')
        }
      }
      document.body.removeChild(input)
    },
    // 下载xml/svg
    download(type, data, name) {
      // 下载xml/svg
      let dataTrack = ''
      const a = document.createElement('a')
      switch (type) {
        case 'xml':
          dataTrack = 'bpmn20.xml'
          break
        case 'svg':
          dataTrack = 'svg'
          break
        default:
          break
      }
      const reName = name || `${this.computed_flow_uniq_name}.${dataTrack}`
      a.setAttribute(
        'href',
        `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`
      )
      a.setAttribute('target', '_blank')
      a.setAttribute('dataTrack', `diagram:download-${dataTrack}`)
      a.setAttribute('download', reName)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    // 下载 XML 格式
    async handleDownloadXml() {
      try {
        const result = await this.bpmnModeler.saveXML({ format: true })
        const { xml } = result
        this.download('xml', xml)
      } catch (err) {
        console.log(err)
        alert('导出错误，请重试')
      }
    },
    // 下载 SVG 格式
    async saveImg() {
      try {
        const result = await this.bpmnModeler.saveSVG({ format: true })
        const { xml } = result
        this.download('svg', xml)
      } catch (err) {
        console.log(err)
        alert('导出错误，请重试')
      }
    },
    // 前进
    handleRedo() {
      this.bpmnModeler.get('commandStack').redo()
    },
    // 后退
    handleUndo() {
      this.bpmnModeler.get('commandStack').undo()
    },
    // 放大缩小
    handleZoomOut() {
      this.newScale = this.newScale - 0.07
      this.bpmnModeler.get('canvas').zoom(this.newScale)
    },
    handleZoomIn() {
      this.newScale = this.newScale + 0.07
      this.bpmnModeler.get('canvas').zoom(this.newScale)
    }

  }
}
</script>

<style lang="less" scoped>
  @import url("./../../assets/css/variables.less");

  #bpmn-editor, #bpmn-canvas {
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  #bpmn-editor {
    @paddingTop: 100px;
    @paddingBottom: 20px;
    border: 1px solid #d1dbe5;
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    position: relative;
    height: calc(~"100vh - " (@paddingTop + @paddingBottom));
  }

  #properties-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 240px;
    z-index: 10;
    border-left: 1px solid #ccc;
    overflow: auto;
    background-color: #f8f8f8;
    font-size: 12px;
  }

  .btn-area {
    position: absolute;
    top: 20px;
    right: 280px;
    z-index: @flying;
  }

  .widget-area {
    position: absolute;
    top: 20px;
    left: 150px;
    z-index: @flying;
  }

  .color-picker {
    position: absolute;
    top: 20px;
    left: 100px;
    z-index: @flying;
  }

  .credit {
    position: absolute;
    bottom: 0px;
    left: 20px;
    img {
      width: 20px;
      float: left;
      margin-right: 6px;
      opacity: .5;
      position: relative;
      z-index: @floating;

      &:hover {
        opacity: 1;

        & + p {
          opacity: 1;
        }
      }
    }

    p {
      font-size: 12px;
      color: lighten(@textColor, 20%);
      opacity: 0;
      transition: opacity .3s ease;
    }
  }
</style>
