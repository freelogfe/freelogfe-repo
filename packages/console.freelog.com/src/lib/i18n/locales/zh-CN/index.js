import mock from './mock';
import node from './node';
import layout from './layout';
import resource from './resource';
import components from './components';

export default {
    common: {
        login: '登录',
        logout: '登出',
        register: '注册',
        yes: '有',
        no: '无',
        cancel: '取消',
        confirm: '确定',
        operation: '操作',
        detail: '详情',
        save: '保存',
        saveSuccess: '保存成功',
        createText: '创建',
        cancelCreateText: '取消创建',
        createSuccessTip: '创建成功',
        searchPlaceholder: '按回车搜索',
        avatarPlaceholder: '去上传头像',
        backText: '返回',
        cancelText: '取消',
        sureText: '确定',
        sureBtnText: '确 定',
        cancelBtnText: '取 消',
        allTypes: '全部类型'
    },

    header: {
        langSwitchQuestion: '切换为 {lang}？'
    },

    contract: {
        state: '签约状态',
        signedText: '已签约',
        unsignedText: '未签约',
    },

    scheme: {
        schemeName: '授权方案名称',
        schemeNameInputPlaceholder: '请输入授权方案名称',
        schemeStatus: '授权方案状态'
    },

    policy: {
        authTarget: '授权对象',
        checked: '校验通过',
        tplName: '策略模板名称',
        policyType: '策略模板类型',
        tplDesc: '策略模板内容',
        inputTip: '请输入策略',
        checkBtnText: '校验策略',
        state: '状态',
        createDate: '创建时间',
        types: {
            resource: '资源策略模板',
            user: '用户策略模板'
        },

        statesMap: ['正常', '已删除']
    },

    release: {
        myReleases: '我的发行',
        management: '发行管理',
    },

    presentable: {
        nodeIndex: '节点首页',
        id: '节点资源ID',
        name: '节点资源名称',
        label: '节点资源标签',
        addLabel: '新标签',

        listTitle: '节点资源列表',
        addPresentable: '添加节点资源',

        signedText: '已签约',
        unsignedText: '未签约',
        paramError: '缺乏presentable参数',
        tabNames: {
            info: '节点资源基础信息',
            schemes: '授权方案管理',
            contracts: '合约管理',
            policies: '策略管理'
        },
        uncreatedContractTip: '未创建合约',
        gotoCreateContractTip: '去创建合约',
        contractStateError: '合同不完备或不存在可用策略',
        unAuthError: '未获得授权',
        updateFailTip: '更新失败',
        confirmOffline: '确定下线{presentableName}?下线后节点将无法正常访问',
        confirmOnline: '确定上线{presentableName}?上线后将自动替换当前页面样式',
        onlineState: '上线状态',
        offlineState: '下线状态',
        allState: '全部状态',
        onlineText: '上线',
        offlineText: '下线',
        deletePresentableText: '确定删除{presentableName}?',
        deleteSuccessTip: '成功删除'
    },

    company: {
        name: 'freelog',
        copyright: '版权所有'
    },

    sidebar: {
        open: '展开菜单',
        close: '折叠菜单',
    },

    metaInput: {
        metaJSONError: 'JSON格式有误',
        inputTip: '描述资源meta信息的JSON数据'
    },

    listResourceItem: {
        lastUpdateText: '最近更新时间：',
        updateInfo: '更新基础信息',
        detail: '查看详情',
        schemes: '管理授权方案',
        state: '状态：'
    },

    listReleaseItem: {
        manageDetail: '管理详情',
        detail: '查看详情',
    },

    search: {
        addBtn: '加入',
        placeholder: '输入发行名称',
        resourcePlaceholder: '输入资源名称',
        myRelease: '我的发行',
        noMyReleases: '暂无发行',
        favorTitle: '收藏发行',
        noFavorReleases: '暂无收藏发行',
        historicVersion: '历史版本',
        searchTitle: '全局搜索',
    },

    //路由标题
    routes: {
        accountSetting: '账号设置',

        mockResource: 'mock资源',

        nodes: '节点',
        releaseMarket: '发行市场',
        presentableDetail: '节点资源详情',
        nodesSystem: '节点管理系统',

        nodeManager: '节点管理',
        nodeReleaseManagement: '节点发行管理',

        createNode: '创建节点',
        nodeList: '节点列表',
        policyList: '策略模板列表',
        createPolicyTpl: '创建策略模板',
        policyTplDetail: '策略模板详情',
        nodeDetail: '节点详情',
        resourceSystem: '资源管理系统',
        resourcePolicyTplList: '资源策略模板列表',
        createResource: '创建资源',
        updateResource: '更新资源',
        myResources: '我的资源',
        myReleases: '我的发行',
        myCollections: '我的收藏',
        // resourceDetail: '资源详情',
        resourceManager: '资源管理',
        createResourcePolicyTpl: '创建资源策略模板',
        resourcePolicyTplDetail: '资源策略模板详情',
        createRelease: '创建发行',
        releaseDetail: '发行详情',
        releaseSystem: '',
        releaseManager: '发行管理',
        releaseAdd: '添加发行',

        mockResourcePool: '模拟资源池',
        createMockResource: '创建模拟资源',
        manageMockResource: '模拟资源管理',
    },

    axios: {
        unAuthError: '未授权！',
        forbidden: 'forbidden-禁止访问',
        internalError: '服务器内部异常，请稍后再试！'
    },

    //配置类
    config: {
        account: {
            feather: '飞致币',
            eth: '以太坊',
            rmb: '人民币',
            dollar: '美元',
            euro: '欧元'
        },
        contract: {
            statesTip: ['未创建合同', '未开始执行', '待执行', '系统锁住', '生效中', '', '合同已终止'],
        },
        group: {
            user: '用户分组',
            node: '节点分组'
        },
        node: {
            status: ['正常', '未审核', '冻结']
        },

        presentable: {
            states: ['测试状态', '未开始执行', '待执行', '生效中', '用户终止', '系统终止',]
        },
        resource: {
            states: ['未知状态', '未发布', '已发布', '冻结',]
        },
        scheme: {
            states: ['未启用', '启用', '已废弃',]
        }
    },

    //页面级
    resourceDetailView: {
        tabs: ['资源简介', '授权方案', '资源描述', 'meta信息'],
        favorText: '收藏',
        favorSuccessText: '收藏成功',
        deleteFavorSuccessText: '已删除收藏',
        deleteFavorText: '取消收藏',
        noMetaTip: '暂无meta信息',
        noDescTip: '暂无资源描述',
        addPresentableSuccessText: '成功添加到节点资源列表',
        addPresentableText: '获取授权',
        offlineTip: '已下架',
        lastUpdateText: '最近更新',
        addResourceToNode: '获取资源授权至节点：',
        noNodesTip: '未创建节点，',
        createNodeTip: '去创建节点',
        moreTip: '查看更多'
    },

    resourceEditView: {
        updateSuccess: '更新成功',
        uploadFileText: '将文件拖到此处，或点击上传',
        uploadFileRule: '上传文件不超过50MB，只能上传一个文件',
        updateText: '更新资源',
        hideResourceInfo: '收起资源',
        panelsTabName: ['授权方案信息', '授权签约管理', '合约管理', '策略管理'],
        noContractTip: '无合约',
        createContractTip: '未创建依赖授权关系',
        createContractText: '去创建',
        depsListTitle: '依赖资源列表',
        noDepsTip: '没有需要处理的依赖资源',
        requiredDepsTip: '仍有资源未选择授权策略',
        createSuccess: '创建成功！',
        enableText: '启用',
        disableText: '停用',
        addNewScheme: '添加新授权方案',
        addScheme: '添加授权方案',
        inputPlaceholder: '请输入授权方案名称...',
        createSchemeTip: '方案添加成功后无法删除',
        disableSchemeTip: '当前资源中已无其他授权方案，停用此方案将会使资源下架, 是否确认操作？',
        disableSchemeTitle: '提示',
        defaultSchemeName: '未命名授权方案',

        resourceTypeRule: '命名格式有误，需满足{rule}',
        widgetNameRule: '例如freelog-namespace-widgetname，namespace和widgetname至少3个字符',
        versionRule: '版本号需符合semver规范，例如0.0.1',

        inputNameTip: '请输入资源名称',
        selectTypeTip: '请选择资源类型',

        noSupportTip: '不支持的文件类型',
        authFailTip: '权限未经验证',
        noSupportImageTip: '不支持的图片类型',

        uploadingTip: '资源文件正在上传中，等上传完再点击创建',
        noFileTip: '未上传资源文件',
        metaError: 'meta格式有误:',
        donotRepeatUpload: '不能重复添加依赖资源',


        resourceTitle: '资源标题',
        changeTypeTip: '已上传资源文件不能修改资源类型',
        changeTypeTip2: '，如需修改，请重新上传资源',
        selectType: '请选择资源类型',
        uploadPopTip: '选择资源类型后方可上传资源',
        resourceFile: '资源文件',
        uploadResourceRule: '拖拽或点击上传，最大不超过50M',
        reUploadText: '重新上传',
        widgetName: 'widget名称',
        widgetVersion: 'widget版本号',
        uploadPoster: '上传封面',
        depResources: '依赖',
        disableModifiedTip: '已发布的资源不能修改依赖',
        addDepResource: '添加依赖资源',
        introTitle: '资源描述',
        metaTitle: 'meta信息',
        inputDescTip: '请输入资源描述',
        inputMetaTip: '资源meta信息',
        addResource: '添加资源'
    },

    settingView: {
        avatar: '用户头像',
        username: '用户姓名',
        usernameTip: '未设置用户姓名',
        nickname: '用户昵称',
        nicknameTip: '未设置用户昵称',
        email: '邮箱',
        emailTip: '未设置邮箱',
        mobilePhone: '手机号码',
        mobilePhoneTip: '未设置手机号码'
    },

    resourceListView: {
        myListTitle: '自制资源',
        favorListTitle: '收藏资源',
        noResources: '没有自制资源',
        noFavorResources: '未收藏资源'
    },

    aboutView: {
        about: '关于'
    },
    helpView: {
        title: '帮助中心'
    },

    //
    mock,
    node,
    layout,
    resource,
    components,
}
