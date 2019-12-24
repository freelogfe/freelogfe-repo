<i18n src="./resource-list.i18n.json"></i18n>
<template>
  <div class="resource-list">
    <f-pagination class="resource-list-table"
              :config="tableConfig"
              :formatHandler="formatHandler"
              ref="listRef"
              :pagination="paginationConfig"
              :empty-text="pagenationEmptyText">
      <template slot="list">
        <el-table-column :label="$t('list.name')">
          <template slot-scope="scope">
            <div class="r-l-item-name-box">
              <img
                class="r-l-item__img"
                :class="{'resource-default-preview':!previewImage}"
                :src="scope.row.previewImage" />
              <div class="r-l-item-name" :title="scope.row.aliasName">{{scope.row.aliasName}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('list.type')" width="176">
          <template slot="header" slot-scope="scope">
            <el-dropdown class="r-l-types-select" @command="handleSelectType">
              <span class="el-dropdown-link">
                {{$t('list.type')}} {{selectedType === 'all' ? '': `${selectedType}` | pageBuildFilter}}<i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in resourceTypes" :key="item.value" :command="item.value">{{item.label | pageBuildFilter}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <div class="r-l-item-type"> {{scope.row.resourceType | pageBuildFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('list.history')" width="200">
          <template slot="header" slot-scope="scope">
            <el-dropdown class="r-l-types-select" @command="handleSelectReleaseStatus">
              <span class="el-dropdown-link">
                {{$t('list.history')}} {{releaseStatus[selectedReleaseStatus].label}}<i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in releaseStatus" :key="item.value" :command="item.value">{{item.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <div class="r-l-item-no-release">
              {{scope.row.releaseStatus === 'fetching' ?
              $t('list.querying') : scope.row.releaseList.length ? '' : $t('list.noReleases')}}
            </div>
            <div style="position: relative;" v-if="scope.row.releaseList.length">
              <div class="r-l-item-release-row1" @click="goToReleaseDetail(scope.row.releaseList[0])">{{scope.row.releaseList[0].releaseName}}</div>
              <template  v-if="scope.row.releaseList.length > 1">
                <el-popover placement="bottom-start" width="370" trigger="hover">
                  <div class="r-l-item-release-row2" slot="reference">{{$t('list.releasesCount[0]')}}{{scope.row.releaseList.length}}{{$t('list.releasesCount[1]')}}</div>
                  <div class="r-l-item-release-floatbox">
                    <div class="release-item" v-for="(r, index) in scope.row.releaseList" :key="'r'+index">
                      <span class="name" @click="goToReleaseDetail(r)">{{r.releaseName}}</span>
                      <span class="version">{{r.resourceVersion.version}}</span>
                      <span class="date">{{r.resourceVersion.createDate | fmtDate}}</span>
                    </div>
                  </div>
                </el-popover>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updateDate" :label="$t('list.updateDate')" width="180">
          <template slot-scope="scope">
            <div class="r-l-item-updateDate">{{scope.row.updateDate | fmtDate}}</div>
            <div class="r-l-item-createDate">{{$t('list.createDate')}} {{scope.row.createDate | fmtDate }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('list.operate')" width="260">
          <template slot-scope="scope">
            <el-button class="r-l-item-release-btn" size="mini" @click="tapRelease(scope.row)">{{$t('list.releaseBtnText')}}</el-button>
            <router-link :to="scope.row._toDetailLink">
              <el-button class="r-l-item-detail-btn" size="mini">{{$t('list.editBtnText')}}</el-button>
            </router-link>
            <a :href="scope.row._downloadLink" :download="scope.row.aliasName">
              <el-button class="r-l-item-download-btn" size="mini">{{$t('list.downloadBtnText')}}</el-button>
            </a>
          </template>
        </el-table-column>
      </template>
    </f-pagination>
  </div>
</template>

<script>
  import FPagination from '@/components/Pagination/index.vue'
  import { RESOURCE_TYPES } from '@/config/resource'

  export default {
    name: 'resource-items-list',

    components: { FPagination },

    props: {
      query: String
    },

    data() {
      const NO_REACTED_RESOURCE = this.$i18n.t('list.messages[1]')
      const $i18n = this.$i18n
      const qResourceType = this.$route.query.resourceType

      return {
        search: '',
        loader: null,
        tableConfig: {
          rowClassName: 'resource-row',
          'cell-class-name': 'rel-row-cell',
          'show-header': true
        },
        paginationConfig: {
          target: `/v1/resources`,
          params: {
            isSelf: 1,
            resourceType: qResourceType != null ? qResourceType : undefined,
            keywords: undefined,
            isReleased: 2               // 0: 未发行；1: 已发行；2: 全部发行
          }
        },
        resourceMapReleases: {},
        selectedType: qResourceType != null ? qResourceType : 'all',
        releaseStatus: [
          { label: $i18n.t('list.releaseStatus[0]'), value: 0 },
          { label: $i18n.t('list.releaseStatus[1]'), value: 1 },
          { label: $i18n.t('list.releaseStatus[2]'), value: 2 }
        ],
        selectedReleaseStatus: 2,
        pagenationEmptyText: NO_REACTED_RESOURCE
      }
    },

    computed: {
      resourceTypes() {
        const $i18n = this.$i18n
        const arr = [{ label: $i18n.t('list.allTypes'), value: 'all' }]
        for(let [label, value] of Object.entries(RESOURCE_TYPES)) {
          arr.push({ label, value })
        }
        return arr
      },
    },

    watch: {

      query() {
        const [ NO_RIGHT_RESOURCE, NO_REACTED_RESOURCE ] = [ this.$i18n.t('list.messages[0]'), this.$i18n.t('list.messages[1]') ]
        if(this.query == '') {
          this.paginationConfig.params.keywords = undefined
          this.pagenationEmptyText = NO_REACTED_RESOURCE
        }else {
          this.paginationConfig.params.keywords = this.query
          this.pagenationEmptyText = NO_RIGHT_RESOURCE
        }
      },
      selectedReleaseStatus() {
        this.paginationConfig.params.isReleased = this.selectedReleaseStatus
      },
    },

    mounted() {

    },

    methods: {
      formatHandler(list) {
        if (!list || !list.length) {
          return []
        }
        list = list.map(resource => {
          const { resourceId, previewImages } = resource
          // resource._toDetailLink = resourceId ? `/resource/detail/${resourceId}` : ''
          resource._toDetailLink = resourceId ? `/resource/editor/${resourceId}` : ''
          resource._downloadLink = `${window.FreelogApp.Env.qiOrigin}/v1/resources/${resourceId}/download`
          resource.previewImage = previewImages && previewImages[0] || ''
          resource.releaseStatus = 'fetching'
          resource.releaseList = []

          this.fetchReleaseList(resourceId)
            .then(() => {
              resource.releaseStatus = 'done'
              resource.releaseList = this.resourceMapReleases[resource.resourceId]
            })
          return resource
        })

        list.sort((r1, r2) => +new Date(r2.updateDate) - (+new Date(r1.updateDate)))
        return list
      },
      batchFetchReleaseList(list) {
        const pArray = []
        for(let i = 0; i < list.length; i++) {
          const resourceId = list[i].resourceId
          if(!this.resourceMapReleases[resourceId]) {
            pArray.push(this.fetchReleaseList(resourceId))
          }
        }
        return Promise.all(pArray)
      },

      // 获取单个资源"所属发行列表"
      fetchReleaseList(resourceId) {
        if(!this.resourceMapReleases[resourceId]) {
          return this.$services.ResourceService.get(`${resourceId}/releases`)
            .then(res => res.data)
            .then(res => {
              if(res.errcode === 0) {
                this.resourceMapReleases[resourceId] = res.data
              }
            })
        }else {
          return Promise.resolve(this.resourceMapReleases[resourceId])
        }
      },
      tapRelease(resource) {
        this.$emit('release', resource)
      },
      goToReleaseDetail(release) {
        if(release.releaseId) {
          this.$router.push(`/release/detail/${release.releaseId}?version=${release.resourceVersion.version}`)
        }
      },
      handleSelectType(command) {
        this.selectedType = command
        this.$router.push({
          query: { resourceType: command }
        })
        if(this.selectedType === 'all') {
          this.paginationConfig.params.resourceType = undefined
        }else {
          this.paginationConfig.params.resourceType = this.selectedType
        }
      },
      handleSelectReleaseStatus(command) {
        this.selectedReleaseStatus = command
        this.paginationConfig.params.isReleased = this.selectedReleaseStatus
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./list.less";
</style>
<style lang="less">
  .r-l-item-release-floatbox {
    .release-item {
      display: flex;
      span {
        display: inline-block; margin: 5px;
        &.name {
          width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;
          text-decoration: underline;
        }
        &.version { width: 70px; }
        &.date { width: 90px; }
      }
    }
  }
  .resource-list-table {
    .r-l-types-select, .r-l-status-select {
      display: block; padding: 0;
    }
  }
</style>
