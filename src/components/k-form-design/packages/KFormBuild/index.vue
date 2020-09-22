<template>
  <a-config-provider :locale="locale">
    <a-form
      v-if="
        typeof value.list !== 'undefined' && typeof value.config !== 'undefined'
      "
      class="k-form-build-9136076486841527"
      :layout="value.config.layout"
      :hide-required-mark="value.config.hideRequiredMark"
      :form="form"
      :style="value.config.customStyle"
      @submit="handleSubmit"
    >
      <buildBlocks
        v-for="(record, index) in value.list"
        ref="buildBlocks"
        :record="record"
        :key="index"
        :dynamic-data="dynamicData"
        :config="config"
        :disabled="disabled"
        :form-config="value.config"
        @handleReset="reset"
        @change="handleChange"
      />
    </a-form>
  </a-config-provider>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 * description 将json数据构建成表单
 */
import buildBlocks from './buildBlocks'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
// import moment from "moment";
export default {
  name: 'KFormBuild',
  components: {
    buildBlocks
  },
  // props: ["value", "dynamicData"],
  props: {
    value: {
      type: Object,
      required: true
    },
    dynamicData: {
      type: Object,
      default: () => ({})
    },
    config: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    outputString: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      locale: zhCN,
      form: this.$form.createForm(this)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setData(this.defaultValue)
    })
  },
  methods: {
    // moment,
    handleSubmit(e) {
      // 提交按钮触发，并触发submit函数，返回getData函数
      e.preventDefault()
      this.$emit('submit', this.getData)
    },
    reset() {
      // 重置表单
      this.form.resetFields()
    },
    getData() {
      // 提交函数，提供父级组件调用
      return new Promise((resolve, reject) => {
        try {
          this.form.validateFields((err, values) => {
            if (err) {
              reject(err)
            }
            this.$refs.buildBlocks.forEach(item => {
              if (!item.validationSubform()) {
                reject(err)
              }
            })
            if (this.outputString) {
              // 需要所有value转成字符串
              for (const key in values) {
                const type = typeof values[key]
                if (type === 'string' || type === 'undefined') {
                  continue
                } else if (type === 'object') {
                  values[key] = `k-form-design#${type}#${JSON.stringify(
                    values[key]
                  )}`
                } else {
                  values[key] = `k-form-design#${type}#${String(values[key])}`
                }
              }
              resolve(values)
            } else {
              resolve(values)
            }
          })
        } catch (err) {
          reject(err)
        }
      })
    },
    setData(json) {
      return new Promise((resolve, reject) => {
        try {
          if (this.outputString) {
            // 将非string数据还原
            for (const key in json) {
              if (!json[key].startsWith('k-form-design#')) {
                continue
              }
              const array = json[key].split('#')
              if (array[1] === 'object') {
                json[key] = JSON.parse(array[2])
              } else if (array[1] === 'number') {
                json[key] = Number(array[2])
              } else if (array[1] === 'boolean') {
                json[key] = Boolean(array[2])
              }
            }
            this.form.setFieldsValue(json)
          } else {
            this.form.setFieldsValue(json)
          }
        } catch (err) {
          reject(err)
        }
      })
    },

    // 批量设置某个option的值
    setOptions(fields, optionName, value) {
      fields = new Set(fields)

      // 递归遍历控件树
      const traverse = array => {
        array.forEach(element => {
          if (fields.has(element.model)) {
            element.options[optionName] = value
          }
          if (element.type === 'grid') {
            // 栅格布局
            element.columns.forEach(item => {
              traverse(item.list)
            })
          } else if (element.type === 'card') {
            // 卡片布局
            traverse(element.list)
          } else if (element.type === 'batch') {
            // 动态表格
            traverse(element.list)
          }
          if (element.type === 'table') {
            // 表格布局
            element.trs.forEach(item => {
              item.tds.forEach(val => {
                traverse(val.list)
              })
            })
          }
        })
      }
      traverse(this.value.list)
    },
    // 隐藏表单字段
    hide(fields) {
      this.setOptions(fields, 'hidden', true)
    },
    // 显示表单字段
    show(fields) {
      this.setOptions(fields, 'hidden', false)
    },
    // 禁用表单字段
    disable(fields) {
      this.setOptions(fields, 'disabled', true)
    },
    // 启用表单字段
    enable(fields) {
      this.setOptions(fields, 'disabled', false)
    },
    handleChange(value, key) {
      // 触发change事件
      this.$emit('change', value, key)
    }
  }
}
</script>
