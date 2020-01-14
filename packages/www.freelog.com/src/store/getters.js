const getters = {
  session: state => state.user.session,
  serverTime: () => +new Date() // mock
}

export default getters
