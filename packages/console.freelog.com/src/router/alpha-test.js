
import Views from '@/views';
import i18n from '../lib/i18n';

export default {
    name: 'alpha-test',
    path: 'alpha-test',
    meta: {
        requiresAuth: true,
        title: i18n.t('routes.resourceSystem'),
        hideFooter: true,
    },
    component: Views.container,
    redirect: '/alpha-test/input',
    children: [
        {
            path: 'input',
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.mockResourcePool'),
                type: '',
                hideFooter: true,
            },
            component: Views.alphaTestInput
        },
        {
            path: 'input',
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.mockResourcePool'),
                type: '',
                hideFooter: true,
            },
            component: Views.alphaTestInput
        },
        {
            path: 'apply',
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.mockResourcePool'),
                type: '',
                hideFooter: true,
            },
            component: Views.alphaTestApply
        },
        {
            path: 'success',
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.mockResourcePool'),
                type: '',
                hideFooter: true,
            },
            component: Views.alphaTestSuccess
        },
        /*{
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
                // title: i18n.t('routes.manageMockResource'),
                title: '模拟资源信息',
                theme: 'gray',
                hideFooter: true,
            },
            component: Views.mockEditor,
        },*/
    ]
}
