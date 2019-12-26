<template>
    <div style="width: 1190px; margin: 0 auto;">
        <div
            style="margin: 0 auto; width: 1190px;"
        >
            <BreadCrumb
                :list="[
                    {text: '测试节点管理', to: `/node/test-manager/${nodeId}`},
                    {text: '测试展品信息'}
                ]"
            />
        </div>
        <div style="height: 30px;"></div>

        <!--            :datetime="'2018-10-10 12:00'"-->
        <OverviewHeader
            v-if="!!originInfo"
            :theID="originInfo.theID"
            :previewSrc="originInfo.previewImage"
            :title="originInfo.name"
            :type="originInfo.type"
            :resourceType="originInfo.resourceType | pageBuildFilter"
            :version="originInfo.version"
            :content="originInfo.intro"
        />

        <ModuleBlock>
            <BlockItem label="状态" v-if="originInfo.resourceType !== 'page_build'">
                <div v-show="!isOnline" style="display: flex; align-items: center;">
                    <label style="font-size: 14px; color: #333; font-weight: 600; padding-right: 40px;">未上线</label>
                    <a
                        @click="onLineAndOffLine"
                        style="display: inline-block; line-height: 28px; background-color: #409eff; color: #fff; width: 60px; text-align: center; border-radius: 14px; font-weight: 600; cursor: pointer;"
                    >上线</a>
                </div>
                <div v-show="isOnline" style="display: flex; align-items: center;">
                    <label style="font-size: 14px; color: #333; font-weight: 600; padding-right: 40px;">已上线</label>
                    <a
                        @click="onLineAndOffLine"
                        style="display: inline-block; line-height: 28px; background-color: #409eff; color: #fff; width: 60px; text-align: center; border-radius: 14px; font-weight: 600; cursor: pointer;"
                    >下线</a>
                </div>
            </BlockItem>

            <BlockItem
                label="状态"
                v-if="originInfo.resourceType === 'page_build'"
            >
                <div
                    v-show="activatedThemeId !== testResourceID"
                    style="display: flex; align-items: center;"
                >
                    <label style="font-size: 14px; color: #333; font-weight: 600; padding-right: 40px;"
                    >未激活</label>
                    <a
                        @click="activateTheme"
                        style="display: inline-block; line-height: 28px; background-color: #409eff; color: #fff; width: 60px; text-align: center; border-radius: 14px; font-weight: 600; cursor: pointer;"
                    >激活</a>
                </div>
                <div
                    v-show="activatedThemeId === testResourceID"
                    style="display: flex; align-items: center;"
                >
                    <label style="font-size: 14px; color: #333; font-weight: 600; padding-right: 40px;">已激活</label>
                    <!--                    <a-->
                    <!--                        @click="onLineAndOffLine"-->
                    <!--                        style="display: inline-block; line-height: 28px; background-color: #409eff; color: #fff; width: 60px; text-align: center; border-radius: 14px; font-weight: 600; cursor: pointer;"-->
                    <!--                    >下线</a>-->
                </div>
            </BlockItem>

            <BlockItem label="节点发行名称">
                <ConfirmInput
                    v-if="!!originInfo"
                    :disabled="!!nodePresentableId"
                    :value="testResourceName"
                    @confirmChange="confirmChange"
                />
            </BlockItem>
            <BlockItem
                label="展示版本"
                v-if="versions.length !== 0"
            >
                <el-select
                    v-model="versionValue"
                    style="display: block; width: 700px; background-color: #fafbfb; font-weight: 600;"
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
                <!--                actionText="新标签"-->
                <FreelogTags
                    v-model="userDefinedTags"
                />
            </BlockItem>
        </ModuleBlock>

        <ContentBlock :title="'授权管理'">
            <DisplayEditContracts/>
        </ContentBlock>

    </div>
</template>

<script>
    import Index from './index';

    export default Index;
</script>

<style scoped>

</style>
