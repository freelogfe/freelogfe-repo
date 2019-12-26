<i18n src="./release-list.i18n.json"></i18n>
<template>
  <section class="my-releases">
    <div class="m-r-header clearfix">
      <div class="right-tool-bar-wrap">
        <el-input class="search-input" size="medium" ref="input" v-model="searchInputStr"
          :class="{ 'focus': isInputFocus }"
          :style="{width: '300px'}"
          @focus="focusHandler"
          @blur="blurHandler"
          @keyup.enter.native="searchHandler(searchInputStr)">
          <i class="freelog fl-icon-content" :slot="isInputFocus ? 'suffix' : 'prefix'" @click="searchHandler(searchInputStr)"></i>
        </el-input>
      </div>
      <el-button size="medium" type="primary" class="m-r-create-btn" @click="resourceDialogVisible = true">{{$t('createBtnText')}}</el-button>
    </div>
    
    <release-items-list type="myReleases" :query="queryInput"></release-items-list>

    <el-dialog
            class="my-r-search-dialog"
            center
            :title="$t('dialogTitle')"
            width="640px"
            :visible.sync="resourceDialogVisible"
    >
      <resource-search @select-resource="createNewRelease"></resource-search>
    </el-dialog>
  </section>
</template>

<script>

import ResourceSearch from '@/views/resource/search/search.vue'
import SearchInput from '@/components/SearchInput/index.vue'
import ReleaseItemsList from './list.vue'

export default {
  name: 'release-list',
  data() {
    return {
      resourceList: [],
      curTabName: 'self',
      queryInput: '',
			searchInputStr: '',
			isInputFocus: false,
      resourceDialogVisible: false,
    }
  },

  components: {
    ReleaseItemsList,
    SearchInput,
    ResourceSearch
  },

  methods: {
		focusHandler() {
			this.isInputFocus = true
		},
		blurHandler() {
			this.isInputFocus = false
		},
    searchHandler(str) {
      this.queryInput = str
    },
    createNewRelease(resource) {
      this.$router.push(`/release/create?resourceId=${resource.resourceId}`)
    },
  },

  mounted() {
  },
}
</script>

<style lang="less" scoped>
  @import '../../../styles/variables.less';
  .my-releases {
    width: @main-content-width-1190;
    margin: auto;
    padding-top: 30px;
  }
  .m-r-header {
    margin-bottom: 28px; text-align: right;
    .m-r-create-btn {
      width: 120px; margin-left: 18px; border-radius: 2px;
    }
    .right-tool-bar-wrap {
      display: inline-block;
    }
  }
  @media screen and (max-width: 1250px){
    .my-releases {
      width: @main-content-width-990;
    }
  }
</style>

<style lang="less">
.my-r-search-dialog {
  .el-dialog__body {
    overflow: auto;
    height: 300px; margin: 0 20px; padding: 20px 45px 0; border-top: 1px solid #D8D8D8;

    .el-input__inner { padding-left: 30px; }
  }
}

</style>

