// import {ContractDetail} from '@freelog/freelog-ui-contract';
import ReleaseEditorContract from '@/views/release/contract/index.vue';
import NavTitle from "./NavTitle";
import NavItem from "./NavItem";
import TabsHeader from "./TabsHeader";
import SignedContract from "./SignedContract";
import ContractsContainer from "./ContractsContainer";
import UnsignedContract from "./UnsignedContract";

export default {
    name: 'DisplayEditContracts',
    i18n: {
        messages: {
            en: {
                currentRelease: 'Current Release',
                throwingRelease: 'Throwing Release',
                authorizer: 'Authorizer: ',
                authorized: 'Authorized: ',
                contracted: 'Contracted',
                availableSigning: 'Available for signing',
                agencySuccess: 'Agency success',
                success: 'Success',
                onlyOneContract: 'Only one contract in the current licensing scheme, cannot be deactivated',
            },
            'zh-CN': {
                currentRelease: '当前发行',
                throwingRelease: '上抛发行',
                authorizer: '授权方：',
                authorized: '被授权方：',
                contracted: '已签约',
                availableSigning: '以下策略可供签约',
                agencySuccess: '签约成功',
                success: '操作成功',
                onlyOneContract: '当前授权方案中只有一个合约，不可停用',
            }
        }
    },

    components: {
        UnsignedContract,
        ContractsContainer,
        SignedContract,
        TabsHeader,
        NavItem,
        NavTitle,
        // ContractDetail,
        ReleaseEditorContract,
    },
    data() {
        return {
            dataSource: [],
            activatedIndex: -1,

            nodeInfo: null,
            // selectedPolicyIDs: [],

            // isSignDirty: false,

            activeTab: 'contract',
            presentableName: '',
            depReleasesDetailList: [],
            contracts: [],
            currentRelease: null,
        };
    },
    mounted() {
        this.handleData();
        // this.getAllContracts();
    },
    methods: {
        async handleData() {
            const {testResourceID} = this.$route.params;
            // console.log(testResourceID, 'testResourceIDtestResourceID');
            // const res = await this.$axios.get(`/v1/presentables/${this.$route.params.presentableId}`);
            const res = await this.$axios.get(`/v1/testNodes/testResources/${testResourceID}`);
            // console.log(res, 'res');
            if (res.data.errcode !== 0 || res.data.ret !== 0) {
                this.$message.error(res.data.msg);
                throw new Error(res.data.msg);
            }
            const data = res.data.data;
            // console.log(data, 'datadatadata');

            this.currentRelease = data.originInfo;
            // console.log(this.currentRelease, 'currentReleasecurrentReleasecurrentRelease');
            if (!this.nodeInfo) {
                this.handleNodeInfo(data.nodeId);
            }

            // console.log(data, '000000000000000');
            const dataSource = data.resolveReleases.map(i => ({
                releaseId: i.releaseId,
                releaseName: i.releaseName,
                children: i.contracts.map(j => ({
                    contract: {
                        id: j.contractId,
                    },
                    policy: {
                        id: j.policyId,
                    }
                })),
            }));

            const contractIDs = getContractIDs(dataSource);
            let policies = [];
            if (contractIDs.length > 0) {
                policies = await getContracts(this.$axios, contractIDs);
            }

            // console.log(policies, 'policiespoliciespolicies');
            // console.log(policies, '999999999');
            // console.log(dataSource, 'dataSource');
            // console.log(policies, 'policies');
            for (const item of dataSource) {
                for (const item2 of item.children) {
                    const id = item2.contract.id;
                    item2.contract = policies.find(i => i.contractId === id);
                }
            }

            // console.log(dataSource, 'WWWWWWWWWWWWWW');

            const releases = await getReleases(this.$axios, dataSource.map(i => i.releaseId));
            // console.log(releases, 'releasesreleasesreleases');

            // console.log(releases, '3333333333333333');
            if (!releases) {
                return;
            }
            for (let i = 0; i < releases.length; i++) {
                dataSource[i].release = releases[i];
            }

            // 根据策略，合并合约
            for (const item of dataSource) {
                // 从对应的发行中获取对应的策略数组
                const policies = getPoliciesByReleasesAndReleaseID(releases, item.releaseId);
                // conso
                const children = policies.map(i => ({
                    policy: i,
                }));
                // console.log(children, '6666666666666');
                for (const i of children) {
                    for (const j of item.children) {
                        // console.log(i, j, '555555555');
                        if (i.policy.policyId === j.policy.id) {
                            // console.log(j, '444444444444');
                            i.contract = j.contract;
                        }
                    }
                }
                item.children = children;
            }
            // console.log(dataSource, '1111111111111');
            // console.log(res, '22222222');
            // console.log(dataSource, 'dataSource');
            const res5 = await this.$axios.get('/v1/contracts/list', {
                params: {
                    targetIds: dataSource.map(i => i.releaseId).join(','),
                    partyTwo: res.data.data.nodeId,
                }
            });

            if (res5.data.errcode !== 0 || res5.data.ret !== 0) {
                this.$message.error(res5.data.msg);
                throw new Error(res5.data.msg);
            }
            // console.log(res5, 'res5res5res5res5res5res5');
            const allContract = res5.data.data;
            for (const i of dataSource) {
                for (const j of i.children) {
                    if (!j.contract) {
                        const contract = allContract.find(i => i.policyId === j.policy.policyId);
                        if (contract) {
                            j.contract = contract;
                            j.disabled = true;
                        }
                    }
                }
            }

            // console.log(dataSource, 'dataSource');
            // setTimeout(() => this.dataSource = dataSource, 100);
            this.dataSource = dataSource;

            if (this.activatedIndex === -1) {
                this.activatedIndex = 0;
            }


            // 授权链部分
            const depReleasesDetailList = [];
            for (const item of dataSource) {
                const contracts = [];
                for (const item2 of item.children) {
                    contracts.push(item2.contract)
                }
                depReleasesDetailList.push({
                    ...releases.find(i => i.releaseId === item.releaseId),
                    contracts,
                });
            }
            // console.log(depReleasesDetailList, 'depReleasesDetailListdepReleasesDetailList');
            this.presentableName = data.presentableName;
            this.depReleasesDetailList = depReleasesDetailList;
            this.contracts = policies;

            // console.log(dataSource, 'dataSourcedataSource');
            // this.depReleasesDetailList = this.depReleasesDetailList.map(i => ({
            //     ...i,
            //     contracts: this.contracts,
            // }));
        },
        /**
         * 获取节点信息
         */
        async handleNodeInfo(nodeID) {
            const res = await this.$axios.get(`/v1/nodes/${nodeID}`);
            // console.log(res, 'resres');
            if (res.data.errcode !== 0 || res.data.ret !== 0) {
                this.$message.error(res.data.msg);
                throw new Error(res.data.msg);
            }
            this.nodeInfo = res.data.data;
        },

        // async getAllContracts() {
        //     const res = await this.$axios.get('/v1/contracts/list', {
        //         params: {
        //             targetIds: '5d391df0dd147a002b25d57e',
        //             partyTwo: '80000034'
        //         }
        //     });
        //     // console.log(res, '!!!!!!!!!!!!!');
        // },
        /**
         * 对可供签约的策略签约
         */
        async signPolicy(policyId, newSign) {
            // console.log(this.dataSource[this.activatedIndex].children, 'policyIdpolicyId');
            // console.log(
            //     this.dataSource[this.activatedIndex]
            //         .children
            //         .filter(i => i.contract && !i.disabled)
            //         .map(i => i.policy.policyId)
            //     , 'this.dataSourcethis.dataSource');
            const policyIDs = this.dataSource[this.activatedIndex]
                .children
                .filter(i => i.contract && !i.disabled)
                .map(i => i.policy.policyId);
            policyIDs.push(policyId);
            try {
                await this.updateSignPolicy(policyIDs);
                if (newSign) {
                    this.$message.success(this.$t('agencySuccess'));
                } else {
                    this.$message.success(this.$t('success'));
                }
            } catch (e) {
                console.error(e);
            }

        },
        /**
         * 解约
         */
        async breakSignPolicy(policyId) {
            // console.log(policyId, 'policyIdpolicyId');
            const policyIDs = this.dataSource[this.activatedIndex]
                .children
                .filter(i => i.contract && !i.disabled)
                .map(i => i.policy.policyId)
                .filter(j => j !== policyId);
            try {
                await this.updateSignPolicy(policyIDs);
                this.$message.success(this.$t('success'));
            } catch (e) {
                console.log(e);
            }

        },
        /**
         * 更新策略
         * @return {Promise<void>}
         */
        async updateSignPolicy(policyIDs) {
            if (policyIDs.length === 0) {
                this.$message.error(this.$t('onlyOneContract'));
                throw new Error('当前授权方案中只有一个合约');
            }
            // this.isSignDirty = false;
            const releaseId = this.dataSource[this.activatedIndex].releaseId;
            const contracts = policyIDs
                .map(i => ({
                    policyId: i,
                }));
            let res;
            try {
                res = await this.updatePresentable({
                    resolveReleases: [
                        {
                            releaseId,
                            contracts,
                        },
                    ]
                });

            } catch (e) {
                console.error(e);
                // throw e;
            }

            if (res.data.errcode !== 0 || res.data.ret !== 0) {
                this.$message.error(res.data.msg);
                throw new Error(res.data.msg);
            }

            setTimeout(() => {
                this.handleData()
            }, 10);

        },

        async updatePresentable(params) {
            // return await this.$axios.put(`/v1/presentables/${this.$route.params.presentableId}`, params);
            const {testResourceID} = this.$route.params;
            return await this.$axios.put(`/v1/testNodes/testResources/${testResourceID}`, params);
        },
        gotoDetails(releaseId, version) {
            // console.log(releaseId, version, 'gotoDetails');
            window.open(`/release/detail/${releaseId}?version=${version}`)
        },
    },
    watch: {
        activatedIndex() {
            this.selectedPolicyIDs = this.dataSource[this.activatedIndex].children
                .filter(i => i.contract)
                .map(i => i.policy.policyId);
            // .map(i => ({
            //         policyId: i.policy.policyId,
            //     }));
            // console.log(this.selectedPolicyIDs)
        },
    }
}

