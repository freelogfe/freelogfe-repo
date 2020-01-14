import I18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

const win = window
const LangMap = {
  cn: 'zh-CN',
  en: 'en'
}

const cookieLocale = document.cookie.split(';').map(i => i.trim()).find(i => i.startsWith('locale='));

let localeCookie = '';

if (cookieLocale){
  localeCookie = cookieLocale.replace('locale=', '');
}

// path=/; domain=testfreelog.com
var language = localeCookie || window.localStorage.getItem('locale');
// console.log(language, 'LLLLLLLLLL');
if (!Object.values(LangMap).includes(language)) {
  if (/^zh(\-\w+)?/.test(win.navigator.language)) {
    language = LangMap.cn
  } else {
    language = LangMap.en
  }
}

win.FreelogApp = win.FreelogApp || {}
win.FreelogApp.Env = win.FreelogApp.Env || {}

win.FreelogApp.Env.leaguage = language

export default function initI18n(locales) {
  return new I18n({
    locale: language,
    messages: {
      en: Object.assign(locales.en, enLocale),
      cn: Object.assign(locales.cn, zhLocale),
      'zh-CN': locales.cn
    }
  })
}

// ElementLocale.i18n((key, value) => i18n.t(key, value))
// https://kazupon.github.io/vue-i18n/dynamic.html

// our default language that is prelaoded
// const loadedLanguages = ['en']
//
// function setI18nLanguage(lang) {
//   i18n.locale = lang
//   axios.defaults.headers.common['Accept-Language'] = lang // 设置请求头部
//   document.querySelector('html').setAttribute('lang', lang) // 根元素增加lang属性
//   return lang
// }
//
// export function loadLanguageAsync(lang) {
//   if (i18n.locale !== lang) {
//     if (!loadedLanguages.includes(lang)) {
//       return import(/* webpackChunkName: "lang-[request]" */ `./locales/${lang}`).then(msgs => {
//         i18n.setLocaleMessage(lang, msgs.default)
//         loadedLanguages.push(lang)
//         return setI18nLanguage(lang)
//       })
//     }
//     return Promise.resolve(setI18nLanguage(lang))
//   }
//   return Promise.resolve(lang)
// }

// // 在vue-router的beforeEach的全局钩子了处理
// router.beforeEach((to, from, next) => {
//   const lang = to.params.lang
//   loadLanguageAsync(lang).then(() => next())
// })
//

