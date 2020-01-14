<i18n src="./edit.i18n.json"></i18n>
<template>
  <div class="release-editor-wrapper" v-if="release !== null">
    <release-editor-layout :release.sync="release" :selectedVersion="selectedVersion" type="edit">
      <template slot="about-version">
        <div class="r-e-w-v-box">
          <div class="re-wvb-header clearfix">
            <div class="rew-v-selector">
              <div class="rew-v-version-box">
                <span class="rew-v-b-version">{{$t('version')}}{{release.resourceVersions[selectedVersionIndex].version}}</span>
                <span class="rew-v-b-name">
                  <router-link
                          target="_blank"
                          :to="`/resource/detail/${release.resourceVersions[selectedVersionIndex].resourceId}`">{{release.resourceVersions[selectedVersionIndex].aliasName}}
                    </router-link>
                  | {{release.resourceVersions[selectedVersionIndex].createDate | fmtDate}}</span>
                <i class="el-icon-arrow-down" :class="{'visible': isVersionSelectorVisible}"></i>
              </div>
              <div class="rew-v-list">
                <ul>
                  <li class="rew-v-l-item"
                      :class="{'selected': item.version === selectedVersion}"
                      v-for="(item, index) in release.resourceVersions"
                      :key="'rew-v-l-item-'+item.version"
                      @click.stop="exchangeVersion(item, index)">
                    <i class="el-icon-check"></i>
                    <span class="rew-v-li-version">{{item.version}}</span>
                    <span class="rew-v-li-name">{{item.aliasName}}</span>
                    <span class="rew-v-li-date">{{item.createDate | fmtDate}}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="r-e-w-v-add-btn" @click="showResourceDialog">{{$t('addBtnText')}}</div>
          </div>
          <div class="r-e-w-v-scheme" v-if="depReleasesList.length > 0">
            <el-tabs v-model="vTabActiveName" type="card" :closable="false" @tab-click="exchangeVTab">
              <el-tab-pane :label="$t('authManagement')" name="scheme">
                <scheme-manage
                        type="edit"
                        :release="release"
                        :baseUpcastReleases="release.baseUpcastReleases"
                        :depReleasesList="depReleasesList"
                        :depReleasesDetailList.sync="depReleasesDetailList"
                        :releasesTreeData.sync="releasesTreeData"
                        @update-resolved-releases="updateResolvedReleases"
                        @update-release-scheme="updateReleaseScheme"
                        @policy-sign-immediately="signedImmediately"
                        :contracts.sync="contracts"
                ></scheme-manage>
              </el-tab-pane>
              <el-tab-pane :label="$t('contract')" name="contract">
                <release-editor-contract
                        :release="release"
                        :depReleasesDetailList="depReleasesDetailList"
                        :contracts="contracts"
                ></release-editor-contract>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </template>
    </release-editor-layout>
    <el-dialog
            class="r-e-w-search-dialog"
            center
            :title="$t('dialogTitle')"
            width="640px"
            :visible.sync="resourceDialogVisible"
    >
      <resource-search :searchResourceType="release.resourceType" @select-resource="addNewVersion"></resource-search>
    </el-dialog>
  </div>
</template>

<script>
  import ReleaseEditor from './index.js'
  export default ReleaseEditor
</script>

<style lang="less" type="text/less" scoped>
  @import '../../../styles/variables.less';

  .release-editor-wrapper {
    .r-e-w-v-box {
      .cont { padding: 20px 0; }
      .r-e-w-v-list { padding: 20px 0; }

      .el-select { width: 140px; margin-right: 40px; }

      .r-e-w-v-scheme {
        position: relative;
        padding-top: 5px;
      }
    }

    .re-wvb-header {
      .rew-v-selector {
        position: relative; display: inline-block;
        &:hover {
          .rew-v-list{ display: block; }
          .el-icon-arrow-down { transform: rotate(180deg); }
        }

        .rew-v-version-box {
          line-height: 34px; font-size: 14px; font-weight: 600; color: #333; cursor: pointer;
          span { display: inline-block; }
          .rew-v-b-name {
            a {
              color: #333;
              &:hover { text-decoration: underline; }
            }
          }
          .rew-v-b-version { width: 100px; }
          .el-icon-arrow-down {
            margin-left: 15px;
            font-size: 14px; font-weight: 600; transition: all .3s;
            transition: all .3s;
          }
        }

        .rew-v-list {
          display: none;
          position: absolute; top: 34px; left: 0; z-index: 20;
          width: 430px; border-radius:4px;
          background: #fff; box-shadow:0px 4px 7px 0px rgba(0,0,0,0.3);
        }
        .rew-v-l-item {
          margin: 15px 20px; line-height: 20px; cursor: pointer;
          .el-icon-check { font-size: 14px; font-weight: 600;  color: #fff; transform: translateY(-4px); }
          span{
            display: inline-block;
            overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
            padding: 0 8px; font-size: 14px; color: #999;
            &.rew-v-li-version { width: 70px; }
            &.rew-v-li-name { position: relative; width: 160px;
              &:before {
                content: '';
                position: absolute; right: 0; top: 50%; z-index: 5; transform: translateY(-50%);
                width: 1px; height: 14px;
                background-color: #999;
              }
            }
          }
          &.selected {
            .el-icon-check { color: #409EFF; }
            span {
              font-weight: 600; color: #333;
              &.rew-v-li-name {
                &:before { width: 2px; background-color: #333; }
              }
            }
          }
        }
      }

      .r-e-w-v-add-btn {
        float: right; cursor: pointer;
        width: 120px; padding: 8px; border-radius: 2px;
        font-size: 12px; background-color: #FAFBFB; color: #409EFF; text-align: center;
        &:hover {
          background-color: #F5F5F5; color: #1287ff;
        }
        &.disabled { opacity: .7; cursor: not-allowed; pointer-events: none; }
      }
    }
  }
  .r-e-w-footer {
    padding: 20px 10px;
    background-color: #FAFBFB; text-align: center;

    &.no-scheme { padding-left: 60px; text-align: left; }
    .r-e-w-cancel-btn, .r-e-w-save-btn {
      display: inline-block; cursor: pointer;
      padding: 9px 32px; border-radius: 20px;
      font-size: 14px;
    }
    .r-e-w-cancel-btn {
      color: #999;
    }

    .r-e-w-save-btn {
      background: #409EFF; color: #fff;
      &.disabled{
        opacity: .5; cursor: not-allowed;
      }
    }
  }
</style>

<style lang="less" type="text/less">
  .release-editor-wrapper {
    .r-e-w-v-box {
      .el-input__inner{ height: 34px; line-height: 34px; }
      .el-tabs {
        margin-top: 20px;
        .el-tabs__header { margin: 0; }
        .el-tabs__nav-wrap {
          &:after {
            display: none;
          }
        }
        .el-tabs__nav { border-width: 0; }
        .el-tabs__item {
          padding: 0 40px; border-width: 0;
          &.is-active {
            border-bottom: 2px solid #409eff; background-color: #FAFBFB;
          }
        }
        .el-tabs__content { overflow: visible; }
      }
    }

    .r-e-w-search-dialog {
      .el-dialog__body {
        overflow: auto;
        height: 300px; margin: 0 20px; padding: 20px 45px 0; border-top: 1px solid #D8D8D8;

        .el-input__inner { padding-left: 30px; }
      }
    }
  }

</style>