/**
 * 根据合约 IDs 批量查询合约
 */
async function getContracts(axios, IDs) {
    const res = await axios.get('/v1/contracts/list?', {
        params: {
            contractIds: IDs.join(','),
        }
    });
    return res.data.data;
}

/**
 * 根据数据源，获取对应的
 */
function getContractIDs(dataSource) {
    const contractIDs = [];
    for (const item of dataSource) {
        // console.log(item, 'item');
        for (const item2 of item.children) {
            // console.log(item2, 'item2item2item2');
            contractIDs.push(item2.contract.id);
        }
    }
    return contractIDs;
}

/**
 * 根据发行数组和发行ID，获取对应的 发行
 * @param releases
 * @param releaseID
 * @return {Promise<*>}
 */
function getPoliciesByReleasesAndReleaseID(releases, releaseID) {
    const release = releases.find(i => i.releaseId === releaseID);
    return release ? release.policies : [];
}

/**
 * 根据 批量的发行 ID 通过服务端获取批量的发行信息
 * @param axios
 * @param releaseIds
 * @return {Promise<*>}
 */
async function getReleases(axios, releaseIds) {
    const res = await axios.get('/v1/releases/list', {
        params: {
            releaseIds: releaseIds.join(','),
        }
    });
    return res.data.data;
}
