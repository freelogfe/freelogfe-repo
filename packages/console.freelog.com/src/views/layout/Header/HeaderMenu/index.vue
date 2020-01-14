<template>
    <div class="header-menu">
        <a
            class="header-menu__nav"
            :class="{'header-menu__nav--active': ['/', '/main/node-examples'].includes($route.path)}"
        >
            <span>发现</span>
            <div class="header-menu__dropdown">
                <div class="header-menu__menu">
                    <router-link
                        to="/"
                        class="header-menu__menu__item"
                        :class="{'header-menu__menu__item--active': $route.path === '/'}"
                    >发行市场
                    </router-link>
                    <router-link
                        to="/main/node-examples"
                        class="header-menu__menu__item"
                        :class="{'header-menu__menu__item--active': $route.path === '/main/node-examples'}"
                    >示例节点
                    </router-link>
                </div>
            </div>
        </a>
        <a
            class="header-menu__nav"
            :class="{'header-menu__nav--active': ['/mock/display'].includes($route.path)}"
        >
            <span>储存空间</span>
            <div class="header-menu__dropdown" style="width: 240px;">
                <template v-if="buckets && buckets.length > 0">
                    <div class="header-menu__menu">
                        <!--                    v-for="(bucket, index) in (bucketsList || [])"-->
                        <a
                            v-for="(bucket, index) in (buckets || [])"
                            class="header-menu__menu__item"
                            :class="{'header-menu__menu__item--active': $route.path === '/mock/display' && $route.query.activatedBucketName === bucket.bucketName}"
                            @click="gotoMock(bucket)"
                        >{{bucket.bucketName}}
                        </a>
                    </div>
                    <a
                        @click="createBucketDialogVisible=true"
                        class="header-menu__footer"
                    >
                        <i style="font-size: 14px;" class="freelog fl-icon-add"/>
                    </a>
                </template>
                <div v-else style="height: 180px; display: flex; align-items: center;">
                    <div
                        style="display: flex; width: 100%; height: 80px; flex-direction: column; align-items: center; justify-content: center;">
                        <div style="color: #ddd; line-height: 20px; font-size: 14px;">自由创作从Freelog开始</div>
                        <div style="height: 30px;"/>
                        <a @click="createBucketDialogVisible=true" class="round-button">创建Bucket</a>
                    </div>
                </div>
            </div>
        </a>
        <a
            class="header-menu__nav"
            :class="{'header-menu__nav--active': $route.path.startsWith('/release-management/')}"
        >
            <span>发行管理</span>
            <div class="header-menu__dropdown">
                <div class="header-menu__menu">
                    <router-link
                        to="/release-management/resource/list"
                        class="header-menu__menu__item"
                        :class="{'header-menu__menu__item--active': $route.path === '/release-management/resource/list'}"
                    >我的资源
                    </router-link>
                    <router-link
                        to="/release-management/release/list"
                        class="header-menu__menu__item"
                        :class="{'header-menu__menu__item--active': $route.path === '/release-management/release/list'}"
                    >我的发行
                    </router-link>
                    <router-link
                        to="/release-management/release/collections"
                        class="header-menu__menu__item"
                        :class="{'header-menu__menu__item--active': $route.path === '/release-management/release/collections'}"
                    >我的收藏
                    </router-link>
                </div>

            </div>
        </a>
        <a
            class="header-menu__nav"
            :class="{'header-menu__nav--active': $route.path.startsWith('/node/manager/') || $route.path.startsWith('/node/test-manager/')}"
        >
            <span>节点管理</span>
            <div class="header-menu__dropdown" style="width: 280px;">
                <template v-if="nodes && nodes.length > 0">
                    <div class="header-menu__menu">
                        <router-link
                            v-for="node in (nodes || [])"
                            class="header-menu__menu__item"
                            :class="{'header-menu__menu__item--active': $route.path === `/node/manager/${node.nodeId}` || $route.path === `/node/test-manager/${node.nodeId}`}"
                            :to="`/node/manager/${node.nodeId}`"
                        >
                            <span>{{node.nodeName}}</span>
                            <router-link
                                :to="`/node/test-manager/${node.nodeId}`"
                            >进入测试节点
                            </router-link>
                        </router-link>
                    </div>
                    <router-link
                        to="/node/create"
                        class="header-menu__footer"
                    >
                        <i style="font-size: 14px;" class="freelog fl-icon-add"/>
                    </router-link>
                </template>
                <div v-else style="height: 180px; display: flex; align-items: center;">
                    <div
                        style="display: flex; width: 100%; height: 80px; flex-direction: column; align-items: center; justify-content: center;">
                        <div style="color: #ddd; line-height: 20px; font-size: 14px;">自由创作从Freelog开始</div>
                        <div style="height: 30px;"/>
                        <router-link
                            to="/node/create"
                            class="round-button"
                        >创建节点
                        </router-link>
                    </div>
                </div>
            </div>
        </a>

        <CreateBucketDialog
            :visible="createBucketDialogVisible"
            @cancel="createBucketDialogVisible=false"
            @success="createBucketSuccess"
        />

    </div>

