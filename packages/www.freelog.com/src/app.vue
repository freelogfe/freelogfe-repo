<template>
  <div class="app-wrapper" :class="[$i18n.locale]" >
    <nav-top-bar></nav-top-bar>
    <el-container class="app-container" :class="[{ 'noPaddingLeft': !isShowSidebar }]" >
      <router-view></router-view>
    </el-container>
    <f-footer></f-footer>
  </div>
</template>

<script>
  import NavTopBar from '@/components/NavTop/index.vue'
  import Footer from '@/components/Footer/index.vue'
  import UserAsideNav from '@/components/UserAsideNav/index.vue'
  import { LOGIN_PATH, SIGN_PATH, RESET_PASSWORD_PATH } from '@freelog/freelog-ui-login'

  export default {
    data() {
      return {
        isShowSidebar: true
      }
    },

    computed: {
      themeCls() {
        return this.$route.meta.theme || 'white'
      },
      isError() {
        return (typeof this.$route.meta.error === 'undefined') ? false : this.$route.meta.error
      }
    },

    watch: {
      '$route.fullPath'() {
        this.resolveFullPath()
      }
    },

    mounted() {
      this.resolveFullPath()
    },
    components: {
      'f-footer': Footer,
      NavTopBar,
      UserAsideNav
    },

    methods: {
      resolveFullPath() {
        const { meta: { hideAside }, path } = this.$route
        this.isShowSidebar = !hideAside
        if ([LOGIN_PATH, SIGN_PATH, RESET_PASSWORD_PATH].indexOf(path) !== -1) {
          this.isShowSidebar = false
        }
      }
    }
  }
</script>


<style lang="less" type="text/less">
  @import "./styles/global.less";
  @import "app.less";
</style>
