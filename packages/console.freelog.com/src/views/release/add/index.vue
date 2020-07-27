<!--<i18n src="./add.i18n.json"></i18n>-->
<template>
  <div class="release-add-wrapper" v-if="release !== null">
    <release-editor-layout :release.sync="release" type="add">
      <template slot="about-version">
        <div class="r-a-w-version">
          <h4>{{$t('release.version')}}</h4>
          <div class="r-a-w-v-current">
            <label>{{$t('release.currentVersion')}}</label>
            <el-input v-model="newVersion"></el-input>
            <div class="raw-v--li-name" v-if="resourceDetail">
              <img :src="resourceDetail.previewImages ? resourceDetail.previewImages[0] : ''" alt="" :class="{'resource-default-preview':!(resourceDetail.previewImages && resourceDetail.previewImages[0])}" >
              {{resourceDetail.aliasName}}
            </div>
          </div>
          <div class="r-a-w-v-list clearfix">
            <label>{{$t('release.historicVersion')}}</label>
            <div style="margin-left: 72px;">
              <ul class="raw-v--ul">
                <li v-for="item in targetVersionsList">
                  <div class="raw-v--li-box">
                    <span class="raw-v--li-version">{{item.version}}</span>
                    <span class="raw-v--li-date">({{item.createDate}})</span>
                  </div>
                  <div class="raw-v--li-name">
                    <img :src="item.previewImages ? item.previewImages[0] : ''" alt="" :class="{'resource-default-preview':!(item.previewImages && item.previewImages[0])}" >
                    {{item.aliasName}}
                  </div>
                </li>
              </ul>
              <div class="r-a-w-v-l-more" v-if="release.resourceVersions.length > 3" @click="tapMoreBtn">
                {{this.isShowAllVersions ? $t('release.tuckUp') : $t('release.more') }}
              </div>
            </div>
          </div>
        </div>
        <div class="r-a-w-scheme" v-if="depReleasesList.length > 0">
          <div class="r-a-w-s-line"></div>
          <h4>{{$t('release.scheme')}}</h4>
          <scheme-manage
                  type="add"
                  :release="release"
                  :baseUpcastReleases="release.baseUpcastReleases"
                  :depReleasesList="depReleasesList"
                  :depReleasesDetailList.sync="depReleasesDetailList"
                  @update-resolved-releases="updateResolvedReleases"
          ></scheme-manage>
        </div>
        <div class="r-a-w-footer" :class="{'no-scheme': depReleasesList.length === 0}">
          <div class="r-a-w-cancel-btn" @click="cancelAddRelease">{{$t('release.cancelBtnText')}}</div>
          <div class="r-a-w-save-btn" @click="saveReleaseVersion">{{$t('release.saveBtnText')}}</div>
        </div>
      </template>
    </release-editor-layout>
  </div>
</template>

