<i18n src="./scheme.i18n.json"></i18n>
<template>
  <div
          class="r-dependencies-item"
          :class="{ 'second-level': isScondLevel, 'active': isActive }"
          @click="exchangeSelectedRelease(release)"
  >
    <div class="r-item-cont">
      <p class="r-name" :class="[resolveStatus]">
        <i class="el-icon-top" v-if="!hideUpcastIcon"></i>
        {{release.releaseName}}
        <router-link :to="`/release/detail/${release.releaseId}?version=${release.latestVersion.version}`" target="_blank" v-if="release && release.latestVersion">
          {{$t('detail')}}
        </router-link>
      </p>
      <div class="r-info">
        <span>{{release.resourceType | pageBuildFilter}}</span>
        <span>{{release.latestVersion && release.latestVersion.version}}</span>
        <span>{{release.updateDate | fmtDate }}</span>
      </div>
      <div class="r-policies">
        <template v-if="!release.isUpcasted">
          <div
            class="r-p-item"
            :class="{'disabled': p.contractId && p.isEnbledContract === false, 'isHasContract': !!p.contractId }"
            v-for="(p, index) in selectedPolicies"
            :key="'s-policy-'+index"
          >
            {{p.policyName}}
            <span :class="['contract-status', 'status-' + contractsMap[p.contractId].status]" v-if="contractsMap && contractsMap[p.contractId]"></span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'depend-item',
    props: {
      contractsMap: Object,
      release: Object,
      resolveStatus: String,
      isScondLevel: Boolean,
      isActive: Boolean,
      hideUpcastIcon: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        selectedPolicies: this.release.selectedPolicies       // 如果使用computed，则不能观测到release.selectedPolicies的变化
      }
    },
    updated() {
      this.selectedPolicies = this.release.selectedPolicies
    },
    methods: {
      exchangeSelectedRelease(item) {
        this.$emit('exchange-item', item)
      }
    },
  }
</script>

<style lang="less" type="text/less" scoped>
  .r-dependencies-item {
    cursor: pointer;
    &.active {
      border-top-left-radius: 4px; border-bottom-left-radius: 4px; background-color: #fff;
    }

    .r-item-cont {
      padding: 10px 0; overflow: hidden;
    }

    .r-name, .r-info, .r-policies { padding-left: 20px; }
    .r-name {
      position: relative;
      margin-bottom: 6px;
      font-size: 14px; font-weight: 500;

      i {
        position: absolute; left: 0; top: 54%; z-index: 1;
        transform: translateY(-50%); color: transparent;
      }

      a {
        font-size: 12px; color: #91C7FF; text-decoration: underline;
      }

      &.no-resolve, &.resolved{
        i {
          width: 12px; height: 12px; border-radius: 50%; overflow: hidden;
          font-size: 12px;
        }
      }
      // &.no-resolve{
      //   i { background-color: #FFBD28; color: #FFBD28; }
      // }
      // &.resolved{
      //   i { background-color: #84CCA8; color: #84CCA8; }
      // }
      &.upcast {
        i { color: #EA7171; font-weight: bold; }
      }
    }

    .r-info {
      margin-bottom: 6px;
      font-size: 12px; color: #999;
      span{
        padding-right: 5px;
        &:not(:first-child) {
          padding-left: 5px; border-left: 1px solid #999;
        }
      }
    }

    .r-policies {
      margin-right: 8px;
      .r-p-item {
        display: inline-block;
        margin: 0 8px 8px 0; padding: 2px 10px; border: 1px solid #A5D1FF; border-radius: 2px;
        background-color: #E9F4FF; color: #248fff;
        &.isHasContract {
          border-color: #E7E7E7;
          background-color: #FAFBFB; color: #999;
        }
        .contract-status {
          display: inline-block; width: 8px; height: 8px; margin-left: 2px; border-radius: 50%;
          &.status-2 { background-color: #FBB726; }
          &.status-4 { background-color: #39C500; }
          &.status-6 { background-color: #E35A5F; }
        }
        &.disabled { opacity: .5; }
      }
    }

    &.second-level {
      padding: 0 0 0 40px; cursor: pointer;
      &.active {  border-top-left-radius: 4px; border-bottom-left-radius: 4px; background-color: #fff; }
      .r-name { font-size: 14px; }
      .r-policies { border-width: 0; }
    }
  }
</style>
