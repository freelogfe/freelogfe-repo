export default {
    myReleases: 'My releases',
    management: 'Release management',

    version: 'Version',
    currentVersion: 'Current version',
    scheme: 'Scheme',
    historicVersion: 'Historic version',
    tuckUp: 'Tuck up',
    more: 'more...',
    saveBtnText: 'Save',
    cancelBtnText: 'Cancel',

    noDesc: 'No resource description yet',
    name: 'Release Name',
    cover: 'Release Cover',
    basicUpcast: 'Basic upcast',
    noBasicUpcast: 'There are no basic upcast yet',
    // scheme: 'scheme',
    // 'version': 'version',
    tips: [ 'Once the release name is created, it cannot be modified', 'The upcast selected in the scheme will become a base upcast'  ],
    messages: [ 'The release name should be 4-20 characters long.', 'Cannot contain spaces and the following characters', 'The version number is in the wrong format!', 'The release name cannot be empty!', 'The version number cannot be empty!', 'The release was created successfully!' ],
    createBtnText: 'Create Release',
    cancelCreateBtnText: 'Cancel',

    release: 'Release ',
    releaseID: 'Release ID',
    policiesComparison: 'Policies comparison',
    selectionPlaceholder: 'Please select a contract node',
    noDescription: 'No description',
    warings: [
        'The current release is not online, no strategy is available!',
        'The current upsell issue is not online and is not available!',
        'You have not created a node;'
    ],
    messages1: [
        'Please select the contracted node first',
        ' have not chosen a policy!',
        'Successful signing!',
        'Successful authorization signing; will soon jump to the node distribution management page!'
    ],
    titles: [ 'Add node', 'Current release', 'Put on basis', 'Resource description', 'Confirmation' ],
    iconTexts: [ 'Upsell', 'Signed' ],
    steps: [
        'Step 1: Select a contract node',
        'Step 2: Select Authorization Policy'
    ],
    linkBtns: {
        'editRelease': 'Go to edit',
        'createNode': 'Go to create'
    },
    btns: {
        cancel: 'cancel',
        sign: 'Sign a contract',
        getAuth: 'Get authorized'
    },
    signPolicyBox: {
        titles: [ 'Signed to ', 'Historical contract' ],
        signState: 'As an authorized party, if you meet and accept the authorized party\'s authorization policy, you can choose to sign up with the authorized party. There is a mechanism between authorized parties to change the status of resource authorization according to future events, which is called a contract.',
        signRuleState1: 'Reuse of contracts: Contracts of authorized parties and authorized parties can be reused within the same authorized party (node or issue).',
        signRuleState2: 'Activation and deactivation of contracts: If you have multiple contracts with multiple authorization policies of the licensor, at least one contract must be active when managing the contract. You can choose to enable or disable one or more of these contracts. In the authorization chain, the system will only verify the authorization status of the enabled contracts.',
        tips: [
            'This issue has a historical contract and can be used directly.',
            'The following policies are available for new signings'
        ],
        contractID: 'Contract ID',
        signDate: 'Sign Date'
    },
    signConfirm: {
        title1: 'Selected nodes',
        title2: 'Policy confirmation'
    },

    namePlaceholder: 'Please enter the release name',
    // version: 'Version',
    dialogTitle: 'My resources',
    policy: 'Authorization Policy ',
    // 'basicUpcast': 'Basic upcast',
    releaseId: 'releaseID',
    releaseIntro: 'Release Intro',
    aboutRelease: 'About release',
    aboutVersion: 'About Version',
    authManagement: 'Authorization Management',
    contract: 'contract',
    addBtnText: 'Add new version',
    save: 'Save',
    editBtnText: 'Edit',
    // 'cancelBtnText': 'Cancel',
    addIntroBtnText: 'add the intro',
    addPolicyBtnText: 'add the policy ',
    enabled: ' enabled',
    disabled: ' disabled',
    online: 'Online',
    notOnline: 'Not online',
    tips1: [ 'The release without a policy do not appear in the market', 'There are no policy', 'The policies are disabled', 'Policy unnamed' ],
    messages2: [ 'Release cover updated successfully!', 'Release policy added successfully!', 'Release intro added successfully!', 'Release intro updated successfully!', 'Release name updated successfully!' ],

    // 'createBtnText': 'Create Release',
    // 'dialogTitle': 'My Resources',
    goToMarket: 'Go to market',
    list: {
        name: 'Release name',
        type: 'Release type',
        newVersion: 'New version',
        allTypes: 'All types',
        policy: 'Policy',
        policyCount: [ 'There are ', ' policies...' ],
        noPolicies: 'No policies',
        view: 'view',
        updateDate: 'Update date',
        collectDate: 'Collect Date',
        createDate: 'Create date',
        operate: 'Operate',
        editBtnText: 'Edit',
        cancelCollectionBtnText: 'remove',
        tips: [ 'All policies has been off the shelves' ],
        messages: [ 'There are no releases available', 'You have not created any releases.', 'You haven\'t collected any releases yet. You will appear here after the release of your collection in the release market.', 'Cancel Successful！' ],
        status: [ 'All', 'online', 'offline' ],
        statusText: 'State'
    },

    upcast: 'Upcast',
    signContractBtnText: 'Sign contract',
    applyBtnText: 'apply',
    layAsideBtnText: 'lay aside',
    offline: 'Already offline',
    signedContracts: 'Signed contracts',
    contractID: 'Contract ID',
    signingDate: 'Signing Date',
    detail: 'detail',
    partyA: 'Party A',
    partyB: 'Party B',
    policyStatus: [ 'Already applied', 'Already lay aside' ],
    signStatus: [ 'Already signed' ],
    contractStatus: [ 'Executing', 'In effect', 'Termination of contract', 'Upcast' ],
    tips2: [ 'The release has been upcasted', 'The following policies are available for new signings', 'This issue has a historical contract and can be used directly.' ],

    noValidContract: 'No Valid Contract',
    contractDetails: 'Details',
    releaseName: 'Name',
    resourceType: 'Type',
    createData: 'Create Data',
    contractInfo: 'Contract Info',

    licensingFailed: 'Licensing Scheme gets failed!',

};
