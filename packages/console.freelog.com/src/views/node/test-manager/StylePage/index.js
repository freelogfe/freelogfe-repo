import AddAndReplace from '../AddAndReplace/index.vue';

let searchInputDelay = null;

export default {
    name: "index",
    components: {
        AddAndReplace,
    },
    data() {
        return {
            tableData: [],
            // 筛选搜索框
            filterSearch: '',
            // 已选类型
            selectedType: '全部类型',
            // 状态可以选项
            allState: ['全部状态', '已上线', '未上线', '异常'],
            // 已选状态
            selectedState: '全部状态',
            // 当前页码
            currentPage: 1,
            // 当前页面条数
            pageSize: 10,
            // 表格总数量
            totalQuantity: 0,
        };
    },
    mounted() {
        // console.log(this.$route.params.nodeId, 'this.$router');
        // const {nodeId} = this.$route.params;
        // const nodeId = this.$router
        // this.$axios(`/v1/testNodes/${nodeId}/testResources`);
        this.handleTableData(true);
    },
    methods: {
        async matchTestResources() {
            const {nodeId} = this.$route.params;
            await this.$axios.post(`/v1/testNodes/${nodeId}/matchTestResources`)
        },
        async handleTableData(init = false) {
            if (init) {
                await this.matchTestResources();
            }

            const {nodeId} = this.$route.params;
            const params = {
                pageIndex: this.currentPage,
                pageSize: this.pageSize,
                resourceType: 'page_build',
                isOnline: this.stateTextToValue(this.selectedState),
                keywords: this.filterSearch || undefined,
            };
            const res = await this.$axios(`/v1/testNodes/${nodeId}/testResources`, {
                params,
            });
            if (res.data.errcode !== 0 || res.data.ret !== 0) {
                return this.$message.error(res.data.msg);
            }
            const data = res.data.data;
            // console.log(data, 'datadatadatadatadata');
            this.tableData = data.dataList;
            this.totalQuantity = data.totalItem;
            // console.log(data.dataList, 'ddddddddddddDDDDDD');
        },
        /**
         * 追加新加规则成功
         */
        pushRuleSuccess() {
            this.handleTableData();
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
         * 节点状态发生变化
         */
        onChangeState(value) {
            this.selectedState = value;
        },
        getIconClass(operation) {
            switch (operation) {
                case 'add':
                    return 'el-icon-plus';
                case 'replace':
                    return 'el-icon-refresh';
                case 'offline':
                    return 'el-icon-sort-down';
                case 'online':
                    return 'el-icon-sort-up';
                case 'set':
                    return 'el-icon-tickets';
                default:
                    return '';
            }
        },
        /**
         * 文字转换为对应数字
         */
        stateTextToValue(text) {
            //this.$t('allState'), this.$t('online'), this.$t('noOnline'), this.$t('contractException')
            //'全部状态', '已上线', '未上线', '合约异常'
            switch (text) {
                case '全部状态':
                    return 2;
                case '已上线':
                    return 1;
                case '未上线':
                    return 0;
                default:
                    return 2;
            }
        },
        /**
         * 上下线
         * @param row
         */
        async onLineAndOffLine(row) {
            const {nodeId} = this.$route.params;
            const res = await this.$axios.get(`/v1/testNodes/${nodeId}`);
            const testResourceName = row.testResourceName;
            const isOnline = row.differenceInfo.onlineStatusInfo.isOnline === 1;
            const ruleText = res.data.data ? res.data.data.ruleText : '';
            if (isOnline) {
                // 需要下线
                if (ruleText.includes(`^ ${testResourceName}`)) {
                    const testRuleText = ruleText.replace(`^ ${testResourceName}`, `- ${testResourceName}`);
                    const response = await this.$axios.post(`/v1/testNodes`, {
                        nodeId,
                        testRuleText: Buffer.from(testRuleText).toString('base64'),
                    });
                } else {
                    const testRuleText = `- ${testResourceName}`;
                    const params = {
                        testRuleText: Buffer.from(testRuleText).toString('base64'),
                    };
                    const response = await this.$axios.put(`/v1/testNodes/${nodeId}/additionalTestRule`, params);
                }
                this.$message.success('下线成功');
            } else {
                // 需要上线
                if (ruleText.includes(`- ${testResourceName}`)) {
                    const testRuleText = ruleText.replace(`- ${testResourceName}`, `^ ${testResourceName}`);
                    const response = await this.$axios.post(`/v1/testNodes`, {
                        nodeId,
                        testRuleText: Buffer.from(testRuleText).toString('base64'),
                    });
                } else {
                    const testRuleText = `^ ${testResourceName}`;
                    const params = {
                        testRuleText: Buffer.from(testRuleText).toString('base64'),
                    };
                    const response = await this.$axios.put(`/v1/testNodes/${nodeId}/additionalTestRule`, params);
                }
                this.$message.success('上线成功');
            }
            this.handleTableData();
        }
    },
    watch: {
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
    }
}