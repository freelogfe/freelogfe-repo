import ContentBlock from './ContentBlock.vue';
import DisplayOrInput from './DisplayOrInput.vue';
import DisplayEditContracts from './DisplayEditContracts/index.vue';
import FreelogTags from '@/components/Tags/index.vue';
import PolicyEditor from '@/components/PolicyEditor/index.vue';
import PolicyList from '@/components/PolicyList/list/index.vue';
import ContractManager from '@/components/ContractManager/index.vue';
import ReleaseEditorContract from '@/views/release/contract/index.vue';
import i18n from './i18n';
import ConfirmInput from "../test-manager-resource/ConfirmInput";
import ModuleBlock from "../test-manager-resource/ModuleBlock";
import BlockItem from "../test-manager-resource/BlockItem";
import OverviewHeader from "../test-manager-resource/OverviewHeader";
import BreadCrumb from '@/components/BreadCrumb/index.vue';

export default {
    name: 'manager-release',
    i18n,
    components: {
        OverviewHeader,
        BlockItem,
        ModuleBlock,
        ConfirmInput,
        ContentBlock,
        DisplayOrInput,
        FreelogTags,
        PolicyEditor,
        PolicyList,
        ContractManager,
        DisplayEditContracts,
        ReleaseEditorContract,
        BreadCrumb,
    },
    data() {
        return {
            nodeId: '',
            // 是否是初始状态
            initState: true,
            // 发行相关信息
            releaseInfo: {
                theID: '',
                previewImages: '',
                releaseName: '',
                resourceType: '',
                version: '',
                createDate: '',
                intro: '',
            },
            isOnline: 0,
            // 名称
            presentableName: null,

            // 当前可选版本
            versions: [],
            // 当前选择版本
            versionValue: null,
            // 用户定义标签
            userDefinedTags: null,

            // 策略是否是编辑状态
            isShowEditPolicy: false,
            // 策略列表
            policies: [],
            // 新建的策略
            newPolicie: {policyName: this.$t('unnamedPolicy'), policyText: ''},

            // 当前底部激活的是哪个 tabs
            activeTab: 'contract',

            // 发行以及其上抛的解决方式
            resolveReleases: [
                // {
                // releaseId: "5d391df0dd147a002b25d57e",
                // releaseName: "12345123451234/发行G",
                // policies: [
                // {
                //     id: '',
                //     name: '',
                // }
                // ]
                // }
            ],
            // 当前激活的发行 ID
            resolveReleaseID: '',
            // 当前激活的发行的已签约的合约列表
            resolveReleaseContracts: [],

            // 所有发行的策略
            resolveReleasePolicies: [],
            // 当前 presonble 依赖的所有发行，为了获取未签约的发行
            releases: [],

            // 发行详情，作为授权链的数据源
            // releaseDetail: null,

            depReleasesDetailList: [],
            contracts: [],
        };
    },
    mounted() {
        this.handleInitInfo();
        // this.getContractsList();
        // this.freshBottomPolicy();
        // console.log(this.$route.query.addPolicy, '!@#$!@#$@#$');
        if (this.$route.query.addPolicy === 'true') {
            this.switchShowEditPolicy(true);
        }
    },
    methods: {
        /**
         * 根据 presentableId 初始化信息
         * @return {Promise<void>}
         */
        async handleInitInfo() {
            // console.log(this.$route.params.presentableId, 'paramsparamsparamsparams');
            const res = await this.$axios.get(`/v1/presentables/${this.$route.params.presentableId}`);
            const result = res.data.data;
            setTimeout(() => this.initState = false);

            this.nodeId = result.nodeId;
            const time = new Date(result.createDate);
            // console.log(time, 'tTWERFTTTTTTT');
            // console.log(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes(), '@AFDSASDF@#RASEZCX');
            this.releaseInfo = {
                theID: result.releaseInfo.releaseId,
                previewImages: result.releaseInfo.previewImages[0] ? result.releaseInfo.previewImages[0] : undefined,
                releaseName: result.releaseInfo.releaseName,
                resourceType: result.releaseInfo.resourceType,
                version: result.releaseInfo.versions.reverse()[0],
                intro: result.releaseInfo.intro,
                createDate: [
                    [time.getFullYear(), (time.getMonth() + 1 < 10 ? '0' : '') + (time.getMonth() + 1), (time.getDate() < 10 ? '0' : '') + time.getDate()].join('-'),
                    [(time.getHours() < 10 ? '0' : '') + time.getHours(), (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()].join(':')
                ].join(' '),
            };
            this.isOnline = result.isOnline;
            this.presentableName = result.presentableName;
            this.versions = result.releaseInfo.versions;
            this.versionValue = result.releaseInfo.version;
            this.userDefinedTags = result.userDefinedTags;
            this.policies = result.policies;
            // console.log(result.resolveReleases, 'PPPPPPPPPPPPPPPPPPPPP');
            this.resolveReleases = result.resolveReleases;
            this.resolveReleaseID = result.resolveReleases[0].releaseId;

        },
        /**
         * 更新 presentable 数据
         */
        async updatePresentable(params) {
            return await this.$axios.put(`/v1/presentables/${this.$route.params.presentableId}`, params);
        },
        /**
         * 显示添加策略的编辑框
         */
        switchShowEditPolicy(bool) {
            this.isShowEditPolicy = bool;
            this.newPolicie = {policyName: this.$t('unnamedPolicy'), policyText: ''};
        },
        /**
         * 保存一个新策略
         */
        async saveANewPolicy(policy) {
            // console.log(policy, 'policypolicypolicy');
            // return;
            // console.log(this.btoa, 'newPolicienewPolicie');
            // const res = await this.updatePresentable({
            //     policyInfo: {
            //         addPolicies: [
            //             {
            //                 policyName: this.newPolicie.policyName,
            //                 policyText: window.btoa(this.newPolicie.policyText),
            //             },
            //         ],
            //     },
            // });
            const res = await this.updatePresentable({
                policyInfo: {
                    addPolicies: [
                        {
                            policyName: policy.policyName,
                            policyText: window.btoa(policy.policyText),
                        },
                    ],
                },
            });
            // console.log(res.data.data, 'handleInitInfo');
            // this.handleInitInfo(res.data.data);
            if (res.data.errcode !== 0) {
                return this.$message.error(res.data.msg);
            }
            this.isShowEditPolicy = false;
            this.policies = res.data.data.policies;
            this.$message.success(this.$t('addPolicySuccess'));
        },
        /**
         * 更新一个策略的状态
         * @param policie
         */
        async updatePolicies(policie) {
            // console.log(policie, 'policiespoliciespoliciespolicies');
            const res = await this.updatePresentable({
                policyInfo: {
                    updatePolicies: [
                        {
                            policyId: policie.policyId,
                            policyName: policie.policyName,
                            status: policie.status,
                        },
                    ],
                },
            });
            // console.log(res.data.data, 'handleInitInfo');
            // this.handleInitInfo(res.data.data);
            if (res.data.errcode !== 0) {
                return this.$message.error(res.data.msg);
            }
            this.isShowEditPolicy = false;
            this.policies = res.data.data.policies;
            this.$message.success(this.$t('updatedPolicySuccessfully'));
        },
        /**
         * presentableName 变化
         * @param value
         */
        confirmChange(value) {
            this.presentableName = value;
            this.updatePresentable({
                presentableName: value,
            });
            this.$message.success(this.$t('titleUpdateSuccessful'));
        },
        /**
         * 上线和下线
         */
        async onLineAndOffLine() {
            // console.log(item, 'IYOIUHJLKJN');
            const {presentableId} = this.$route.params;
            if (this.isOnline === 0) {
                if (!this.policies || this.policies.length === 0) {
                    return this.$message.error('暂无策略');
                }
                // if (!item.isAuth) {
                //     return this.$message.error(this.$t('cannotOnline.exceptions'));
                // }
            }
            const res = await this.$axios.put(`/v1/presentables/${presentableId}/switchOnlineState`, {
                onlineState: this.isOnline === 0 ? 1 : 0,
            });

            if (res.data.errcode !== 0) {
                return this.$message.error(res.data.msg);
            }
            this.isOnline === 0 ? this.$message.success('上线成功') : this.$message.success('下线成功');
            // item.isOnline = item.isOnline === 0 ? 1 : 0;
            this.handleInitInfo();
        },
        async updateVersion(val) {
            const {presentableId} = this.$route.params;
            const {data: {errcode}} = await this.$services.PresentablesService.put(`${presentableId}/switchPresentableVersion`, {version: val});
            if (errcode !== 0) {
                return this.$message.error('更新版本失败！')
            }
            this.$message.success('更新版本成功！');
        },
    },
    watch: {
        // presentableName(val, oldVal) {
        //     if (this.initState) {
        //         return;
        //     }
        //     // 更新 presentableName
        //     // console.log(this.presentableName, val, oldVal, 'presentableNamepresentableNamepresentableName');
        //     this.updatePresentable({
        //         presentableName: val,
        //     });
        //     this.$message.success(this.$t('titleUpdateSuccessful'));
        // },
        userDefinedTags(val, old) {

            if (this.initState) {
                return;
            }

            // console.log(this.userDefinedTags, 'userDefinedTagsuserDefinedTagsuserDefinedTags');
            // console.log(val, old, 'OOOOOOO');
            if (JSON.stringify(val) === JSON.stringify(old)) {
                return;
            }
            // console.log(val, 'userDefinedTagsuserDefinedTags');
            this.updatePresentable({
                userDefinedTags: val,
            });
            this.$message.success(this.$t('tagUpdatedSuccessfully'));
        },
        versionValue(val, old) {
            if (old === null) {
                return;
            }
            this.updateVersion(val);
            // this.updatePresentable({
            //     version: val,
            // });
            // this.$message.success(this.$t('tagUpdatedSuccessfully'));
        }
    },
    computed: {
        availablePolicies() {
            // console.log(this.resolveReleases, '12342341234213');
            const resolveReleases = this.resolveReleases.find(i => i.releaseId === this.resolveReleaseID);
            if (!resolveReleases) {
                return [];
            }
            // console.log(resolveReleases, 'resolveReleasesresolveReleases');
            const currentReleasePolicyIds = resolveReleases.contracts.map(i => i.policyId);
            // console.log(currentReleasePolicyIds, '111111111');
            const findRelease = this.releases.find(i => i.releaseId === this.resolveReleaseID);
            // console.log(findRelease, '222222222222');
            if (!findRelease) {
                return [];
            }
            return findRelease.policies.filter(i => !currentReleasePolicyIds.includes(i.policyId));
        },
    },
}

function getPolicies(releases) {
    const policies = [];
    for (const i of releases) {
        for (const j of i.policies) {
            policies.push(j);
        }
    }
    return policies;
}
