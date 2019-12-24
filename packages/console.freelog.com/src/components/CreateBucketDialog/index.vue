<template>
<!--    <div class="">-->
        <!-- 添加 bucket 弹窗 -->
        <el-dialog
            :close-on-click-modal="false"
            :title="$t('newBucket')"
            :visible="visible"
            width="700px"
            @close="onClose"
            custom-class="create-bucket-dialog"
            :modal-append-to-body="false"
        >
            <div style="height: 17px"></div>
            <div class="dialog-body">
                <div style="width: 490px;">
                    <p>• {{$t('createdMayNotBeModified')}}</p>
                    <p>• {{$t('provide2GBStorage')}}</p>
                    <div style="height: 21px;"></div>
                    <!--          v-model="input"-->
                    <div style="display: flex;">
                        <el-input
                            v-model="bucketNameInputValue"
                            :placeholder="$t('bucketName')"
                            style="flex-shrink: 1;"
                        >
                        </el-input>
                        <span style="line-height: 46px; display: inline-block; flex-shrink: 0; padding: 0 10px;"
                              slot="suffix">{{bucketNameInputValue.length}}/63</span>
                    </div>
                </div>
            </div>

            <!-- 错误提示区域 -->
            <div
                style="height: 99px; line-height: 25px; padding: 5px 0; color: #f54242;"
            >
                <div
                    style="width: 490px; margin: 0 auto;"
                    class="animated"
                    :class="{shake: !!bucketNameInputValueError}"
                >
                    <template v-if="bucketNameInputValueError === true">
                        <p>{{$t('includeOnly')}}</p>
                        <p>{{$t('startAndEnd')}}</p>
                        <p>{{$t('between1To63Characters')}}</p>
                    </template>
                    <template v-if="bucketNameInputValueError !==true && !!bucketNameInputValueError">
                        <p>{{bucketNameInputValueError}}</p>
                    </template>
                </div>
            </div>

            <!-- dialog 底部按钮 -->
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    style="color: #999999"
                    type="text"
                    @click="onClose"
                >{{$t('cancel')}}</el-button>
                <el-button
                    type="primary"
                    style="margin-left: 20px; width: 90px; padding-left: 0; padding-right: 0;"
                    round
                    @click="createNewBucketByAPI"
                >{{$t('confirm')}}</el-button>
            </span>
        </el-dialog>
<!--    </div>-->
</template>

<script>

    export default {
        name: "index",
        i18n: {
            messages: {
                en: {
                    newBucket: 'New Bucket',
                    createdMayNotBeModified: 'Please note the name of the storage space but created may not be modified',
                    provide2GBStorage: 'Freelog provide 2GB of free storage space for each user',
                    bucketName: 'Bucket Name',
                    includeOnly: 'Include lowercase letters, numbers and dashes only (-);',
                    startAndEnd: 'Start and end must be in lowercase letters or numbers;',
                    between1To63Characters: 'The length must be between 1 - 63 characters.',
                    confirm: 'Confirm',
                    cancel: 'Cancel',
                },
                'zh-CN': {
                    newBucket: '新建Bucket',
                    createdMayNotBeModified: '请注意存储空间的名称一但创建则不可修改',
                    provide2GBStorage: 'Freelog为每个用户提供2GB的免费存储空间',
                    bucketName: 'Bucket名称',
                    includeOnly: '只能包括小写字母、数字和短横线（-）；',
                    startAndEnd: '必须以小写字母或者数字开头和结尾；',
                    between1To63Characters: '长度必须在 1–63 字符之间。',
                    confirm: '确定',
                    cancel: '取消',
                },
            }
        },
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                // 『新建 bucket 弹窗』中的 『输入框』value
                bucketNameInputValue: '',
                // 『新建 bucket 弹窗』中的错误提示信息
                bucketNameInputValueError: '',
            };
        },
        methods: {
            /**
             * 向服务端 API 发起，新建 bucket 的请求
             */
            async createNewBucketByAPI() {

                this.bucketNameInputValueError = false;

                if (!/^(?!-)[a-z0-9-]{1,63}(?<!-)$/.test(this.bucketNameInputValue)) {
                    setTimeout(() => this.bucketNameInputValueError = true);
                    return;
                }
                this.bucketNameInputValueError = '';

                const params = {
                    bucketName: this.bucketNameInputValue,
                };
                const {data} = await this.$axios.post('/v1/resources/mocks/buckets', params);

                if (data.errcode !== 0) {
                    this.bucketNameInputValueError = data.msg;
                    return;
                }
                this.$emit('success', data.data);
                // this.$message.success(this.$t('successfullyCreated'));
                // this.hideNewBucketDialog();
                // await this.initBucketsByAPI(true);
                // this.activeBucketIndex = this.bucketsList.length - 1;
            },
            onClose() {
                this.$emit('cancel');
                // console.log('#######');
            }
        }
    }
</script>

<style lang="less">
    .create-bucket-dialog {
        &.el-dialog {
            border-radius: 10px;

            .el-dialog__header {
                padding-bottom: 6px;
                padding-top: 6px;
                text-align: center;
                border-bottom: 1px solid #d8d8d8;

                .el-dialog__title {
                    line-height: 38px;
                    color: #333;
                    font-size: 14px;
                }

                .el-dialog__headerbtn {
                    top: 15px
                }
            }

            .dialog-body {
                display: flex;
                align-items: center;
                justify-content: center;
                /*flex-direction: column;*/
                line-height: 38px;
                color: #666;
                font-size: 14px;

                & > div {
                    width: 400px;
                }
            }

            .el-input__inner {
                border: 1px solid #979797;
                height: 46px;
                line-height: 45px;
            }
        }

        /*.mock-list__mocks_non-empty__body_table {*/
        /*    .el-table {*/
        /*        overflow: auto !important;*/

        /*        .el-table__body-wrapper {*/
        /*            overflow: auto;*/
        /*        }*/
        /*    }*/
        /*}*/

        .el-dialog__footer {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-bottom: 45px;
            padding-top: 0;
        }
    }
</style>
