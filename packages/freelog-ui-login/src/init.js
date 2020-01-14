
import FLogin from './components/login/index.vue'
import FSignup from './components/signup/index.vue'
import FRsetPassword from './components/reset-password/index.vue'
import LoginPage from './views/login.vue'
import SignupPage from './views/signup.vue'
import RsetPasswordPage from './views/reset-password.vue'
import { initToast } from './components/toast/toast'

import { LOGIN_PATH, SIGN_PATH, RESET_PASSWORD_PATH } from './constant'
import addAxiosInterceptorHandler from './interceptor'
import initWindowListener from './listenWindowVisibility'
import defualtOptions, { checkOptions } from './options'
import initCode, { runAuthenticationHandler, checkLoginStatus } from './core'
import { goToLoginPage } from './login'

import loginLocales from './i18n-locales/login.json'
import signupLocales from './i18n-locales/signup.json'
import resetPasswordLocales from './i18n-locales/reset-password.json'

var isNeedCheckLoginStatus = true
export default function init(options) {
	options = Object.assign({}, defualtOptions, options)
	// 审查参数
	checkOptions(options)
	// UI组件注册
	registerComponent(options)
	// 初始化toast组件
	initToast(options.Vue)
	// 添加请求响应拦截器：处理授权认证问题
	if (options.isAddResponseInterceptor) {
		addAxiosInterceptorHandler(options)
	}
	// 初始化：挂载axios instance
	initCode(options)
	// 组件路由组册：新增组件路由配置
	if (options.isRegisterRouter) {
		registerRouter(options)
	}
	// 添加浏览器窗口监听器：重新验证用户信息
	if (options.isListenWindowVisibility) {
		initWindowListener((type) => {
			// 切换tab后，需重新判断登录态
			isNeedCheckLoginStatus = true
			runAuthenticationHandler()
		})
	}
}

function registerComponent(options) {
	const Vue = options.Vue
	Vue.component(FLogin.name, FLogin)
	Vue.component(FSignup.name, FSignup)
	Vue.component(FRsetPassword.name, FRsetPassword)
}

function registerRouter(options) {
	const locale = options.i18n.locale
	options.router.addRoutes([{
		path: LOGIN_PATH,
		component: LoginPage,
		meta: { 
			requiresAuth: false,
			title: loginLocales[locale]['login']['title']
		}
	},
	{
		path: SIGN_PATH,
		component: SignupPage,
		meta: { 
			requiresAuth: false,
			title: signupLocales[locale]['signup']['title']
		}
	},
	{
		path: RESET_PASSWORD_PATH,
		component: RsetPasswordPage,
		meta: { 
			requiresAuth: false,
			title: resetPasswordLocales[locale]['resetPassword']['title']
		}
	}])

	if (options.isAuthenticationBeforeRoute) {
		options.router.beforeEach((to, from, next) => {
			const meta = to.meta || { requiresAuth: true, requireAuth: true }
			meta['requiresAuth'] = typeof meta['requiresAuth'] === 'undefined' ? true : meta['requiresAuth']
			meta['requireAuth'] = typeof meta['requireAuth'] === 'undefined' ? true : meta['requireAuth']
			if(!meta.requiresAuth || !meta.requireAuth) {
				next()
				return 
			}
			//避免每次跳转都判断登录态的判断，只有切换tab后回来再重新判断
			if(!isNeedCheckLoginStatus) {
				next()
			}else {
				checkLoginStatus()
					.then(loginStatus => {
						isNeedCheckLoginStatus = false
						if(loginStatus === 0) {
							goToLoginPage()
						}else {
							next()
						}
					})
			}
		})
	}
}

