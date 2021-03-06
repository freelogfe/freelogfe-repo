/**
 * mock 池
 */
import Views from '@/views'
import i18n from '../lib/i18n'

export default {
    name: 'mock',
    path: 'mock',
    meta: {
        requiresAuth: true,
        title: i18n.t('routes.mockResourcePool'),
        hideFooter: true,
    },
    component: Views.container,
    redirect: '/mock/display',
    children: [
        {
            path: 'display',
            meta: {
                requiresAuth: true,
                // title: i18n.t('routes.resourcePolicyTplList'),
                // title: i18n.t('routes.resourcePolicyTplList'),
                title: i18n.t('routes.mockResourcePool'),
                type: 'resource',
                hideFooter: true,
            },
            component: Views.mockDisplay
        },
        {
            path: 'create/:bucketName',
            hidden: true,
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.createMockResource'),
                // title: '模拟资源信息',
                theme: 'gray',
                hideFooter: true,
                // breadCrumb: [
                //     {
                //         to: '/release-management/release/list',
                //         text: '我的发行',
                //     },
                //     {
                //         text: i18n.t('routes.createRelease'),
                //     },
                // ]
            },
            component: Views.mockEditor,
        },
        {
            path: 'update/:mockResourceId',
            hidden: true,
            meta: {
                requiresAuth: true,
                // title: i18n.t('routes.createResource'),
                title: i18n.t('routes.mockResourceInfo'),
                // title: '模拟资源信息',
                theme: 'gray',
                hideFooter: true,
            },
            component: Views.mockEditor,
        },
    ]
}