<script>
  import ReleaseEditorLayout from '../edit/layout.vue'
  import SchemeManage from '../scheme/index.vue'
  import { format } from 'date-fns'
  import { versionDescendingOrder } from '@/lib/utils.js'
  export default {
    name: 'release-add-box',
    components: { SchemeManage, ReleaseEditorLayout },
    data() {
      return {
        releaseId: this.$route.query.releaseId,
        resourceId: this.$route.query.resourceId,
        release: null,
        resourceDetail: null,
        releaseScheme: null,
        depReleasesList: [],
        depReleasesDetailList: [],
        releasesTreeData: [],
        resolvedReleases: [],
        targetVersionsList: [],
        newVersion: '',
        isShowAllVersions: false
      }
    },
    computed: {

    },
    watch: {
      isShowAllVersions() {
        this.getTargetVersionsList()
      },
    },
    methods: {
      fetchResourceDetail() {
        this.$services.resource.get(this.resourceId)
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              this.resourceDetail = res.data
              this.depReleasesList =  res.data.systemMeta.dependencies || []
              this.releaseName = res.data.aliasName
            }else {
              this.$message({ type: 'error', message: res.msg })
            }
          })
          .catch(e => this.$message({ type: 'error', message: e.toString() }))
      },
      fetchReleaseDetail() {
        this.$services.ReleaseService.get(this.releaseId)
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              this.release = res.data
              this.formatReleaseData()
              this.fetchEveryVersionRDetail()
            }
          })
      },
      // 获取 发行方案
      fetchReleaseScheme() {
        const { releaseId, latestVersion: { version } } = this.release
        this.$services.ReleaseService.get(`${releaseId}/versions/${version}`)
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              this.releaseScheme = res.data
            }
          })
          .catch(e => this.$error.showErrorMessage(this.$t('release.licensingFailed')))
      },
      formatReleaseData() {
        this.newVersion = this.getNewVersion()
        this.release.resourceVersions = this.release.resourceVersions.map(i => {
          i.createDate = format(i.createDate, 'YYYY-MM-DD')
          return i
        })
        this.getTargetVersionsList()
      },
      fetchEveryVersionRDetail() {
        this.$services.resource.get('list', {
          params: {
            resourceIds: this.release.resourceVersions.map(r => r.resourceId).join(','),
            projection: 'aliasName,resourceId,resourceType,createDate,intro,previewImages',
          }
        })
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              const map = {}
              res.data = res.data.forEach(resource => map[resource.resourceId] = resource)
              this.release.resourceVersions = this.release.resourceVersions.sort(versionDescendingOrder).map(resource => {
                resource = Object.assign(resource, map[resource.resourceId])
                resource.createDate = format(resource.createDate, 'YYYY-MM-DD')
                return resource
              })
              this.getTargetVersionsList()
            }else {
              this.$message({ type: 'error', message: res.msg })
            }
          })
          .catch(e => this.$message({ type: 'error', message: e.toString() }))
      },
      getTargetVersionsList() {
        if(this.isShowAllVersions) {
          this.targetVersionsList = this.release.resourceVersions.slice()
        }else {
          this.targetVersionsList = this.release.resourceVersions.slice(0, 3)
        }
      },
      getNewVersion() {
        let [ fN, sN, tN ] = this.release.latestVersion.version.split('.')
        tN = +tN + 1
        return `${fN}.${sN}.${tN}`
      },
      tapMoreBtn() {
        this.isShowAllVersions = !this.isShowAllVersions
      },
      updateResolvedReleases(resolvedReleases) {
        this.resolvedReleases = resolvedReleases
      },
      cancelAddRelease() {
        // this.$router.go(-1)
        this.$router.push(`/resource/editor/${this.resourceDetail.resourceId}`)
      },
      saveReleaseVersion() {
        this.$axios.post(`/v1/releases/${this.releaseId}/versions`, {
          resourceId: this.resourceId,
          version: this.newVersion,
          resolveReleases: this.resolvedReleases,
        })
          .then(res => res.data)
          .then(res => {
            if(res.errcode === 0) {
              this.$router.replace(`/release/edit/${this.releaseId}`)
            }else {
              this.$error.showErrorMessage(res.msg)
            }
          })
      },
    },
    created() {
      this.fetchReleaseDetail()
      this.fetchResourceDetail()
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import '../../../styles/variables.less';

  .r-a-w-version, .r-a-w-scheme {
    background-color: #FAFBFB;
    h4 {
      position: relative; padding: 10px 10px 10px 20px; font-weight: 400;
      &:after {
        content: '';
        position: absolute; top: 50%; left: 10px; z-index: 5;
        width: 3px; height: 12px; background-color: #333;
        transform: translateY(-50%);
      }
    }
  }

  .r-a-w-scheme{
    .r-a-w-s-line { margin: 0 10px; padding: 5px 0; border-top: 1px solid #EBEBEB; }
  }

  .r-a-w-version {
    .r-a-w-v-current, .r-a-w-v-list {
      padding: 10px;
      label {
        display: inline-block; width: 72px;
      }
    }
    .r-a-w-v-current {
      display: flex; align-items: center;

      .el-input { width: 170px; margin-right: 30px; }
    }

    .r-a-w-v-list {
      label{ float: left; padding: 10px 0; }
      .raw-v--ul {
        .raw-v--li-box, .raw-v--li-name {
          overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
          display: inline-block; margin-bottom: 10px;
          span { display: inline-block; padding: 0 5px; }
        }
        .raw-v--li-box {
          width: 200px; line-height: 40px;
          .raw-v--li-version { width: 58px; color: #333; }
          .raw-v--li-date { width: 80px; color: #999; }
        }
      }

      .r-a-w-v-l-more {
        display: inline-block; margin-bottom: 5px; padding: 8px 10px; cursor: pointer;
        color: #888;
        &:hover { background-color: #f5f7fa; color: #333; }
      }
    }

    .raw-v--li-name {
      width: 300px; padding: 5px; line-height: 30px;
      background-color: #fff;
      img { float: left; width: 40px; height: 30px; margin-right: 5px; }
      span { display: inline-block; }
    }
  }

  .r-a-w-footer {
    padding: 20px 10px;
    background-color: #FAFBFB; text-align: center;

    &.no-scheme { padding-left: 60px; text-align: left; }
    .r-a-w-cancel-btn, .r-a-w-save-btn {
      display: inline-block; cursor: pointer;
      padding: 9px 32px; border-radius: 20px;
      font-size: 14px;
    }
    .r-a-w-cancel-btn {
      color: #999;
    }

    .r-a-w-save-btn {
      background: #409EFF; color: #fff;
    }
  }
</style>
<style lang="less" type="text/less">
  .release-add-wrapper {
    .r-a-w-version {
      .el-input__inner { height: 32px; line-height: 32px; }
    }
    .r-a-w-v-list {
      .el-table {
        .cell { white-space: nowrap; color: #888; }
        tr { background-color: #FAFBFB; }
        td { border-bottom-width: 0; }
      }
    }
  }

</style>
