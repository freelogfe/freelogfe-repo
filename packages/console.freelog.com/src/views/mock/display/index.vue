<template>
    <div
        class="mock-list"
        :style="styleObject"
    >

        <!-- 左侧 bucket 列表 -->
        <div class="mock-list__buckets">
            <div style="height: 80px;"></div>

            <!-- buckets 标题 -->
            <div class="mock-list__buckets__title">
                <div class="mock-list__buckets__title__content">
                    <div>
                        <span>Bucket{{$t('list')}}</span>
                        <span style="padding-left: 10px;">{{(bucketsList || []).length}}/5</span>
                    </div>
                    <el-button
                        v-if="(bucketsList || []).length < 5"
                        icon="el-icon-plus"
                        circle
                        size="small"
                        @click="dialogVisible=true"
                    />
                </div>
                <div style="height: 10px;"></div>
            </div>

            <!-- buckets 列表 -->
            <div class="mock-list__buckets__list">
                <a
                    href="javascript:"
                    v-for="(bucket, index) in (bucketsList || [])"
                    :key="bucket.bucketId"
                    class="mock-list__buckets__list__item"
                    :class="{'mock-list__buckets__list__item_active': $route.query.activatedBucketName === bucket.bucketName}"
                    @click="onChangeBucketActiveIndex(bucket)"
                >{{bucket.bucketName}}</a>
            </div>
        </div>

        <!-- 右侧内容区 -->
        <div class="mock-list__mocks">

            <!-- 没有 bucket 时显示-->
            <div
                class="mock-list__mocks_empty"
                v-if="bucketsList && bucketsList.length === 0"
            >
                <div class="mock-list__mocks_empty__content">
                    <h3>{{$t('startingFromFreelog')}}</h3>
                    <div style="height: 60px;"></div>
                    <p>{{$t('freelogMockResourcePool')}}</p>
                    <div style="height: 60px;"></div>
                    <el-button
                        @click="dialogVisible=true"
                        type="primary"
                    >{{$t('createBucket')}}
                    </el-button>
                </div>
            </div>

            <!-- 有 bucket 时显示 -->
