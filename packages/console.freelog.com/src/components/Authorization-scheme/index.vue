<template>
  <div
          v-loading="isShowLoading"
          class="authorization-scheme-box"
          :style="[ boxStyle ]"
  >
    <div
            class="auth-s-b-content"
            :style="[ contentBoxStyle ]"
    >
      <div
              class="scheme-partition"
              v-for="(resourceAuthScheme, index) in currentOpenedResources"
              :key="'resource' + index"
      >
        <div class="upcast-resource-head" v-if="currentOpenedResources.length > 1 || authType === 'resource'">
          <h3>{{resourceAuthScheme.resourceName}}</h3>
          <div>
            <span>{{resourceAuthScheme.userName}}</span>
            <span>{{resourceAuthScheme.updateDate|fmtDate}}</span>
            <span>{{resourceAuthScheme.resourceType | pageBuildFilter}}</span>
          </div>
        </div>
        <div
                class="s-p-resolve-btn"
                :class="{'s-p-no-resolve': resourceAuthScheme.isNoResolved}"
                v-if="authType === 'resource'"
                @click="toggleResolveResource(resourceAuthScheme, index)">
          {{$t('components.authScheme.notHandleResource')}}
        </div>
        <scheme-detail
                :authType="authType"
                :isCanUpdateContract.sync="isCanUpdateContract"
                :resourceAuthScheme="resourceAuthScheme"
                :currentOpenedResources="currentOpenedResources"
                :resourceLevelIndex="index"
                :resourceMap="resourceMap"
                :authSchemeIdentityAuthMap="authSchemeIdentityAuthMap"
                :selectedAuthSchemeTabIndex.sync="resourceAuthScheme.selectedAuthSchemeTabIndex"
                :activeAuthSchemeTabIndex.sync="resourceAuthScheme.activeAuthSchemeTabIndex"
                :checkIsCanExchangeSelection="checkIsCanExchangeSelection"
                @show-upcast-resource-scheme="showUpcastResourceScheme"
                @refresh-opened-resource="refreshCurrentOpenedResource"
                @refresh-selected-auth-schemes="refreshSelectedAuthSchemes"
                @cancel-scheme-selection="cancelSomeURSchemeSelection"
        ></scheme-detail>
        <div class="s-p-mask" v-if="resourceAuthScheme.isNoResolved"></div>
      </div>
    </div>

    <div class="auth-s-b-nav" v-if="isShowNavBar">
      <div
              class="auth-s-b-n-btn prev"
              :class="{ 'disabled': contentBoxTX >= maxTX }"
              @click="contentScroll('left')">
        <span class="el-icon-arrow-left"></span>
      </div>
      <div
              class="auth-s-b-n-btn next"
              :class="{ 'disabled': contentBoxTX === 0 }"
              @click="contentScroll('right')">
        <span class="el-icon-arrow-right"></span>
      </div>
    </div>
    <div class="asb-footer" v-if="isShowFooter">
      <div
              class="update-btn"
              :class="{'active': true}"
              @click="signContract(isCanUpdateContract)">
        {{presentableInfo.contracts.length ? $t('components.authScheme.updateContract') : $t('components.authScheme.createContract')}}
      </div>
    </div>
    <scheme-suspension-ball
            :isShow="authType === 'presentable'"
            :selectedAuthSchemes="selectedAuthSchemes"
            :unResolveAuthResources="unResolveAuthResources"
    ></scheme-suspension-ball>
    <scheme-sign-dialog
            v-if="authType ==='presentable'"
            :authType="authType"
            :visible.sync="isShowDialog"
            :resolvedDutyStatements="selectedAuthSchemes"
            :presentableId="presentableInfo.presentableId"
            @done="afterSginContract"
    ></scheme-sign-dialog>
    <!--<div class="asb-scroll-guide-box" v-if="isScrollBar && this.currentOpenedResources.length > 2">-->
      <!--<div class="red-bar" :style="redBarStyle"></div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import authorizationSchememManage from './index'

  export default authorizationSchememManage
</script>

<style lang="less" scoped>
  @import "index.less";
</style>
