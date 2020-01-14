<template>
  <div id="breadcrumb-wrap" v-if="breadcrumbs.length > 0">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: item.path }" :key="item.path" v-for="item in breadcrumbs">
        {{item.title}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import FBreadcrumb from './breadcrumb.vue'
export default {
  name: 'fl-breadcrumb',

  components: { FBreadcrumb },

  data() {
    return {
      breadcrumbs: []
    }
  },
  watch: {
    $route: 'breadcrumbHandler'
  },
  mounted() {
    this.breadcrumbHandler()
  },
  methods: {
    breadcrumbHandler() {
      const { title, name, breadcrumbs = [] } = this.$route.meta
      if (name === '404' || breadcrumbs.length === 0) {
        this.breadcrumbs = []
      } else {
        this.breadcrumbs = [ ...breadcrumbs, { title } ]
      }
    },
  }
}
</script>

<style lang="less" type="text/less">
#breadcrumb-wrap {
  margin: 0 auto 40px;
  .el-breadcrumb {
    line-height: 18px;
    .el-breadcrumb__item {
      font-size: 14px; 
      .el-breadcrumb__inner { color: #999; }
      .el-breadcrumb__separator { margin: 0 8px 0 4px; }
    }
    [aria-current="page"] {
      font-size: 18px; 
      .el-breadcrumb__inner { color: #333; }
    }
  }
}
</style>
