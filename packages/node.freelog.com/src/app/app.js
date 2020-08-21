

import Vue from 'vue'
import axios from 'axios'
import App from './views/app.vue'
import i18n from '@/i18n/index'

import axiosPlugin from '@freelog/freelog-common-lib/src/plugins/axios'
import elementUIPlugin from './elementUI-plugins'
import initLogin from '@freelog/freelog-ui-login'
import { FREELOG_APP_MOUNTED } from '../_core/events/pb-event-names'

Vue.use(elementUIPlugin)
Vue.use(axiosPlugin, axios)

initLogin({ Vue, i18n, isRegisterRouter: false })

export async function bootstrap() {}
export async function mount({ appRootElement = null }) {

  const selector = '#app-auth'
  const el = appRootElement && appRootElement.querySelector ? appRootElement.querySelector(selector) : document.querySelector(selector)
  new Vue({
    el,
    i18n,
    methods: {},
    render: h => h(App),
    mounted() {
      if (window.FreelogApp) {
        window.FreelogApp.trigger(FREELOG_APP_MOUNTED)
      }
    },
  })
}
export async function unmount() {}

// mount({})