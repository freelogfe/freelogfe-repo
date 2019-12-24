<template>
  <div class="release-item-info" :class="['release-item-theme-type-'+type]">
    <div class="release-item" :class="['release-state-' + release.status]">
      <img :src="previewImage | padImage"
           class="res-preview-img"
           :class="{'resource-default-preview':!previewImage}"
           @click="gotoDetail(resource)"
           alt="">
      <template v-if="type === 'self'">
        <div class="res-intro-detail">
          <div class="res-intro-bd">
            <p>
              <span class="res-name" @click="gotoDetail(resource)">{{release.releaseName}}</span>
              <span class="res-type">#{{release.resourceType | pageBuildFilter}}</span>
            </p>
            <p class="res-id">{{release.releaseId}}</p>
          </div>
          <div class="res-intro-ft">
            <span class="update-time">{{$t('listResourceItem.lastUpdateText')}}{{release.updateDate|fmtDate}}</span>
            <!--<span style="margin-left: 6px" v-if="release._statusInfo">状态：{{release._statusInfo.desc}}</span>-->
          </div>
        </div>

        <router-link
                class="res-nav-btn"
                :to="_goToDetailLink"
                v-if="release.policies.length > 0 && _goToDetailLink">{{$t('listReleaseItem.detail')}}
        </router-link>
        <router-link
                class="res-nav-btn"
                :to="_goToMangeDetailLink"
                v-if="_goToMangeDetailLink">{{$t('listReleaseItem.manageDetail')}}
        </router-link>
      </template>
      <template v-else>
        <div class="simple-res-view" @click="gotoDetail(release)">
          <div class="res-intro-bd">
            <span class="res-desc">{{release.releaseName}}</span>
            <span class="res-type">#{{release.resourceType | pageBuildFilter}}</span>
          </div>
          <div class="res-intro-ft">
            <span class="update-time">{{$t('listResourceItem.lastUpdateText')}}{{release.updateDate|fmtDate}}</span>
            <span style="margin-left: 6px" v-if="release._statusInfo">{{$t('listResourceItem.state')}}{{resource._statusInfo.desc}}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>


<script>
  import {onloadUserInfo} from '@/data/user/loader'
  import {RESOURCE_STATUS, RESOURCE_STATUS_MAP} from '@/config/resource'

  export default {
    name: 'release-item-info',

    data() {
      return {
        RESOURCE_STATUS_MAP
      }
    },

    components: {},
    props: {
      release: {
        type: Object,
        default() {
          return {}
        }
      },
      type: {
        type: String,
        default: 'list'
      },
      navTo: Function
    },

    computed: {
      previewImage() {
        return (this.release.previewImages && this.release.previewImages[0]) || ''
      },
      _goToDetailLink(){
        var editLink = `/release/detail/${this.release.releaseId}?version=${this.release.latestVersion.version}`
        return this.release.releaseId? editLink : ''
      },
      _goToMangeDetailLink() {
        return `/release/edit/${this.release.releaseId}`
      },
    },

    watch: {
      'release.releaseId'() {
        this.format(this.release)
      }
    },

    mounted() {
      this.format(this.release)
    },

    methods: {
      format(resource) {
        if (!this.release.releaseId) {
          return
        }

        resource._statusInfo = RESOURCE_STATUS[resource.status]
      },
      gotoDetail(resource) {
        if (typeof this.navTo === 'function') {
          this.navTo(resource)
        } else {
          this.$router.push(`/resource/detail/${resource.releaseId}`)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "index.less";
</style>
