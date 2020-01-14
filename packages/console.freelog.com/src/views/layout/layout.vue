<template>
<!--    <div :class="[sidebar.openSidebar?'': 'collapse-sidebar']">-->
    <div>
        <fl-header/>
        <!--        <fl-sidebar/>-->
        <section class="main" :class="themeCls">
            <div style="height: 60px;"/>
            <main class="content">
                <div
                    style="margin: 0 auto; width: 1190px;"
                    v-show="!!$route.meta.breadCrumb"
                >
                    <BreadCrumb
                        :list="$route.meta.breadCrumb || []"
                    />
                </div>
                <transition name="content">
                    <router-view class="main-view"/>
                </transition>
            </main>
        </section>
        <fl-footer class="footer-wrap" :class="themeCls" />
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Sidebar from './Sidebar/index.vue'
    import Header from './Header/index.vue'
    import Footer from './Footer/index.vue'
    // import Breadcrumb from './breadcrumb/index.vue'
    import BreadCrumb from '@/components/BreadCrumb/index.vue';

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
            // 'fl-breadcrumb': Breadcrumb
            BreadCrumb,
        }
    }
</script>

<style scoped lang="less">
    @import "../../styles/mixin.less";

    .main {
        min-height: 100vh;
        padding-bottom: 100px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
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
        // margin-top: @header-height;
    }

    .content {
        /*flex-shrink: 1;*/
        /*min-height: 100vh;*/
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
