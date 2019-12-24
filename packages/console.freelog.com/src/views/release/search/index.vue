
<template>
  <div class="releases-search-wrapper">
    <el-tabs v-model="activeName">

      <!-- 全局搜索 -->
      <el-tab-pane v-if="tabLayout.indexOf('search') !== -1" :label="$t('search.searchTitle')" name="search">
        <div class="search-input-area">
          <el-input v-model="searchInput"
                    class="search-release-input"
                    clearable
                    ref="searchInputRef"
                    @clear="clearSearchInputHandler"
                    @keyup.native.enter="searchHandler"
                    :placeholder="$t('search.placeholder')"></el-input>
        </div>
        <lazy-list-view :list="searchReleases"
                        ref="searchView"
                        class="search-release-list"
                        :height="60" :fetch="searchDataHandler">
          <template slot-scope="scope">
            <release-item
                    type="search"
                    :historicalReleaseIds="historicalReleaseIds"
                    :release="scope.data"
                    @add="addToReleaseHandler"></release-item>
          </template>
        </lazy-list-view>
      </el-tab-pane>

      <el-tab-pane v-if="tabLayout.indexOf('my-release') !== -1" :label="$t('search.myRelease')" name="my-release">
        <lazy-list-view :list="myReleases" class="search-release-list" :height="60" :fetch="fetchMyData">
          <template slot-scope="scope">
            <release-item
                    type="search"
                    :historicalReleaseIds="historicalReleaseIds"
                    :release="scope.data"
                    @add="addToReleaseHandler"></release-item>
          </template>
<!--          <div class="no-release-items" slot="empty">{{$t('search.noFavorReleases')}}</div>-->
          <div class="no-release-items" slot="empty">暂无相同类型发行</div>
        </lazy-list-view>
      </el-tab-pane>

      <el-tab-pane v-if="tabLayout.indexOf('favor') !== -1" :label="$t('search.favorTitle')" name="favor">
        <lazy-list-view :list="favorReleases" class="search-release-list" :height="60" :fetch="fetchFavorData">
          <template slot-scope="scope">
            <release-item
                    type="search"
                    :historicalReleaseIds="historicalReleaseIds"
                    :release="scope.data"
                    @add="addToReleaseHandler"></release-item>
          </template>
          <div class="no-release-items" slot="empty">{{$t('search.noFavorReleases')}}</div>
        </lazy-list-view>
      </el-tab-pane>

      <!-- 我的 mock 资源 -->
      <el-tab-pane
              v-if="tabLayout.indexOf('mock-search') !== -1"
              :label="'我的mock资源'"
              name="mock-search"
      >
        <div class="search-input-area">
          <el-input
                  v-model="mockSearchInput"
                  class="search-release-input"
                  clearable
                  ref="mockSearchInputRef"
                  @keyup.native.enter="mockSearchHandler"
                  :placeholder="$t('search.placeholder')">
          </el-input>
        </div>
        <!--                :fetch="mockSearchReleases"-->
        <lazy-list-view
                :list="mockSearchReleases"
                ref="mockSearchView"
                class="search-release-list"
                :height="60"
                :fetch="mockSearchDataHandler"
        >
          <template slot-scope="scope">
            <release-item
                    type="search"
                    :historicalReleaseIds="historicalReleaseIds"
                    :release="scope.data"
                    @add="addToMockReleaseHandler"
            >
            </release-item>
          </template>
        </lazy-list-view>
      </el-tab-pane>

    </el-tabs>
    <!--        {{searchReleases}}-->
  </div>
</template>

