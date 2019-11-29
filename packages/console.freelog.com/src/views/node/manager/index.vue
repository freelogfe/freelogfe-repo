<template>
    <div class="node-manager">

        <div
            :style="styleObject"
            class="node-manager__aside"
        >
            <NodeHeader
                :nodeName="nodeInfo.name"
                :nodeHref="nodeInfo.origin"
                :isTestNode="false"
                :enterNode="`/node/test-manager/${$route.params.nodeId}`"
                btnText="进入测试节点管理"
            />
 
            <div class="node-manager__aside__navs">
                <a
                    @click="switchIsPageStyle(false)"
                    :class="{'node-manager__aside__navs__a--active': !isPageStyle}"
                >{{$t('nodeReleaseList')}}</a>
                <a
                    @click="switchIsPageStyle(true)"
                    :style="{
                        backgroundColor: isPageStyle ? '#fff':'transparent',
                        borderRight: isPageStyle ? '3px solid #409eff': 'none',
                        color: isPageStyle ? '#409eff': '#333',
                    }"
                    :class="{'node-manager__aside__navs__a--active': isPageStyle}"
                >{{$t('nodePageStyle')}}</a>
            </div>
        </div>


        <div class="node-manager__main">
            <div style="height: 40px;"></div>
            <div class="node-manager__main__header">
                <el-radio-group
                    v-model="filterTodo">
                    <el-radio-button label="全部">
                        <span class="node-manager__main__header__text">{{$t('all')}}</span>
                    </el-radio-button>
                    <el-radio-button label="待处理">
                        <span class="node-manager__main__header__text">{{$t('pending')}}</span>
                    </el-radio-button>
                </el-radio-group>

                <el-input
                    class="node-manager__main__header__input"
                    v-model="filterSearch"
                    debounce="1000"
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"/>
                    <i
                        @click="filterSearch = ''"
                        v-show="filterSearch && filterSearch.length > 0"
                        slot="suffix"
                        class="el-input__icon el-icon-circle-close"
                    />
                </el-input>
            </div>

            <div style="height: 80px;"></div>

            <el-table
                :empty-text="tableData === null ? '加载中...' : ''"
                :data="tableData"
                class="node-manager__main__table"
            >
                <el-table-column
                    prop="presentableName"
                    :label="$t('table.presentableName')"
                    min-width="18%"
                >
                    <template slot-scope="scope">
                        <div class="text-overflow-ellipsis node-manager__main__table__name">
                            {{scope.row.presentableName}}
                        </div>
                        <el-select
                            placeholder="请选择"
                            :value="scope.row.releaseInfo.version"
                            style="width: 90px;"
                            size="mini"
                            @change="$event => onVersionChange($event, scope.row)"
                        >
                            <el-option
                                v-for="i in [...scope.row.releaseInfo.versions].reverse()"
                                :key="i"
                                :label="i"
                                :value="i">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="publish"
                    :label="$t('table.publish')"
                    min-width="20%"
                >
                    <template slot-scope="scope">
                        <a
                            :href="`/release/detail/${scope.row.releaseInfo.releaseId}?version=${scope.row.releaseInfo.version}`"
                            target="_blank"
                            class="node-manager__main__table__release"
                        >
                            <div
                                class="resource-default-preview node-manager__main__table__release__preview"
                            >
                                <img
                                    style="width: 100%; height: 100%;"
                                    v-if="scope.row.releaseInfo.previewImages && scope.row.releaseInfo.previewImages.length > 0"
                                    :src="scope.row.releaseInfo.previewImages[0]"
                                    class="resource-default-preview"
                                />
                            </div>
                            <div class="node-manager__main__table__release__content">
                                <div class="text-overflow-ellipsis node-manager__main__table__release__content__name">
                                    {{scope.row.releaseInfo.releaseName}}
                                </div>
                                <div class="node-manager__main__table__release__content__version">
                                    {{scope.row.releaseInfo.versions[scope.row.releaseInfo.versions.length - 1]}}
                                </div>
                            </div>
                        </a>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="type"
                    :label="$t('table.type')"
                    min-width="12%"
                >
                    <template slot="header" slot-scope="scope">
                        <el-dropdown
                            style="height: 32px"
                        >
                            <div>
                                {{selectedType}} <i v-if="!isPageStyle" class="el-icon-caret-bottom"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown" v-if="!isPageStyle">
                                <el-dropdown-item v-for="item in allTypes">
                                    <a
                                        @click="onChangeType(item)"
                                        style="display: block; width: 100%; height: 100%;"
                                    >{{item}}</a>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                    <template slot-scope="scope">
                        <div class="node-manager__main__table__type">
                            {{scope.row.releaseInfo.resourceType}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="policies"
                    :label="$t('table.policies')"
                    min-width="14%"
                >
                    <div
                        class="table-policies node-manager__main__table__policy"
                        slot-scope="scope"
                    >
                        <el-popover
                            placement="bottom-start"
                            width="400"
                            trigger="hover"
                            :disabled="scope.row.policies.length === 0"
                        >
                            <PolicyTabs :policies="scope.row.policies"/>
                            <div
                                slot="reference"
                            >
                                <div
                                    class="node-manager__main__table__policy__box"
                                >
                                    <div
                                        v-if="scope.row.policies.length > 0"
                                        class="node-manager__main__table__policy__box--then-zero"
                                    >
                                        {{scope.row.policies[0].policyName}}
                                    </div>
                                    <div
                                        v-if="scope.row.policies.length === 0"
                                        class="node-manager__main__table__policy__box--zero"
                                    >
                                        {{$t('noPolicy')}}
                                    </div>
                                    <div
                                        v-if="scope.row.policies.length > 1"
                                        class="node-manager__main__table__policy__box--then-one"
                                    >
                                        {{$t('suchAs')}}{{scope.row.policies.length}}{{$t('policies')}}…
                                    </div>
                                </div>
                            </div>
                        </el-popover>
                        <a
                            @click="goToAddPolicyPage(scope.row.presentableId)"
                            class="node-manager__main__table__policy__add"
                        >
                            <i class="el-icon-plus"></i>
                        </a>
                    </div>
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    :label="$t('table.updateTime')"
                    min-width="18%"
                >
                    <template slot-scope="scope">
                        <div class="node-manager__main__table__date">
                            <div class="node-manager__main__table__date__update">
                                {{dateStringToFormat(scope.row.updateDate)}}
                            </div>
                            <div class="node-manager__main__table__date__create">{{$t('joined')}}
                                {{dateStringToFormat(scope.row.createDate)}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="state"
                    :label="$t('table.state')"
                    min-width="12%"
                >
                    <template slot="header" slot-scope="scope">
                        <el-dropdown
                            style="height: 32px"
                        >
                            <div>
                                {{selectedState}} <i class="el-icon-caret-bottom"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in allState">
                                    <a
                                        @click="onChangeState(item)"
                                        class="node-manager__main__table__state__button"
                                    >{{item}}</a>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>

                    <template slot-scope="scope">
                        <div class="node-manager__main__table__state__text">
                            <span
                                v-if="scope.row.isOnline === 1"
                                class="node-manager__main__table__state__text--online"
                            >
                                {{scope.row.releaseInfo.resourceType === 'page_build' ? '已激活' : $t('online')}}
                            </span>
                            <span
                                v-if="scope.row.isOnline === 0"
                                class="node-manager__main__table__state__text--no-online"
                            >
<!--                                {{$t('noOnline')}}-->
                                 {{scope.row.releaseInfo.resourceType === 'page_build' ? '未激活' : $t('noOnline')}}
                            </span>
                            <template v-if="!scope.row.isAuth">
                                <el-popover
                                    placement="top"
                                    width="100"
                                    trigger="hover"
                                    :content="$t('exceptionExists')"
                                >
                                    <i
                                        slot="reference"
                                        class="el-icon-warning"
                                    />
                                </el-popover>
                            </template>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column
                    prop="operation"
                    :label="$t('table.operation')"
                    min-width="5%"
                >

                    <template slot-scope="scope">
                        <el-dropdown @command="handleOperation($event, scope.row)">

                            <el-button
                                icon="el-icon-more"
                                type="small"
                                circle
                                class="node-manager__main__table__operation"
                            />

                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="edit">
                                    <!--                                    @click="goToEditPage(scope.row.presentableId)"-->
                                    <a
                                        class="node-manager__main__table__operation__dropdown-link"
                                    >{{$t('action.edit')}}</a>
                                </el-dropdown-item>
                                <!--                                <el-dropdown-item>-->
                                <!--                                    <a-->
                                <!--                                        class="node-manager__main__table__operation__dropdown-link"-->
                                <!--                                    >{{$t('action.top')}}</a>-->
                                <!--                                </el-dropdown-item>-->
                                <el-dropdown-item command="upgrade">
                                    <!--                                     @click="upgradePresentable(scope.row)"-->
                                    <a class="node-manager__main__table__operation__dropdown-link"

                                    >{{$t('action.upgrade')}}</a>
                                </el-dropdown-item>
                                <el-dropdown-item
                                    command="online"
                                    v-if="scope.row.releaseInfo.resourceType !== 'page_build' || scope.row.isOnline === 0"
                                >
                                    <!--                                     @click="onLineAndOffLine(scope.row)"-->
                                    <a

                                        style="display: block; width: 100%; height: 100%;"
                                    >
                                        <span
                                            v-if="scope.row.releaseInfo.resourceType === 'page_build'"
                                            style="color: #44a0ff;"
                                        >激活</span>
                                        <template v-else>
                                            <span v-if="scope.row.isOnline === 0" style="color: #44a0ff;">{{$t('action.online')}}</span>
                                            <span v-if="scope.row.isOnline === 1" style="color: #ee4040;">{{$t('action.downline')}}</span>
                                        </template>
                                    </a>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>

            <div
                class="node-manager__main__pagination"
                v-if="totalQuantity > 10"
            >
                <el-pagination
                    :current-page="currentPage"
                    :page-size="pageSize"
                    @current-change="onChangeCurrentPage"
                    @size-change="onChangePageSize"
                    :page-sizes="[10, 20, 30, 40, 50]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalQuantity"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import manager from './index.js';

    export default manager;
</script>

<style lang="less" scoped>
    @import 'index.less';
</style>

<style lang="less">
    .node-manager {

        .text-overflow-ellipsis {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }


        .el-table--border td:first-child .cell, .el-table--border th:first-child .cell, .el-table .cell, .el-table th div {
            padding-left: 0;
        }

        .cell {
            color: #666;
        }

        .table-policies {
            & > a {
                visibility: hidden;
            }

            &:hover {
                & > a {
                    visibility: visible;
                }
            }

        }
    }

</style>
