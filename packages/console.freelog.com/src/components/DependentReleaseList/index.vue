<template>
    <div style="background-color: #fff;">
<!--        {{// dataSource}}-->
        <div
            style="padding: 15px 20px;"
        >
            <!-- 添加发行按钮 -->
            <div v-if="!isLock" style="align-items: center; display: flex;">
                <el-button
                    size="small"
                    icon="el-icon-plus"
                    circle
                    @click="dialogVisible = true"
                />
                <span style="padding-left: 10px; font-size: 14px; color: #333;">{{$t('addDependencies')}}</span>
            </div>

            <!-- 按钮与发行间距 -->
            <div v-if="dataSource.length > 0 && !isLock" style="height: 10px;"></div>
            <div v-if="dataSource.length === 0 && isLock" style="font-size: 14px;">{{$t('notRely')}}...</div>

            <!-- 发行列表 -->
            <Item
                v-for="(i, j) in dataSource"
                :isLock="isLock"
                :name="i.name"
                :version="i.version"
                :versions="i.versions"
                :isOnline="i.isOnline"
                @onVersionChange="i.version = $event"
                @onRemove="onRemove(j)"
            />
            <!-- 发行与mock 之间的间隔 -->
            <div
                v-show="mockDataSource && mockDataSource.length > 0"
                style="height: 10px;"
            ></div>
            <!-- mock 列表的小标题 -->
            <div
                v-show="mockDataSource && mockDataSource.length > 0"
                style="font-size: 13px; color: #888; padding-left: 5px; line-height: 20px;"
            >{{$t('mockDependency')}}
            </div>
            <!-- mock 列表 -->
            <Item
                v-for="(i, j) in mockDataSource"
                :name="i.name"
                @onRemove="onRemoveMock(j)"
            />
        </div>


        <!--        <Item :isLock="false" :name="'策略2'" :isOnline="true" @onRemove="onRemove(1)"/>-->
        <!--        <Item :isLock="false" :name="'策略3'" :isOnline="false" @onRemove="onRemove(2)"/>-->
        <DepDialog
            v-if="dialogVisible"
            :showMock="!!mockDataSource"
            :exists="exists"
            :existMocks="existMocks"
            @addARelease="addARelease"
            @addAMock="addAMock"
            @removeARelease="removeARelease"
            @removeAMock="removeAMock"
            @onClose="dialogVisible = false"
            :currentID="currentID"
        />
    </div>
</template>

<script>
    export {default} from './index.js';
</script>

<style scoped>

</style>
