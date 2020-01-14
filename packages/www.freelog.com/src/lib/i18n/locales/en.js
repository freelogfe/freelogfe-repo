
// 异常码对应的解释和eventName
// import { HANDLE_INVALID_AUTH, GO_TO_LOGIN, REPORT_ERROR, NOTIFY_NODE } from '@/views/pagebuild/event-center/event-name.js'
const noLogin = {
  desc: 'User is not logged in',
  tip: 'go to login',
  eventName: 'GO_TO_LOGIN'
}

export default {
  common: {
    searchPlaceholder: 'Search',
    avatarPlaceholder: 'Upload avatar',
    backText: 'back',
    cancelText: 'cancel',
    sureText: 'sure',
    sureBtnText: 'sure',
    cancelBtnText: 'cancel',
  },
  titles: {
    collections: 'my collections',
    accounts: 'wallet',
    profile: 'Information & Account',
    createAccount: 'Create an account',
    rechangeAccount: 'Account recharge',
    accountsManager: 'Account management',
    addPayAccount: 'Add payment account',
    accountWithdraw: 'Account withdraw',
    accountTransfer: 'Account transfer',
    accountRecords: 'Account transaction history',
    accountReset: 'Account recharge password',
    contract: {
      detail: 'contract detail',
      management: 'contract management'
    },
  },
  userAsideNav: {
    title: ['wallet','My contract','Information & Account']
  },
  navTop: ['enter console','logout',],
  pagination: {
    emptyText: 'No data',
    start: 'First Page',
    end: 'Last Page',
    prev: 'Previous Page',
    next: 'Next Page',
    bar: '',
    total: 'A total of '
  },
  cropImage: {
    imageReupload: 'reupload',
    save: 'save'
  },
  toolbar: {
    userTabTitle: 'Personal center',
    contractTabTitle: 'Contract management',
  },
  company: {
    name: 'freelog',
    copyright: 'all rights reserved'
  },
  aboutView: {
    about: 'About'
  },
  helpView: {
    title: 'Help Center'
  },
  contracts: {
    status: [ 'To be executed', 'Authorization is OK', 'Contract Termination', 'Unknown status' ],
    inputPlaceholder: 'Contract ID / Contract Name',
    partyOne: 'Party one',
    partyTwo: 'Party two',
    content: 'Contract content',
    relevancy: 'Relevancy contract',
    tableColumn: ['Contract', 'Party two','Party one', 'Contract Status', 'Contract Time', 'Contract detail'],
    id: 'Contract ID',
    signTime: 'Contract Time',
    updateTime: 'Update Time',
    statusText: 'Contract Status',
    viewBtn: 'view',
    detail: {
      title: 'Contract detail'
    },
  },
  profile: {
    userAvatar: 'Avatar',
    noUserAvatar: 'User name not set',
    editAvatar: 'edit avatar',
    userName: 'User name',
    userNickname: 'Nickname',
    email: 'Email',
    phoneNumber: 'Phone number',
    noPhoneNumber: 'Phone number not set'
  },
  accounts: {
    currencyAccounts: [
      {},
      { name: 'Feather ',abbr: 'feth',value: 1,unit: 1e3,type: 1,extBindAddrName: 'Ethereum',enable: true },
      { name: 'RMB',abbr: 'fcny',value: 2,unit: 1e2,type: 2,extBindAddrName: 'Bank card' },
      { name: 'USD',abbr: 'fusd',value: 3,unit: 1e2,type: 3,extBindAddrName: 'Bank card' },
      { name: 'EUR',abbr: 'feur',value: 4,unit: 1e2,type: 4,extBindAddrName: 'Bank card' },
    ],
    addrName: ['Ethereum address','Bank account'],
    index: {
      create: 'to create',
      name: 'Account name',
      id: 'Account ID',
      node: 'Node',
      types: [
        { name: 'RMB',account: 'RMB account',title: 'Bank card management',noAccountWarning: 'You don\'t have a RMB account yet，' },
        { name: 'USD',account: 'USD account',title: 'Bank card management',noAccountWarning: 'You don\'t have a USD account yet，' },
        { name: 'Feather',account: 'Feather account',title: 'Ethereum address management',noAccountWarning: 'You don\'t have a Feather account yet，' },
        { name: 'EUR',account: 'Euro account',title: 'Bank card management',noAccountWarning: 'You don\'t have a Euro account yet，' },
      ],
      actions: ['Recharge','Transfer','Withdraw','Transaction record','Reset password'],
    },
    recharge: {
      title: 'Account recharge',
      to: 'Recharge to',
      record: 'Recharge record',
      payer: 'payer',
      payAddr: 'Payment address',
      payAccountPlaceholder: 'Please select a payment account',
      amount: 'Recharge amount',
      btn: 'Recharge',
      statusLabel: 'Recharge status',
      status: 'Recharging',
      addText: 'Add to',
      addNewText: 'Add new',
      currentText: 'current',
      balanceText: 'Balance',
      tradeStatus: ['Successful','Failed','Initiating','Time out'],
      currencyTypes: ['Ethereum','Bank'],
    },
    list: {
      tableColumn: ['Account name | Address','Current balance','Test coin(100feth)','Operation'],
      manageText: 'management',
      giftedStatus: ['Receive','Received','Successfully received'],
      deleteConfirm: 'Whether to delete the account？',
      deleteSuccess: 'Deleted successfully！'
    },
    records: {
      title: 'Account bill',
      tableColumn: ['Classification','Transaction hour','Name|Other side|Serial number','Amount|Currency','Order notes'],
      commentTitle: 'Comment：',
      commentList: ['Recharge','Transfer','Node consumption']
    },
    transfer: {
      fromAccountId: 'Payer Account ID',
      toAccountId: 'Payee Account ID',
      amount: 'Transfer amount',
      password: 'Password',
      remark: 'Transfer note',
      transferText: 'Transfer',
      placeholder: ['Please enter the payer account ID','Please enter the payee account ID','Please enter the transfer amount','Please enter the payment password'],
      message: {
        success: 'Successful transfer'
      }
    },
    reset: {
      text: 'reset',
      password: 'Payment password',
      oldPassword: 'Old payment password',
      newPassword: 'New payment password',
      checkNewPassword: 'Confirm payment password',
      sureBtnText: 'Confirm reset',
      messages: ['Please enter the payment password','Please enter the payment confirmation password','Composed of 6 digits'],
      errors: ['Please enter your password','Please enter your password again','Please enter 6 digits','Inconsistent password entered twice!'],

    },
    create: {
      accountName: 'Account name',
      accountNameTip: 'Consists of 2-20 characters',
      password: 'Payment password',
      passwordTip: 'Composed of 6 digits',
      checkPassword: 'Confirm password',
      messages: ['Please enter an account name','Consists of 2-20 characters','Please enter the payment password','Composed of 6 digits','Please enter the payment confirmation password'],
      errors: ['Please enter your password','Please enter your password again','Please enter 6 digits','Inconsistent password entered twice!'],
      text: 'create',
      accountText: 'account',
      successMsg: 'Created successfully',
      failMsg: 'Operation failed',
    },
    withdraw: {
      title: 'Withdraw'
    },
    addPayAccount: {
      title: 'Add card number',
      accountName: 'Account name',
      inputText: 'enter',
      accountNamePlaceholder: 'Enter a custom account name',
      errors: ['Please enter your password','Please enter your password again','Inconsistent password entered twice!'],
      messages: ['Please enter an encrypted password','Please enter the confirmation encryption password','At least 6 characters','Account name','Please enter an account address'],
      addPaySeccessMsg: 'Added successfully',
      confirm: {
        tip: 'Tip',
        msg: 'This encrypted password is used to encrypt the Ethereum keystore. Once created, it cannot be changed. The system does not save it. You need to save it yourself!',
        sureBtnText: 'sure',
        cancelBtnText: 'cancel',
        success: 'Ethereum account created successfully',
        error: 'Creation failed'
      },
      createAddrTip: 'Don\'t have an Ethereum address yet?',
      createAddrBtnText: 'Create an Ethereum address',
      addBtnText: 'add',
      submitBtnText: 'submit',
      cancelBtnText: 'cancel',
      dialogTitle: 'Create an Ethereum address',
      dialogHead: 'Please set the Ethereum key encryption password',
      dialogPass: 'Encrypted password',
      dialogCheckPass: 'Confirm encrypted password',
    },
  },
  collections: {
    tableColumn: ['Release|Type','Release author','Update time'],
    contractStatus: {
      inactive: 'inactive',
      active: 'active',
      termination: 'termination of contract',
      unknown: 'unknown state'
    }
  },
  pagebuild: {
    errors: ['There is no corresponding event handler', 'Undefined error'],
    tips: ['Report error'],
    authError: {
      msg: 'Incorrect parameters'
    },
    notifyNode: {
      msg: 'Node resource contract is not in effect, node has been notified'
    },
  },
}
