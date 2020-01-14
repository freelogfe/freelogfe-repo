<i18n src="../../i18n-locales/signup.json"></i18n>
<template>
  <section class="login-section"
           v-loading="logining"
           :element-loading-text="$t('signup.loadingText')">
    <header class="login-header">
      <!--<h1 class="brand">-->
      <!--<router-link to="/" tabindex="-1">freelog.com</router-link>-->
      <!--</h1>-->
      <el-alert v-if="error" :title="error.title" type="error" :description="error.message" show-icon/>
    </header>
    <el-form class="login-form" auto-complete="off" :model="model" :rules="rules" ref="signupForm" label-width="80px">
      <h2 class="heading">{{$t('signup.head')}}</h2>
      <el-form-item prop="loginName" :label="$t('signup.loginName')" required>
        <el-input type="text" v-model="model.loginName"
                  :placeholder="$t('signup.loginNamePlaceholder')" autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item prop="username" :label="$t('signup.username')" required>
        <el-input type="text" v-model="model.username"
                  :placeholder="$t('signup.usernamePlaceholder')" autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item prop="password" :label="$t('signup.password')" required>
        <el-input type="password" v-model="model.password"
                  :placeholder="$t('signup.passwordPlaceholder')"
                  autocomplete="new-password"
                  :readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item prop="checkPassword" :label="$t('signup.checkPassword')" required>
        <el-input type="password" v-model="model.checkPassword"
                  :placeholder="$t('signup.checkPasswordPlaceholder')"
                  autocomplete="new-password"
                  :readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item prop="authCode" :label="$t('signup.verifyCode')">
        <el-input v-model="model.authCode"
                  style="width: 170px"
                  :placeholder="$t('signup.verifyCodePlaceholder')"></el-input>
        <div class="check-code-wrap">
          <el-button class="vcode-btn"
                     @click="sendCheckCodeNotifyHandler"
                     :disabled="disabledCheckCodeBtn">
            {{vcodeBtnText}}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <router-link :to="loginLink" class="user-op">{{$t('signup.loginText')}}<i class="el-icon-d-arrow-right"></i></router-link>
      </el-form-item>
      <el-form-item class="login-btns">
        <el-button type="primary"
                   style="width: 100%;"
                   :loading="loading"
                   @click="submit('signupForm')">{{ loading ? $t('signup.signupingText') : $t('signup.signupedText') }}
        </el-button>
      </el-form-item>
    </el-form>
    <!--<footer class="login-footer">-->
    <!--<a href="/">返回到 freelog.com</a>-->
    <!--</footer>-->
  </section>
</template>

<script>
import SignupView from './index'

export default SignupView
</script>

<style lang="less" scoped>
  @import "index.less";
</style>
