import Views from '@/views'
import i18n from '../lib/i18n'

export default {
    path: 'node',
    meta: {
        requiresAuth: true,
        title: i18n.t('routes.nodesSystem')
    },
    component: Views.container,
    redirect: '/',
    children: [
        {
            path: 'test-manager-resource/:testResourceID',
            hidden: true,
            meta: {
                hideSidebar: true,
                requiresAuth: true,
                // title: i18n.t('routes.nodeManager'),
                title: '测试展品信息',
                hideFooter: true,
            },
            component: Views.testManagerResource
        },
        {
            path: 'test-manager/:nodeId',
            hidden: true,
            meta: {
                hideSidebar: true,
                requiresAuth: true,
                // title: i18n.t('routes.nodeManager'),
                title:  '测试节点管理',
                hideFooter: true,
            },
            component: Views.testNodeManager
        },
        {
            path: 'manager/:nodeId',
            hidden: true,
            meta: {
                hideSidebar: true,
                requiresAuth: true,
                title: i18n.t('routes.nodeManager'),
                hideFooter: true,
            },
            component: Views.nodeManager
        },
        {
            path: 'manager-release/:presentableId',
            hidden: true,
            meta: {
                hideSidebar: true,
                requiresAuth: true,
                // title: i18n.t('routes.nodeReleaseManagement'),
                title: '展品信息',
                hideFooter: true,
            },
            component: Views.nodeManagerRelease
        },
        {
            path: 'create',
            hidden: true,
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.createNode'),
                hideFooter: true,
            },
            component: Views.nodeCreator
        },
        // {
        //     path: 'list',
        //     meta: {
        //         requiresAuth: true,
        //         type: 'node',
        //         title: i18n.t('routes.nodeList')
        //     },
        //     component: Views.nodeList
        // },
        // {
        //     path: 'policy_tpl/list',
        //     meta: {
        //         requiresAuth: true,
        //         title: i18n.t('routes.policyList'),
        //         type: 'node'
        //     },
        //     component: Views.policyTplList
        // },
        // {
        //     path: 'policy_tpl',
        //     hidden: true,
        //     meta: {
        //         requiresAuth: true,
        //         type: 'node'
        //     },
        //     component: Views.container,
        //     redirect: '/node/policy_tpl/list',
        //     children: [
        //         {
        //             path: 'create',
        //             hidden: true,
        //             meta: {
        //                 requiresAuth: true,
        //                 title: i18n.t('routes.createPolicyTpl'),
        //                 type: 'node'
        //             },
        //             component: Views.policyTplCreator
        //         },
        //         {
        //             path: 'detail',
        //             hidden: true,
        //             meta: {
        //                 requiresAuth: true,
        //                 title: i18n.t('routes.policyTplDetail'),
        //                 type: 'node'
        //             },
        //             component: Views.policyTplDetail
        //         }
        //     ]
        // },
        // {
        //     path: ':nodeId',
        //     hidden: true,
        //     meta: {
        //         requiresAuth: true,
        //         title: i18n.t('routes.nodeDetail')
        //     },
        //     component: Views.nodeDetail,
        //     redirect(to) {
        //         return `${to.path}/presentables`
        //     },
        //     children: [{
        //         path: 'presentables',
        //         meta: {
        //             requiresAuth: true,
        //             title: i18n.t('routes.nodeDetail')
        //         },
        //         component: Views.presentableList,
        //     }, {
        //         path: 'preview',
        //         meta: {
        //             requiresAuth: true,
        //             title: i18n.t('routes.nodeDetail')
        //         },
        //         component: Views.nodePreview,
        //     }]
        // },
        // nodeItemRoute,
    ]
}
