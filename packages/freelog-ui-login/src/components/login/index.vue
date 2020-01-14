<i18n src="../../i18n-locales/login.json"></i18n>
<template>
  <section class="login-section">
    <header class="login-header">
      <!--<h1 class="brand">-->
      <!--<router-link to="/" tabindex="-1">freelog.com</router-link>-->
      <!--</h1>-->
      <h2 class="heading" :class="{ 'show-error': error }">{{$t('login.head')}}</h2>
      <i class="el-icon-close" v-if="showClose" @click="tapCloseBtn"></i>
      <el-alert type="warning" :title="error.title" :description="error.message" show-icon v-if="error" />
    </header>
    <el-form
      class="login-form"
      auto-complete="off"
      :model="model"
      :rules="rules"
      ref="loginForm"
      label-width="0"
    >
      <el-form-item prop="loginName">
        <el-input
          type="text"
          v-model="model.loginName"
          name="username"
          :placeholder="$t('login.usernamePlaceholder')"
        >
          <template slot="prepend">
            <i class="fa fa-user" aria-hidden="true"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="model.password"
          name="password"
          :placeholder="$t('login.passwordPlaceholder')"
          @keyup.native.enter="submit('loginForm')"
        >
          <template slot="prepend">
            <i class="fa fa-unlock-alt" aria-hidden="true"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="login-sc-operation">
        <el-checkbox v-model="rememberUser">{{$t('login.rememberUser')}}</el-checkbox>
        <span class="user-ops">
          <template v-if="$route">
            <router-link class="user-op" :to="resetPwLink" target="_blank">{{$t('login.resetPW')}}</router-link>|
            <router-link class="user-op" :to="signUpLink">{{$t('login.signup')}}</router-link>
          </template>
          <template v-else>
            <a class="user-op" :href="resetPwLink" target="_blank">{{$t('login.resetPW')}}</a> |
            <a class="user-op" :href="signUpLink" target="_blank">{{$t('login.signup')}}</a>
          </template>
        </span>
      </el-form-item>
      <el-form-item class="login-btns">
        <el-button
          type="primary"
          style="width: 100%;"
          :loading="loading"
          class="js-login-btn"
          @click="submit('loginForm')"
        >{{ loading ? $t('login.loginStatus[0]') : $t('login.loginStatus[1]') }}</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { isSafeUrl, setItemForStorage, getItemFromStorage } from "../../utils";
import {
  SIGN_PATH,
  RESET_PASSWORD_PATH,
  LOGIN_NAME,
  USER_SESSION,
  LAST_AUTH_INFO
} from "../../constant";
import FToast from "../toast/index.vue";

