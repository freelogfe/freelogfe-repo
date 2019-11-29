<i18n src="./detail.i18n.json"></i18n>
<template>
  <div class="r-d-w-r-sign">
    <h4>{{$t('signConfirm.title1')}}</h4>
    <div class="r-d-w-r-node">
      {{checkedNodeName}}
    </div>
    <h4>{{$t('signConfirm.title2')}}</h4>
    <div class="r-d-w-r-s-releases" >
      <div class="rdwr-s-r-item" v-for="(item, index) in release.selectedPolicies" :key="'s-p-'+index">
        <span class="rdwr-s-r-item-name">{{release.releaseName}}</span>
        <span class="rdwr-s-r-item-policy">
          {{item.policyName}}
        </span>
      </div>
      <div v-for="buRelease in baseUpcastReleasesList" :key="buRelease.releaseId">
        <div class="rdwr-s-r-item" v-for="(item, index) in buRelease.selectedPolicies" :key="'s-p-'+index">
          <span class="rdwr-s-r-item-name">{{buRelease.releaseName}}</span>
          <span class="rdwr-s-r-item-policy">
            {{item.policyName}}
          </span>
        </div>
      </div>
    </div>
    <div class="rdwr-s-btn-group">
      <el-button class="rdwr-s-btn rdwr-s-btn-cancel" @click="cancel">{{$t('btns.cancel')}}</el-button>
      <el-button type="primary" class="rdwr-s-btn rdwr-s-btn-sign" :disabled="!checkedNodeId" @click="authSign">{{$t('btns.sign')}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "release-detail-signed-confirm",
  props: {
    checkedNodeId: Number,
    checkedNodeName: String,
    release: Object,
    baseUpcastReleasesList: Array,
  },
  methods: {
    cancel() {
      this.$emit('cancel-sign')
    },
    authSign() {
      this.$emit('auth-signed')
    }
  },
}
</script>

<style lang="less" type="text/less" scoped>
.r-d-w-r-sign {
  overflow: auto; max-height: 520px;
  margin: 0 20px; padding: 25px 20px; border-top: 1px solid #DDDDDD;

  h4 {
    margin-bottom: 10px;
    font-size: 14px; font-weight: 600; color: #333;

    a {
      display: inline-block;
      width: 26px; height: 20px; line-height: 20px; margin-left: 5px; border-radius: 10px;
      color: #fff; background-color: #409EFF; text-align: center;
    }
  }
  .r-d-w-r-node { overflow: hidden; margin-left: 60px; margin-bottom: 15px; }
  
  .r-d-w-r-s-releases {
    margin: 0 50px 25px 60px;
    font-size: 14px; font-weight: 500; color: #333;
    .rdwr-s-r-item { overflow: hidden; margin: 10px 0; line-height: 22px; }
    .rdwr-s-r-item-policy {
      float: right;
      margin: 0 0 0 8px; padding: 0 6px; border: 1px solid #A5D1FF; border-radius: 2px;
      font-size: 12px; background-color: #E9F4FF; color: #248fff;
    }
  }
  .rdwr-s-btn-group {
    text-align: center;

    .rdwr-s-btn { width: 110px; padding: 8px 10px; border-width: 0; }
    .rdwr-s-btn-cancel { color: #999;  }
    .rdwr-s-btn-sign { border-radius: 4px; }
  }
}
</style>