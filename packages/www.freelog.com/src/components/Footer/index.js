import {mapGetters} from 'vuex'

export default {
    name: 'fl-footer',

    data() {
        return {
            year: '',
            // 是否显示本 footer
            isShowFooter: true,
        }
    },

    computed: {
        ...mapGetters(['serverTime']),

    },
    created() {
        const date = new Date(this.serverTime || Date.now())
        this.year = date.getFullYear()
    },
    methods: {},
    watch: {
        '$route.fullPath'() {
            const {meta: {hideFooter}} = this.$route;
            this.isShowFooter = !hideFooter;
        }
    },
    mounted() {
        const {meta: {hideFooter}} = this.$route;
        this.isShowFooter = !hideFooter;
    },
}