<!--            v-if="bucketsList && bucketsList.length > 0"-->
            <div
                class="mock-list__mocks_non-empty"
                v-if="!!activatedBucket"
            >
                <div class="mock-list__mocks_non-empty__header">
                    <div class="mock-list__mocks_non-empty__header__info">
                        <div>{{$t('mockQuantity')}}<span>{{activatedBucket.resourceCount}}</span></div>
                        <div>{{$t('creationTime')}}<span>{{transformToDateString(activatedBucket.createDate)}}</span>
                        </div>
                        <div>
                            {{$t('used')}}<span>{{Math.floor(activatedBucket.totalFileSize / 1073741824 * 100) / 100}}GB/2GB</span>
                            <el-progress
                                :percentage="Math.floor(activatedBucket.totalFileSize / 2147483648 * 100) / 100"
                                :show-text="false"
                                style="width: 120px;"
                            />
                        </div>
                    </div>

                    <el-popover
                        placement="top"
                        width="(mockTableData && mockTableData.length === 0) ? 360 : 274"
                        v-model="deleteBucketPopoverShow"
                    >
                        <template v-if="mockTableData && mockTableData.length === 0">
                            <div style="height: 30px;"></div>
                            <p style="text-align: center; font-size: 14px; font-weight: 600; color: #333;">
                                {{$t('confirmDeletion')}}</p>
                            <div style="height: 25px;"></div>
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <el-button
                                    size="small"
                                    type="text"
                                    style="padding-left: 20px; padding-right: 20px; color: #999;"
                                    @click="controlDeleteBucketPopoverShow(false)"
                                >{{$t('cancel')}}
                                </el-button>
                                <el-button
                                    type="danger"
                                    size="small"
                                    @click="removeABucketByAPI"
                                >{{$t('confirm')}}
                                </el-button>
                            </div>
                            <div style="height: 8px;"></div>
                        </template>
                        <template v-if="mockTableData && mockTableData.length > 0">
                            <div style="height: 30px;"></div>
                            <p style="text-align: center; font-size: 14px; font-weight: 600; color: #333;">
                                {{$t('doesNotRemove')}}</p>
                            <div style="height: 25px;"></div>
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <el-button
                                    size="small"
                                    type="primary"
                                    plain
                                    @click="controlDeleteBucketPopoverShow(false)"
                                >{{$t('confirm')}}
                                </el-button>
                            </div>
                            <div style="height: 8px;"></div>
                        </template>

                        <el-button
                            type="danger"
                            plain
                            slot="reference"
                            size="small"
                            icon="el-icon-delete"
                            style="border-radius: 2px;"
                        >{{$t('deleteBucket')}}
                        </el-button>
                    </el-popover>

                </div>

                <div class="mock-list__mocks_non-empty__create">
                    <router-link
                        :to="'/mock/create/' + activatedBucket.bucketName"
                        class="nav-link ls-nav-link"
                        target="_blank"
                    >
                        <el-button type="primary" style="border-radius: 2px; background-color: #409EFF;">
                            {{$t('createMock')}}
                        </el-button>
                    </router-link>
                </div>

                <div class="mock-list__mocks_non-empty__body">
                    <div
                        v-if="mockTableData && mockTableData.length === 0"
                        class="mock-list__mocks_non-empty__body_null"
                    >
                        <p>{{$t('notCreatedAnyMock')}}</p>
                    </div>

                    <!--                    v-if="mockTableData && mockTableData.length > 0"-->
                    <div
                        class="mock-list__mocks_non-empty__body_table"
                        v-else
                    >
                        <el-table
                            :empty-text="mockTableData === null ? '加载中...' : ''"
                            :data="mockTableData"
                            style="width: 100%">
                            <el-table-column
                                prop="preview"
                                label=""
                                width="70">
                                <template slot-scope="scope">
                                    <div
                                        style="width: 40px; height: 36px;"
                                        class="resource-default-preview"
                                    >
                                        <img
                                            style="width: 100%; height: 100%;"
                                            v-if="scope.row.previewImages && scope.row.previewImages.length > 0"
                                            :src="scope.row.previewImages[0]"
                                            alt=""
                                        />
                                        <!--                                        <span v-if="scope.previewImages"></span>-->
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                :label="$t('table.name')"
                                min-width="180">
                            </el-table-column>
                            <el-table-column
                                prop="type"
                                :label="$t('table.type')"
                                min-width="180">
                                <template slot-scope="scope">
                                    {{scope.row.type | pageBuildFilter}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="size"
                                :label="$t('table.size')"
                                min-width="180">
                            </el-table-column>
                            <el-table-column
                                prop="date"
                                :label="$t('table.date')"
                                min-width="180">
                            </el-table-column>
                            <el-table-column
                                prop="action"
                                :label="$t('table.action')"
                                width="70"
                            >
                                <template slot-scope="scope">
                                    <el-dropdown>

                                        <el-button
                                            icon="el-icon-more"
                                            type="small"
                                            circle
                                            style="background-color: #fafbfb;"
                                        />

                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item>
                                                <router-link
                                                    target="_blank"
                                                    :to="'/mock/update/' + scope.row.mockResourceId"
                                                >
                                                    <a
                                                        style="display: block; width: 100%; height: 100%; color: #333;"
                                                    >{{$t('edit')}}</a>
                                                </router-link>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <a
                                                    @click="downloadAMockByAPI(scope.row.mockResourceId)"
                                                    style="display: block; width: 100%; height: 100%; color: #333;"
                                                >{{$t('downloadResourceFile')}}</a>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <a
                                                    @click="buildFormalResourcesConfirm(scope.row)"
                                                    style="display: block; width: 100%; height: 100%; color: #333;"
                                                >{{$t('generateFormalResources')}}</a>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <a
                                                    @click="showDeleteMockDialog(scope.row.mockResourceId)"
                                                    style="color: #EE4040; display: block; width: 100%; height: 100%;"
                                                >{{$t('delete')}}</a>
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </template>

                            </el-table-column>
                        </el-table>
                        <div style="padding: 10px 0; display: flex; justify-content: flex-end;">
                            <el-pagination
                                :current-page="mockCurrentPage"
                                :page-sizes="[10, 20, 30, 40, 50]"
                                :page-size="mockPageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="mockTotalItem"
                                @current-change="onCurrentPageChange"
                                @size-change="onPageSizeChange"
                            >
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <CreateBucketDialog
            :visible="dialogVisible"
            @cancel="dialogVisible=false"
            @success="createBucketSuccess"
        />
        <!--        <div class="mock-list__border-dialog">-->
        <!--            &lt;!&ndash; 添加 bucket 弹窗 &ndash;&gt;-->
        <!--            <el-dialog-->
        <!--                :close-on-click-modal="false"-->
        <!--                :title="$t('newBucket')"-->
        <!--                :visible.sync="dialogVisible"-->
        <!--                width="700px"-->
        <!--            >-->
        <!--                <div style="height: 17px"></div>-->
        <!--                <div class="dialog-body">-->
        <!--                    <div style="width: 490px;">-->
        <!--                        <p>• {{$t('createdMayNotBeModified')}}</p>-->
        <!--                        <p>• {{$t('provide2GBStorage')}}</p>-->
        <!--                        <div style="height: 21px;"></div>-->
        <!--                        &lt;!&ndash;          v-model="input"&ndash;&gt;-->
        <!--                        <div style="display: flex;">-->
        <!--                            <el-input-->
        <!--                                v-model="bucketNameInputValue"-->
        <!--                                :placeholder="$t('bucketName')"-->
        <!--                                style="flex-shrink: 1;"-->
        <!--                            >-->
        <!--                            </el-input>-->
        <!--                            <span style="line-height: 46px; display: inline-block; flex-shrink: 0; padding: 0 10px;"-->
        <!--                                  slot="suffix">{{bucketNameInputValue.length}}/63</span>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                </div>-->

        <!--                &lt;!&ndash; 错误提示区域 &ndash;&gt;-->
        <!--                <div-->
        <!--                    style="height: 99px; line-height: 25px; padding: 5px 0; color: #f54242;"-->
        <!--                >-->
        <!--                    <div-->
        <!--                        style="width: 490px; margin: 0 auto;"-->
        <!--                        class="animated"-->
        <!--                        :class="{shake: !!bucketNameInputValueError}"-->
        <!--                    >-->
        <!--                        <template v-if="bucketNameInputValueError === true">-->
        <!--                            <p>{{$t('includeOnly')}}</p>-->
        <!--                            <p>{{$t('startAndEnd')}}</p>-->
        <!--                            <p>{{$t('between1To63Characters')}}</p>-->
        <!--                        </template>-->
        <!--                        <template v-if="bucketNameInputValueError !==true && !!bucketNameInputValueError">-->
        <!--                            <p>{{bucketNameInputValueError}}</p>-->
        <!--                        </template>-->
        <!--                    </div>-->
        <!--                </div>-->

        <!--                &lt;!&ndash; dialog 底部按钮 &ndash;&gt;-->
        <!--                <span-->
        <!--                    slot="footer"-->
        <!--                    class="dialog-footer"-->
        <!--                >-->
        <!--                <el-button-->
        <!--                    style="color: #999999"-->
        <!--                    type="text"-->
        <!--                    @click="hideNewBucketDialog"-->
        <!--                >{{$t('cancel')}}</el-button>-->
        <!--                <el-button-->
        <!--                    type="primary"-->
        <!--                    style="margin-left: 20px; width: 90px; padding-left: 0; padding-right: 0;"-->
        <!--                    round-->
        <!--                    @click="createNewBucketByAPI"-->
        <!--                >{{$t('confirm')}}</el-button>-->
        <!--            </span>-->
        <!--            </el-dialog>-->
        <!--        </div>-->

        <div class="mock-list__noheader-dialog">
            <el-dialog
                :visible="!!deleteMockID"
                width="30%"
                :show-close="false"
                :close-on-click-modal="false"
            >
                <div style="height: 10px;"></div>
                <div style="color: #333; font-size: 14px; text-align: center; word-break: normal;">
                    {{$t('mockOnceDeleted')}}
                </div>
                <div style="height: 26px;"></div>
                <div style="text-align: center;">
                    <el-button
                        type="text"
                        style="padding: 0 20px; color: #999;"
                        @click="hideDeleteMockDialog"
                    >{{$t('cancel')}}
                    </el-button>
                    <el-button
                        type="danger"
                        @click="deleteAMock"
                    >{{$t('confirm')}}
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>

</template>

<script>
    import MockDisplay from './index';

    export default MockDisplay;
</script>

<style lang="less" type="text/less" scoped>
    @import "index.less";

    .message-class {
        background-color: #fff;
    }
</style>

<style lang="less" type="text/less">

    .message-class {
        background-color: #fff;
        width: 246px;
        min-width: 246px;
        padding: 40px 0;

        .el-message__icon.el-icon-success {
            font-size: 40px;
        }
    }

    .mock-list {
        /*.mock-list__border-dialog {*/
        /*    .el-dialog {*/
        /*        border-radius: 10px;*/

        /*        .el-dialog__header {*/
        /*            padding-bottom: 6px;*/
        /*            padding-top: 6px;*/
        /*            text-align: center;*/
        /*            border-bottom: 1px solid #d8d8d8;*/

        /*            .el-dialog__title {*/
        /*                line-height: 38px;*/
        /*                color: #333;*/
        /*                font-size: 14px;*/
        /*            }*/

        /*            .el-dialog__headerbtn {*/
        /*                top: 15px*/
        /*            }*/
        /*        }*/

        /*        .el-input__inner {*/
        /*            border: 1px solid #979797;*/
        /*            height: 46px;*/
        /*            line-height: 45px;*/
        /*        }*/
        /*    }*/

        /*    !*.mock-list__mocks_non-empty__body_table {*!*/
        /*    !*    .el-table {*!*/
        /*    !*        overflow: auto !important;*!*/

        /*    !*        .el-table__body-wrapper {*!*/
        /*    !*            overflow: auto;*!*/
        /*    !*        }*!*/
        /*    !*    }*!*/
        /*    !*}*!*/

        /*    .el-dialog__footer {*/
        /*        display: flex;*/
        /*        align-items: center;*/
        /*        justify-content: center;*/
        /*        padding-bottom: 45px;*/
        /*        padding-top: 0;*/
        /*    }*/
        /*}*/

        .mock-list__noheader-dialog {
            .el-dialog__header {
                display: none;
            }

            .el-dialog__body {
                padding-bottom: 20px;
            }
        }
    }

</style>
