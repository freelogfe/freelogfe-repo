const getters = {
    session: state => state.user.session,
    sidebar: state => state.sidebar,
    nodes: state => state.node.nodes,
    buckets: state => state.mock.buckets,
    serverTime: () => +new Date() // mock
}

export default getters