export default {
  name: "f-login",

  components: { FToast },

  props: {
    showClose: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const $i18n = this.$i18n;
    const validateLoginName = function(rule, value, callback) {
      if (value) {
        const EMAIL_REG = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
        const PHONE_REG = /^1[34578]\d{9}$/;
        if (!EMAIL_REG.test(value) && !PHONE_REG.test(value)) {
          callback(new Error($i18n.t("login.validateErrors[0]")));
        } else {
          callback();
        }
      } else {
        callback(new Error($i18n.t("login.validateErrors[1]")));
      }
    };

    const rules = {
      loginName: [
        {
          required: true,
          message: $i18n.t("login.ruleMessages[0]"),
          trigger: "blur"
        },
        { validator: validateLoginName, trigger: "blur" }
      ],
      password: [
        {
          required: true,
          message: $i18n.t("login.ruleMessages[1]"),
          trigger: "blur"
        },
        { min: 6, message: $i18n.t("login.ruleMessages[2]"), trigger: "blur" }
      ]
    };
    const loginName = window.localStorage.getItem("loginName") || "";

    return {
      model: {
        loginName,
        password: ""
      },
      rules,
      error: null,
      loading: false,
      rememberUser: false
    };
  },

  computed: {
    resetPwLink() {
      return this.resolveLink(RESET_PASSWORD_PATH)
    },
    signUpLink() {
      return this.resolveLink(SIGN_PATH)
    }
  },

  mounted() {
  },

  methods: {
    tapCloseBtn() {
      this.$emit('close-dialog')
    },
    resolveLink(path) {
      var link = `${path}`
      if (this.$route != null) {
        const { redirect } = this.$route.query
        if (isSafeUrl(redirect)) {
          link = `${link}?redirect=${redirect}`
        }
      }else {
        const hostName = `${window.location.protocol}//www.${window.FreelogApp.Env.mainDomain}`
        link = `${hostName}${link}`
      }
      return link
    },
    submit(ref) {
      const self = this;
      this.$refs[ref].validate(valid => {
        if (!valid) {
          return;
        }

        const data = Object.assign(this.model, {
          isRememer: this.rememberUser ? 1 : 0
        });

        this.fetchLogin(data).then(userInfo => {
          this.afterLogin(userInfo);
        });
      });
    },
    fetchLogin(data) {
      this.error = null;
      this.loading = true;
      return this.$axios
        .post("/v1/passport/login", data)
        .then(res => {
          this.loading = false;
          if (res.data.ret === 0 && res.data.errcode === 0) {
            var userInfo = res.data.data
            userInfo.loginName = data.loginName
            return Promise.resolve(userInfo);
          }
          return Promise.reject(res.data.msg);
        })
        .catch(err => {
          console.log(err);
          this.$emit("after-login-fail")
          const $i18n = this.$i18n
          if (typeof err === "string") {
            this.error = { title: "", message: err }
          } else {
            this.error = {
              title: $i18n.t("login.errorTitle"),
              message: err.response.errorMsg || $i18n.t("login.errors[0]")
            }
            switch (err.response && err.response.status) {
              case 401:
                this.error.message = $i18n.t("login.errors[1]")
                break
              case 500:
                this.error.message = $i18n.t("login.errors[2]")
                break
              default:
                this.error.message = $i18n.t("login.errors[3]")
            }
          }
          this.loading = false
        })
    },
    afterLogin(userInfo) {
      if (userInfo == null) return 
      this.$emit("after-login-success")
      const win = window
      setItemForStorage(USER_SESSION, userInfo)
      setItemForStorage(LOGIN_NAME, userInfo.loginName)
      const lastAuthInfo = getItemFromStorage(LAST_AUTH_INFO)
      var targetLink = '/'
      if(lastAuthInfo && lastAuthInfo.userId === userInfo.userId) {
        const redirect = this.$route.query.redirect
        if (isSafeUrl(redirect)) {
          targetLink = redirect
        }
      }
      window.location.replace(targetLink)
    }
  }
}
</script>

<style lang="less" scoped>
.login-section {
  position: relative;
  width: 350px; height: auto;
  padding: 35px 35px 15px 35px; border: 1px solid #eaeaea; border-radius: 5px;
  background: #fff; background-clip: padding-box;
  box-shadow: 0 0 25px #cac6c6;
 
  .el-icon-close {
    position: absolute; top: 4px; right: 4px; z-index: 10;
    padding: 6px;
    font-size: 16px; cursor: pointer;
  }

  .heading {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
    &.show-error { 
      margin-bottom: 20px; 
    }
  }
  .el-alert { margin-bottom: 20px; }

  .user-ops {
    float: right;
    .user-op {
      color: #1f2d3d;
      &:hover {
        color: #35b5ff;
      }
    }
  }
  .login-btns {
    text-align: center;
  }
}

@media screen and (max-width: 768px) {
  .login-section {
    box-sizing: border-box; padding: 30px 20px; width: 90%;
    .heading {
      margin-bottom: 20px; font-size: 26px;
    }
    .login-btns {
      margin-bottom: 0;
    }
  }
}
</style>

<style lang="less">
  @media screen and (max-width: 768px) {
    .login-section {
      .login-sc-operation {
        .el-form-item__content {
          line-height: 28px;
          .el-input-group__prepend {
            padding: 0 15px;
          }
        }
      }

      .el-form-item__content {
        .el-input-group__prepend {
          padding: 0 15px;
        }
      }
    }
    
  }
</style>
