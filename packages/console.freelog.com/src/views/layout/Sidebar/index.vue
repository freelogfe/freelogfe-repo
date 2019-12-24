<template>
    <nav
        class="left-sidebar"
        :class="{'sidebar-mini': isMini}"
        v-if="isShowSidebar"
        @click.stop="function(){}"
    >
        <ul class="ls-list">
            <li class="ls-item ">
                <el-tooltip effect="dark" :content="isMini ? $t('sidebar.open') : $t('sidebar.close')" placement="right"
                            :disabled="!isMini">
                    <a class="nav-link ls-nav-link" href="javascript:;" @click="isMini=!isMini">
                        <i class="el-icon-more-outline"></i>
                        <span>{{isMini ? $t('sidebar.open') : $t('sidebar.close')}}</span>
                    </a>
                </el-tooltip>
            </li>
            <li class="ls-item ls-create-resource">
                <el-tooltip effect="dark" :content="$t('routes.createResource')" placement="right" :disabled="!isMini">
<!--                    <router-link to="/resource/create" class="nav-link create-resource ls-nav-link">-->
                    <router-link to="/resource/editor" class="nav-link create-resource ls-nav-link" target="_blank">
                        <i class="el-icon-plus"></i>
                        <span>{{$t('routes.createResource')}}</span>
                    </router-link>
                </el-tooltip>
            </li>
            <li class="ls-item">
                <el-tooltip effect="dark" :content="$t('routes.releaseMarket')" placement="right" :disabled="!isMini">
                    <router-link to="/" class="nav-link ls-nav-link">
                        <i class="el-icon-fa-th"></i>
                        <span>{{$t('routes.releaseMarket')}}</span>
                    </router-link>
                </el-tooltip>
            </li>
            <li class="ls-item">
                <el-tooltip effect="dark" :content="$t('routes.myResources')" placement="right" :disabled="!isMini">
                    <router-link to="/release-management/resource/list" class="nav-link ls-nav-link">
                        <i class="el-icon-menu"></i>
                        <span>{{$t('routes.myResources')}}</span>
                    </router-link>
                </el-tooltip>
            </li>
            <li class="ls-item">
                <el-tooltip effect="dark" :content="$t('routes.myReleases')" placement="right" :disabled="!isMini">
                    <router-link to="/release-management/release/list" class="nav-link ls-nav-link">
                        <i class="el-icon-fa-list"></i>
                        <span>{{$t('routes.myReleases')}}</span>
                    </router-link>
                </el-tooltip>
            </li>
            <li class="ls-item">
                <el-tooltip effect="dark" :content="$t('routes.myCollections')" placement="right" :disabled="!isMini">
                    <router-link to="/release-management/release/collections" class="nav-link ls-nav-link">
                        <i class="el-icon-files"></i>
                        <span>{{$t('routes.myCollections')}}</span>
                    </router-link>
                </el-tooltip>
            </li>
            <li class="ls-item ls-submenu">
                <a href="javascript:;" class="nav-link ls-nav-link">
                    <i class="el-icon-document"></i>
                    <div class="ls-submenu-text">
                        <span>{{$t('routes.nodes')}}</span>
                        <el-tooltip effect="dark" :content="$t('node.createNode')" placement="right"
                                    :disabled="!isMini">
                            <router-link to="/node/create" class="nav-link ls-nav-link create-node-btn">
                                <i class="el-icon-plus"></i>
                            </router-link>
                        </el-tooltip>
                    </div>
                </a>
                <ul class="my-node-list ls-submenu-list" v-if="nodes&&nodes.length">
                    <li class="node-item hover" :key="node.nodeId" v-for="node in nodes">
                        <router-link 
                            :to="'/node/manager/'+node.nodeId" 
                            :title="node.nodeName"
                            class="nav-link mnl-nav-link"
                            target="_blank">
                            {{node.nodeName}}
                        </router-link>
                        <router-link
                            :to="'/node/test-manager/'+node.nodeId"
                            class="nav-link mnl-nav-link"
                            target="_blank"
                            :title="node.nodeName"
                        >
                            {{node.nodeName}} 测试
                        </router-link>
                    </li>
                </ul>
            </li>
            <li class="ls-item">
                <el-tooltip effect="dark" :content="$t('routes.accountSetting')" placement="right" :disabled="!isMini">
                    <router-link to="/setting" class="nav-link ls-nav-link">
                        <i class="el-icon-setting"></i>
                        <span>{{$t('routes.accountSetting')}}</span>
                    </router-link>
                </el-tooltip>
            </li>
            <li class="ls-item">
                <el-tooltip
                    effect="dark"
                    :content="$t('routes.mockResource')"
                    placement="right"
                    :disabled="!isMini">
                    <router-link
                        to="/mock"
                        class="nav-link ls-nav-link"
                    >
                        <i class="el-icon-edit"></i>
                        <!--            <span>{{$t('routes.accountSetting')}}</span>-->
                        <span>mock资源</span>
                    </router-link>
                </el-tooltip>
            </li>
        </ul>
    </nav>
</template>

<script>
    import SideBar from './index'

    export default SideBar
</script>

<style scoped lang="less">
    @import "index.less";
</style>
