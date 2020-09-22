<!--
 * @Description:
 * @Author: kcz
 * @Date: 2019-12-30 00:37:05
 * @LastEditors: kcz
 * @LastEditTime: 2020-03-22 20:56:48
 -->
<template>
  <a-modal
    title="代码"
    :footer="null"
    :visible="visible"
    style="top:20px;"
    wrap-class-name="code-modal-9136076486841527"
    width="850px"
    :destroy-on-close="true"
    @cancel="handleCancel"
  >
    <a-tabs tab-position="left" style="height:100%">
      <a-tab-pane key="1" tab="VUE">
        <!-- vue code start -->
        <previewCode :editor-json="editorVueJson" file-format="vue" />
        <!-- vue code end -->
      </a-tab-pane>
      <a-tab-pane key="2" tab="HTML">
        <!-- html code start -->
        <previewCode :editor-json="editorHtmlJson" file-format="html" />
        <!-- html code end -->
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>
<script>
const codeVueFront = `<template>
  <div>
    <k-form-build
      :value="jsonData"
      ref="KFB"
      @submit="handleSubmit"
    />
    <button @click="getData">提交</button>
  </div>
</template>
<script>
export default {
  name: 'Demo',
  data () {
    return {
      jsonData: `
/* eslint-disable */
let codeVueLast = `
    }
  },
  methods: {
    handleSubmit(p) {
       // 通过表单提交按钮触发，获取promise对象
       p().then(res => {
         // 获取数据成功
         alert(JSON.stringify(res))
       })
         .catch(err => {
           console.log(err, '校验失败')
         })
     },
     getData() {
       // 通过函数获取数据
       this.$refs.KFB.getData().then(res => {
         // 获取数据成功
         alert(JSON.stringify(res))
       })
         .catch(err => {
           console.log(err, '校验失败')
         })
     }
  }
}
<\/script>`;

let codeHtmlFront = `<!DOCTYPE html>
<html>

<head>
  <title>表单设计器kcz</title>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="http://unpkg.com/k-form-design/lib/k-form-design.css">
</head>

<body>
  <div class="app">
    <k-form-build ref="KFB" @submit="handleSubmit" :value="jsonData"></k-form-build>
    <button @click="getData">提交</button>
  </div>
  <script src="http://cdn.kcz66.com/vue.min.js"><\/script>
  <script src="http://unpkg.com/k-form-design/lib/k-form-design.umd.min.js"><\/script>
  <script>
    let jsonData = `;
    
    let codeHtmlLast = `
    let vm = new Vue({
      el: '.app',
      data: {
        jsonData
      },
      methods: {
        handleSubmit(p) {
          // 通过表单提交按钮触发，获取promise对象
          p().then(res => {
            // 获取数据成功
            alert(JSON.stringify(res))
          })
            .catch(err => {
              console.log(err, '校验失败')
            })
        },
        getData() {
          // 通过函数获取数据
          this.$refs.KFB.getData().then(res => {
            // 获取数据成功
            alert(JSON.stringify(res))
          })
            .catch(err => {
              console.log(err, '校验失败')
            })
        }
      }
    })
  <\/script>
</body>

</html>`
/* eslint-enable */
import previewCode from '../../PreviewCode/index'
export default {
  name: 'CodeModal',
  components: {
    previewCode
  },
  data() {
    return {
      visible: false,
      editorVueJson: '',
      editorHtmlJson: '',
      jsonData: {}
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.editorVueJson =
          codeVueFront + JSON.stringify(this.jsonData) + codeVueLast

        this.editorHtmlJson =
          codeHtmlFront + JSON.stringify(this.jsonData) + codeHtmlLast
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
