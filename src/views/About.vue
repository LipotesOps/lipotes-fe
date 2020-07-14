<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-button type="success" @click="handleQueryTask">成功按钮</el-button>
  </div>
</template>
<script>
import { queryProcessInstance } from '@/api/flowable-rest'
export default {
  methods: {
    handleQueryTask() {
      queryProcessInstance({}).then(resp => {
        if (resp.status === 200 ) {
          console.log(resp)
          this.$message({
                    message: 'launch success',
                    type: 'success'
                  })
        }
      })

    }
  }
}
</script>