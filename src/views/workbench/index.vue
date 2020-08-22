<template>
  <div class="app-container">
    <div class="workbench-container" style="margin: 0px; padding: 10px; background-color:White; border-radius: 8px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="待办" name="todo">待办</el-tab-pane>
        <el-tab-pane label="待阅" name="toread">待阅</el-tab-pane>
        <el-tab-pane label="已完成" name="done">已完成</el-tab-pane>
        <el-tab-pane label="待认领" name="toclaim">待认领</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Workbench',
  data() {
    return {
      activeName: 'todo'
    }
  },
  created() {
  },
  methods: {
    handleClick(tab) {
      // this.$router.push(tab.name)
      this.activeName = tab.name
      console.log(tab)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
