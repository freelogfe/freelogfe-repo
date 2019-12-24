import '@freelog/freelog-common-lib/lib/freelog-common.css'

import {sync} from 'vuex-router-sync'
import VueLazyload from 'vue-lazyload'

import { Vue } from '@freelog/freelog-common-lib'
import initEnv from '@freelog/freelog-common-lib/src/initEnv'
import initLogin from '@freelog/freelog-ui-login'
import contractUIPlugin from '@freelog/freelog-ui-contract/src/index'

import App from './App.vue'
import router, { registerNotFoundRouete } from './router'
import store from './store'
import plugins from './plugins'
import i18n from './lib/i18n/index'
import './lib/index'

sync(store, router, {moduleName: 'route'})

initEnv()
/* eslint-disable no-new */
initLogin({ Vue, router })
// 404页面路由是通配符的路由，须放在最后
registerNotFoundRouete()

Vue.use(contractUIPlugin)
Vue.use(plugins)
Vue.use(VueLazyload, {
  lazyComponent: true,
  observer: true
})

Vue.filter('pageBuildFilter', function (value) {
    if (!value) return '';
    if (value === 'page_build') {
        return 'theme';
    }
    return value;
})

Vue.config.devtools = true
// Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: {App}
})