<script>
  import LazyListView from '@/components/LazyListView/index.vue'
  import ReleaseItem from './release-item.vue'
  import {axios} from "@/lib";
  import querystring from 'querystring';

  export default {
    name: 'releases-search',
    components: {LazyListView, ReleaseItem},
    props: {
      type: {
        type: String,
        default: 'release'
      },
      releaseSource: {
        type: Object
      },
      historicalReleases: {
        type: Array,
        default() {
          return []
        }
      },
      mockTab: {
        type: Boolean,
      },
      tabLayout: {
        type: Array,
        default: [ 'search', 'my-release', 'favor' ]
      },
    },
    data() {
      return {
        activeName: this.tabLayout[0],
        searchInput: '',
        // 我的 mock 输入框文本
        mockSearchInput: '',
        myReleases: [],
        favorReleases: [],
        searchReleases: [],
        // 我的 mock 搜索列表
        mockSearchReleases: [],
      }
    },
    computed: {
      historicalReleaseIds() {
        return this.historicalReleases.map(r => r.releaseId)
      }
    },
    mounted() {
      this.$refs.searchInputRef && this.$refs.searchInputRef.focus()
      this.myLoader = this.getMyReleasesLoader()
      this.favorLoader = this.getFavorReleasesLoader()
    },
    methods: {
      addToReleaseHandler(release) {
        this.$emit('add', release)
      },
      addToMockReleaseHandler(release) {
        this.$emit('add', release)
      },
      clearSearchInputHandler() {
        // this.searchReleases = []
      },
      getMyReleasesLoader() {
        return this.createReleaseLoader(param => this.$services.ReleaseService.get(param || {}).then(res => res.getData()))
      },
      getFavorReleasesLoader() {
        return this.createReleaseLoader(param => this.$services.collections.get(param || {}).then(res => res.getData()))
      },
      createReleaseLoader(loader) {
        return (param) => {
          param = param || {
            pageSize: 10,
            page: 1
          }
          if (typeof param === 'object') {
            param = {
              params: Object.assign({
                pageSize: 10,
                page: 1,
              }, param)
            }
          }
          return loader(param)
        }
      },
      fetchMyData(page) {
        const pageSize = 10
        if (!this.myLoader) {
          return Promise.resolve({
            canLoadMore: false,
            dataList: []
          })
        }
        const params = Object.assign({page, isSelf: 1}, { resourceType: this.releaseSource ? this.releaseSource.resourceType : null })
        return this.myLoader(params).then((data) => {
          this.myReleases = this.myReleases.concat(data.dataList)
          if (data.dataList.length < pageSize) {
            data.canLoadMore = false
          }
          return data
        })
      },
      fetchFavorData(page) {
        const pageSize = 10
        if (!this.favorLoader) {
          return Promise.resolve({
            canLoadMore: false,
            dataList: []
          })
        }
        return this.favorLoader({page}).then((data) => {
          this.favorReleases = this.favorReleases.concat(data.dataList)
          if (data.dataList.length < pageSize) {
            data.canLoadMore = false
          }
          return data
        })
      },
      searchDataHandler(page) {
        const pageSize = 10

        if (!this.searchInput) {
          return Promise.resolve({canLoadMore: false})
        }

        return this.$services.ReleaseService.get({
          params: Object.assign({
            keywords: encodeURIComponent(this.searchInput),
            page,
            pageSize
          }, this.searchScope)
        }).then((res) => {
          // console.log(res, 'resresres');
          const data = res.getData() || {}
          if (res.data.errcode === 0) {
            // data.dataList = data.dataList.filter(r => r.policies.length > 0)
            // console.log(data.dataList, 'data.dataListdata.dataListdata.dataList');
            this.searchReleases = this.searchReleases.concat(data.dataList)
            if (data.dataList.length < pageSize) {
              data.canLoadMore = false
            }
          } else {
            data.canLoadMore = false
          }
          // console.log(data, 'datadatadatadatadata');
          return data
        })
      },
      searchHandler() {
        this.activeName = 'search'
        this.searchReleases = []
        this.$refs.searchView.refresh()
      },
      /**
       * mock 搜索
       */
      mockSearchDataHandler(page) {
        // console.log(12342134);
        const pageSize = 10

        if (!this.mockSearchInput) {
          return Promise.resolve({canLoadMore: false})
        }

        // return this.$services.ReleaseService.get({
        //     params: Object.assign({
        //         keywords: encodeURIComponent(this.mockSearchInput),
        //         page,
        //         pageSize
        //     }, this.searchScope)
        // })
        const params = {
          page,
          pageSize,
          // bucketName: this.activatedBucket.bucketName,
          keywords: encodeURIComponent(this.mockSearchInput),
          // resourceType: '',
          // projection: '',
          ...this.searchScope
        };
        const str = querystring.stringify(params);
        return axios.get(`/v1/resources/mocks?${str}`)
        .then((res) => {
          console.log(res, 'CASEFRWWFEA');
          const data = res.getData() || {}
          if (res.data.errcode === 0) {
            data.dataList = data.dataList
            // .filter(r => r.policies.length > 0)
            .map(i => ({
              releaseName: i.name,
              resourceType: i.resourceType,
              // latestVersion: '',
              updateDate: i.updateDate,
              releaseId: i.mockResourceId,
            }));
            this.mockSearchReleases = this.mockSearchReleases.concat(data.dataList)
            if (data.dataList.length < pageSize) {
              data.canLoadMore = false
            }
          } else {
            data.canLoadMore = false
          }
          return data
        })
      },
      /**
       *
       */
      mockSearchHandler() {
        this.activeName = 'mock-search'
        this.mockSearchReleases = []
        this.$refs.mockSearchView.refresh()
      },
    }
  }
</script>


<style lang="less" type="text/less">
  .no-release-items {
    font-size: 20px;
    text-align: center;
  }

  .releases-search-wrapper {
    .el-tabs__content {
      overflow: auto;
      min-height: 260px; height: 360px;
    }
    .search-input-area {
      margin: 20px 0;
    }

    .el-tab-pane {
      width: 550px;
      margin: auto;
    }
  }

</style>
