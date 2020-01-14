<i18n src="../../i18n-locales/reset-password.json"></i18n>
<template>
  <section class="login-section">
    <header class="login-header">
      <!--<h1 class="brand">-->
      <!--<router-link to="/" tabindex="-1">freelog.com</router-link>-->
      <!--</h1>-->
      <el-alert v-if="error" :title="error.title" type="warning" :description="error.message" show-icon/>
    </header>
    <el-form class="login-form" auto-complete="off" :model="model" :rules="rules" ref="formRef" label-width="60px">
      <h2 class="heading">{{$t('resetPassword.head')}}</h2>
      <el-form-item prop="loginName" :label="$t('resetPassword.loginName')">
        <el-input type="text" v-model="model.loginName" :placeholder="$t('resetPassword.loginNamePlaceholder')"></el-input>
      </el-form-item>
      <el-form-item prop="authCode" :label="$t('resetPassword.verifyCode')">
        <el-input type="text" v-model="model.authCode"
                  style="width: 60%"
                  :placeholder="$t('resetPassword.verifyCodeInputTip')"></el-input>
        <el-button class="vcode-btn"
                   @click="sendCheckCodeNotifyHandler"
                   :disabled="disabledCheckCodeBtn">
          {{vcodeBtnText}}
        </el-button>
      </el-form-item>
      <el-form-item prop="password" :label="$t('resetPassword.password')">
        <el-input type="password" v-model="model.password"
                  autocomplete="new-password"
                  :readonly="readonly"
                  :placeholder="$t('resetPassword.inputPasswordTip')"></el-input>
      </el-form-item>
      <el-form-item>
        <router-link :to="loginLink" class="user-op">{{$t('resetPassword.backToLogin')}}<i class="el-icon-d-arrow-right"></i></router-link>
      </el-form-item>
      <el-form-item class="login-btns">
        <el-button type="primary"
                   style="width: 100%;"
                   :loading="loading"
                   @click="submit('formRef')">{{ loading ? $t('resetPassword.verifyCodeStatus[0]') : $t('resetPassword.verifyCodeStatus[1]') }}
        </el-button>
      </el-form-item>

    </el-form>
    <!--<footer class="login-footer">-->
    <!--<a href="/">返回到 freelog.com</a>-->
    <!--</footer>-->
  </section>
</template>

<script>
import ResetView from './index'

export default ResetView
</script>

<style lang="less" scoped>
  .login-section {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    width: 400px;
    min-height: 300px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    .heading {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }

    .login-btns {
      text-align: center;
    }

    .user-op {
      float: right;
      color: #1f2d3d;
      height: 20px;

      &:hover {
        color: #409EFF;
      }
    }

    .vcode-btn {
      margin-left: 10px;
    }
  }
</style>
