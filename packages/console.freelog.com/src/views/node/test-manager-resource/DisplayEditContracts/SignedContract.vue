<template>
    <div
        style="background-color: #fafbfb; border: 1px solid #ccc; border-radius: 4px; overflow: hidden;"
    >
        <!--        :style="{opacity: disabled ? .5: 1}"-->
        <div style="padding: 0 15px; border-bottom: 1px solid #d8d8d8;">
            <div style="height: 14px;"></div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center;">
                    <span class="text-overflow-ellipsis"
                          style="font-size: 16px; color: #333; font-weight: 600; padding-right: 20px; max-width: 350px;">{{name}}</span>
                    <span v-if="status === 2"
                          style="color: #fbb726; padding: 0 9px; line-height: 18px; border: 1px solid #fbb726; border-radius: 10px; font-size: 14px;">{{$t('pending')}}</span>
                    <span v-if="status === 4"
                          style="color: #39c500; padding: 0 9px; line-height: 18px; border: 1px solid #39c500; border-radius: 10px; font-size: 14px;">{{$t('active')}}</span>
                    <span v-if="status === 6"
                          style="color: #e35a5f; padding: 0 9px; line-height: 18px; border: 1px solid #e35a5f; border-radius: 10px; font-size: 14px;">{{$t('termination')}}</span>
                </div>
                <el-dropdown v-if="unique">
                    <el-button size="mini">
                        已启用<i class="el-icon-arrow-down el-icon--right"/>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>当前授权方案中只有一个合约，不可停用</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown v-else @command="$emit('command')">
                    <el-button size="mini">
                        {{disabled ? $t('paused') : $t('used')}}<i class="el-icon-arrow-down el-icon--right"/>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>{{disabled ? $t('use') : $t('pause')}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div style="height: 15px"></div>
            <div
                style="font-size: 12px; color: #999;">
                <span style="padding-right: 50px;">{{$t('contract')}}ID：{{contractId}}</span>
                <span>{{$t('signingTime')}}{{data}}</span>
            </div>
            <div style="height: 14px;"></div>
        </div>
        <div style="margin: 0 30px;">
            <!--                                    @update-contract="updateContractAfterEvent"-->
            <div style="height: 20px;"></div>
            <ContractDetail
                class="contract-policy-content"
                :contract.sync="contract"
                :policyText="contract.contractClause.policyText"
            />
            <div style="height: 30px;"></div>
        </div>
    </div>
</template>

<script>
    import {ContractDetail} from '@freelog/freelog-ui-contract';

    export default {
        name: "SignedContract",
        i18n: {
            messages: {
                en: {
                    pending: 'Pending',
                    active: 'Active',
                    termination: 'Termination',
                    paused: 'Paused',
                    used: 'Used',
                    use: 'Use',
                    pause: 'Pause',
                    contract: 'Contract ',
                    signingTime: 'Signing Time: ',
                },
                'zh-CN': {
                    pending: '待执行',
                    active: '生效中',
                    termination: '合约终止',
                    paused: '已搁置',
                    used: '已应用',
                    use: '应用',
                    pause: '搁置',
                    contract: '合约',
                    signingTime: '签约时间：'
                },
            }
        },
        props: {
            name: {
                type: String,
                default: '',
            },
            status: {
                type: Number,
                default: 4,
            },
            contractId: {
                type: String,
                default: '',
            },
            data: {
                type: String,
                default: '',
            },
            contract: {
                type: Object,
                default() {
                    return {};
                }
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            unique: {
                type: Boolean,
                default: false,
            }
        },
        components: {
            ContractDetail,
        }
    }
</script>

<style scoped>
    .text-overflow-ellipsis {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
