<template>
  <div class="login-page">
		<Login></Login>	
	</div>
</template>

<script>
import Login from '../components/login/index.vue'
export default {
	name: 'login-page',
	components: { Login }
}
</script>

<style lang="less" scoped>
.login-page {
	margin: 120px auto 0; text-align: center;
	.login-section {
		display: inline-block;
	}
}
</style>