</template>

<script>
    import CreateBucketDialog from '@/components/CreateBucketDialog/index.vue';
    import {mapGetters} from "vuex";

    export default {
        name: "index",
        components: {
            CreateBucketDialog,
        },
        data() {
            return {
                // bucketsList: null,
                // nodesList: null,

                createBucketDialogVisible: false,
            };
        },
        mounted() {
            // console.log(this.$route, '$$$$$$$$');
            this.initBucket();
            this.initNode();
            // setTimeout(() => {
            // console.log(this.nodes, 'nodesList');
            // console.log(this.nodesList, 'nodesList');
            // }, 2000);
        },
        computed: {
            ...mapGetters({
                nodes: 'nodes',
                buckets: 'buckets',
            }),
        },
        methods: {
            async initBucket() {
                this.$store.dispatch('loadBuckets');
                // const {data} = await this.$axios.get('/v1/resources/mocks/buckets');
                // console.log(data, 'datadatadatadatadatadatadatadatadatadatadatadatadatadatadatadata');
                // this.bucketsList = data.data;
                // console.log(this.bucketsList, 'this.bucketsList');
            },
            async initNode() {
                // const {data} = await this.$axios.get('/v1//nodes?pageSize=100');
                // this.nodesList = data.data.dataList;
                // console.log(this.nodesList, 'data');
                this.$store.dispatch('loadNodes');
            },
            async createBucketSuccess(bucket) {
                // console.log('#######');
                this.createBucketDialogVisible = false;
                this.$message.success('创建成功');
                await this.$store.dispatch('loadBuckets');
                this.gotoMock(bucket);
                // window.location.reload();
            },
            gotoMock(bucket) {
                this.$router.push({
                    path: '/mock/display',
                    query: {
                        activatedBucketName: bucket.bucketName,
                    }
                });
            }
        },
    }
</script>

<style scoped lang="less">

    .header-menu {
        display: inline-block;
        cursor: pointer;

        .header-menu__nav {
            display: inline-block;
            line-height: 60px;
            padding: 0 15px;
            color: #999;
            font-size: 14px;
            cursor: pointer;
            position: relative;

            &:hover {
                & > span {
                    color: #ddd;
                    font-weight: 600;
                }

                .header-menu__dropdown {
                    display: inline-block;
                }
            }

            &.header-menu__nav--active {
                & > span {
                    color: #fff;
                    font-weight: 600;
                }
            }
        }

        .header-menu__dropdown {
            position: absolute;
            display: none;
            top: 100%;
            left: 5px;
            font-size: 14px;
            color: #999;
            background-color: #333;
            width: 180px;
            box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.2);
            cursor: auto;

            .header-menu__menu {
                padding: 10px 0;

                .header-menu__menu__item {
                    /*display: block;*/
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 20px;
                    box-sizing: border-box;
                    line-height: 40px;
                    color: #999;

                    & > a {
                        background-color: #444;
                        color: #999;
                        font-size: 12px;
                        line-height: 20px;
                        padding: 0 10px;
                        font-weight: 600;
                        border-radius: 10px;
                    }

                    &:hover {
                        background-color: #444;
                        color: #ddd;
                        font-weight: 600;

                        & > a {
                            background-color: #555;
                            color: #ddd;

                            &:hover {
                                background-color: #61afff;
                                color: #fff;
                            }
                        }
                    }

                    &.header-menu__menu__item--active {
                        color: #fff;
                        font-weight: 600;

                        & > a {
                            background-color: #555;
                            color: #fff;
                        }
                    }
                }
            }


            .header-menu__footer {
                line-height: 40px;
                border-top: 1px solid #444;
                text-align: center;
                display: block;
                font-size: 14px;
                color: #999;
                /*font-weight: 600;*/

                &:hover {
                    background-color: #444;
                    color: #ddd;
                }
            }

        }

        .round-button {
            width: 100px;
            text-align: center;
            line-height: 30px;
            color: #fff;
            background-color: #409eff;
            display: inline-block;
            border-radius: 15px;
            cursor: pointer;

            &:hover {
                background-color: #61afff;
            }
        }
    }
</style>
