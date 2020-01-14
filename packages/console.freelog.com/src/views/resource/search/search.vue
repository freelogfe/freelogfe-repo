<template>
  <div>
    <el-input
            class="r-e-w-search-input"
            v-model="searchInput"
            clearable
            ref="searchInputRef"
            @clear="clearSearchInputHandler"
            @keyup.native.enter="searchHandler"
            :placeholder="$t('search.resourcePlaceholder')"
    ></el-input>
    <lazy-list-view :list="searchResources"
                    ref="searchView"
                    class="r-e-w-s-resource-list"
                    :height="60"
                    :fetch="searchDataHandler">
      <template slot-scope="scope">
        <div class="r-e-w-s-r-item">
          <span class="r-e-w-s-r-name">{{scope.data.aliasName}}</span>
          <span class="r-e-w-s-r-type">{{scope.data.resourceType | pageBuildFilter}}</span>
          <span class="r-e-w-s-r-date">{{scope.data.createDate | fmtDate}}</span>
          <span class="r-e-w-s-r-relase" v-if="resourceMapReleases[scope.data.resourceId]">已有发行</span>
          <span class="r-e-w-s-r-select-btn" @click="selectResource(scope.data)">选择</span>
        </div>
      </template>
    </lazy-list-view>
  </div>
</template>

<script>

import LazyListView from '@/components/LazyListView/index.vue'
export default {
  name: 'resource-search',
  props: {
    searchResourceType: {
      type: String,
      default: ''
    } 
  },
  components: {
    LazyListView
  },
  data() {
    return {
      searchInput: '',
      searchResources: [],
      isFirstSearch: true,
      resourceMapReleases: {}
    }
  },
  computed: {
    resourceProjection() {
      return ['resourceId', 'resourceType', 'aliasName', 'createDate', 'status'].join(',')
    },
  },
  methods: {
    clearSearchInputHandler() {

    },
    searchHandler() {
      this.searchResources = []
      this.$refs.searchView.refresh()
      console.log(this.resourceMapReleases)
    },
    // 资源搜索
    searchDataHandler(page) {
      const pageSize = 10

      // if (!this.searchInput && !this.isFirstSearch) {
      //   return Promise.resolve({ canLoadMore: false })
      // }
      // this.isFirstSearch = false
      let params = Object.assign({
        keywords: encodeURIComponent(this.searchInput),
        page,
        pageSize,
        isSelf: 1,
        projection: this.resourceProjection
      }, this.searchScope)
      if (this.searchResourceType !== '') {
        params = Object.assign(params, { resourceType: this.searchResourceType })
      }
      // 空输入时，即查询所有属于我的资源
      return this.$services.ResourceService.get({ params }).then((res) => {
        const data = res.getData() || {}
        if (res.data.errcode === 0) {
          this.searchResources = this.searchResources.concat(data.dataList)
          if (data.dataList.length < pageSize) {
            data.canLoadMore = false
          }
        } else {
          data.canLoadMore = false
        }
        const resourceIds = data.dataList.map(r => r.resourceId)
        this.batchFetchReleaseList(resourceIds)
        return data
      })
    },
    selectResource(resource) {
      this.$emit('select-resource', resource)
    },
    // 批量获取资源"所属发行列表"
    batchFetchReleaseList(resourceIds) {
      resourceIds = resourceIds.filter(r => !this.resourceMapReleases[r.resourceId]).join(',')
      return this.$services.ResourceService.get(`releases?resourceIds=${resourceIds}`)
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              const leng = res.data.length
              const map = {}
              for(let i = 0; i < leng; i++) {
                const { resourceId } = res.data[i]
                map[resourceId] = res.data[i].releases.length > 0
              }
              this.resourceMapReleases = Object.assign({}, this.resourceMapReleases, map)
            }
          })
    },
  },
}
</script>

<style lang="less" type="text/less" scoped>
  @import '../../../styles/variables.less';

  .r-e-w-search-input { margin-bottom: 20px; }

  .r-e-w-s-r-item { margin: 15px 0; }
  span { display: inline-block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
  .r-e-w-s-r-name { width: 220px; color: #333; }
  .r-e-w-s-r-type, .r-e-w-s-r-date { font-size: 12px; color: #999; }
  .r-e-w-s-r-type{ width: 80px; }
  .r-e-w-s-r-date{ width: 72px; }
  .r-e-w-s-r-relase{
    padding: 0 5px; border-radius: 3px;
    font-size: 12px; background-color: #67C23A; color: #fff;
  }
  .r-e-w-s-r-select-btn {
    float: right; cursor: pointer;
    margin: 2px 0; padding: 2px 10px; border-radius: 13px;
    font-size: 12px; background-color: #409EFF; color: #fff;
  }
</style>
