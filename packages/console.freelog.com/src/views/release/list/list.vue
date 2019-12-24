<i18n src="./release-list.i18n.json"></i18n>
<template>
  <div class="release-list">
    <f-pagination class="release-list-table"
              ref="listRef"
              :config="tableConfig"
              :formatHandler="formatHandler"
              :pagination="paginationConfig"
              :empty-text="pagenationEmptyText">
      <template slot="list">
        <el-table-column :label="$t('list.name')">
          <template slot-scope="scope">
            <div class="r-l-item-name-box" @click="goToReleaseDetail(scope.row)">
                <img
                  class="r-l-item__img"
                  :class="{'resource-default-preview':!previewImage}"
                  :src="scope.row.previewImage" />
                <div class="r-l-item-name" :title="scope.row.releaseName">{{scope.row.releaseName}}</div>
              </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('list.type')" width="160">
          <template slot="header" slot-scope="scope">
            <el-dropdown class="r-l-types" @command="handleSelectType">
              <span class="el-dropdown-link">
                {{$t('list.type')}} {{(selectedType === 'all' ? '': `${selectedType}`) | pageBuildFilter}}<i class="el-icon-caret-bottom"></i>
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
        <el-table-column :label="$t('list.newVersion')" width="120">
          <template slot-scope="scope">
            <div> {{scope.row.latestVersion.version}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('list.policy')" width="160">
          <template slot-scope="scope">
            <div v-if="scope.row.policies.length">
              <el-popover placement="bottom-start" width="370" trigger="hover">
                <div slot="reference">
                  <div class="r-l-item-policy-row1">
                    {{scope.row.policies[0].policyName}}
                    <router-link class="r-l-item-policy-add" v-if="type === 'myReleases'" :to="scope.row._toMangeDetailLink">
                      <i class="el-icon-plus"></i>
                    </router-link>
                  </div>
                  <div class="r-l-item-policy-row2" v-show="scope.row.policies.length > 1">{{$t('list.policyCount[0]')}}{{scope.row.policies.length}}{{$t('list.policyCount[1]')}}</div>
                </div>
                <f-policy-tabs :policies="scope.row.policies"></f-policy-tabs>
              </el-popover>
            </div>
            <div class="r-l-item-no-policy" v-else>{{$t('list.noPolicies')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="updateDate" :label="$t('list.updateDate')" width="180" v-if="type ==='myReleases' ">
          <template slot-scope="scope">
            <div class="r-l-item-date-row1">{{scope.row.updateDate | fmtDate}}</div>
            <div class="r-l-item-date-row2">{{$t('list.createDate')}} {{scope.row.createDate | fmtDate }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="collectionDate" :label="$t('list.collectDate')" width="180" v-else>
          <template slot-scope="scope">
            <div class="r-l-item-date-row1">{{scope.row.collectionDate | fmtDate}}</div>
            <div class="r-l-item-date-row2">{{$t('list.updateDate')}} {{scope.row.updateDate | fmtDate }}</div>
          </template>
        </el-table-column>
        <el-table-column width="130">
          <template slot="header" slot-scope="scope">
            <el-dropdown class="r-l-status" @command="handleSelectReleaseStatus" v-if="type === 'myReleases'">
              <span class="el-dropdown-link">
                {{$t('list.statusText')}} {{releaseStatusArray[selectedReleaseStatus].label}}<i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in releaseStatusArray"
                  :key="item.value"
                  :command="item.value">{{item.label}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span class="" v-else>
              {{releaseStatusArray[0].label}}
            </span>
          </template>
          <template slot-scope="scope">
            <div class="r-l-item-online" v-if="scope.row.isOnline">{{$t('list.status[1]')}}</div>
            <div class="r-l-item-offline" v-else>
              {{$t('list.status[2]')}}
              <el-tooltip placement="top">
                <div class="" slot="content">
                  <template v-if="scope.row.policies.length > 0"> {{$t('list.tips[0]')}}</template>
                  <template v-else>
                    {{$t('list.noPolicies')}}
                    <el-button type="text" size="mini" @click="goToMangeDetailLink(scope.row)">{{$t('list.view')}}</el-button>
                  </template>
                </div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('list.operate')" width="140">
          <template slot-scope="scope">
            <router-link :to="scope.row._toMangeDetailLink" v-if="type === 'myReleases'">
              <el-button class="r-l-item-edit-btn" size="mini">{{$t('list.editBtnText')}}</el-button>
            </router-link>
            <el-button 
              v-if="type === 'myCollections'"
              class="r-l-item-cancel-favor-btn"
              size="mini"
              @click="cancelCollection(scope.row)">{{$t('list.cancelCollectionBtnText')}}</el-button>
            <!-- -->
            <!-- 
            <router-link :to="scope.row._toDetailLink" v-if="scope.row.isOnline">
              <el-button class="r-l-item-detail-btn" size="mini">详情</el-button>
            </router-link> -->
          </template>
        </el-table-column>
      </template>
    </f-pagination>
  </div>
</template>

<script>
  import FPagination from '@/components/Pagination/index.vue'
  import FPolicyTabs from '@/components/PolicyTabs/index.vue'
  import { RESOURCE_TYPES } from '@/config/resource'
  import { RELEASE_STATUS } from '@/config/release'

  export default {
    name: 'release-items-list',

    components: { FPagination, FPolicyTabs },

    props: {
      type: {
        type: String,
        default: 'myReleases'
      },
      query: String
    },

    data() {
      const qResourceType = this.$route.query.resourceType
      return {
        search: '',
        loader: null,
        tableConfig: {
          rowClassName: 'release-row',
          'cell-class-name': 'rel-row-cell',
          'show-header': true
        },
        paginationConfig: {
          reloadCount: 0,
          target: '/v1/releases',
          params: {
            isSelf: 1,
            resourceType: qResourceType != null ? qResourceType : undefined,
            keywords: undefined,
            status: undefined
          }
        },
        selectedType: qResourceType != null ? qResourceType : 'all',
        pagenationEmptyText: '',
        selectedReleaseStatus: 0,
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
      releaseStatusArray() {
        var status = typeof this.$i18n.t('list.status') === 'string' ? RELEASE_STATUS : this.$i18n.t('list.status')
        const arr = []
        for(let index in status) {
          arr.push({ label: status[index], value: +index })
        }
        return arr
      }
    },

    watch: {
      selectedReleaseStatus() {

      },
      query() {
        const $i18n = this.$i18n
        const [ NO_RIGHT_RELEASE, NO_CREATED_RELEASE, NO_COLLECTED_RELEASE ] = [ $i18n.t('list.messages[0]'), $i18n.t('list.messages[1]'), $i18n.t('list.messages[2]') ]
        if(this.query == '') {
          this.paginationConfig.params.keywords = undefined
          this.pagenationEmptyText = this.type === 'myReleases' ? NO_CREATED_RELEASE : NO_COLLECTED_RELEASE
        }else {
          this.paginationConfig.params.keywords = this.query
          this.pagenationEmptyText = NO_RIGHT_RELEASE
        }
      }
    },
    mounted() {
      this.initView()
    },

    methods: {
      initView() {
        const $i18n = this.$i18n
        const [ NO_CREATED_RELEASE, NO_COLLECTED_RELEASE ] = [ $i18n.t('list.messages[1]'), $i18n.t('list.messages[2]') ]
        switch(this.type) {
          case 'myReleases': {
            this.paginationConfig.target = '/v1/releases'
            this.pagenationEmptyText = NO_CREATED_RELEASE
            break
          }
          case 'myCollections': {
            this.paginationConfig.target = '/v1/collections/releases'
            this.pagenationEmptyText = NO_COLLECTED_RELEASE
            break
          }
          default: {}
        }
      },
      formatHandler(list) {
        if (!list || !list.length) {
          return []
        }
        list = list.map(release => {
          const { releaseId, policies = [], previewImages, latestVersion, status } = release
          let isOnline = false
          for(let i = 0; i < policies.length; i++) {
            if(policies[i].status === 1) {
              isOnline = true
              break
            }
          }
          release.policies = policies
          release.isOnline = isOnline
          release._toDetailLink = release.releaseId ? `/release/detail/${releaseId}?version=${latestVersion.version}` : ''
          release._toMangeDetailLink = `/release/edit/${releaseId}`
          release.previewImage = previewImages && previewImages[0] || ''
          if(this.type === 'myCollections') {
            release.updateDate = release.releaseUpdateDate
            release.createDate = release.latestVersion.createDate
          }
          return release
        })
        list.sort((r1, r2) => +new Date(r2.updateDate) - (+new Date(r1.updateDate)))
        return list
      },
      cancelCollection(release) {
        const $i18n = this.$i18n
        this.$services.collections.delete(release.releaseId)
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              this.$message({ type: 'success', message: $i18n.t('list.messages[3]') })
              this.paginationConfig.reloadCount = this.paginationConfig.reloadCount + 1
            }
          })
      },
      goToReleaseDetail(release) {
        this.$router.push(release._toDetailLink)
      },
      goToMangeDetailLink(release) {
        this.$router.push(release._toMangeDetailLink)
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
        console.log(command)
        this.selectedReleaseStatus = command
        // 0: 全部状态；1: 已上线；2: 已下线
        switch(+this.selectedReleaseStatus) {
          case 0: {
            this.paginationConfig.params.status = undefined
            break
          }
          case 1: {
            this.paginationConfig.params.status = 1
            break
          }
          case 2: {
            this.paginationConfig.params.status = 0
            break
          }
          default: {}
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./list.less";
</style>

<style lang="less">
.release-list-table {
  .r-l-types, .r-l-status {
    display: block; padding: 0;
    .el-dropdown { padding: 0; }
  }
}
</style>

