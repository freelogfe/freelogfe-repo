import CryptoJS from 'crypto-js';
import path from 'path';

export default {
    name: 'UploadFile',
    i18n: { // `i18n` 选项，为组件设置语言环境信息
        messages: {
            en: {
                uploadResource: 'Upload Resource',
                noMoreThan50m: 'Resources maximum of no more than 50m',
                uploadSuccess: 'Success',
                sureDelete: 'Sure delete a resource file ?',
                cancel: 'Cancel',
                confirm: 'Confirm',
                reselect: 'Reselect',
                resourceDuplicated: 'The resource already exists, cannot be duplicated to create'
            },
            'zh-CN': {
                uploadResource: '上传资源',
                noMoreThan50m: '资源最大不超过50M',
                uploadSuccess: '上传成功',
                sureDelete: '确定删除资源文件？',
                cancel: '取消',
                confirm: '确定',
                reselect: '重新选择',
                resourceDuplicated: '该资源已存在，不能重复创建',
            },
        }
    },
    props: {
        // 保证资源不能与现有资源重复
        noRepeat: {
            type: Boolean,
            default: false,
        },
        // 文件类型
        fileType: {
            type: String,
            default: '',
        },
        // 文件信息
        fileInfo: {
            type: Object,
            default: {
                fileID: '',
                sha1: '',
                name: '',
                size: 0,
                uploading: false,
            },
        },
        // fileURL: {
        //     type: String,
        //     default: '',
        // },
        // beforeOpenFile: {
        //     type: Function,
        //     default: function () {
        //         return true;
        //     }
        // },
        // 文件信息发生变化时
        onFileInfoChange: {
            type: Function,
            default: function (fileInfo) {
            }
        },
        // onFileIDChange: {
        //     type: Function,
        //     default: function (FileID) {
        //     }
        // }
    },
    // component:{
    //     ElUpload,
    // },
    data() {
        return {
            // 上传进度百分比
            percentage: null,
            // 上传错误提示文字
            errorText: '',
            // 删除文件信息的 popover 是否显示
            visiblePopover: false,
        };
    },

    computed: {
        /**
         * 上传文件的类型
         */
        accept() {
            return this.fileType === 'image' ? 'image/*' : '*';
        },
        /**
         * 要显示的文件大小
         * @return {string}
         */
        fileSize() {
            return humanizeSize(this.fileInfo.size);
        },
        /**
         * 上传文件的主机名
         * @return {string}
         */
        apiHostName() {
            const arr = window.location.hostname.split('.');
            arr.shift();
            arr.unshift('qi');
            return arr.join('.');
        },
        /**
         * 拼接后的上传路径
         * @return {string}
         */
        uploadResourceFileAction() {
            return `//${this.apiHostName}/v1/resources/temporaryFiles/uploadResourceFile`;
        },
    },

    methods: {
        /**
         * 上传文件按钮点击时
         * @param e
         */
        onClickButton(e) {
            // if (this.beforeOpenFile && (this.beforeOpenFile() === false)) {
            if (!this.fileType) {
                e.stopPropagation();
                this.$emit('error');
            }
        },
        /**
         * 文件状态改变时的钩子
         * @param file
         */
        handleChange(file) {
            // console.log(file, 'efasdfasdc asdf');
        },
        /**
         * 上传文件之前的钩子
         * @param file
         */
        async beforeUpload(file) {
            // console.log(file, '123412341234213423');
            // console.log(this.fileType === 'image', 'this.fileType');
            // console.log(!(file.type.startsWith('image')), 'file.type');
            if (this.fileType === 'image' && !(file.type.startsWith('image'))) {
                // console.log('##########');
                this.errorText = '请上传图片格式';
                throw new Error(this.errorText);
            }

            if (file.size > 52428800) {
                this.errorText = '资源最大不超过50M';
                throw new Error(this.errorText);
            }

            if (this.noRepeat) {
                const hash = await getSHA1Hash(file);
                const res = await this.$axios.get(`/v1/resources/${hash}`);
                if (res.data.data) {
                    this.errorText = this.$t('resourceDuplicated');
                    throw new Error(this.errorText);
                }
            }

            this.onFileInfoChange && this.onFileInfoChange({
                fileID: '',
                sha1: '',
                name: file.name,
                size: file.size,
                uploading: true,
            });
            this.percentage = 0;
        },
        /**
         * 文件上传时的钩子
         * @param event
         * @param file
         */
        onProgress(event, file) {
            // console.log(event.percent, '11111111111');
            this.percentage = Math.ceil(event.percent * .95);
        },
        /**
         * 文件上传成功时的钩子
         * @param response
         */
        onSuccess(response) {
            // console.log(response, 'responseresponseresponse');
            if (response.ret !== 0 || response.errcode !== 0) {
                this.deleteUploadedFile();
                return this.$message.error(response.msg);
            }
            this.percentage = 100;
            this.onFileInfoChange({
                ...this.fileInfo,
                fileID: response.data.uploadFileId,
                sha1: response.data.sha1,
                uploading: false,
            });
        },
        /**
         * 取消删除 文件信息
         */
        deleteUploadedFileCancel() {
            this.visiblePopover = false;
        },
        /**
         * 清除已删除文件信息
         */
        deleteUploadedFile() {
            this.percentage = null;
            this.visiblePopover = false;
            this.onFileInfoChange({
                fileID: '',
                sha1: '',
                name: '',
                size: 0,
                uploading: false,
            });
        },
        /**
         * 模拟点击『资源上传按钮』
         */
        onClickUpload() {
            // console.log( this.$refs.buttttttt.$el, 'this.$refs.resourceUploader');
            this.$refs.sourceUploadButton.$el.click();
            this.hideUploadErrorDialog();
        },
        /**
         * 关闭上传错误按钮
         */
        hideUploadErrorDialog() {
            this.errorText = '';
            // this.deleteUploadedFile();
        },
    }
}

/**
 * 将对应的字节数，转换为易读单位数量
 * @param number
 * @return {string}
 */
function humanizeSize(number) {
    const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

    if (!number && number !== 0) {
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

/**
 * 根据 File 获取 SHA1 Hash 字符串
 * @param file
 * @return {Promise<string>}
 */
function getSHA1Hash(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (evt) {
            var wordArray = CryptoJS.lib.WordArray.create(reader.result);
            var hash = CryptoJS.SHA1(wordArray).toString();
            resolve(hash);

            // const sha1sum = crypto.createHash('sha1');
            // sha1sum.update(chunk)
            // console.log(sha1sum.digest('hex'), 'sha1sum.digest(\'hex\')');
            // resolve(sha1sum.digest('hex'));

        };
        // reader.readAsBinaryString(file);
        reader.readAsArrayBuffer(file);
    });
}
