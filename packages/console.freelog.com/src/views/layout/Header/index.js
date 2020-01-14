import {mapGetters} from 'vuex'
import SearchInput from '@/components/SearchInput/index.vue'
import { logout, LOGIN_PATH } from '@freelog/freelog-ui-login'

import HeaderMenu from './HeaderMenu/index.vue';
import HeaderTools from './HeaderTools/index.vue';
import {getUserInfoFromLocalStorage} from "../../../lib/utils";

export default {
  name: 'fl-header',

  data() {
    return {
      isSideBarOpen: true,
      domainPostfix: /\.test/.test(window.location.host) ? '.testfreelog.com' : '.freelog.com',
      avatarUrl: '',
      loginLink: LOGIN_PATH,
        // userType: JSON.parse(window.localStorage.getItem('user_session')).userType,
        userType: (getUserInfoFromLocalStorage() || {userType: 0}).userType,
    }
  },
  computed: {
    ...mapGetters({
      sidebar: 'sidebar',
      session: 'session',
      nodes: 'nodes'
    }),
    pageTitle() {
      return (this.$route.meta && this.$route.meta.title) || ''
    }
  },

  components: {
    SearchInput,
      HeaderMenu,
      HeaderTools,
  },

  created() {

  },
  mounted() {
    if (this.session && this.session.user && this.session.user.userId) {
      this.initData()
    } else {
      this.$store.dispatch('getCurrentUserInfo').then(userInfo => {
        if (!userInfo) {
          this.$store.dispatch('getCurrentUser').then(() => {
            this.initData()
          })
        } else {
          this.initData()
        }
      })
    }
  },

  methods: {
    initData() {
      // this.$store.dispatch('loadNodes')
      if (this.session.user.headImage) {
        this.avatarUrl = `${this.session.user.headImage}?x-oss-process=style/head-image`
      }
    },
    errorImageHandler() {
      this.avatarUrl = '' //失败展示昵称
    },
    syncUserSession() {
      this.$store.dispatch('checkUserSession')
        .then((valid) => {
          if (!valid) {
            this.$store.dispatch('getCurrentUser').then(() => {
              window.location.reload()
            })
          }
        })
    },
    logout() {
      logout().catch(this.$error.showErrorMessage)
    },
    // searchHandler(qs) {
    //   this.$router.push({path: '/', query: {q: qs}})
    // },
    // handleCommand(lang) {
    //   if (lang === this.$i18n.locale) return
    //   var langMap = {
    //     'en': 'English',
    //     'zh-CN': '中文'
    //   }
    //   this.$confirm(this.$t('header.langSwitchQuestion', {lang: langMap[lang]}))
    //     .then(() => {
    //       window.localStorage.setItem('locale', lang)
    //       this.$i18n.locale = lang
    //       window.location.reload()
    //     }).catch(() => {
    //   })
    // }
  }
}
