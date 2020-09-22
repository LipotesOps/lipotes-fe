<!--
 * @Description: 传入record数据，通过判断record.type，来渲染对应的组件
 * @Author: kcz
 * @Date: 2020-01-02 22:41:48
 * @LastEditors: kcz
 * @LastEditTime: 2020-07-09 22:24:34
 -->
<template>
  <a-form-item
    v-if="
      !(record.options.hidden === true) &&
        [
          'input',
          'textarea',
          'date',
          'time',
          'number',
          'radio',
          'checkbox',
          'select',
          'rate',
          'switch',
          'slider',
          'uploadImg',
          'uploadFile',
          'cascader',
          'treeSelect'
        ].includes(record.type)
    "
    :label="record.label"
    :label-col="formConfig.layout === 'horizontal' ? formConfig.labelCol : {}"
    :wrapper-col="
      formConfig.layout === 'horizontal' ? formConfig.wrapperCol : {}
    "
  >
    <!-- 单行文本 -->
    <a-input
      v-if="record.type === 'input'"
      v-decorator="[
        record.model, // input 的 name
        {
          initialValue: record.options.defaultValue, // 默认值
          rules: record.rules // 验证规则
        }
      ]"
      :style="`width:${record.options.width}`"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      :type="record.options.type"
      :allow-clear="record.options.clearable"
      :max-length="record.options.maxLength"
      @change="handleChange($event.target.value, record.model)"
    />
    <!-- 多行文本 -->
    <a-textarea
      v-else-if="record.type === 'textarea'"
      v-decorator="[
        record.model, // input 的 name
        {
          initialValue: record.options.defaultValue, // 默认值
          rules: record.rules // 验证规则
        }
      ]"
      :style="`width:${record.options.width}`"
      :auto-size="{
        minRows: record.options.minRows,
        maxRows: record.options.maxRows
      }"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      :allow-clear="record.options.clearable"
      :max-length="record.options.maxLength"
      :rows="4"
      @change="handleChange($event.target.value, record.model)"
    />

    <!-- 日期选择 -->
    <KDatePicker
      v-else-if="record.type === 'date'"
      v-decorator="[
        record.model, // input 的 name
        {
          initialValue: record.options.range
            ? record.options.rangeDefaultValue
            : record.options.defaultValue, // 默认值
          rules: record.rules // 验证规则
        }
      ]"
      :record="record"
      :parent-disabled="disabled"
      @change="handleChange($event, record.model)"
    />
    <!-- 时间选择 -->
    <KTimePicker
      v-else-if="record.type === 'time'"
      v-decorator="[
        record.model, // input 的 name
        {
          initialValue: record.options.defaultValue, // 默认值
          rules: record.rules // 验证规则
        }
      ]"
      :record="record"
      :parent-disabled="disabled"
      @change="handleChange($event, record.model)"
    />
    <!-- 数字输入框 -->
    <a-input-number
      v-else-if="record.type === 'number'"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
      :style="`width:${record.options.width}`"
      :min="
        record.options.min || record.options.min === 0
          ? record.options.min
          : -Infinity
      "
      :max="
        record.options.max || record.options.max === 0
          ? record.options.max
          : Infinity
      "
      :disabled="disabled || record.options.disabled"
      :step="record.options.step"
      :precision="
        record.options.precision > 50 ||
          (!record.options.precision && record.options.precision !== 0)
          ? null
          : record.options.precision
      "
      :placeholder="record.options.placeholder"
      @change="handleChange($event, record.model)"
    />
    <!-- 单选框 -->
    <a-radio-group
      v-else-if="record.type === 'radio'"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
      :options="
        !record.options.dynamic
          ? record.options.options
          : dynamicData[record.options.dynamicKey]
            ? dynamicData[record.options.dynamicKey]
            : []
      "
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      @change="handleChange($event.target.value, record.model)"
    />
    <!-- 多选框 -->
    <a-checkbox-group
      v-else-if="record.type === 'checkbox'"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
      :options="
        !record.options.dynamic
          ? record.options.options
          : dynamicData[record.options.dynamicKey]
            ? dynamicData[record.options.dynamicKey]
            : []
      "
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      @change="handleChange($event, record.model)"
    />
    <!-- 评分 -->
    <a-rate
      v-else-if="record.type === 'rate'"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
      :count="record.options.max"
      :disabled="disabled || record.options.disabled"
      :placeholder="record.options.placeholder"
      :allow-half="record.options.allowHalf"
      @change="handleChange($event, record.model)"
    />
    <!-- 下拉选框 -->
    <a-select
      v-else-if="record.type === 'select'"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
      :style="`width:${record.options.width}`"
      :placeholder="record.options.placeholder"
      :show-search="record.options.showSearch"
      :options="
        !record.options.dynamic
          ? record.options.options
          : dynamicData[record.options.dynamicKey]
            ? dynamicData[record.options.dynamicKey]
            : []
      "
      :disabled="disabled || record.options.disabled"
      :allow-clear="record.options.clearable"
      :mode="record.options.multiple ? 'multiple' : ''"
      @change="handleChange($event, record.model)"
    />
    <!-- 开关 -->
    <a-switch
      v-else-if="record.type === 'switch'"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          valuePropName: 'checked',
          rules: record.rules
        }
      ]"
      :disabled="disabled || record.options.disabled"
      @change="handleChange($event, record.model)"
    />
    <!-- 滑块 -->
    <div
      v-else-if="record.type === 'slider'"
      :style="`width:${record.options.width}`"
      class="slider-box"
    >
      <div class="slider">
        <a-slider
          v-decorator="[
            record.model,
            {
              initialValue: record.options.defaultValue,
              rules: record.rules
            }
          ]"
          :disabled="disabled || record.options.disabled"
          :min="record.options.min"
          :max="record.options.max"
          :step="record.options.step"
          @change="handleChange($event, record.model)"
        />
      </div>
      <div v-if="record.options.showInput" class="number">
        <a-input-number
          v-decorator="[
            record.model,
            {
              initialValue: record.options.defaultValue
            }
          ]"
          style="width:100%"
          :disabled="disabled || record.options.disabled"
          :min="record.options.min"
          :max="record.options.max"
          :step="record.options.step"
          @change="handleChange($event, record.model)"
        />
      </div>
    </div>
    <!-- 上传图片 -->
    <UploadImg
      v-else-if="record.type === 'uploadImg'"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
      :style="`width:${record.options.width}`"
      :parent-disabled="disabled"
      :record="record"
      :config="config"
      @change="handleChange($event, record.model)"
    />
    <!-- 上传文件 -->
    <UploadFile
      v-else-if="record.type === 'uploadFile'"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
      :style="`width:${record.options.width}`"
      :record="record"
      :config="config"
      :dynamic-data="dynamicData"
      :parent-disabled="disabled"
      @change="handleChange($event, record.model)"
    />
    <!-- 树选择器 -->
    <a-tree-select
      v-else-if="record.type === 'treeSelect'"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
      :style="`width:${record.options.width}`"
      :placeholder="record.options.placeholder"
      :multiple="record.options.multiple"
      :show-search="record.options.showSearch"
      :tree-checkable="record.options.treeCheckable"
      :tree-data="
        !record.options.dynamic
          ? record.options.options
          : dynamicData[record.options.dynamicKey]
            ? dynamicData[record.options.dynamicKey]
            : []
      "
      :disabled="disabled || record.options.disabled"
      :allow-clear="record.options.clearable"
      @change="handleChange($event, record.model)"
    />
    <!-- 级联选择器 -->
    <a-cascader
      v-else-if="record.type === 'cascader'"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
      :style="`width:${record.options.width}`"
      :placeholder="record.options.placeholder"
      :show-search="record.options.showSearch"
      :options="
        !record.options.dynamic
          ? record.options.options
          : dynamicData[record.options.dynamicKey]
            ? dynamicData[record.options.dynamicKey]
            : []
      "
      :disabled="disabled || record.options.disabled"
      :allow-clear="record.options.clearable"
      @change="handleChange($event, record.model)"
    />
  </a-form-item>
  <!-- 可隐藏label -->
  <a-form-item
    v-else-if="record.type === 'batch' || record.type === 'editor'"
    :label="!record.options.showLabel ? '' : record.label"
    :label-col="
      formConfig.layout === 'horizontal' && record.options.showLabel
        ? formConfig.labelCol
        : {}
    "
    :wrapper-col="
      formConfig.layout === 'horizontal' && record.options.showLabel
        ? formConfig.wrapperCol
        : {}
    "
  >
    <!-- 动态表格 -->
    <KBatch
      v-if="record.type === 'batch'"
      ref="KBatch"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
      :style="`width:${record.options.width}`"
      :record="record"
      :config="config"
      :parent-disabled="disabled"
      :dynamic-data="dynamicData"
      @change="handleChange($event, record.model)"
    />
    <!-- 富文本编辑器 -->
    <KEditor
      v-else
      ref="KEditor"
      v-decorator="[
        record.model,
        {
          initialValue: record.options.defaultValue,
          rules: record.rules
        }
      ]"
      :style="`width:${record.options.width}`"
      :record="record"
      :parent-disabled="disabled"
      :dynamic-data="dynamicData"
      @change="handleChange($event, record.model)"
    />
  </a-form-item>
  <!-- button按钮 -->
  <a-form-item
    v-else-if="record.type === 'button'"
    :wrapper-col="
      formConfig.layout === 'horizontal'
        ? { ...formConfig.wrapperCol, offset: formConfig.labelCol.span }
        : {}
    "
  >
    <a-button
      :disabled="disabled || record.options.disabled"
      :type="record.options.type"
      :html-type="record.options.handle === 'submit' ? 'submit' : undefined"
      @click="
        record.options.handle === 'submit'
          ? false
          : record.options.handle === 'reset'
            ? $emit('handleReset')
            : dynamicData[record.options.dynamicFun]
              ? dynamicData[record.options.dynamicFun]()
              : false
      "
      v-text="record.label"
    />
  </a-form-item>
  <!-- alert提示 -->
  <a-form-item v-else-if="record.type === 'alert'">
    <a-alert
      :message="record.label"
      :description="record.options.description"
      :type="record.options.type"
      :show-icon="record.options.showIcon"
      :closable="record.options.closable"
      :banner="record.options.banner"
    />
  </a-form-item>
  <!-- 文本 -->
  <a-form-item v-else-if="record.type === 'text'">
    <div :style="{ textAlign: record.options.textAlign }">
      <label
        :class="{ 'ant-form-item-required': record.options.showRequiredMark }"
        v-text="record.label"
      />
    </div>
  </a-form-item>
  <!-- html -->
  <div
    v-else-if="record.type === 'html'"
    v-html="record.options.defaultValue"
  />
  <!-- 自定义组件 -->
  <customComponent
    v-else-if="customList.includes(record.type)"
    :record="record"
    :disabled="disabled"
    :dynamic-data="dynamicData"
    :form-config="formConfig"
    @change="handleChange($event, record.model)"
  />

  <div v-else>
    <!-- 分割线 -->
    <a-divider
      v-if="
        record.type === 'divider' &&
          record.label !== '' &&
          record.options.orientation
      "
      :orientation="record.options.orientation"
    >{{ record.label }}</a-divider>
    <a-divider v-else-if="record.type === 'divider' && record.label !== ''">{{
      record.label
    }}</a-divider>
    <a-divider v-else-if="record.type === 'divider' && record.label === ''" />
  </div>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 */
