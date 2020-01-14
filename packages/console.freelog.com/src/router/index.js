/**
 * meta 配置
 * hidden=true表示在导航上默认不展示
 * requiresAuth=true 表示需要身份验证即需要登录
 * scrollTop=true 切换路由时，页面滚动到顶部，默认是true
 * type: resource/node 对应的侧边栏
 */
import Router from 'vue-router'
import {Vue} from '@freelog/freelog-common-lib'
import Views from '@/views/index'
import nodeRoute from './node'
import resourceRoute from './resource'
import mockRoute from './mock'
import alphaTestRoute from './alpha-test'
import releaseRoute from './release'
import batchOperationRoute from './batch-operation'
import i18n from '../lib/i18n'
import {getUserInfoFromLocalStorage} from "../lib/utils";

Vue.use(Router)

const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
        return savedPosition
    }
    const position = {}
    if (to.hash) {
        position.selector = to.hash
    }

    if (to.meta.scrollToTop !== false) {
        position.x = 0
        position.y = 0
    }
    return position
}

const routerConfig = {
    mode: 'history',
    scrollBehavior,
    routes: [
        {
            path: '/',
            meta: {title: i18n.t('resource.market')},
            component: Views.layout,
            children: [
                resourceRoute,
                nodeRoute,
                releaseRoute,
                mockRoute,
                alphaTestRoute,
                batchOperationRoute,
                {
                    path: 'about',
                    hidden: true,
                    meta: {
                        requiresAuth: false,
                        title: `${i18n.t('aboutView.about')}freelog`
                    },
                    component: Views.aboutView
                },
                {
                    path: 'setting',
                    hidden: true,
                    meta: {
                        requiresAuth: true,
                        title: i18n.t('routes.accountSetting')
                    },
                    component: Views.userView
                },
                {
                    path: 'help',
                    hidden: true,
                    meta: {
                        requiresAuth: false,
                        title: i18n.t('helpView.title')
                    },
                    component: Views.helpView
                },
                {
                    path: 'market',
                    hidden: true,
                    meta: {
                        requiresAuth: false,
                        title: i18n.t('resource.market'),
                        theme: 'gray',
                        hideFooter: true,
                    },
                    component: Views.marketView
                },
                {
                    path: '/',
                    hidden: true,
                    meta: {
                        requiresAuth: false,
                        title: i18n.t('resource.market'),
                        theme: 'gray'
                    },
                    component: Views.mainView
                },
                {
                    path: '/main/node-examples',
                    hidden: true,
                    meta: {
                        requiresAuth: false,
                        // title: i18n.t('resource.market'),
                        title: '示例节点',
                        theme: 'gray',
                        hideFooter: true,
                    },
                    component: Views.mainView
                },
                {
                    path: '/release-management/*',
                    hidden: true,
                    meta: {
                        requiresAuth: false,
                        title: i18n.t('release.management'),
                        theme: 'white',
                        hideFooter: true,
                    },
                    component: Views.releaseManagementView
                }
            ]
        },
    ]
}

const notFoundRouteConfig = {
    path: '*',
    meta: {
        requiresAuth: false,
        title: 'not found'
    },
    component: Views.layout,
    children: [{
        name: '404',
        path: '',
        meta: {
            requiresAuth: false,
            title: '404'
        },
        component: Views.error
    }]
}
const router = new Router(routerConfig)

export function registerNotFoundRouete() {
    // 延迟执行挂载404页面路由
    setTimeout(() => {
        router.addRoutes([notFoundRouteConfig])
    }, 0)
}

export default router

router.beforeEach((to, from, next) => {
    // ...
    // console.log(to, from, 'to, from');

    if (to.path === '/login' || to.path === '/signup') {
        return next();
    }

    if (!to.path.startsWith('/alpha-test') && (getUserInfoFromLocalStorage() || {userType: 0}).userType !== 1) {
        return next({
            path: '/alpha-test',
            replace: true,
        });
    }

    if (to.path.startsWith('/alpha-test') && (getUserInfoFromLocalStorage() || {userType: 0}).userType === 1) {
        return next({
            path: '/',
            replace: true,
        });
    }
    next();
});
