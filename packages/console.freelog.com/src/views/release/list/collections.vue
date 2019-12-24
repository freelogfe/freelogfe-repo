<i18n src="./release-list.i18n.json"></i18n>
<template>
  <section class="my-collections">
    <div class="m-c-header clearfix">
      <div class="right-tool-bar-wrap">
        <search-input @search="searchHandler" showInputImmediately></search-input>
      </div>
      <router-link :to="releasesMarketLink">
        <el-button size="medium" type="warning" class="m-c-go-to-market">{{$t('goToMarket')}}</el-button>
      </router-link>
    </div>
    <release-items-list type='myCollections' :query="queryInput"></release-items-list>
  </section>
</template>

<script>
import SearchInput from '@/components/SearchInput/index.vue'
import ReleaseItemsList from './list.vue'

export default {
  name: 'release-collections',
  data() {
    return {
      resourceList: [],
      queryInput: '',
      releasesMarketLink: '/'
    }
  },
  components: {
    ReleaseItemsList,
    SearchInput,
  },

  methods: {
    searchHandler(str) {
      this.queryInput = str
    },
  },

  mounted() {
  },
}
</script>

<style lang="less" scoped>
  @import '../../../styles/variables.less';
  .my-collections {
    width: @main-content-width-1190;
    margin: auto;
    padding-top: 30px;
    padding-left: 50px;
  }
  .m-c-header {
    margin-bottom: 28px; text-align: right;
    .m-c-go-to-market {
      width: 120px; margin-left: 20px; border-radius: 2px; border-color: #F6BE25;
      background-color: #F6BE25; color: #fff;
    }
    .right-tool-bar-wrap {
      display: inline-block;
    }
  }
  @media screen and (max-width: 1250px){
    .my-collections {
      width: @main-content-width-990;
    }
  }
</style>
