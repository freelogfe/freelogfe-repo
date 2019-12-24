<i18n src="./resource-list.i18n.json"></i18n>
<template>
  <section class="my-resources">
    <div class="m-r-header clearfix">
      <div class="right-tool-bar-wrap">
        <search-input @search="searchHandler" showInputImmediately></search-input>
      </div>
      <router-link to="/resource/editor">
        <el-button size="medium" type="primary" class="m-r-create-btn">{{$t('createBtnText')}}</el-button>
      </router-link>
    </div>

    <resource-items-list :query="queryInput" @release="showReleaseDialog"></resource-items-list>

    <el-dialog width="750px"
               top="10vh"
               center
               :visible.sync="isShowReleaseSearchDialog">
      <release-search
        :release-source="targetReleaseResource"
        :tabLayout="['my-release']"
        :historicalReleases="targetReleaseResource ? targetReleaseResource.releaseList : []"
        @add="releaseSearchHandler"></release-search>
      <div class="" slot="footer">
        <el-button round type="primary" class="create-release-btn" @click="createNewRelease">{{$t('createNewReleaseText')}}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import SearchInput from '@/components/SearchInput/index.vue'
import CONFIG from '@/config/index'
import ResourceItemsList from './list.vue'
import ReleaseSearch from '@/views/release/search/index.vue'

const { RESOURCE_STATUS } = CONFIG

export default {
  name: 'resource-list',
  data() {
    return {
      resourceList: [],
      RESOURCE_STATUS,
      queryInput: '',
      isShowReleaseSearchDialog: false,
      targetReleaseResource: null,
    }
  },
  components: {
    ResourceItemsList,
    SearchInput,
    ReleaseSearch
  },

  mounted() {

  },
  methods: {
    searchHandler(str) {
      this.queryInput = str
      // this.$message.warning('todo')
    },
    showReleaseDialog(resource) {
      this.isShowReleaseSearchDialog = true
      this.targetReleaseResource = resource
    },
    releaseSearchHandler(release) {
      this.$router.push(`/release/add?releaseId=${release.releaseId}&resourceId=${this.targetReleaseResource.resourceId}`)
    },
    // 创建一个全新的发行
    createNewRelease() {
      // 跳转 发行中间页
      this.$router.push(`/release/create?resourceId=${this.targetReleaseResource.resourceId}`)
    },
  }
}

</script>

<style lang="less" scoped>
  @import '../../../styles/variables.less';
  .my-resources {
    width: @main-content-width-1190;
    margin: auto;
    padding-top: 30px;
    padding-left: 50px;
    .el-dialog__header{ padding: 0; }
  }
  .m-r-header {
    margin-bottom: 28px; text-align: right;
    .m-r-create-btn {
      width:120px; margin-left: 20px; border-radius: 2px;
    }
    .right-tool-bar-wrap {
      display: inline-block;
    }
  }
  @media screen and (max-width: 1250px){
    .my-resources {
      width: @main-content-width-990;
    }
  }
</style>
<style lang="less">
  .my-resources {
    .el-dialog__header{
      padding: 0;
      .el-dialog__headerbtn { z-index: 100; }
    }
  }
</style>

