
import Views from '@/views'
import i18n from '../lib/i18n'

export default {
  name: 'release',
  path: 'release',
  meta: {
    requiresAuth: true,
    title: i18n.t('routes.releaseSystem')
  },
  component: Views.container,
  children: [
    {
      path: 'create',
      hidden: true,
      meta: {
        requiresAuth: true,
        hideFooter: true,
        title: i18n.t('routes.createRelease'),
        type: 'release',
        theme: 'white',
        breadCrumb: [
            {
                to: '/release-management/release/list',
                text: '我的发行',
            },
            {
                text: i18n.t('routes.createRelease'),
            },
        ]
      },
      component: Views.releaseCreator,
    },
    {
      path: 'detail',
      hidden: true,
      meta: {
        requiresAuth: true,
        title: i18n.t('routes.releaseDetail'),
        type: 'release',
        theme: 'white'
      },
      component: Views.releaseDetail
    },
    {
      path: 'detail/:releaseId',
      hidden: true,
      meta: {
        requiresAuth: true,
        title: i18n.t('routes.releaseDetail'),
        type: 'release',
        theme: 'white'
      },
      component: Views.releaseDetail
    },
    {
      path: 'edit/:releaseId',
      hidden: true,
      meta: {
        requiresAuth: true,
        hideFooter: true,
        // title: i18n.t('routes.releaseManager'),
        title: '发行信息',
        type: 'release',
        theme: 'white',
          breadCrumb: [
              {
                  to: '/release-management/release/list',
                  text: '我的发行',
              },
              {
                  text: '发行信息',
              },
          ]
      },
      component: Views.releaseEditor
    },
    {
      path: 'add',
      hidden: true,
      meta: {
        requiresAuth: true,
        title: i18n.t('routes.releaseAdd'),
        type: 'release',
        theme: 'white'
      },
      component: Views.releaseAdd
    },
    {
      path: 'list',
      meta: {
        requiresAuth: true,
        title: i18n.t('routes.myReleases'),
        type: 'release',
        theme: 'white'
      },
      component: Views.releaseList
    },
    {
      path: 'collections',
      meta: {
        requiresAuth: true,
        title: i18n.t('routes.myCollections'),
        type: 'release',
        theme: 'white'
      },
      component: Views.releaseCollections
    },
  ]
}
