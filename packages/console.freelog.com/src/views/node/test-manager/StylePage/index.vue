<template>
    <div class="style-page">
        <div style="height: 40px;"></div>

        <div class="style-page__header">

            <AddAndReplace
                @success="pushRuleSuccess"
                :matchTestResult="matchTestResult"
            />

            <el-input
                class="style-page__header__input"
                v-model="filterSearch"
            >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <i
                    @click="filterSearch = ''"
                    v-show="filterSearch.length !== 0"
                    slot="suffix"
                    class="el-input__icon el-icon-circle-close"
                ></i>
            </el-input>
        </div>

        <div style="height: 70px;"></div>

        <el-table
            :data="tableData"
            :empty-text="tableData === null ? '加载中...' : ''"
            class="style-page__table"
        >
            <el-table-column
                prop="rules"
                label="规则"
                min-width="12%"
            >
                <template slot-scope="scope">
                    <el-popover
                        v-if="scope.row.textRule"
                        placement="right"
                        width="670"
                        trigger="hover"
                    >
                        <RulesBar slot="reference" :rules="scope.row.icons"/>
                        <rule-text :textRule="scope.row.textRule"/>
                    </el-popover>
                    <RulesBar v-else :rules="scope.row.icons"/>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="相关条目|展示版本"
                min-width="25%"
            >
                <template slot-scope="scope">
                    <div
                        class="text-overflow-ellipsis style-page__table__name"
                    >
                        <label
                            class="style-page__table__name__mock"
                            v-if="scope.row.originInfo.type === 'mock'"
                        >mock</label>
                        <label
                            class="style-page__table__name__release"
                            v-if="scope.row.originInfo.type === 'release'"
                        >发行</label>
                        <label
                            style="width: 40px; display: inline-block;"
                            v-if="scope.row.originInfo.type === 'presentable'"
                        >
                            <div style="border-top: 1px solid #b5b5b5; width: 16px;"></div>
                        </label>
                        <span>{{scope.row.testResourceName}}</span>
                    </div>
                    <div style="font-size: 12px; color: #888; padding-left: 50px;">{{scope.row.originInfo.version}}</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="entries"
                label="相关测试资源"
                min-width="30%"
            >
                <template slot-scope="scope">
                    <a @click="goToOrigin(scope.row.originInfo)" class="style-page__table__entries">
                        <div
                            class="resource-default-preview style-page__table__entries__img"
                        >
                            <img
                                v-if="scope.row.previewImages.length > 0"
                                :src="scope.row.previewImages[0]"
                                class="resource-default-preview"
                            />
                        </div>
                        <div class="style-page__table__entries__info">
                            <div class="text-overflow-ellipsis">{{scope.row.originInfo.name}}</div>
                            <div>{{scope.row.originInfo.version}}</div>
                        </div>
                    </a>
                </template>
            </el-table-column>

            <el-table-column
                prop="type"
                label="全部类型"
                min-width="12%"
            >
                <template slot-scope="scope">
                    <div class="style-page__table__type">
                        {{scope.row.resourceType}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                min-width="12%"
            >
                <template slot="header" slot-scope="scope">
                    <!--                     trigger="click"-->
                    <el-dropdown
                        @command="onChangeState"
                        style="height: 32px; padding-left: 0;"
                    >
                        <div style="padding-left: 0; cursor: pointer;">
                            {{selectedState}} <i class="el-icon-caret-bottom"/>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                :command="item"
                                v-for="item in allState"
                            >
                                {{item}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>

                <template slot-scope="scope">
                    <div class="style-page__table__status">
                        <span v-if="scope.row.testResourceId === activatedThemeId"
                              style="color: #000;">已激活</span>
                        <span v-if="scope.row.testResourceId !== activatedThemeId"
                              style="color: #bfbfbf;">未激活</span>

                        <template v-if="scope.row.resolveReleaseSignStatus === 2">
                            <el-popover
                                placement="top"
                                width="100"
                                trigger="hover"
                            >
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <span>尚未获得测试授权</span>
                                    <el-button @click="operationCommand('编辑', scope.row)" type="text">详情</el-button>
                                </div>
                                <i
                                    slot="reference"
                                    class="el-icon-warning"
                                    style="font-size: 20px; color: #ffc210; margin-left: 8px;"
                                />
                            </el-popover>
                        </template>
                    </div>

                </template>
            </el-table-column>
            <el-table-column
                prop="operation"
                label="操作"
                min-width="5%"
            >
                <template slot-scope="scope">
                    <el-dropdown @command="$event => operationCommand($event, scope.row)">

                        <el-button
                            icon="el-icon-more"
                            type="small"
                            circle
                            class="release-list__table__operation"
                        />

                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="'编辑'">
                                编辑
                            </el-dropdown-item>
                            <el-dropdown-item
                                v-if="scope.row.testResourceId !== activatedThemeId"
                                :command="'isOnline'"
                            >
                                <span
                                    style="color: #44a0ff;">激活</span>
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="'delete'"
                                v-if="matchTestResult.testRules.find(i => i.presentableName === scope.row.testResourceName)"
                            >
                                <span style="color: #ee4040;">删除</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <div
            class="style-page__pagination"
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
</template>

<script>
    import Index from './index';

    export default Index;
</script>

<style scoped lang="less">
    @import "index";
</style>
