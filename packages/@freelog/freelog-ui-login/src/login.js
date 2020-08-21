import { LAST_AUTH_INFO, USER_SESSION, LOGIN_NAME, LOGIN_PATH, HOME_PATH, USER_CENTER_PATH } from './constant'
import { setItemForStorage, getItemFromStorage, isSafeUrl } from './utils'

function goToPath(path) {
	return new Promise(resolve => {
		window.location.replace(path)
		// if(router !== null) {
		// 	router.replace({ path })
		// }else {
		// 	window.location.replace(path)
		// }
		resolve()
	})
}

// 跳登录页
export function goToLoginPage() {
	if (window.location.pathname !== LOGIN_PATH) {
		const redirect = encodeURIComponent(window.location.href)
		var targetPath = `${LOGIN_PATH}?redirect=${redirect}`
		return goToPath(targetPath)
	}
}

// 跳首页
export function goToHomePage() {
	return goToPath(HOME_PATH)
}

export function loginSuccessHandler(userInfo, redirect) {
	if (userInfo == null) return 
	const win = window
	const lastAuthInfo = getItemFromStorage(LAST_AUTH_INFO)
	setItemForStorage(USER_SESSION, userInfo)
	setItemForStorage(LOGIN_NAME, userInfo.loginName)
	// setItemForStorage(LAST_AUTH_INFO, { userId: userInfo.userId })
	var targetLink = `//www.${window.FreelogApp.Env.mainDomain}${USER_CENTER_PATH}`
	if(lastAuthInfo && lastAuthInfo.userId === userInfo.userId) {
		if (isSafeUrl(redirect)) {
			targetLink = redirect
			window.location.replace(targetLink)
			return 
		}
	}
	window.location.replace(targetLink)
	// window.location.href = targetLink
}
