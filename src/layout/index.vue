<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container" />
  </div>
</template>

<script>
import { Sidebar } from "./components";
export default {
  name: "Layout",
  components: {
    Sidebar
  },
  computed: {},
  methods: {}
};
</script>

<style lang="less" scoped></style>