// import moment from "moment";
import customComponent from './customComponent'

import KBatch from '../KBatch'
import KEditor from '../KEditor'
import UploadFile from '../UploadFile'
import UploadImg from '../UploadImg'
import KDatePicker from '../KDatePicker'
import KTimePicker from '../KTimePicker'
export default {
  name: 'KFormItem',
  components: {
    KBatch,
    KEditor,
    UploadImg,
    UploadFile,
    KDatePicker,
    KTimePicker,
    customComponent
  },
  props: {
    // 表单数组
    record: {
      type: Object,
      required: true
    },
    // form-item 宽度配置
    formConfig: {
      type: Object,
      required: true
    },
    config: {
      type: Object,
      default: () => ({})
    },
    dynamicData: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    customList() {
      if (window.$customComponentList) {
        return window.$customComponentList.map(item => item.type)
      } else {
        return []
      }
    }
  },
  methods: {
    validationSubform() {
      // 验证动态表格
      if (!this.$refs.KBatch) return true
      return this.$refs.KBatch.validationSubform()
    },
    handleChange(value, key) {
      // change事件
      this.$emit('change', value, key)
    }
  }
}
</script>
<style lang="less" scoped>
.slider-box {
  display: flex;
  > .slider {
    flex: 1;
    margin-right: 16px;
  }
  > .number {
    width: 70px;
  }
}
</style>
