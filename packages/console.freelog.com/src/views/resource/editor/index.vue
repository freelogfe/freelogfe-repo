<template>
    <div class="resource-editor">

        <BlockBody v-if="isUpdateResource" :tilte="$t('historyRelease')">
            <div class="resource-editor__history">
                <div
                    v-if="releasedList.length === 0"
                    class="resource-editor__history--none"
                >{{$t('noReleaseHistory')}}...
                </div>
                <ReleasedItem
                    v-for="item in releasedList"
                    :name="item.name"
                    :version="item.version"
                    :date="item.date"
                />
            </div>
        </BlockBody>

        <BlockBody :tilte="$t('resourceUpload')">

            <SmallTitle v-if="!isUpdateResource">{{$t('resourceType')}}</SmallTitle>

            <div
                v-if="!isUpdateResource"
                class="resource-editor__type"
            >
                <el-select
                    class="resource-editor__type__select"
                    v-model="resourceType"
                    @change="onChangeResourceType"
                    :placeholder="$t('resourceType')"
                    allow-create
                    filterable
                    :disabled="!!this.uploadFileInfo.name"
                >
                    <el-option
                        v-for="item in resourceTypes"
                        :key="item"
                        :label="item | pageBuildFilter"
                        :value="item">
                    </el-option>

                </el-select>

                <div
                    :style="{color: resourceTypeTip? 'red': '#afafaf'}"
                    class="animated resource-editor__type__tip"
                    :class="{shake: resourceTypeTip}"
                >
                    <small>•</small>
                    {{$t('beforeUpload')}}
                </div>
            </div>

            <SmallTitle v-if="!isUpdateResource">{{$t('resourceFile')}}</SmallTitle>

            <div
                v-if="!isUpdateResource"
                class="resource-editor__upload"
            >
                <UploadFile
                    :noRepeat="true"
                    :fileType="resourceType"
                    :fileInfo="uploadFileInfo"
                    :onFileInfoChange="onFileInfoChange"
                    @error="onUploadNoType"
                />
            </div>

            <SmallTitle>{{$t('resourceName')}}</SmallTitle>

            <div
                class="resource-editor__name"
            >
                <!--                :disabled="isUpdateResource"-->
                <el-input
                    :minlength="1"
                    :maxlength="60"
                    v-model="resourceName"
                    :placeholder="$t('enterResourceName')"
                    class="resource-editor__name__input"
                />

                <span
                    class="resource-editor__name__length"
                >{{resourceName.length}}/60</span>
            </div>

            <div style="height: 20px;"></div>
        </BlockBody>

        <BlockBody :tilte="$t('dependency')">
            <template
                v-slot:title2
                v-if="releasedList.length > 0"
            >
                <div
                    class="resource-editor__dependency--lock"
                >
                    <i class="el-icon-info"/> {{$t('cannotChangedDep')}}
                </div>
            </template>
            <!--            :isLock="releasedList.length > 0"-->
            <DependentReleaseList
                :dataSource="depList"
                :isLock="releasedList.length > 0"
                @onChange="onChangeDeps"
            />
        </BlockBody>

        <BlockBody :tilte="$t('description')">
            <RichEditor
                class="resource-editor__description"
                width="100%"
                :placeholder="$t('enterDescription')"
                v-model="description"
            >
            </RichEditor>
        </BlockBody>

        <div v-if="!visibleMetaInput">
            <div style="height: 35px;"></div>
            <el-button
                round
                class="resource-editor__meta__button"
                size="medium"
                @click="showMetaInput"
            ><i class="el-icon-plus"/> {{$t('addMeta')}}
            </el-button>
        </div>

        <BlockBody
            v-if="visibleMetaInput"
            :tilte="$t('metaInfo')">
            <div class="resource-editor__meta__input">
                <div class="resource-editor__meta__input__box">
                    <MetaInfoInput
                        @validate="checkMetaValid"
                        v-model="metaInfo"
                    />
                </div>
            </div>
        </BlockBody>

        <div style="height: 145px;"></div>

        <div
            class="resource-editor__footer"
        >
            <div class="resource-editor__footer__box">
                <el-button
                    size="medium"
                    round
                    class="resource-editor__footer__box__cancel"
                    type="text"
                    @click="goBack"
                >{{isUpdateResource ? $t('cancel'): $t('cancelCreating')}}
                </el-button>
                <el-button
                    size="medium"
                    round
                    @click="onSubmitButtonClick(false)"
                >{{isUpdateResource ? $t('save'): $t('completeCreating')}}
                </el-button>
                <el-button
                    size="medium"
                    type="primary"
                    round
                    @click="onSubmitButtonClick(true)"
                >{{isUpdateResource ? $t('saveAndRelease'): $t('createAndRelease')}}
                </el-button>
            </div>
        </div>

        <el-dialog
            width="750px"
            top="10vh"
            center
            :visible.sync="isShowReleaseSearchDialog"
        >
            <!--            :historicalReleases="releasesList"-->
            <release-search
                :release-source="targetResourceData"
                :tabLayout="['my-release']"
                :historicalReleases="this.releasedList.map(i => ({releaseId: i.id}))"
                @add="createRelease"
            />
            <div slot="footer">
                <el-button
                    round
                    type="primary"
                    class="create-release-btn"
                    @click="createRelease()">{{$t('createANewRelease')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export {default} from './index';
</script>

<style lang="less" scoped>
    @import 'index.less';
</style>
