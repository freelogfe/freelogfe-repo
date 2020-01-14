
import Router from 'vue-router'
import { Vue } from '@freelog/freelog-common-lib'
import UserLayout from '@/views/layout/user.vue'
import MyContractsView from '@/views/contracts/index.vue'
import MyAccountsView from '@/views/accounts/index.vue'
import MyProfileView from '@/views/profile/index.vue'
import MyCollectionsView from '@/views/collections/index.vue'
import AccountCreateView from '@/views/accounts/create.vue'
import AccountRechargeView from '@/views/accounts/recharge.vue'
import AccountTransactionRecordsView from '@/views/accounts/records.vue'
import AccountResetPayPasswordView from '@/views/accounts/reset.vue'
import AccountWithdrawView from '@/views/accounts/withdraw.vue'
import AccountTransferView from '@/views/accounts/transfer.vue'
import AccountListManagerView from '@/views/accounts/list.vue'
import AddPayAccountView from '@/views/accounts/add-pay-account.vue'
import ResourceContractDetailView from '@/views/contracts/detail.vue'
import ErrorView from '@/views/error/index.vue'

import i18n from '../lib/i18n'

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
  base: '/',
  routes: [
    {
      path: '/',
      redirect: '/user/accounts'
    },
    {
      path: '/user',
      component: UserLayout,
      children: [{
        path: 'accounts',
        meta: {
          title: i18n.t('titles.accounts'),
          theme: 'transparent'
        },
        component: MyAccountsView
      }, {
        path: 'create',
        name: 'createAccount',
        meta: {
          title: i18n.t('titles.createAccount')
        },
        component: AccountCreateView
      }, {
        path: 'recharge',
        name: 'rechangeAccount',
        meta: {
          title: i18n.t('titles.rechangeAccount')
        },
        component: AccountRechargeView
      }, {
        path: 'records',
        name: 'accountRecords',
        meta: {
          title: i18n.t('titles.accountRecords')
        },
        component: AccountTransactionRecordsView
      }, {
        path: 'accounts-manager',
        name: 'accountsManager',
        meta: {
          title: i18n.t('titles.accountsManager')
        },
        component: AccountListManagerView
        // AddPayAccountView
      }, {
        path: 'accounts/add',
        name: 'addPayAccount',
        meta: {
          title: i18n.t('titles.addPayAccount')
        },
        component: AddPayAccountView
        // AddPayAccountView
      }, {
        path: 'reset',
        name: 'accountReset',
        meta: {
          title: i18n.t('titles.accountReset')
        },
        component: AccountResetPayPasswordView
      }, {
        path: 'withdraw',
        name: 'accountWithdraw',
        meta: {
          title: i18n.t('titles.accountWithdraw')
        },
        component: AccountWithdrawView
      },
      {
        path: 'transfer',
        name: 'accountTransfer',
        meta: {
          title: i18n.t('titles.accountTransfer')
        },
        component: AccountTransferView
      },
      {
        path: 'profile',
        name: 'profile',
        meta: { title: i18n.t('titles.profile') },
        component: MyProfileView
      }, {
        path: 'collections',
        name: 'collections',
        meta: { title: i18n.t('titles.collections') },
        component: MyCollectionsView
      }, {
        path: 'contracts',
        name: 'contracts-management',
        meta: { title: i18n.t('titles.contract.management') },
        component: MyContractsView
      },
      {
        path: 'contracts/detail',
        name: 'contract-detail',
        meta: { 
          title: i18n.t('titles.contract.detail'), 
          hideAside: true,
          breadcrumbs: [
            { path: '/user/contracts', title: i18n.t('titles.contract.management'), },
          ]
        },
        component: ResourceContractDetailView
      }]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ]
}
const notFoundRouteConfig = {
  path: '/*',
  meta: {
    requiresAuth: false,
    title: 'not found',
    error: true
  },
  component: ErrorView,
}
const router = new Router(routerConfig)
export function registerNotFoundRouete() {
  // 延迟执行挂载404页面路由
  setTimeout(() => {
    router.addRoutes([notFoundRouteConfig])
  }, 0)
}

export default router

