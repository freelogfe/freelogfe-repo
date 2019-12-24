<template>
    <div :class="[sidebar.openSidebar?'': 'collapse-sidebar']">
        <fl-header/>
<!--        <fl-sidebar/>-->
        <section class="main" :class="themeCls">
            <main class="content">
                <transition name="content">
                    <router-view class="main-view"></router-view>
                </transition>
            </main>
        </section>
        <fl-footer class="footer-wrap"/>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Sidebar from './Sidebar/index.vue'
    import Header from './Header/index.vue'
    import Footer from './Footer/index.vue'
    import Breadcrumb from './breadcrumb/index.vue'

    export default {
        name: 'fl-layout',
        data() {
            return {}
        },
        computed: {
            ...mapGetters({
                sidebar: 'sidebar'
            }),
            themeCls() {
                if (this.$route.meta.theme) {
                    return `${this.$route.meta.theme}-theme`
                }
                return ''
            },
            // key(){
            //   return `layout-${this.$route.path}`
            // }
        },
        mounted() {
            // console.log(this, 'thisthisthisthisthisthis');
        },
        components: {
            'fl-header': Header,
            'fl-sidebar': Sidebar,
            'fl-footer': Footer,
            'fl-breadcrumb': Breadcrumb
        }
    }
</script>

<style scoped lang="less">
    @import "../../styles/mixin.less";

    .main {
        min-height: 100%;
    }

    .white-theme {
        background-color: white;
    }

    .gray-theme {
        background-color: #FAFBFB;
    }

    .main-view {
        min-height: 100%;
    }

    .content {
        margin-top: @header-height;
    }

    .content {
        transition: all .5s;
    }

    .footer-wrap {
        transition: all .5s;
    }

    .collapse-sidebar {

        .content, .footer-wrap {
            margin-left: 30px;
        }
    }
</style>
