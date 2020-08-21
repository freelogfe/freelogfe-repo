<template>
  <div class="pb-app">
    <div v-if="isLoadedAuthHandlerBox">
      <f-auth-handler-box 
        :pbAuthErrorData="pbAuthErrorData"
        @auth-box-mounted="mountAuthHandlerBox"></f-auth-handler-box>
    </div>
   
    <transition name="fade">
      <div class="pb-login-dialog" v-if="loginDialogVisible">
        <f-login 
          class="pb-l-d-comp" 
          showClose 
          @close-dialog="closeDialogHandler"
          @onLoginSuccess="loginSuccessHandler"></f-login>
      </div>
    </transition>
  </div>
</template>

<script>
  import { TOGGLE_TOOL_BAR, GO_TO_LOGIN, HANDLE_INVALID_AUTH, SHOW_AUTH_DIALOG } from '../../_core/events/pb-event-names'
  var cacheAuthEventOptions = []
  var chcheLoginEventCBs = []
  export default {
    data() {
      return {
        pbAuthErrorData: null,
        isShowToolBar: false,
        isLoadedAuthHandlerBox: false,
        loginDialogVisible: false,
      }
    },
    components: {
      FAuthHandlerBox: () => import('./components/auth-handler-box.vue'),
    },
    computed: {},
    async mounted() {
      await this.init()
    },
    methods: {
      async init() {
        this.initEvents()
        /**
         * 当pb存在授权问题：
         * 1. 显示"异常页面"
         * 2. 检查用户是否登录，否则提示用户完成"登录"
         */
        const authErrorData = window.__auth_info__ && window.__auth_info__.__auth_error_info__
        if(authErrorData) {
          this.isLoadedAuthHandlerBox = true
          this.pbAuthErrorData = authErrorData
        }
      },
      initEvents() {
        /**
         * 订阅事件"SHOW_AUTH_DIALOG"、"TOGGLE_TOOL_BAR"
         * 开发者可通过api - window.FreelogApp.trigger 触发事件并唤起对应视图
         */
        if(window.FreelogApp.on) {
          window.FreelogApp
            .on(GO_TO_LOGIN, (callback) => {
              chcheLoginEventCBs.push(callback)
              this.loginDialogVisible = true
            })
            .once(SHOW_AUTH_DIALOG, (options, callback) => {
              // 缓存事件SHOW_AUTH_DIALOG的数据
              cacheAuthEventOptions.push({ options, callback })
              this.isLoadedAuthHandlerBox = true
            })
        }
      },
      toggleToolBar() {
        this.isShowToolBar ? this.$refs.toolbar.hide() : this.$refs.toolbar.show()
        this.isShowToolBar = !this.isShowToolBar
      },
      closeDialogHandler() {
        this.loginDialogVisible = false
        // chcheLoginEventCBs = []
      },
      loginSuccessHandler(data) {
        chcheLoginEventCBs.forEach(cb => {
          if (typeof cb === 'function') {
            cb(data)
          }
        })
        this.loginDialogVisible = false
      },
      mountAuthHandlerBox() {
        // 再次触发已缓存的SHOW_AUTH_DIALOG
        for (const eventOpt of cacheAuthEventOptions) {
          const { options, callback } = eventOpt
          window.FreelogApp.trigger(SHOW_AUTH_DIALOG, options, callback)
        }
        cacheAuthEventOptions = []
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../styles/pagebuild.less';
  .pb-login-dialog {
    overflow: auto;
    position: fixed; top: 0; left: 0; z-index: 100;
    width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, .6);

    .pb-l-d-comp {
      margin: 20vh auto 0 auto; box-shadow: none;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

<style lang="less">
.f-ui-login-section.pb-l-d-comp {
  padding: 20px 0 30px; border-radius: 10px;
  background-color: #fff;
  .login-body {
    padding-top: 10px; padding-bottom: 0; border-color: transparent; border-radius: 0;
    background-color: transparent;

  }
  .login-sc-operation { margin-top: 0; }
}
</style>
