import getUserInfo from '@freelog/freelog-ui-login/src/shared/getUserInfo'
export default {
  data() {
    return {}
  },
  methods: {
    async getUserId() {
      const userInfo = await getUserInfo()
      return userInfo && userInfo.userId
    }
  },
  async created() {
    
  }
}