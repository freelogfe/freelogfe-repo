<template>
  <div class="release-item">
    <div class="r-i-name">{{release.releaseName}}</div>
    <div class="r-i-row">
      <span class="r-i-type">{{release.resourceType | pageBuildFilter}}</span>
      <span v-if="!!release.latestVersion" class="r-i-version">{{release.latestVersion && release.latestVersion.version}}</span>
      <span class="r-i-date">{{release.updateDate | fmtDate}}</span>
      <strong v-if="isHistoricalRelease">{{$t('search.historicVersion')}}</strong>
    </div>
    <el-button class="add-release-btn" :class="{ 'disabled': isHistoricalRelease }" @click="addToRelease">{{$t('search.addBtn')}}</el-button>
  </div>
</template>


<script>
  export default {
    name: 'release-item',
    props: {
      release: {
        type: Object,
        default() {
          return {}
        }
      },
      type: String,
      historicalReleaseIds: {
        type: Array,
        default() { return [] }
      }
    },
    computed: {
      isHistoricalRelease() {
        return this.historicalReleaseIds.indexOf(this.release.releaseId) !== -1
      }
    },
    methods: {
      addToRelease() {
        if(!this.isHistoricalRelease) {
          this.$emit('add', this.release)
        }
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .release-item {
    position: relative;
    padding: 8px 0; border-bottom: 1px solid #E1E1E1;

    .r-i-name {
      overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
      padding-right: 70px; font-size: 18px; color: #333;
    }

    .r-i-row {
      span {
        font-size: 13px; color: #999;
        &:not(:first-child) {
          margin-left: 5px; padding-left: 5px; border-left: 1px solid #999;
        }
      }
      strong {
        display: inline-block; margin-left: 10px; padding: 0 8px; border-radius: 12px;
        font-size: 12px; background-color: #409EFF; color: #fff;
        transform: scale(.8);
      }
    }

    .add-release-btn {
      position: absolute; top: 50%; right: 0; z-index: 1;
      padding: 8px 16px; border-radius: 16px; border-width: 0;
      font-size: 12px; font-weight: 400; background-color: #409EFF; color: #fff;
      transform: translateY(-50%);

      &.disabled {
        opacity: .3; cursor: not-allowed;
      }
    }
  }


</style>
