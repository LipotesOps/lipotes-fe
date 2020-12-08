<template>
  <div>
    <el-option v-for="item in categoryOptions" :key="item.name" :label="item.name" :value="{'_id': item._id, '_version': item._version, 'name': item.name}" />
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
