import {axios} from "@/lib";
import querystring from 'querystring';
import CreateBucketDialog from '@/components/CreateBucketDialog/index.vue';
import i18n from './i18n';
import {mapGetters} from "vuex";

export default {
    i18n,
    components: {
        CreateBucketDialog,
    },
    // name: "index",
    data() {
        return {
            // 根 div 样式对象
            styleObject: {
                // height: '100%',
                minHeight: (window.innerHeight - 60) + 'px',
            },

            // 『bucket 列表』
            // bucketsList: null,
            // bucket 列表』中被激活的 bucket，在 bucket 列表中的索引
            // activeBucketIndex: Number(window.sessionStorage.getItem('activeBucketIndex') || 0),
            // activeBucketIndex: 0,

            // 『新建 bucket 弹窗』 是否显示
            dialogVisible: false,
            // 『新建 bucket 弹窗』中的 『输入框』value
            // bucketNameInputValue: '',
            // 『新建 bucket 弹窗』中的错误提示信息
            // bucketNameInputValueError: '',

            // 『mock 表格』数据
            mockTableData: null,
            // 『mock 表格』当前页码
            mockCurrentPage: 1,
            // 『mock 表格』当前分页
            mockPageSize: 10,
            // 『mock 表格』总条数
            mockTotalItem: 0,

            // 删除Bucket的面板是否显示
            deleteBucketPopoverShow: false,
            // 删除mock资源的提示框是否显示
            // deleteMockDialogShow: false,
            // 要删除的mock ID
            deleteMockID: '',

            // 临时储存需要生成的资源信息
            tmpNeedBuildResource: null,
        };
    },
    computed: {
        // 当前已激活的 bucket
        activatedBucket: function () {
            // console.log(this.$route);
            return this.bucketsList && this.bucketsList.find(i => i.bucketName === this.$route.query.activatedBucketName);
            // return this.bucketsList && this.bucketsList.find(i => );
        },
        ...mapGetters({
            // nodes: 'nodes',
            // buckets: 'bucketsList',
            bucketsList: 'buckets',
        }),
    },
    mounted() {
        this.handleMockData();
    },
    methods: {
        /**
         * 通过 服务端 API 获取 buckets 数据，并初始化 buckets
         * @returns {Promise<void>}
         */
        // async initBucketsByAPI(bool) {
            // const {data} = await axios.get('/v1/resources/mocks/buckets');
            // console.log(data, 'datadatadatadatadatadatadatadatadatadatadatadatadatadatadatadata');
            // this.bucketsList = data.data;
            // if (bool) {
            //     this.activeBucketIndex = data.data.length - 1
            // }
        // },
        async createBucketSuccess(bucket) {
            // console.log('######');
            this.$message.success(this.$t('successfullyCreated'));
            this.dialogVisible = false;
            // window.location.reload();
            this.$store.dispatch('loadBuckets');
            // this.initBucketsByAPI(true);
            this.onChangeBucketActiveIndex(bucket);
        },
        /**
         * 改变 bucket 列表中激活的索引
         * @param bucket
         */
        onChangeBucketActiveIndex(bucket) {
            // 将激活的索引放到本地，方便再次进入页面时选中
            // window.sessionStorage.setItem('activeBucketIndex', index);
            // this.activeBucketIndex = index;
            this.$router.push({
                path: '/mock/display',
                query: {
                    activatedBucketName: (bucket && bucket.bucketName) || '',
                }
            });
        },

        /**
         * 显示『新建 bucket』弹窗
         */
        // showNewBucketDialog() {
        //     this.dialogVisible = true;
        // },
        /**
         * 隐藏『新建 bucket』弹窗
         */
        hideNewBucketDialog() {
            this.dialogVisible = false;
            // this.bucketNameInputValue = '';
            // this.bucketNameInputValueError = '';
        },
        // /**
        //  * 向服务端 API 发起，新建 bucket 的请求
        //  */
        // async createNewBucketByAPI() {
        //
        //     this.bucketNameInputValueError = false;
        //
        //     if (!/^(?!-)[a-z0-9-]{1,63}(?<!-)$/.test(this.bucketNameInputValue)) {
        //         setTimeout(() => this.bucketNameInputValueError = true);
        //         return;
        //     }
        //     this.bucketNameInputValueError = '';
        //
        //     const params = {
        //         bucketName: this.bucketNameInputValue,
        //     };
        //     const {data} = await axios.post('/v1/resources/mocks/buckets', params);
        //
        //     if (data.errcode !== 0) {
        //         this.bucketNameInputValueError = data.msg;
        //         return;
        //     }
        //     this.$message.success(this.$t('successfullyCreated'));
        //     this.hideNewBucketDialog();
        //     await this.initBucketsByAPI(true);
        //     // this.activeBucketIndex = this.bucketsList.length - 1;
        // },
        /**
         * 向 API 发起请求，删除当前激活的 bucket
         * @returns {Promise<void>}
         */
        async removeABucketByAPI() {
            const bucketName = this.activatedBucket.bucketName;
            // console.log(bucketName, 'bucketNamebucketNamebucketName');
            const {data} = await axios.delete(`/v1/resources/mocks/buckets/${bucketName}`);
            // console.log(data, 'datadatadata');
            if (data.errcode !== 0) {
                return this.errorMessage(data.msg);
            }
            this.$message.success(this.$t('successfullyDeleted'));
            // 从 bucket 列表中 移除当前 bucket
            // this.bucketsList.splice(this.activeBucketIndex, 1);
            // this.bucketsList = this.bucketsList.filter(i => i.bucketName !== this.$route.query.activatedBucketName);
            await this.$store.dispatch('loadBuckets');
            this.controlDeleteBucketPopoverShow(false);

            // await null;
            console.log('########');
            this.onChangeBucketActiveIndex(this.bucketsList[0] || null);
            // this.initBucketsByAPI();
        },
        /**
         * 处理展示 mock table
         * @returns {Promise<void>}
         */
        async handleMockData() {
            if (!this.activatedBucket) {
                return;
            }
            const params = {
                page: this.mockCurrentPage,
                pageSize: this.mockPageSize,
                bucketName: this.activatedBucket.bucketName,
                // keywords: '',
                // resourceType: '',
                // projection: '',
            };
            const str = querystring.stringify(params);
            const {data} = await axios.get(`/v1/resources/mocks?${str}`);
            this.mockTableData = data.data.dataList.map((i) => ({
                mockResourceId: i.mockResourceId,
                name: i.name,
                type: i.resourceType,
                previewImages: i.previewImages,
                size: humanizeSize(i.systemMeta.fileSize),
                date: i.createDate.split('T')[0],
                sha1: i.sha1,
                systemMeta: i.systemMeta,
            }));
            // console.log(this.mockTableData, 'this.mockTableDatathis.mockTableData');
            this.mockTotalItem = data.data.totalItem;
        },
        /**
         * 下载一个 mock 资源
         * @param mockResourceId
         */
        downloadAMockByAPI(mockResourceId) {
            window.location.href = `${window.location.origin.replace('console', 'qi')}/v1/resources/mocks/${mockResourceId}/download`;
        },

        /**
         * 生成正式资源
         */
        async buildFormalResourcesConfirm(row) {
            // console.log(row, 'RRRRRWWWWWWW');

            if (row.systemMeta.dependencyInfo && row.systemMeta.dependencyInfo.mocks && row.systemMeta.dependencyInfo.mocks.length > 0) {
                return this.$message.error(this.$t('invalidRelease'));
            }

            const res = await this.$axios.get(`/v1/resources/${row.sha1}`);
            if (res.data.data) {
                return this.$message.error(this.$t('resourceAlreadyExists'));
            }

            this.tmpNeedBuildResource = row;

            this.$confirm(this.$t('formalResource'), this.$t('prompt'), {
                confirmButtonText: this.$t('confirm'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            })
                .then(async () => {
                    const params = {
                        resourceAliasName: row.name,
                    };
                    const res1 = await this.$axios.post(`/v1/resources/mocks/${row.mockResourceId}/convert`, params);

                    if (res1.data.errcode !== 0) {
                        this.$message({
                            type: 'error',
                            message: res1.data.msg,
                        });
                        return;
                    }
                    this.$message({
                        type: 'success',
                        message: this.$t('generateSuccess')
                    });
                    this.$router.push(`/resource/editor/${res1.data.data.resourceId}`);
                    // console.log(res1, 'res1res1res1res1res1');

                })
                .catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });
                });
        },
        /**
         * 正式生成正式资源
         */
        // async buildFormalResources() {
        //     const params = {
        //         resourceAliasName: row.name,
        //     };
        //     const res1 = await this.$axios.post(`/v1/resources/mocks/${row.mockResourceId}/convert`, params);
        //
        //     if (res1.data.errcode === 0) {
        //
        //     }
        // },


        /**
         * 向 API 发起请求，根据 mockID 删除一个 mock
         * @param mockResourceId
         */
        async removeAMockByAPI(mockResourceId) {
            // console.log(mockResourceId, 'mockResourceId');
            const {data} = await axios.delete(`/v1/resources/mocks/${mockResourceId}`);
            // console.log(data, 'aadsfaewazxdf');
            // this.mockTotalItem = this.mockTotalItem - 1;
            this.mockCurrentPage = Math.min(this.mockCurrentPage, Math.ceil((this.mockTotalItem - 1) / this.mockPageSize) || 1);
            // console.log(this.mockCurrentPage, 'this.mockCurrentPagethis.mockCurrentPage');
            this.handleMockData();
        },

        /**
         * 当前页面发生变化时
         * @param currentPage
         */
        onCurrentPageChange(currentPage) {
            // console.log(currentPage, 'currentPagecurrentPage');
            this.mockCurrentPage = currentPage;
        },
        /**
         * 页面数量发生改变时
         * @param pageSize
         */
        onPageSizeChange(pageSize) {
            // console.log(pageSize, 'pageSizepageSizepageSize');
            this.mockPageSize = pageSize;
            this.mockCurrentPage = 1;
        },

        /**
         * 错误提示框
         * @param text
         */
        errorMessage(text) {
            this.$message.error(text);
        },

        /**
         * 将服务端的日期格式转换成显示日期
         * @param str
         */
        transformToDateString(str) {
            const date = new Date(str);
            // console.log(date.getFullYear(), 'getFullYear');
            // console.log(date.getMonth(), 'getMonth');
            // console.log(date.getDate(), 'getDate');
            return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        },
        /**
         * 控制 『删除 bucket 的面板是否显示』
         * @param {boolean} bool
         */
        controlDeleteBucketPopoverShow(bool) {
            this.deleteBucketPopoverShow = bool;
        },
        /**
         * 显示删除 mock 提示框
         */
        showDeleteMockDialog(mockResourceId) {
            // this.deleteMockDialogShow = true;
            // this.removeAMockByAPI(mockResourceId);
            this.deleteMockID = mockResourceId;
        },
        /**
         * 正式删除一个 mock
         */
        async deleteAMock() {
            await this.removeAMockByAPI(this.deleteMockID);
            this.$message({
                customClass: 'message-class',
                duration: 1500,
                // duration: 0,
                center: true,
                type: 'success',
                dangerouslyUseHTMLString: true,
                message: '<div style="font-size: 14px; color: #333;">删除成功</div>'
            });
            this.hideDeleteMockDialog();
        },
        /**
         * 隐藏删除 mock 提示框
         */
        hideDeleteMockDialog() {
            this.deleteMockID = '';
        },
    },
    watch: {
        activatedBucket() {
            this.handleMockData();
        },
        mockCurrentPage() {
            this.handleMockData();
        },
        mockPageSize() {
            this.handleMockData();
        }
    }
}

function humanizeSize(number) {
    const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

    if (!number) {
        return '';
    }

    if (number < 1) {
        return `${number} B`;
    }

    const algorithm = 1024;
    const exponent = Math.min(Math.floor(Math.log(number) / Math.log(algorithm)), UNITS.length - 1);
    number = Number((number / Math.pow(algorithm, exponent)).toPrecision(2));
    const unit = UNITS[exponent];

    return `${number} ${unit}`;
}

