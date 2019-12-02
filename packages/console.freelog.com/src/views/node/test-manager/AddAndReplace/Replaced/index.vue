<template>
    <div style="width: 384px;">
        <div style="font-size: 14px; color: #333;">选择被替换资源</div>
        <div style="height: 5px;"></div>

        <div style="border: 1px solid #c8c8c8; border-radius: 2px; overflow: hidden;">
            <div
                style="border-radius: 2px 2px 0 0; display: flex; align-items: center; justify-content: space-between; padding: 15px 15px 10px;">
                <el-autocomplete
                    size="small"
                    v-model="filterSearch"
                    style="width: 80%;"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"/>
                    <!--                    <i-->
                    <!--                        style="cursor: pointer"-->
                    <!--                        @click="filterSearch = ''"-->
                    <!--                        v-show="filterSearch && filterSearch.length > 0"-->
                    <!--                        slot="suffix"-->
                    <!--                        class="el-input__icon el-icon-circle-close"-->
                    <!--                    ></i>-->
                </el-autocomplete>

                <Version
                    v-if="selectedExact && selectedExact.versions"
                    :versions="selectedExact.versions"
                    @change="onVersionChange"
                />

            </div>
            <div style="height: 365px;">
                <el-tree
                    :props="{isLeaf: 'leaf'}"
                    :data="data2"
                    :load="loadNode1"
                    lazy
                    show-checkbox
                    @check-change="treeCheckChange"
                    node-key="id"
                    ref="tree"
                    :default-expand-all="false"
                    :default-checked-keys="[]"
                >
                </el-tree>
            </div>
        </div>
    </div>
</template>

<script>

    import Radio from '../components/Radio.vue';
    import Version from './Version';

    let timeout = null;
    export default {
        name: "index",
        components: {
            Version,
            Radio,
        },
        data() {
            return {
                // 关系依赖树
                data2: [],
                // 搜索框文字
                filterSearch: '',
                // 是否现实版本选择器
                popoverShow: false,
                // 当前被选中要操作的发行或mock对象
                selectedExact: null,
                // 当前选择的版本
                version: '*',
                // 作用域范围
                scope: [],
            };
        },
        mounted() {
            // this.searchTestResource('yanghongtian/stefan111');
        },
        methods: {
            treeCheckChange() {
                if (timeout) {
                    return;
                }
                timeout = setTimeout(() => {
                    // console.log(this.$refs.tree.getCheckedKeys(), 'getCheckedKeys');
                    timeout = null;
                }, 10);

                const scope = [];
                let tempScope = [...this.$refs.tree.getCheckedKeys()];
                while (tempScope.length > 0) {
                    const temp = tempScope.shift();
                    scope.push(temp);
                    tempScope = tempScope.filter(i => !i.startsWith(temp + '->'));
                }
                // console.log(scope, 'SSSSSSSSOOOOOOO');
                this.scope = scope;
                this.$emit('onChange', {
                    name: this.filterSearch,
                    version: this.version,
                    scope: this.scope,
                });
                // console.log(this.$refs.tree.getCheckedNodes(), 'getCheckedNodes');
            },
            /**
             * 模糊搜索 获取提示列表
             */
            querySearchAsync(queryString, cb) {
                (async () => {

                    const {nodeId} = this.$route.params;
                    const params = {
                        keywords: queryString,
                    };
                    const res = await this.$axios.get(`/v1/testNodes/${nodeId}/searchTestResourceDependencyTree`, {
                        params,
                    });
                    // if (res.errcode !== 0 || res.ret !== 0) {
                    //     return this.$message.error(res.msg);
                    // }
                    // console.log(res, 'RERRRRRRR');
                    const dataList = res.data.data;
                    // console.log(dataList, 'dataListdataList');
                    const list = dataList.map(i => (
                        {id: i.id, value: i.name, type: i.type, versions: i.versions}
                    ));
                    // console.log(list, 'listlist');
                    cb(list);
                })();
            },
            closePopover() {

            },
            onVersionChange(data) {
                // console.log(data, '123412341234231423434234');
                // this.$emit('onChange', data);
                this.version = data.custom ? data.inputVersion : data.selectedVersion;
                this.searchTestResource();
            },
            async handleSelect(item) {
                // console.log(item);
                // await this.$axios.get(`/v1/testNodes/testResources/${item.id}/dependencyTree`);
                this.selectedExact = item;
                this.searchTestResource()
            },
            /**
             * 获取 树根 列表
             * @param queryString
             * @returns {Promise<void>}
             */
            async searchTestResource(queryString) {
                const {nodeId} = this.$route.params;
                const params = {
                    dependentEntityId: this.selectedExact.id,
                    dependentEntityVersionRange: this.version,
                };
                const res = await this.$axios.get(`/v1/testNodes/${nodeId}/searchTestResource`, {
                    params,
                });
                // if (res.errcode !== 0 || res.ret !== 0) {
                //     return this.$message.error(res.msg);
                // }
                // console.log(res, 'RERRRRRRR');
                const dataList = res.data.data;
                // console.log(dataList, 'dataListdataListdataListdataListdataList');
                this.data2 = dataList.map(i => ({
                    id: i.testResourceName,
                    label: i.testResourceName,
                    testResourceId: i.testResourceId,
                    children: [],
                }));
            },
            /**
             * 加载 presentable 根节点下的数据
             * @param node
             * @param resolve
             * @returns {*}
             */
            loadNode1(node, resolve) {
                // console.log(node, 'nodenodenode');
                if (node.level === 0) {
                    return resolve([]);
                }

                if (node.level > 1) {
                    return resolve(node.data.children || []);
                }
                // console.log(this.selectedExact, 'nodenodenode');
                setTimeout(async () => {
                    const params = {
                        // testResourceId: node.data.id,
                        // testResourceId: node.data.testResourceId,
                        dependentEntityId: this.selectedExact.id,
                        dependentEntityVersionRange: this.version,
                    };
                    const res = await this.$axios.get(`/v1/testNodes/testResources/${node.data.testResourceId}/filterDependencyTree`, {
                        params,
                    });
                    const data = transformTreeArr(res.data.data, node.data.id);
                    // console.log(data, 'datadata');
                    resolve(data);
                }, 500);
            }
        }
    }

    /**
     * 将服务端 tree 数组 转换成 客户端所需数据结构
     * @param nodeSources
     * @param parentID
     * @returns {[]}
     */
    function transformTreeArr(nodeSources, parentID = '') {
        // console.log(nodeSources, 'nodeSources');
        const arr = [];
        for (const i of nodeSources) {
            const id = parentID + '->' + (i.type === 'mock' ? '#:' : '$:') + i.name;
            const children = transformTreeArr(i.dependencies, id);
            arr.push({
                id,
                label: i.name,
                children,
                leaf: children.length === 0,
            });
        }
        return arr;
    }
</script>

<style scoped>

</style>
