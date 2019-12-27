<template>
  <div class="pb-app">
    <div class="pb-exceptions" v-if="isShowPbException">
      <el-button type="danger" plain @click="handleAuthError">
        {{pbExceptionMsg}}
      </el-button>
    </div>
    <contract-signing-dialog
            :activeIndex="activePresentableIndex"
            :visible.sync="isShowDialog"
            @close-dialog="hideAuthDialog"
            :presentableList="scAuthPresentableList"
    ></contract-signing-dialog>
    <!--<tool-bar ref="toolbar"></tool-bar>-->
    <transition name="fade">
      <div class="pb-login-dialog" v-if="loginDialogVisible">
        <FLogin class="pb-l-d-comp" show-close @close-dialog="loginDialogVisible = false"></FLogin>
      </div>
    </transition>
  </div>
</template>


<script>
  import { FLogin } from '@freelog/freelog-ui-login'
  import { ContractSigningDialog } from '@freelog/freelog-ui-contract'
  import { noop } from '../core/utils/util'
  import { TOGGLE_TOOL_BAR, GO_TO_LOGIN, HANDLE_INVALID_AUTH, SHOW_AUTH_DIALOG } from '../_core/events/pb-event-names.ts'

  // import ToolBar from '@/components/ToolBar/index.vue'
  var authCallback = function() {}
  export default {
    data() {
      return {
        isShowToolBar: false,
        isShowPbException: false,
        isLogin: false,
        isShowDialog: false,
        loginDialogVisible: false,
        pbExceptionMsg: '完成签约授权',
        scAuthPresentableList: [],
        activePresentableIndex: 0,
      }
    },
    components: {
      FLogin, ContractSigningDialog
    },

    computed: {

    },

    mounted() {
      this.init()
    },

    methods: {
      init() {
        this.initEvents()

        /**
         * 当pb存在授权问题
         * 1. 显示"异常页面"
         * 2. 检查用户是否登录，否则提示用户完成"登录"
         */
        const { authErrorData = null, isPbAuthOk  } = this.checkPbAuth()
        if(!isPbAuthOk) {
          this.isShowPbException = true
          this.pbAuthErrorData = authErrorData
          this.checkLoginStatus()
        }
      },
      /**
       * 订阅事件"SHOW_AUTH_DIALOG"、"TOGGLE_TOOL_BAR"
       * 开发者可通过api - window.FreelogApp.trigger 触发事件并唤起对应视图
       */
      initEvents() {
        if(window.FreelogApp.on) {
          window.FreelogApp
            .on(GO_TO_LOGIN, this.showLoginDialog)
            .on(TOGGLE_TOOL_BAR, this.toggleToolBar)
            .on(SHOW_AUTH_DIALOG, this.showAuthDialog)
        }
      },

      checkPbAuth() {
        const authInfo = window.__auth_info__
        const authErrorData = authInfo && authInfo.__auth_error_info__
        if(!authErrorData) {
          return { isPbAuthOk: true }
        }else {
          return { isPbAuthOk: false, authErrorData }
        }
      },

      checkLoginStatus() {
        this.isLogin = window.FreelogApp.QI.checkUserIsLogin()
        if(!this.isLogin) {
          this.pbExceptionMsg = '去登录，并完成签约授权'
        }
      },

      handleAuthError() {
        if(!this.isLogin) {
          window.FreelogApp.trigger(GO_TO_LOGIN)
        }else {
          return new Promise((resolve) => {
            window.FreelogApp.trigger(HANDLE_INVALID_AUTH, { response: this.pbAuthErrorData }, (data) => {
              if(data) {
                resolve(data)
              }
            })
          })
            .then(data => {
              if (data._contractStatus === 3) {
                window.location.reload() // 后续考虑局部更新？
              }
            })
        }

      },

      showLoginDialog() {
        this.loginDialogVisible = true
      },

      showAuthDialog({presentableList, activePresentableId, callback}) {
        
        if (typeof callback === 'function'){
          authCallback = callback
        }

        if (presentableList.length === 1) {
          activePresentableId = presentableList[0].presentableId
        }

        this.scAuthPresentableList = presentableList
        this.resolvePresentableActiveIndex(activePresentableId)
        this.isShowDialog = true
      },

      hideAuthDialog({ isUpdatedContract }) {
        this.isShowDialog = false
        if (isUpdatedContract) {
          this.refreshAuthPresentList()
            .then((data) => authCallback(data))
            .catch((e) => {
              this.$message.error(e)
              authCallback(null)
            })
        }
      },

      beforeClose(done) {
        done()
      },

      toggleToolBar() {
        this.isShowToolBar ? this.$refs.toolbar.hide() : this.$refs.toolbar.show()
        this.isShowToolBar = !this.isShowToolBar
      },
      resolvePresentableActiveIndex(presentableId) {
        this.activePresentableIndex = 0
        if (typeof presentableId === 'string') {
          for (let i = 0; i < this.scAuthPresentableList.length; i += 1) {
            if (this.scAuthPresentableList[i].presentableId === presentableId) {
              this.activePresentableIndex = i
              break
            }
          }
        }
      },
      refreshAuthPresentList() {
        let nodeId = null
        const presentableIDs = this.scAuthPresentableList.map((p) => {
          nodeId = p.nodeId
          return p.presentableId
        })

        // 获取presentable授权详情
        return window.FreelogApp.QI.get(`/v1/presentables/auth.json?pids=${presentableIDs}&nodeId=${nodeId}`)
          .then(res => res.data)
          .then((res) => {
            if (res.errcode === 0) {
              return res.data
            }
            return Promise.reject(res.msg)
          })
      },
    }
  }
</script>

<style lang="less">
  @import "./pagebuild.less";
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
