<template>
    <div class="manager-release">

        <div
            style="margin: 0 auto; width: 1190px;"
        >
            <BreadCrumb
                :list="[
                    {text: releaseInfo.resourceType === 'page_build' ? '主题管理' : '展品管理', to: `/node/manager/${nodeId}`},
                    {text: '展品信息'}
                ]"
            />
        </div>

        <div style="height: 30px;"></div>

        <OverviewHeader
            v-if="!!releaseInfo"
            :theID="releaseInfo.theID"
            :previewSrc="releaseInfo.previewImages || undefined"
            :title="releaseInfo.releaseName"
            :type="'release'"
            :resourceType="releaseInfo.resourceType | pageBuildFilter"
            :version="releaseInfo.version"
            :content="releaseInfo.intro"
        />
        <ModuleBlock>

            <BlockItem label="状态">
                <template v-if="releaseInfo.resourceType === 'page_build'">
                    <div
                        v-show="!isOnline"
                        class="manager-release__state"
                    >
                        <label>未激活</label>
                        <a
                            @click="onLineAndOffLine"
                        >激活</a>
                    </div>
                    <div
                        v-show="isOnline"
                        class="manager-release__state"
                    >
                        <label>已激活</label>
                        <!--                    <a-->
                        <!--                        @click="onLineAndOffLine"-->
                        <!--                    >下线</a>-->
                    </div>
                </template>
                <template v-else>
                    <div
                        v-show="!isOnline"
                        class="manager-release__state"
                    >
                        <label>未上线</label>
                        <a
                            @click="onLineAndOffLine"
                        >上线</a>
                    </div>
                    <div
                        v-show="isOnline"
                        class="manager-release__state"
                    >
                        <label>已上线</label>
                        <a
                            @click="onLineAndOffLine"
                        >下线</a>
                    </div>
                </template>
            </BlockItem>

            <BlockItem label="展品名称">
                <ConfirmInput
                    :value="presentableName"
                    @confirmChange="confirmChange"
                />
            </BlockItem>

            <BlockItem
                label="展示版本"
                v-if="versions.length !== 0"
            >
                <el-select
                    v-model="versionValue"
                    class="manager-release__version"
                >
                    <el-option
                        v-for="item in versions"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </BlockItem>

            <BlockItem label="标签">
                <div style="height: 5px;"></div>
                <FreelogTags
                    v-model="userDefinedTags"
                />
            </BlockItem>

            <BlockItem label="授权策略">
                <template v-if="!isShowEditPolicy">
                    <div
                        v-if="policies.length === 0"
                        class="manager-release__policy"
                    >
                        <el-button
                            @click="switchShowEditPolicy(true)"
                            type="primary"
                            size="small"
                        >添加策略
                        </el-button>
                        <el-popover
                            placement="top"
                            trigger="hover"
                            :content="$t('noPolicyNotAppear')"
                        >
                            <div
                                slot="reference"
                                class="manager-release__policy__warning"
                            >
                                <i
                                    class="el-icon-warning"
                                />
                            </div>
                        </el-popover>
                    </div>
                    <PolicyList
                        v-if="policies.length > 0"
                        class="manager-release__policy__list"
                        @add-policy="switchShowEditPolicy(true)"
                        :policyList="policies"
                        @update-policies="updatePolicies"
                    />
                    <!--                        </div>-->
                </template>
                <!--                :policy="editTmpPolicy"-->
                <PolicyEditor
                    :policy="newPolicie"
                    :showFooterBtns="true"
                    class="r-e-w-r-p-editor"
                    v-if="isShowEditPolicy"
                    @save="saveANewPolicy"
                    @cancel="switchShowEditPolicy(false)"
                />
            </BlockItem>
        </ModuleBlock>

        <ContentBlock :title="$t('authorization')">
            <DisplayEditContracts/>
        </ContentBlock>
        <!--        </div>-->
        <div style="height: 65px;"></div>
    </div>
</template>

<script>
    import ManagerRelease from './index.js';


    export default ManagerRelease;
</script>

<style lang="less" scoped>
    @import '../../../styles/variables.less';
    @import "index";

</style>

<style lang="less">
    .manager-release {
        .policy-input-item.edit-mode {
            margin-bottom: 0;
        }

    }
</style>
