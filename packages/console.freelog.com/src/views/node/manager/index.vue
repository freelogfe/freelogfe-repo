<template>
    <div class="node-manager">

        <!--         :style="styleObject"-->
        <div class="node-manager__aside">
            <NodeHeader
                :nodeName="nodeInfo.name"
                :nodeHref="nodeInfo.origin"
                :isTestNode="false"
                :enterNode="`/node/test-manager/${$route.params.nodeId}`"
                :btnText="$t('gotoTest')"
            />

            <div class="node-manager__aside__navs">
                <a
                    @click="switchIsPageStyle(false)"
                    :class="{'node-manager__aside__navs__a--active': !isPageStyle}"
                >{{$t('presentableManagement')}}</a>
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
                <!--                <el-radio-group-->
                <!--                    v-model="filterTodo">-->
                <!--                    <el-radio-button label="全部">-->
                <!--                        <span class="node-manager__main__header__text">{{$t('all')}}</span>-->
                <!--                    </el-radio-button>-->
                <!--                    <el-radio-button label="待处理">-->
                <!--                        <span class="node-manager__main__header__text">{{$t('pending')}}</span>-->
                <!--                    </el-radio-button>-->
                <!--                </el-radio-group>-->
                <div></div>
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

            <template
                v-if="tableData && tableData.length === 0"
            >
                <div style="height: 40px;"/>
                <div style="display: flex; justify-content: flex-end; align-items: center;">

                </div>

                <div
                    style="display: flex; height: 400px; justify-content: center; align-items: center; color: #999; font-size: 22px;">
                    <div>
                        <span>{{!isPageStyle ? $t('notAdded'): $t('notSetTheme')}}</span>
                        <router-link
                            :to="!isPageStyle ? '/' : '/?q=page_build'"
                            class="nav-link ls-nav-link"
                            target="_blank"
                        >
                            <el-button type="primary" style="border-radius: 2px; background-color: #409EFF;">
                                {{!isPageStyle ? $t('toMarket'): $t('addTheme')}}
                            </el-button>
                        </router-link>
                    </div>
                </div>
            </template>

            <template v-else>
                <div style="height: 80px;"/>
                <el-table
                    :empty-text="tableData === null ? `${$t('loading')}...` : ''"
                    :data="tableData"
                    class="node-manager__main__table"
                >
                    <!--                :label="$t('table.presentableName')"-->
                    <el-table-column
                        prop="presentableName"
                        min-width="18%"
                    >
                        <div style="padding-left: 16px;" slot="header" slot-scope="scope">
                            展品 | 展示版本
                        </div>
                        <div style="padding-left: 16px;" slot-scope="scope">
                            <a @click="handleOperation('edit', scope.row)"
                               class="text-overflow-ellipsis node-manager__main__table__name"
                            >{{scope.row.presentableName}}</a>
                            <el-select
                                placeholder="请选择"
                                :value="scope.row.releaseInfo.version"
                                style="width: 110px; transform: scale(.714); transform-origin: 0;"
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
                        </div>
                    </el-table-column>
                    <!--                label="$t('table.publish')"-->
                    <el-table-column
                        prop="publish"
                        label="相关发行"
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
                                        alt=""
                                    />
                                </div>
                                <div class="node-manager__main__table__release__content">
                                    <div
                                        class="text-overflow-ellipsis node-manager__main__table__release__content__name">
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
                                    {{selectedType}} <i v-if="!isPageStyle" class="el-icon-caret-bottom"/>
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
                                {{scope.row.releaseInfo.resourceType | pageBuildFilter}}
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
                                <i class="el-icon-plus"/>
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
                                    {{selectedState}} <i class="el-icon-caret-bottom"/>
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
                                    <!--                                :content="$t('exceptionExists')"-->
                                    <el-popover
                                        placement="top"
                                        width="160"
                                        trigger="hover"
                                    >
                                        <div
                                            style="display: flex; align-items: center; justify-content: space-between;">
                                            <span>{{$t('exceptionExists')}}</span>
                                            <el-button
                                                @click="handleOperation('edit', scope.row)"
                                                type="text"
                                            >详情
                                            </el-button>
                                        </div>
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
                                        <a
                                            class="node-manager__main__table__operation__dropdown-link"
                                        >{{$t('action.edit')}}</a>
                                    </el-dropdown-item>
                                    <el-dropdown-item
                                        :command="scope.row.releaseInfo.resourceType !== 'page_build' || scope.row.isOnline === 0 ? 'online': ''"
                                    >
                                        <!--                                     @click="onLineAndOffLine(scope.row)"-->
                                        <a
                                            style="display: block; width: 100%; height: 100%;"
                                        >
                                        <span
                                            v-if="scope.row.releaseInfo.resourceType === 'page_build'"
                                            style="color: #44a0ff;"
                                        >
                                            <div v-if="scope.row.isOnline === 0">激活</div>
                                            <div v-if="scope.row.isOnline === 1" style="color: #bfbfbf;">已激活</div>
                                        </span>
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
            </template>
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

        .node-manager__main__table {
            .el-input--mini {
                font-size: 16px;
            }
        }
    }

</style>
