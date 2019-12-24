<template>
    <div>

        <TabsHeader v-model="activeTab"/>

        <div
            v-show="activeTab === 'contract'"
            style="background-color: #fafbfb; padding: 10px 10px 20px 0; display: flex;"
        >
            <!-- 左侧导航列表 -->
            <div style="width: 320px; flex-shrink: 0;">
                <!-- 发行列表 -->
                <div v-for="(item, index) in dataSource">
                    <NavTitle v-if="index === 0">{{$t('currentRelease')}}</NavTitle>
                    <NavTitle v-if="index === 1">{{$t('throwingRelease')}}</NavTitle>

                    <NavItem
                        @gotoDetails="gotoDetails(item.releaseId, item.release.resourceVersions[0].version)"
                        @click="activatedIndex = index"
                        :activated="activatedIndex === index"
                        :title="item.releaseName"
                        :type="item.release.resourceType"
                        :version="item.release.resourceVersions[0].version"
                        :date="item.release.updateDate.split('T')[0]"
                        :tags="item.children.filter(i => i.contract && !i.disabled).map(i => ({policyName: i.policy.policyName, status: i.contract.status}))"
                    />
                </div>
                <div style="height: 25px;"></div>
            </div>

            <div style="flex-shrink: 1; width: 100%; height: 720px; overflow-y: auto;">
                <div
                    v-if="activatedIndex !== -1"
                    style="background-color: #fff; padding: 20px 50px; min-height: 100%;"
                >

                    <div
                        style="color: #333; font-size: 14px; background-color: #fafbfb; padding: 15px;"
                    >
                        <div style="padding-bottom: 5px; display: flex;">
                            <div style="flex-shrink: 0;">{{$t('authorizer')}}</div>
                            <div style="width: 100%; flex-shrink: 1; white-space: normal;">
                                {{dataSource[activatedIndex].releaseName}}
                            </div>
                        </div>
                        <div style="display: flex;">
                            <div style="flex-shrink: 0;">{{$t('authorized')}}</div>
                            <div style="width: 100%; flex-shrink: 1; white-space: normal;">{{nodeInfo.nodeName}}</div>
                        </div>
                    </div>

                    <ContractsContainer :title="$t('contracted')">
                        <!-- 已签约列表 -->
                        <div
                            style="position: relative;"
                            v-for="(item, index) in dataSource[activatedIndex].children.filter(i => i.contract)"
                        >
                            <div v-if="index !== 0" style="height: 15px;"></div>
                            <!-- :unique="dataSource[activatedIndex].children.filter(i => i.contract && !i.disabled).length === 1 && !item.disabled" -->
<!--                            :name="[...item.contract.contractName.split('-')].pop()"-->
                            <SignedContract
                                :name="item.contract.contractName"
                                :status="item.contract.status"
                                :contractId="item.contract.contractId"
                                :data="item.contract.createDate.split('T')[0]"
                                :contract="item.contract"
                                :disabled="!!item.disabled"
                                @command="item.disabled ? signPolicy(item.policy.policyId): breakSignPolicy(item.policy.policyId)"
                            />
                        </div>
                    </ContractsContainer>

                    <ContractsContainer
                        :title="$t('availableSigning')"
                        v-if="dataSource[activatedIndex].children.filter(i => !i.contract).length > 0"
                    >
                        <!-- 可签约列表 -->
                        <div v-for="(item, index) in dataSource[activatedIndex].children.filter(i => !i.contract)">
                            <div v-if="index !== 0" style="height: 15px;"></div>
                            <UnsignedContract
                                :policyName="item.policy.policyName"
                                :policyText="item.policy.policyText"
                                @add="signPolicy(item.policy.policyId, true)"
                            />
                        </div>
                    </ContractsContainer>
                </div>
            </div>

        </div>
        <ReleaseEditorContract
            v-show="activeTab === 'authorize'"
            :release="{releaseName: this.presentableName}"
            :depReleasesDetailList="depReleasesDetailList"
            :contracts="contracts"
        />
    </div>
</template>

<script>
    export {default} from './index';
</script>

<style scoped>
    .text-overflow-ellipsis {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

</style>

<style lang="less">
    .message-center-customClass {
        /*font-size: 40px;*/
        top: 50% !important;
        /*transform: translateY(-50%);*/
    }
</style>


