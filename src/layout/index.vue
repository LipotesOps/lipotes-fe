<template>
  <div :class="classObj" class="app-wrapper"></div>
</template>

<script>
export default {
  name: "Layout",
  computed: {},
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    }
  }
};
</script>

<style lang="less" scoped></style>
