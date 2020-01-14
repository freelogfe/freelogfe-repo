import {mapGetters} from 'vuex'
import { logout, LOGIN_PATH } from '@freelog/freelog-ui-login'

import HeaderTools from './HeaderTools/index.vue';

export default {
  name: 'fl-header',

  data() {
    return {
      isSideBarOpen: true,
      domainPostfix: /\.test/.test(window.location.host) ? '.testfreelog.com' : '.freelog.com',
      avatarUrl: '',
      loginLink: LOGIN_PATH
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
      if (this.session.user && this.session.user.headImage) {
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
  }
}
