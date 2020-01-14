import '@freelog/freelog-common-lib/lib/freelog-common.css'

import { Vue } from '@freelog/freelog-common-lib'
import initEnv from '@freelog/freelog-common-lib/src/initEnv'
import contractUIPlugin from '@freelog/freelog-ui-contract'
import initLogin from '@freelog/freelog-ui-login'

import App from './app.vue'
import router,  { registerNotFoundRouete } from '@/router/index'
import store from '@/store/index'
import plugins from '@/plugins/index'
import i18n from '@/lib/i18n/index'

Vue.use(contractUIPlugin)
Vue.use(plugins)

Vue.config.devtools = true

initEnv()
initLogin({ Vue, router, i18n })
// 404页面路由是通配符的路由，须放在最后
registerNotFoundRouete()
var app = new Vue({
  el: '#app',
  store,
  router,
  i18n,
  methods: {},
  render: h => h(App)
})











