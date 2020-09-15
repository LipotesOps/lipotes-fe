<template>
  <div class="app-container">
    <div class="app-content-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="待办" name="todo">待办
          <todo />
        </el-tab-pane>
        <el-tab-pane label="待阅" name="toread">待阅</el-tab-pane>
        <el-tab-pane label="已完成" name="done">已完成</el-tab-pane>
        <el-tab-pane label="待认领" name="toclaim">待认领</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import todo from './todo'
export default {
  name: 'Workbench',
  components: { todo },
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
