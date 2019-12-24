<template>
  <div class="resource-item-info" :class="['resource-item-theme-type-'+type]">
    <div class="resource-item" :class="['resource-state-'+resource.status]">
      <img :src="previewImage | padImage"
           class="res-preview-img"
           :class="{'resource-default-preview':!previewImage}"
           @click="gotoDetail(resource)"
           alt="">
      <template v-if="type === 'self'">
        <div class="res-intro-detail">
          <div class="res-intro-bd">
            <p>
              <span class="res-name" @click="gotoDetail(resource)">{{resource.aliasName}}</span>
              <span class="res-type">#{{resource.resourceType | pageBuildFilter}}</span>
            </p>
            <p class="res-id">{{resource.resourceId}}</p>
          </div>
          <div class="res-intro-ft">
            <span class="update-time">{{$t('listResourceItem.lastUpdateText')}}{{resource.updateDate|fmtDate}}</span>
            <!--<span style="margin-left: 6px" v-if="resource._statusInfo">状态：{{resource._statusInfo.desc}}</span>-->
          </div>
        </div>

        <router-link :to="_detailInfoLink"
                     v-if="_detailInfoLink" class="res-nav-btn">{{$t('listResourceItem.detail')}}
        </router-link>
        <!--<router-link :to="_editSchemeLink"-->
                     <!--v-if="_editSchemeLink" class="res-nav-btn">{{$t('listResourceItem.schemes')}}-->
        <!--</router-link>-->

        <!--<ResourceButton class="res-act-btn" :resource="resource"></ResourceButton>-->
      </template>
      <template v-else>
        <div class="simple-res-view" @click="gotoDetail(resource)">
          <div class="res-intro-bd">
            <span class="res-desc">{{resource.resourceName}}</span>
            <span class="res-type">#{{resource.resourceType | pageBuildFilter}}</span>
          </div>
          <div class="res-intro-ft">
            <span class="update-time">{{$t('listResourceItem.lastUpdateText')}}{{resource.updateDate|fmtDate}}</span>
            <span style="margin-left: 6px" v-if="resource._statusInfo">{{$t('listResourceItem.state')}}{{resource._statusInfo.desc}}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>


<script>
  import {onloadUserInfo} from '@/data/user/loader'
  import {RESOURCE_STATUS, RESOURCE_STATUS_MAP} from '@/config/resource'
  import ResourceButton from '@/components/ResourceButton'

  export default {
    name: 'resource-info-item',

    data() {
      return {
        RESOURCE_STATUS_MAP
      }
    },

    components: {ResourceButton},
    props: {
      resource: {
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
        return (this.resource.previewImages && this.resource.previewImages[0]) || ''
      },
      _detailInfoLink(){
        var editLink = `/resource/detail/${this.resource.resourceId}`
        return this.resource.resourceId? `${editLink}` : ''
      },
      _editSchemeLink(){
        return this.resource.resourceId? `/resource/edit/${this.resource.resourceId}`: ''
      }
    },

    watch: {
      'resource.resourceId'() {
        this.format(this.resource)
      }
    },

    mounted() {
      this.format(this.resource)
    },

    methods: {
      format(resource) {
        if (!this.resource.resourceId) {
          return
        }

        resource._statusInfo = RESOURCE_STATUS[resource.status]
      },
      gotoDetail(resource) {
        if (typeof this.navTo === 'function') {
          this.navTo(resource)
        } else {
          this.$router.push(`/resource/detail/${resource.resourceId}`)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "index.less";
</style>
