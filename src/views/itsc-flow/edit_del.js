import BpmnModeler from 'bpmn-js/lib/Modeler' // bpmn-js 设计器

// eslint-disable-next-line no-unused-vars
import propertiesPanelModule from 'bpmn-js-properties-panel'
// eslint-disable-next-line no-unused-vars
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
// eslint-disable-next-line no-unused-vars
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json'

import panel from './PropertyPanel' // 属性面板
import BpmData from './BpmData'
// import diagramXML from './resources/newDiagram.bpmn'

import { fetchBpmn, updateBpmn } from '@/api/itsc-flow'
export default {
  components: {
    panel
  },
  data() {
    return {
      committing: false,
      bpmnModeler: null,
      element: null,
      bpmn_id: null,
      bpmData: new BpmData(),
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  mounted() {
    const canvas = this.$refs.canvas
    // 生成实例
    this.bpmnModeler = new BpmnModeler({
      container: canvas
    })

    // 获取a标签dom节点
    const downloadLink = this.$refs.saveDiagram
    const downloadSvgLink = this.$refs.saveSvg
    // 监听流程图改变事件
    const _this = this
    this.bpmnModeler.on('commandStack.changed', function() {
      _this.saveSVG(function(err, svg) {
        _this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
      })
      _this.saveDiagram(function(err, xml) {
        _this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml)
      })
    })

    // 新增流程定义
    // this.createNewDiagram()
    this.makeNewDiagram()
  },
  created() {
    // this.makeNewDiagram()
  },
  methods: {
    makeNewDiagram() {
      const queryDate = {
        uniq_key: this.$route.query.uniq_key,
        flow_uniq_key: this.$route.query.flow_uniq_key
      }

      //  ff
      fetchBpmn(queryDate).then(resp => {
        if (resp.status === 200) {
          // 将字符串转换成图显示出来
          const bpmn_content = resp.data[0].bpmn_content
          this.bpmn_id = resp.data[0].id
          this.uniq_key = resp.data[0].uniq_key
          this.flow_uniq_key = resp.data[0].flow_uniq_key
          this.bpmnModeler.importXML(bpmn_content, err => {
            if (err) {
              console.error(err)
            } else {
              this.adjustPalette()
            }
          })
          return
        }
      },
      errResp => {
        return (errResp.response)
      }
      )
    //   ////
    },
    // 调整左侧工具栏排版
    adjustPalette() {
      try {
        // 获取 bpmn 设计器实例
        const canvas = this.$refs.canvas
        const djsPalette = canvas.children[0].children[1].children[4]
        const djsPalStyle = {
          width: '130px',
          padding: '5px',
          background: 'white',
          left: '20px',
          borderRadius: 0
        }
        for (var key in djsPalStyle) {
          djsPalette.style[key] = djsPalStyle[key]
        }
        const palette = djsPalette.children[0]
        const allGroups = palette.children
        allGroups[0].style['display'] = 'none'
        // 修改控件样式
        for (var gKey in allGroups) {
          const group = allGroups[gKey]
          for (var cKey in group.children) {
            const control = group.children[cKey]
            const controlStyle = {
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              padding: '5px'
            }
            if (
              control.className &&
              control.dataset &&
              control.className.indexOf('entry') !== -1
            ) {
              const controlProps = this.bpmData.getControl(
                control.dataset.action
              )
              control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;'>${
                controlProps['title']
              }</div>`
              for (var csKey in controlStyle) {
                control.style[csKey] = controlStyle[csKey]
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveSVG(done) {
      // 把传入的done再传给bpmn原型的saveSVG函数调用
      this.bpmnModeler.saveSVG(done)
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveDiagram(done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        done(err, xml)
      })
    },
    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    setEncoded(link, name, data) {
      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data)
      // 获取到图的xml，保存就是把这个xml提交给后台
      this.xmlStr = data
      // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
      if (data) {
        link.className = 'active'
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        link.download = name
      }
    },
    commitBpmn() {
      if (this.bpmn_id !== null && this.xmlStr) {
        const id = this.bpmn_id
        const xmlStr = this.xmlStr
        const data = {
          'uniq_key': this.uniq_key,
          'flow_uniq_key': this.flow_uniq_key,
          'bpmn_content': xmlStr,
          'version': '1.0.1'
        }
        updateBpmn(id, data).then(
          resp => {
            if (resp.status === 200) {
              console.log('success!')
            }
          },
          errResp => {
            return (errResp.response)
          }
        )
      }
    }
  }
}
