<template>
  <div class="signup-page">
		<sign-up></sign-up>	
	</div>
</template>

<script>
import SignUp from '../components/signup/index.vue'
export default {
	name: 'signup-page',
	components: { SignUp }
}
</script>

<style lang="less" scoped>
.signup-page {
	margin: 120px auto 0; text-align: center;
	.login-section {
		display: inline-block;
	}
}
</style>

