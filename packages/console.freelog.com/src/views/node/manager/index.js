import clipboard from '@/components/clipboard/index.vue';
import PolicyTabs from '@/components/PolicyTabs/index.vue';
import i18n from './i18n';
import NodeHeader from '../components/NodeHeader.vue';

let searchInputDelay = null;

export default {
    name: 'manager',
    i18n,
    components: {
        clipboard,
        PolicyTabs,
        NodeHeader,
    },
    data() {
        return {
            // 根 div 样式对象
            styleObject: {
                // height: '100%',
                minHeight: (window.innerHeight - 60) + 'px',
            },
            nodeInfo: {
                origin: '',
                name: '',
            },
            // 是否是页面样式
            isPageStyle: this.$route.query.isPageStyle && this.$route.query.isPageStyle === 'true',
            // isPageStyle: true,
            // 筛选『全部』和『待处理』
            filterTodo: '全部',
            // 筛选搜索框
            filterSearch: '',
            // 表格数据
            tableData: null,
            // 类型可选项
            allTypes: [this.$t('allType'), 'json', 'widget', 'image', 'audio', 'markdown', 'reveal_slide', 'license', 'video', 'catalog'],
            // 已选类型
            selectedType: this.$t('allType'),
            // 状态可以选项
            allState: [this.$t('allState'), this.$t('online'), this.$t('noOnline'), this.$t('contractException')],
            // 已选状态
            selectedState: this.$t('allState'),

            // 当前页码
            currentPage: 1,
            // 当前页面条数
            pageSize: 10,
            // 表格总数量
            totalQuantity: 0,
        }
    },
    mounted() {
        this.handleTableData();
        this.handleNodeInfo();
        this.listenWindowVisibility();
    },

    methods: {
        /**
         * 监听窗口激活事件
         */
        listenWindowVisibility() {
            // 不同浏览器 hidden 名称
            const hiddenProperty = 'hidden' in document ? 'hidden' :
                'webkitHidden' in document ? 'webkitHidden' :
                    'mozHidden' in document ? 'mozHidden' :
                        null;
            // console.log(hiddenProperty, 'hiddenPropertyhiddenProperty');
            // 不同浏览器的事件名
            const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
            const onVisibilityChange = () => {
                // console.log('111111');
                if (document[hiddenProperty]) {
                    // 窗口隐藏
                    // console.log(Date(), 'hidden');
                } else {
                    // 窗口可见
                    // console.log(Date(), 'visible');
                    this.handleTableData();
                }
            };
            document.addEventListener(visibilityChangeEvent, onVisibilityChange);
        },

        /**
         * 切换样式页
         * @param bool
         */
        switchIsPageStyle(bool) {
            if (this.isPageStyle === bool) {
                return;
            }
            this.isPageStyle = bool;
            // console.log(this.$router, '!@#$@#!$');
            // console.log(this.$route, '!@#$@#!$');
            this.$router.replace(this.$route.path + '?isPageStyle=' + bool);
        },
        /**
         * 处理节点信息
         */
        async handleNodeInfo() {
            const res = await this.$axios.get(`/v1/nodes/${this.$route.params.nodeId}`);
            // console.log(res, 'nodeInfonodeInfo');
            const origin = [
                res.data.data.nodeDomain,
                ...window.location.origin.split('.').filter((i, j, k) => j >= k.length - 2)
            ].join('.');
            // console.log(origin, 'originoriginorigin');
            this.nodeInfo = {
                origin,
                name: res.data.data.nodeName,
            };
        },
        /**
         * 处理表格数据
         */
        async handleTableData() {
            // console.log(this.selectedState, this.stateTextToValue(this.selectedState), 'selectedState');
            const params = {
                nodeId: this.$route.params.nodeId,
                page: this.currentPage,
                pageSize: this.pageSize,
                resourceType: this.isPageStyle ? 'page_build' : (this.selectedType === this.$t('allType') ? undefined : this.selectedType),
                isOnline: this.stateTextToValue(this.selectedState),
                keywords: this.filterSearch || undefined,
                omitResourceType: this.isPageStyle ? undefined : 'page_build',
            };

            const res = await this.$axios.get(`/v1/presentables`, {
                params,
            });

            this.totalQuantity = res.data.data.totalItem;
            // console.log(res.data.data.dataList, 'resresres');
            this.tableData = res.data.data.dataList.map(i => ({
                presentableId: i.presentableId,
                presentableName: i.presentableName,
                releaseInfo: i.releaseInfo,
                policies: i.policies,
                updateDate: i.updateDate,
                createDate: i.createDate,
                isOnline: i.isOnline,
                isAuth: true,
            }));

            const params1 = {
                presentableIds: this.tableData.map(i => (i.presentableId)).join(','),
            };
            const res1 = await this.$axios.get('/v1/auths/presentables/batchNodeAndReleaseSideAuth', {
                params: params1,
            });

            // const authResult = res1.data.data.authResult.isAuth;

            // console.log(res1, 'res1res1res1');

            for (let i = 0; i < this.tableData.length; i++) {
                this.tableData[i].isAuth = res1.data.data[i].authResult.isAuth;
            }
        },
        /**
         * 修改使用版本
         * @param value
         * @param row
         * @returns {Promise<ElMessageComponent>}
         */
        async onVersionChange(value, row) {
            // console.log(value, row, '1234233');
            const presentableId = row.presentableId;
            const {data: {errcode}} = await this.$services.PresentablesService.put(`${presentableId}/switchPresentableVersion`, {version: value});
            if (errcode !== 0) {
                return this.$message.error('更新版本失败！')
            }
            this.$message.success('更新版本成功！');
            row.releaseInfo.version = value;
        },

        /**
         * 格式化策略
         * @param str
         */
        spaceReplaceNbsp(str) {
            return str.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
        },
        /**
         * 将 Date 字符串转换为标准格式
         */
        dateStringToFormat(dataStr) {
            // console.log(dataStr, 'dataStrdataStrdataStr');
            const data = new Date(dataStr);
            // console.log(data.getFullYear(), data.getMonth(), data.getDate(), '@!%@#$!@#$@#$');
            return [data.getFullYear(), data.getMonth() + 1, data.getDate()].join('.');
        },
        /**
         * 文字转换为对应数字
         */
        stateTextToValue(text) {
            //this.$t('allState'), this.$t('online'), this.$t('noOnline'), this.$t('contractException')
            //'全部状态', '已上线', '未上线', '合约异常'
            switch (text) {
                case this.$t('allState'):
                    return 2;
                case this.$t('online'):
                    return 1;
                case this.$t('noOnline'):
                    return 0;
                default:
                    return 2;
            }
        },

        /**
         * 节点类型发生变化
         */
        onChangeType(value) {
            // console.log(value, 'valuevaluevaluevaluevalue');
            this.selectedType = value;
        },

        /**
         * 节点状态发生变化
         */
        onChangeState(value) {
            this.selectedState = value;
        },

        /**
         * 当前page发生变化时
         * @param currentPage
         */
        onChangeCurrentPage(currentPage) {
            this.currentPage = currentPage;
        },
        /**
         * 页面条数发生变化时
         * @param pageSize
         */
        onChangePageSize(pageSize) {
            this.pageSize = pageSize;
        },
        /**
         * 新打开页面 去编辑页
         * @param presentableId
         */
        goToEditPage(presentableId) {
            // this.$router.push(`/node/manager-release/${presentableId}`);
            window.open(`/node/manager-release/${presentableId}`);
        },
        /**
         * 跳转到添加策略页面
         * @param presentableId
         */
        goToAddPolicyPage(presentableId) {
            // this.$router.push(`/node/${this.$route.params.nodeId}/presentable/${presentableId}?tab=policy`);
            // this.$router.push(`/node/manager-release/${presentableId}?addPolicy=true`);
            window.open(`/node/manager-release/${presentableId}?addPolicy=true`);
        },
        /**
         * 上线和下线
         */
        async onLineAndOffLine(item) {
            // console.log(item, 'IYOIUHJLKJN');
            if (item.isOnline === 0) {
                if (!item.policies || item.policies.length === 0) {
                    return this.$message.error(this.$t('cannotOnline.noPolicy'));
                }
                if (!item.isAuth) {
                    return this.$message.error(this.$t('cannotOnline.exceptions'));
                }
            }
            const res = await this.$axios.put(`/v1/presentables/${item.presentableId}/switchOnlineState`, {
                onlineState: item.isOnline === 0 ? 1 : 0,
            });

            if (res.data.errcode !== 0) {
                return this.$message.error(res.data.msg);
            }
            item.isOnline === 0 ? this.$message.success(item.releaseInfo.resourceType === 'page_build' ? '激活成功' : '上线成功') : this.$message.success('下线成功');
            // item.isOnline = item.isOnline === 0 ? 1 : 0;
            this.handleTableData();
        },
        // upgradePresentable(presentable) {
        //     const {presentableId, releaseInfo: {version, releaseId}} = presentable
        //     this.$services.ReleaseService.get(releaseId)
        //         .then(res => res.data)
        //         .then(res => {
        //             var _version = version
        //             if (res.errcode === 0) {
        //                 const {latestVersion} = res.data
        //                 _version = latestVersion.version
        //             }
        //             return _version
        //         })
        //         .then(_v => {
        //             return this.$services.PresentablesService.put(`${presentableId}/switchPresentableVersion`, {version: _v})
        //         })
        //         .then(res => res.data)
        //         .then(res => {
        //             if (res.errcode === 0) {
        //                 this.$message({type: 'success', message: '升级成功！'})
        //             } else {
        //                 this.$message({type: 'error', message: '升级失败！'})
        //             }
        //         })
        //         .catch(this.$error.showErrorMessage)
        // },
        /**
         * 处理操作
         * @param e
         * @param row
         */
        handleOperation(e, row) {
            if (e === 'edit') {
                this.goToEditPage(row.presentableId);
            }
            // else if (e === 'upgrade') {
            //     this.upgradePresentable(row);
            // }
            else if (e === 'online') {
                this.onLineAndOffLine(row);
            }
        }
        /**
         * 去来源编辑页
         */
        // goToOrigin(originInfo) {
        //     // console.log(originInfo, 'originInfooriginInfo');
        //     let url = '';
        //     if (originInfo.type === 'presentable') {
        //         url = `/node/manager-release/${originInfo.id}`;
        //     }
        //
        //     if (originInfo.type === 'mock') {
        //         url = `/mock/update/${originInfo.id}`;
        //     }
        //
        //     if (originInfo.type === 'release') {
        //         url = `/release/detail/${originInfo.id}?version=${originInfo.version}`;
        //     }
        //
        //     window.open(url);
        // },
    },

    watch: {
        isPageStyle() {
            this.filterSearch = '';
            this.selectedType = this.$t('allType');
            this.selectedState = this.$t('allState');
            this.currentPage = 1;
            this.pageSize = 10;
            this.handleTableData();
        },
        selectedType() {
            this.currentPage = 1;
            this.pageSize = 10;
            this.handleTableData();
        },
        selectedState() {
            this.currentPage = 1;
            this.pageSize = 10;
            this.handleTableData();
        },
        filterSearch() {
            if (searchInputDelay) {
                clearTimeout(searchInputDelay);
            }
            searchInputDelay = setTimeout(() => {
                this.currentPage = 1;
                this.pageSize = 10;
                this.handleTableData();
            }, 300);

        },
        pageSize() {
            this.currentPage = 1;
            this.handleTableData();
        },
        currentPage() {
            this.handleTableData();
        },
    },
}
