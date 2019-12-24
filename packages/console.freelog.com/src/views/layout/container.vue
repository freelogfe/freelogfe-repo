<template>
  <transition name="content">
    <router-view :key="key"></router-view>
      123
  </transition>
</template>

<script>
export default {
  name: 'fl-container',
  data() {
    return {
      // key: `view-${this.$route.path}`
    }
  },
  computed: {
    key(){
      return `${this.$route.path}`  //切换不同url必定重新渲染
    }
  },
  beforeRouteUpdate(to, from, next) {
    let toPath = to.fullPath
    const params = this.$route.params
    let matched = false

    // 适配多级嵌套参数解析
    Object.keys(params).forEach((key) => {
      const match = `:${key}`
      if (toPath.indexOf(match) > -1) {
        matched = true
        toPath = toPath.replace(match, params[key])
      }
    })
    if (matched) {
      next({ path: toPath })
    } else {
      next()
    }
  }
}
</script>

<style>
  body, .app-wrapper {
    height: 100%;
  }
</style>
