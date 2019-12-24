import axios from "@/lib/axios";

const types = {
    LOAD_BUCKETS: 'loadBuckets',
};

const mockStore = {
    state: {
        buckets: []
    },
    mutations: {
        [types.LOAD_BUCKETS](state, buckets) {
            // console.log('#####', buckets);
            state.buckets = buckets;
        },
    },
    actions: {
        async [types.LOAD_BUCKETS]({commit}) {
            const {data} = await axios.get('/v1/resources/mocks/buckets');

            // console.log(data.data, 'resres');
            commit(types.LOAD_BUCKETS, data.data)
        },
    }
};

export default mockStore;
