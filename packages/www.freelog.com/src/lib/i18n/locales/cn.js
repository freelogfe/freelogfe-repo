
// 异常码对应的解释和eventName
// import { HANDLE_INVALID_AUTH, GO_TO_LOGIN, REPORT_ERROR, NOTIFY_NODE } from '@/views/pagebuild/event-center/event-name.js'
const noLogin = {
  desc: '未登录用户',
  tip: '去登录',
  eventName: 'GO_TO_LOGIN'
}

export default {
  common: {
    searchPlaceholder: '按回车搜索',
    avatarPlaceholder: '去上传头像',
    backText: '返回',
    cancelText: '取消',
    sureText: '确定',
    sureBtnText: '确 定',
    cancelBtnText: '取 消',
  },
  titles: {
    collections: '我的关注',
    accounts: '钱包',
    profile: '资料与账号',
    createAccount: '创建账户',
    rechangeAccount: '账户充值',
    accountsManager: '账号管理',
    addPayAccount: '添加支付账号',
    accountWithdraw: '账户提现',
    accountTransfer: '账户转账',
    accountRecords: '账户交易记录',
    accountReset: '账户充值密码',
    contract: {
      detail: '合约详情',
      management: '合约管理'
    },
  },
  userAsideNav: {
    title: ['钱包','合约管理','资料与账号']
  },
  navTop: ['进入console','登出',],
  pagination: {
    emptyText: '暂无数据',
    start: '首页',
    end: '尾页',
    prev: '上一页',
    next: '下一页',
    bar: '条',
    total: '共'
  },
  cropImage: {
    imageReupload: '重新上传',
    save: '保存'
  },
  toolbar: {
    userTabTitle: '个人中心',
    contractTabTitle: '合约管理',
  },
  company: {
    name: 'freelog',
    copyright: '版权所有'
  },
  aboutView: {
    about: '关于'
  },
  helpView: {
    title: '帮助中心'
  },
  contracts: {
    status: [ '待执行', '授权正常', '合约终止', '未知状态' ],
    searchType: {
      placeholder: '请选择',
      label: ['节点','资源','资源类型']
    },
    inputPlaceholder: '合约ID / 合约名称',
    partyOne: '授权方',
    partyTwo: '被授权方',
    content: '合约内容',
    relevancy: '关联合约',
    tableColumn: ['合约', '被授权方','授权方', '合约状态', '签约时间', '合约详情'],
    id: '合约ID',
    signTime: '签约时间',
    updateTime: '更新时间',
    statusText: '合约状态',
    viewBtn: '查看',
    detail: {
      title: '合约详情'
    },
  },
  profile: {
    userAvatar: '用户头像',
    noUserAvatar: '未设置用户姓名',
    editAvatar: '编辑头像',
    userName: '用户姓名',
    userNickname: '用户昵称',
    email: '邮箱账号',
    noMail: '未设置邮箱账号',
    phoneNumber: '手机账号',
    noPhoneNumber: '未设置手机号',
    password: '登陆密码',
  },
  accounts: {
    currencyAccounts: [
      {},
      { name: '飞致币',abbr: 'feth',value: 1,unit: 1e3,type: 1,extBindAddrName: '以太坊',enable: true },
      { name: '人民币',abbr: 'fcny',value: 2,unit: 1e2,type: 2,extBindAddrName: '银行卡' },
      { name: '美元',abbr: 'fusd',value: 3,unit: 1e2,type: 3,extBindAddrName: '银行卡' },
      { name: '欧元',abbr: 'feur',value: 4,unit: 1e2,type: 4,extBindAddrName: '银行卡' },
    ],
    addrName: ['以太坊地址','银行账号'],
    index: {
      create: '去创建',
      name: '账户名',
      id: '账户ID',
      node: '节点',
      types: [
        { name: '人民币',account: '人民币账户',title: '银行卡管理',noAccountWarning: '您还没有人民币账户，' },
        { name: '美元',account: '美元账户',title: '银行卡管理',noAccountWarning: '您还没有美元账户，' },
        { name: '飞致币',account: '飞致币账户',title: '以太坊地址管理',noAccountWarning: '您还没有飞致币账户，' },
        { name: '欧元',account: '欧元账户',title: '银行卡管理',noAccountWarning: '您还没有欧元账户，' },
      ],
      actions: ['充值','转账','提现','交易记录','重置密码'],
    },
    recharge: {
      title: '账户充值',
      to: '充值到',
      record: '充值记录',
      payer: '付款方',
      payAddr: '付款地址',
      payAccountPlaceholder: '请选择付款账号',
      amount: '充值金额',
      btn: '充值',
      statusLabel: '充值状态',
      status: '充值中',
      addText: '添加',
      addNewText: '添加新的',
      currentText: '当前',
      balanceText: '余额',
      tradeStatus: ['充值成功','充值失败','发起中','超时失败'],
      currencyTypes: ['以太坊','银行'],
    },
    list: {
      tableColumn: ['账号名 | 地址','当前余额','测试币(100feth)','操作'],
      manageText: '管理',
      giftedStatus: ['领取','已领取','领取成功'],
      deleteConfirm: '确定删除账户？',
      deleteSuccess: '删除成功'
    },
    records: {
      title: '账户账单',
      tableColumn: ['分类','交易时间','名称|对方|流水号','金额|币种','订单备注'],
      commentTitle: '注释：',
      commentList: ['充值','转账','节点消费']
    },
    transfer: {
      fromAccountId: '付款方账户ID',
      toAccountId: '收款方账户ID',
      amount: '转账金额',
      password: '支付密码',
      remark: '转账备注',
      transferText: '转账',
      placeholder: ['请输入付款方账户ID','请输入收款方账户ID','请输入转账金额','请输入支付密码'],
      message: {
        success: '转账成功'
      }
    },
    reset: {
      text: '重置',
      password: '支付密码',
      oldPassword: '旧支付密码',
      newPassword: '新支付密码',
      checkNewPassword: '确认支付密码',
      sureBtnText: '确定重置',
      messages: ['请输入支付密码','请输入支付确认密码','由6位数字组成'],
      errors: ['请输入密码','请再次输入密码','请输入6位数字','两次输入密码不一致!'],

    },
    create: {
      accountName: '账户名称',
      accountNameTip: '由2-20位字符组成',
      password: '支付密码',
      passwordTip: '由6位数字组成',
      checkPassword: '确认密码',
      messages: ['请输入账户名称','由2-20位字符组成','请输入支付密码','由6位数字组成','请输入支付确认密码'],
      errors: ['请输入密码','请再次输入密码','请输入6位数字','两次输入密码不一致!'],
      text: '创建',
      accountText: '账户',
      successMsg: '创建成功',
      failMsg: '操作失败',
    },
    withdraw: {
      title: '提现'
    },
    addPayAccount: {
      title: '添加卡号',
      accountName: '账号名',
      inputText: '输入',
      accountNamePlaceholder: '输入自定义账号名称',
      errors: ['请输入密码','请再次输入密码','两次输入密码不一致!'],
      messages: ['请输入加密密码','请输入确认加密密码','最少6个字符','账号名','请输入账号地址'],
      addPaySeccessMsg: '添加成功',
      confirm: {
        tip: '提示',
        msg: '此加密密码用于加密以太坊keystore，一旦创建后不可更改，系统不予以保存，需用户自行保存妥善！',
        sureBtnText: '确定',
        cancelBtnText: '取消',
        success: '以太坊账号创建成功',
        error: '创建失败'
      },
      createAddrTip: '还没有以太坊地址?',
      createAddrBtnText: '创建一个以太坊地址',
      addBtnText: '添加',
      submitBtnText: '提交',
      cancelBtnText: '取消',
      dialogTitle: '创建以太坊地址',
      dialogHead: '请设置以太坊密钥加密密码',
      dialogPass: '加密密码',
      dialogCheckPass: '确认加密密码',
    },
  },
  collections: {
    tableColumn: ['发行|类型','发行作者','更新时间'],
    contractStatus: {
      inactive: '不可用',
      active: '可用',
      termination: '合约终止',
      unknown: '未知状态'
    }
  },
  pagebuild: {
    errors: ['不存在对应的事件处理函数', '未定义错误'],
    tips: ['上报错误'],
    authError: {
      msg: '参数有误'
    },
    notifyNode: {
      msg: '节点资源合约未生效，已通知节点'
    },
  },
}
