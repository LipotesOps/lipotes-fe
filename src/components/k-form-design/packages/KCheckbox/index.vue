<template>
  <a-checkbox :val="_val" :checked="chackboxVal" @change="handleChange">
    {{ label }}
  </a-checkbox>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 * description 多选框组件,改成v-model Boolean值
 */
export default {
  name: 'KCheckbox',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chackboxVal: false
    }
  },
  computed: {
    _val() {
      this.handleSetChackboxVal(this.value)
      return this.value
    }
  },
  methods: {
    handleChange(e) {
      this.$emit('input', e.target.checked)
    },
    handleSetChackboxVal(val) {
      this.chackboxVal = val
    }
  }
}
</script>
