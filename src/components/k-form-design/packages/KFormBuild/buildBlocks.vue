<template>
  <!-- 栅格布局 -->
  <a-row
    v-if="record.type === 'grid'"
    class="grid-row"
    :gutter="record.options.gutter"
  >
    <a-col
      v-for="(colItem, idnex) in record.columns"
      :key="idnex"
      class="grid-col"
      :span="colItem.span || 0"
    >
      <buildBlocks
        v-for="item in colItem.list"
        ref="nestedComponents"
        :key="item.key"
        :disabled="disabled"
        :dynamic-data="dynamicData"
        :record="item"
        :form-config="formConfig"
        :config="config"
        @handleReset="$emit('handleReset')"
        @change="handleChange"
      />
    </a-col>
  </a-row>
  <!-- 卡片布局 -->
  <a-card
    v-else-if="record.type === 'card'"
    class="grid-row"
    :title="record.label"
  >
    <buildBlocks
      v-for="item in record.list"
      ref="nestedComponents"
      :key="item.key"
      :disabled="disabled"
      :dynamic-data="dynamicData"
      :record="item"
      :form-config="formConfig"
      :config="config"
      @handleReset="$emit('handleReset')"
      @change="handleChange"
    />
  </a-card>
  <!-- 表格布局 -->
  <table
    v-else-if="record.type === 'table'"
    class="kk-table-9136076486841527"
    :class="{
      bright: record.options.bright,
      small: record.options.small,
      bordered: record.options.bordered
    }"
    :style="record.options.customStyle"
  >
    <tr v-for="(trItem, trIndex) in record.trs" :key="trIndex">
      <td
        v-for="(tdItem, tdIndex) in trItem.tds"
        :key="tdIndex"
        class="table-td"
        :colspan="tdItem.colspan"
        :rowspan="tdItem.rowspan"
      >
        <buildBlocks
          v-for="item in tdItem.list"
          ref="nestedComponents"
          :key="item.key"
          :disabled="disabled"
          :dynamic-data="dynamicData"
          :record="item"
          :form-config="formConfig"
          :config="config"
          @handleReset="$emit('handleReset')"
          @change="handleChange"
        />
      </td>
    </tr>
  </table>

  <KFormItem
    v-else
    ref="nestedComponents"
    :key="record.key"
    :disabled="disabled"
    :dynamic-data="dynamicData"
    :record="record"
    :form-config="formConfig"
    :config="config"
    @handleReset="$emit('handleReset')"
    @change="handleChange"
  />
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 */
import KFormItem from '../KFormItem/index'
export default {
  name: 'BuildBlocks',
  components: {
    KFormItem
  },
  props: {
    record: {
      type: Object,
      required: true
    },
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
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    validationSubform() {
      // 验证动态表格
      const nestedComponents = this.$refs.nestedComponents
      if (
        typeof nestedComponents === 'object' &&
        nestedComponents instanceof Array
      ) {
        for (let i = 0; nestedComponents.length > i; i++) {
          if (!nestedComponents[i].validationSubform()) {
            return false
          }
        }
        return true
      } else if (typeof nestedComponents !== 'undefined') {
        return nestedComponents.validationSubform()
      } else {
        return true
      }
    },
    handleChange(value, key) {
      this.$emit('change', value, key)
    }
  }
}
</script>
