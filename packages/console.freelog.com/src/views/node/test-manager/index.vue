<template>
<!--    :style="styleObject"-->
    <div class="test-management">

        <div class="test-management__aside">

            <NodeHeader
                :nodeName="nodeInfo.name"
                :nodeHref="nodeInfo.testOrigin"
                :isTestNode="true"
                :enterNode="`/node/manager/${$route.params.nodeId}`"
                btnText="进入节点管理"
            />

            <div class="test-management__aside__nav">
                <a
                    :class="{'test-management__aside__nav--active': selectedTab === tab.tab }"
                    v-for="(tab, index) in tabList"
                    :key="'tab' + index"
                    @click="exchangeTab(tab)"
                >{{tab.name}}</a>
            </div>

        </div>

        <div class="test-management__main">
            <ReleaseList v-if="selectedTab === 'ReleaseList'"/>
            <StylePage v-if="selectedTab === 'StylePage'"/>
            <MappingRules v-if="selectedTab === 'MappingRules'"/>
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
