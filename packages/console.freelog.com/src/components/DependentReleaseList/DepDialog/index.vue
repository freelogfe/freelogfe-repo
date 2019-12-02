<template>
    <div
        style="position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(0,0,0,.5); z-index: 100; display: flex; align-items: center; justify-content: center;"
    >
        <div
            style="width: 960px; height: 630px; background-color: #fff; border-radius: 10px; display: flex; flex-direction: column;">
            <div
                style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #d8d8d8; flex-shrink: 0;"
            >
                <div style="display: flex; line-height: 55px; color: #333; font-size: 16px;">
                    <a
                        style="display: inline-block; padding: 0 5px; margin-left: 30px; color: #409eff; border-bottom: 1px solid #409eff;"
                        :style="{color: activeTab === 'search' ? '#409eff' : 'inherit', 'border-bottom': activeTab === 'search' ? '1px solid #409eff' : 'none'}"
                        @click="onChangeTab('search')"
                    >{{$t('globalSearching')}}</a>
                    <a
                        style="display: inline-block; padding: 0 5px; margin-left: 40px;"
                        :style="{color: activeTab === 'release' ? '#409eff' : 'inherit', 'border-bottom': activeTab === 'release' ? '1px solid #409eff' : 'none'}"
                        @click="onChangeTab('release')"
                    >{{$t('myReleases')}}</a>
                    <a
                        style="display: inline-block; padding: 0 5px; margin-left: 40px;"
                        :style="{color: activeTab === 'collection' ? '#409eff' : 'inherit', 'border-bottom': activeTab === 'collection' ? '1px solid #409eff' : 'none'}"
                        @click="onChangeTab('collection')"
                    >{{$t('myCollections')}}</a>
                    <a
                        v-if="showMock"
                        style="display: inline-block; padding: 0 5px; margin-left: 40px;"
                        :style="{color: activeTab === 'mock' ? '#409eff' : 'inherit', 'border-bottom': activeTab === 'mock' ? '1px solid #409eff' : 'none'}"
                        @click="onChangeTab('mock')"
                    >{{$t('myMocks')}}</a>
                </div>
                <i
                    class="el-icon-close"
                    style="font-size: 20px; color: #666; margin-right: 30px;"
                    @click="$emit('onClose')"
                />
            </div>

            <div style="flex-shrink: 1; height: 100%; overflow: hidden;">
                <Search
                    v-if="activeTab === 'search'"
                    :exists="exists"
                    @add="$emit('addARelease', $event)"
                    @remove="$emit('removeARelease', $event)"
                    :currentID="currentID"
                />
                <Release
                    v-if="activeTab === 'release'"
                    :exists="exists"
                    @add="$emit('addARelease', $event)"
                    @remove="$emit('removeARelease', $event)"
                    :currentID="currentID"
                />
                <Collection
                    v-if="activeTab === 'collection'"
                    :exists="exists"
                    @add="$emit('addARelease', $event)"
                    @remove="$emit('removeARelease', $event)"
                    :currentID="currentID"
                />
                <Mock
                    v-if="activeTab === 'mock'"
                    :exists="existMocks"
                    @add="$emit('addAMock', $event)"
                    @remove="$emit('removeAMock', $event)"
                    :currentID="currentID"
                />
            </div>
            <div style="height: 20px;"></div>
        </div>
    </div>
</template>

<script>
    export {default} from './index.js';
</script>

<style scoped>

</style>
