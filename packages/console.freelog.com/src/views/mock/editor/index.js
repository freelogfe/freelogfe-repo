import BlockBody from '@/components/ResourceComponents/BlockBody.vue';
import SmallTitle from '@/components/ResourceComponents/SmallTitle.vue';
import DepList from '@/components/ResourceComponents/DepList.vue';
import HeaderAlert from '@/components/ResourceComponents/HeaderAlert.vue';
import UploadFile from '@/components/ResourceComponents/UploadFile/index.vue';
import BreadCrumb from '@/components/BreadCrumb/index.vue';
// import UploadCover from '@/components/ResourceComponents/UploadCover/index.vue';
import ReleaseSearch from '@/views/release/search/index.vue';
import RichEditor from '@/components/RichEditor/index.vue';
import MetaInfoInput from '@/components/MetaInfoInput/index.vue';
import DependentReleaseList from '@/components/DependentReleaseList/index.vue';
import i18n from './i18n';
import {COMMON_NAME_REGEXP} from '@/config/regexp';

export default {
    name: 'editor',
    i18n,

    components: {
        SmallTitle,
        UploadFile,
        // UploadCover,
        ReleaseSearch,
        DepList,
        BlockBody,
        RichEditor,
        MetaInfoInput,
        HeaderAlert,
        DependentReleaseList,
        BreadCrumb
    },

    data() {
        return {
            bucketName: '',

            isUpdateResource: !!this.$route.params.mockResourceId,
            // 资源类型选项
            resourceTypes: ['json', 'widget', 'image', 'audio', 'markdown', 'page_build', 'reveal_slide', 'license', 'video', 'catalog'],
            // 资源类型值
            resourceType: '',
            // 资源类型，是否提醒
            resourceTypeTip: false,

            // 上传文件的信息
            uploadFileInfo: {
                fileID: '',
                sha1: '',
                name: '',
                size: 0,
            },

            // 资源名称
            resourceName: '',

            // 封面图链接
            // coverURL: '',

            // 添加依赖弹出框是否显示
            visibleDepDialog: false,
            // 依赖列表
            depList: [],
            // 依赖 mock 列表
            depMockList: [],

            // 资源描述
            description: '',

            // meta 信息
            metaInfo: '{}',
            // 是否显示 meta 输入框
            visibleMetaInput: false,
            // meta 错误信息提示
            metaValidError: '',
        };
    },
    mounted() {
        // console.log(this.$route, 'this.$routethis.$routethis.$route');
        this.initDataByMockResourceId();
    },

    methods: {
        /**
         * 当为更新 mock 资源时，初始化数据
         * @return {Promise<void>}
         */
        async initDataByMockResourceId() {
            const {mockResourceId} = this.$route.params;
            if (!mockResourceId) {
                return;
            }
            const res = await this.$axios.get(`/v1/resources/mocks/${mockResourceId}`);
            // console.log(res.data.data, 'res.data.datares.data.data');
            const result = res.data.data;
            this.bucketName = result.bucketName;
            this.resourceType = result.resourceType;
            this.uploadFileInfo = {
                fileID: '',
                sha1: '',
                name: result.systemMeta.filename,
                size: result.systemMeta.fileSize,
            };
            this.resourceName = result.name;
            // this.coverURL = result.previewImages[0] || '';
            const depList = result.systemMeta.dependencyInfo.releases.map(i => ({
                id: i.releaseId,
                name: i.releaseName,
                version: i.versionRange,
            }));
            this.depMockList = result.systemMeta.dependencyInfo.mocks.map(i => ({
                id: i.mockResourceId,
                name: i.mockResourceName,
            }));
            this.description = result.description;
            this.metaInfo = JSON.stringify(result.meta);

            const res2 = await this.$axios.get('/v1/releases/list', {
                params: {
                    releaseIds: depList.map(i => i.id).join(','),
                }
            });
            // console.log(res2, 'res2res2res2res2');
            this.depList = res2.data.data.map(i => {
                const version = depList.find(j => j.id === i.releaseId).version;
                return {
                    id: i.releaseId,
                    name: i.releaseName,
                    // version: i.latestVersion.version,
                    version,
                    versions: i.resourceVersions.map(k => k.version),
                    isOnline: i.status === 1,
                };
            });
        },

        /**
         * 资源类型改变时
         */
        onChangeResourceType() {
            this.resourceTypeTip = false;
        },

        /**
         * 上传文件信息发生变化
         */
        onFileInfoChange(fileInfo) {
            // console.log(fileInfo, 'fileInfofileInfo');
            this.uploadFileInfo = {...fileInfo};
            if (!this.resourceName) {
                if (fileInfo.name.includes('.')) {
                    const arr = fileInfo.name.split('.');
                    arr.pop();
                    this.resourceName = arr.join('.');
                } else {
                    this.resourceName = fileInfo.name;
                }
            }
        },
        /**
         * 当上传时，没有选择文件类型时
         * @param e
         */
        onUploadNoType(e) {
            this.resourceTypeTip = false;

            setTimeout(() => this.resourceTypeTip = true, 30);
        },
        /**
         * 封面上传成功后
         * @param imageUrl
         */
        // coverUploaded(imageUrl) {
        //     this.coverURL = imageUrl;
        // },

        /**
         * 显示依赖弹出框
         */
        showDepDialog() {
            this.visibleDepDialog = true;
        },
        /**
         * 添加依赖
         */
        // addDep(dep) {
        //     // console.log(dep, 'debpdebpdebpdebpdebpdebp');
        //     //
        //     if (this.depList.some(i => dep.releaseId === i.id)) {
        //         return this.$message.error('不能重复添加依赖资源');
        //     }
        //
        //     this.visibleDepDialog = false;
        //     this.depList.push({
        //         id: dep.releaseId,
        //         name: dep.releaseName,
        //         // 有版本号为正式资源，否则为 mock 资源
        //         version: dep.latestVersion ? dep.latestVersion.version : undefined,
        //     });
        // },
        /**
         * 依赖列表变化时
         */
        onChangeDeps(deps) {
            this.depList = deps;
        },
        /**
         * 依赖 mock 列表变化时
         */
        onChangeMock(mocks) {
            // console.log(mocks, 'mock');
            this.depMockList = mocks;
        },

        /**
         * 描述的 富文本框 上传图片成功
         */
        // descriptionImgUploadSuccess(detail) {
        //     console.log(detail, 'detaildetaildetail');
        //     const data = detail.data;
        //     const editor = this.$refs.editor;
        //     if (data.errcode === 0) {
        //         editor.insertImg(data.data);
        //     } else {
        //         this.$message.error(data.msg);
        //     }
        // },

        /**
         * 显示 meta 输入框
         */
        showMetaInput() {
            this.visibleMetaInput = true;
        },
        /**
         * 检查 meta 是否合法
         */
        checkMetaValid(valid) {
            // console.log(valid, 'validvalidvalid');
            this.metaValidError = valid;
        },

        /**
         * 提交数据
         */
        async submit() {
            if (!this.resourceType) {
                return this.$message.error(this.$t('pleaseSelectAResourceType'));
            }

            if (this.uploadFileInfo.uploading) {
                return this.$message.error(this.$t('fileUploading'));
            }

            if (!this.uploadFileInfo.name) {
                return this.$message.error(this.$t('pleaseUploadFiles'));
            }

            this.resourceName = this.resourceName.trim();
            if (!this.resourceName) {
                return this.$message.error(this.$t('pleaseEnterAResourceName'));
            }
            //不能包含空格和以下字符：\ / : * ? " < > |
            // if (!/^(?!.*(\\|\/|:|\*|\?|"|<|>|\||\s)).{1,60}$/.test(this.resourceName)) {
            if (!COMMON_NAME_REGEXP.test(this.resourceName)) {
                return this.$message.error(`${this.$t('resourceNamesCannotContain')}\\ / : * ? " < > | @ # $`);
            }

            if (this.metaValidError) {
                return this.$message.error('meta JSON' + this.$t('formattingErrors'));
            }

            const {bucketName, mockResourceId} = this.$route.params;
            // console.log(this.depList, 'this.depListthis.depListthis.depListthis.depList');
            // console.log(this.depMockList, 'this.depListthis.depListthis.depListthis.depList');
            const params = {
                bucketName,
                resourceType: this.resourceType,
                uploadFileId: this.uploadFileInfo.fileID || undefined,
                name: this.resourceName,
                // previewImages: this.coverURL ? [this.coverURL] : undefined,
                dependencyInfo: {
                    mocks: this.depMockList.map(i => ({mockResourceId: i.id})),
                    releases: this.depList.map(i => ({releaseId: i.id, versionRange: i.version}))
                },
                description: this.description,
                meta: JSON.parse(this.metaInfo),
            };

            if (bucketName) {
                const res = await this.$axios.post('/v1/resources/mocks', params);
                if (res.data.errcode !== 0) {
                    return this.$message.error(res.data.msg);
                }
                this.$message.success(this.$t('createdSuccessfully'));
                return this.$router.replace(`/mock/update/${res.data.data.mockResourceId}`);
            }

            if (mockResourceId) {
                const res = await this.$axios.put(`/v1/resources/mocks/${mockResourceId}`, params);
                if (res.data.errcode !== 0) {
                    return this.$message.error(this.$t('saveFailed'));
                }
                this.$message.success(this.$t('saveSuccess'));
            }

        },
        /**
         * 返回 mock 首页
         */
        goBack() {
            this.$router.back();
        },
    },
    // filters: {
    //     pageBuildFilter: function (value) {
    //         if (!value) return '';
    //         if (value === 'page_build') {
    //             return 'theme';
    //         }
    //         return value;
    //     }
    // }

}
