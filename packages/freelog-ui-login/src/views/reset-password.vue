<template>
  <div class="reset-password">
    <reset-password></reset-password>
  </div>
</template>

<script>
import ResetPassword from "../components/reset-password/index.vue";
export default {
  name: "reset-password-page",
  components: { ResetPassword }
};
</script>

<style lang="less" scoped>
.reset-password {
  margin: 120px auto 0; text-align: center;
  .login-section {
    display: inline-block;
  }
}
</style>

