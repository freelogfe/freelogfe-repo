export default {
    title: 'node',
    nodeName: 'node name',
    nodeDomain: 'node address',
    createNode: 'create node',
    gotoNodeDetail: 'view node details',
    nodeId: 'node ID',
    nodeState: 'node status',
    createRules: {
        length: 'The node domain name prefix should be 4-20 characters long.',
        prefix: 'The node domain name prefix should consist of an alphanumeric and "-".',
        noEmpty: 'The node domain name prefix cannot be empty.'
    },
    createPlaceholders: {
        domain: 'input node address',
        name: 'input node name'
    },
    nodeNameRules: {
        noEmpty: 'Node description cannot be empty',
        length: 'The node description length should be 4-20 characters, which is not case sensitive.'
    },
    createSuccess: 'successfully created',
    confirmMessages: {
        question: 'Once the node name and domain name are created, they cannot be changed. Are you sure to continue?',
        title: 'prompt',
        confirm: 'continue',
        cancel: 'cancel'
    },

    detailView: {
        paramError: 'missing nodeId',
        copySuccess: 'successfully copied'
    },

    tabTitles: {
        scheme: 'schemes',
        contract: 'contracts',
        policy: 'policies'
    },
    pageStyle: 'Page Style(pagebuild)',
    switchPageStyle: 'switch style',
    choosePageBuildTip: 'Please pick up a resource with the resource type pagebuild as the page style in the presentable list below.',
    quickFilterText: 'quickly filter',
    noPresentableTip: 'no presentables yet',


    // manager
    copySuccess: 'Copy Success',
    nodeReleaseList: 'Node lists of release',
    nodePageStyle: 'Theme',
    all: 'All',
    pending: 'Pending',
    table: {
        publish: 'Release',
        presentableName: 'Title',
        type: 'All Type',
        policies: 'Policy',
        updateTime: 'UpdateTime',
        state: 'All State',
        operation: 'Operation',
    },
    allType: 'All Type',
    allState: 'All State',
    online: 'Online',
    noOnline: 'NoOnline',
    contractException: 'ContractException',
    noPolicy: 'No policy',
    suchAs: 'Such as ',
    policies: ' policies',
    joined: 'Joined',
    exceptionExists: 'This exception exists on the contractual chain',
    action: {
        edit: 'Edit',
        top: 'Top',
        upgrade: 'Upgrade',
        online: 'Online',
        downline: 'Downline',
    },
    cannotOnline: {
        noPolicy: 'Cannot be on the line : No authorization policy is available',
        exceptions: 'Cannot be on the line : authorized chain of exceptions',
    },

    gotoTest: 'Test node management',
    presentableManagement: 'Presentable',
    notAdded: 'You have not added any issue to the node',
    notSetTheme: 'You have not set a theme for the node, the node cannot be shown. You can add a " theme " theme of the issue as a node of Type',
    toMarket: 'To release the market',
    addTheme: 'AddTheme',
    loading: 'Loading',

    // manager-release
    type: 'Type',
    signingTime: 'Signing Time',
    nodeReleaseTitle: 'The node release title',
    tags: 'Tags',
    newTag: 'New Tag',
    policies_: 'Policies',
    cancel: 'Cancel',
    save: 'Save',
    noPolicyNotAppear: 'No policy issue does not appear in the market',
    addPolicy: 'Add Policy',
    authorization: 'Authorization',
    unnamedPolicy: 'Unnamed policy',
    addPolicySuccess: 'Add a policy success',
    updatedPolicySuccessfully: 'Updated the policy successfully',
    titleUpdateSuccessful: 'The node issuing title update is successful',
    tagUpdatedSuccessfully: 'User tag updated successfully',
    presentableInfo: 'Presentable Info',
    status: 'Status',
    inactive: 'Inactive',
    active: 'Active',
    activated: 'Activated',
    presentableName: 'Name',
    displayVersion: 'Version',
    authorizationPolicy: 'Policies',

    // test-management
    inNodeManagement: 'In node management',
    mappingRulesManagement: 'Mapping rules management',
    addTestPresentable: 'Add test Presentable',
    replaceRelyOn: 'Replace rely on',
    replace: 'Replace',
    selectReplacingResource: 'Select replacing resource',
    myRelease: 'My Release',
    myMock: 'My Mock',
    releaseMarket: 'Release Market',
    versionRange: 'Versions',
    selectedVersion: 'Selected Version',
    pleaseSelect: 'Please Select',
    customer: 'Customer',
    enterSemverVersionRange: 'Enter semver version range',
    confirm: 'Confirm',
    content: 'Content',
    selectReplacedResource: 'Select replaced resource',
    allVersions: 'All Versions',
    noAddedResources: 'You have not added any testing resources',
    rule: 'Rule',
    source: 'Source',
    testPresentable: 'Presentable',
    node: 'Node',
    testResources: 'Test resources',
    notYetAuthorization: 'Not yet tested authorization',
    detail: 'Detail',
    delete: 'Delete',
    // release: 'Release',
    downlineSuccess: 'Downline success',
    onlineSuccess: 'Online success',
    deletedSuccess: 'Deleted Success',
    setVersionSuccess: 'Set the version successfully',
    haveNotSetTheme: 'You have not set a theme for the node, the node cannot be shown. You can add a theme types of testing resources as a theme of the node.',
    exception: 'Exception',
    activationSuccess: 'Activation Success',
    testPresentableInfo: 'Test Presentable Info',
    nodeReleaseName: 'Name',
    aboutNode: 'About Node',
    presentable: 'Presentable',
    aboutRelease: 'Release',

    ruleType: 'Rule type',
    mappingRuleContent: 'Mapping rule content',
    matchResult: 'Match result',
    release: 'release',
    // presentable: 'presentable',
    operation: 'Operation',
    editBtnText: 'Edit',
    enterBtnText: 'Enter mapping rules',
    editMappingRules: 'Edit mapping rules',
    exitBtnText: 'Exit edit mode',
    inputPlaceHolder: 'Please enter a rule',
    imortBtnText: 'Import',
    batchExportBtnText: 'Batch export',
    exportAllBtnText: 'Export all',
    batchDeletionBtnText: 'Batch deletion',
    saveBtnText: 'Verify and save',
    onlineBtnText: 'Online',
    offlineBtnText: 'Offline',
    deleteBtnText: 'Delete',
    sureBtnText: 'Sure',
    cancalBtnText: 'Cancel',
    operationsTexts: [
        'Add', 'Source', 'Display version ', 'Set label ', 'online', 'offline', 'replace', 'Activate theme', 'Change', 'scopes'
    ],
    confirmTexts: [
        'Whether to export the selected rule?', 'Whether to export all rules?', 'This action will delete the rule', 'Whether to continue?', 'Prompt', 'This will delete the ', ' rules selected', 'Online rules', 'Offline rules', ' are successful'
    ],
    messages: [
        'The mapping rules are saved successfully!', 'The mapping rule was deleted successfully!'
    ],
    errors: [
        'Mapping rule compilation failed: there is a syntax error！', 'There is a syntax error in the mapping rule content: ', 'Validation failed, please check and submit:', 'Validation succeeded, but there were pre-execution errors in the rule:', 'statement', 'error'
    ],
    matchResultsTexts: [
        '替换执行结果', '替换指令', '匹配数量'
    ],

    currentRelease: 'Current Release',
    throwingRelease: 'Throwing Release',
    authorizer: 'Authorizer: ',
    authorized: 'Authorized: ',
    contracted: 'Contracted',
    availableSigning: 'Available for signing',
    agencySuccess: 'Agency success',
    success: 'Success',
    onlyOneContract: 'Only one contract in the current licensing scheme, cannot be deactivated',

    enabled: 'Enabled',
    details: 'Details',

    latestVersion: 'Latest Version',

    addRuleSuccess: 'Success',

    tabsHeader: {
        authorization: 'Authorization',
        authorizationChain: 'Chain',
        pending: 'Pending',
        active: 'Active',
        termination: 'Termination',
    },
};
