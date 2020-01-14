

import '../style/loading.less'
import '@freelog/freelog-common-lib/lib/freelog-common.css'

import { Vue } from '@freelog/freelog-common-lib'
import contractUIPlugin from '@freelog/freelog-ui-contract'
import initLogin from '@freelog/freelog-ui-login'

import App from './app.vue'
import i18n from '@/i18n/index'

Vue.use(contractUIPlugin)
initLogin({ Vue, isRegisterRouter: false, i18n })

Vue.config.devtools = true
new Vue({
  el: '#app-auth',
  i18n,
  methods: {},
  render: h => h(App)
})





