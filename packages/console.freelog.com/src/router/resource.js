/**
 * 资源管理系统
 */
import Views from '@/views'
import i18n from '../lib/i18n'


export default {
    name: 'resource',
    path: 'resource',
    meta: {
        requiresAuth: true,
        title: i18n.t('routes.resourceSystem')
    },
    component: Views.container,
    redirect: '/resource/list',
    children: [
        {
            path: 'editor',
            hidden: true,
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.createResource'),
                type: 'resource',
                theme: 'gray',
                hideFooter: true,
                breadCrumb: [
                    {
                        to: '/release-management/resource/list',
                        text: '我的资源',
                    },
                    {
                        text: i18n.t('routes.createResource'),
                    },
                ]
            },
            component: Views.resourceNew,
        },
        {
            path: 'editor/:resourceId',
            hidden: true,

            meta: {
                requiresAuth: true,
                // title: i18n.t('routes.resourceManager'),
                title: '资源信息',
                type: 'resource',
                theme: 'gray',
                hideFooter: true,
                breadCrumb: [
                    {
                        to: '/release-management/resource/list',
                        text: '我的资源',
                    },
                    {
                        text: '资源信息',
                    },
                ]
            },
            component: Views.resourceNew,
        },
        // {
        //     path: 'create',
        //     redirect: 'editor',
        //     // hidden: true,
        //     // meta: {
        //     //     requiresAuth: true,
        //     //     title: i18n.t('routes.createResource'),
        //     //     type: 'resource',
        //     //     theme: 'gray',
        //     //     hideFooter: true,
        //     // },
        //     // component: Views.resourceCreator,
        // },
        {
            path: 'list',
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.myResources'),
                type: 'resource',
                theme: 'white'
            },
            component: Views.resourceList
        },
        // {
        //     path: 'policy_tpl',
        //     hidden: true,
        //     meta: {
        //         requiresAuth: true,
        //         type: 'resource'
        //     },
        //     component: Views.container,
        //     redirect: '/resource/policy_tpl/list',
        //     children: [
        //         {
        //             path: 'create',
        //             hidden: true,
        //             meta: {
        //                 requiresAuth: true,
        //                 title: i18n.t('routes.createResourcePolicyTpl'),
        //                 type: 'resource'
        //             },
        //             component: Views.policyTplCreator
        //         },
        //         {
        //             path: 'detail',
        //             hidden: true,
        //             meta: {
        //                 requiresAuth: true,
        //                 title: i18n.t('routes.resourcePolicyTplDetail'),
        //                 type: 'resource'
        //             },
        //             component: Views.policyTplDetail
        //         }
        //     ]
        // }
    ]
}
