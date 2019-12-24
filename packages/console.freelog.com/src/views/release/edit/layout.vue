<i18n src="./edit.i18n.json"></i18n>
<template>
  <div class="release-editor-layout" v-if="release !== null">
    <div class="r-e-l-header clearfix">
      <div class="r-e-l-main-content">
        <div class="preview-box">
          <UploadCover
            width="100"
            height="75"
            multiple
            :imageUrl="coverImageUrl"
            :textVisible="false"
            :onUploaded="uploadCoverSuccess"
          ></UploadCover>
          <!-- <img :src="release.previewImages[0]" alt="" :class="{'resource-default-preview':!release.previewImages[0]}" > -->
        </div>
        <div class="cont">
          <div class="r-e-l-name">
            <template v-if="!isEditingReleaseName">
              <router-link :to="`/release/detail/${release.releaseId}?version=${selectedVersion}`">
                {{release.releaseName}}
              </router-link>
              <!-- <span class="el-icon-edit-outline" @click="tapEditName"></span> -->
            </template>
            <template v-else>
              <el-input
                      autofocus
                      show-word-limit
                      type="text"
                      maxlength="100"
                      v-model="tmpReleaseName"
                      :placeholder="$t('namePlaceholder')"></el-input>
              <el-button size="small" round type="primary" class="r-e-l-name-save" @click="saveEditName">{{$t('saveBtnText')}}</el-button>
              <el-button size="small" round class="r-e-l-name-cancel" @click="cancelEditName">{{$t('cancelBtnText')}}</el-button>
            </template>
            <span class="r-e-l-version">{{selectedVersion || release.latestVersion.version}}</span>
            <div class="r-e-l-state" >
              <template v-if="releaseState === 1">
                {{$t('online')}}
              </template>
              <template v-else>
                <el-tooltip :content="releaseStateText" placement="bottom" effect="light">
                  <i class="el-icon-warning"></i>
                </el-tooltip>
                {{$t('notOnline')}}
              </template>
            </div>
          </div>
          <div class="r-e-l-info">
            <span class="r-i-type">{{release.resourceType | pageBuildFilter}}</span>
            <span class="r-i-date">{{release.updateDate | fmtDate}}</span>
            <span class="r-i-version">{{$t('releaseId')}} {{release.releaseId}}</span>
          </div>
          <div class="r-e-l-upcast" v-if="release.baseUpcastReleases.length > 0">
            <strong>{{$t('basicUpcast')}}</strong>
            <span
                    class="upcast-release-item"
                    v-for="(item, index) in release.baseUpcastReleases"
                    :key="'upcast-release-' + index"
            ><i class="el-icon-back"></i>{{item.releaseName}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="r-e-l-main-content">
      <div class="r-e-l-row r-e-l-release" :class="{ 'tuck-up': isTuckUpRelease }">
        <h3>{{$t('aboutRelease')}} <i class="el-icon-arrow-up" @click="isTuckUpRelease = !isTuckUpRelease"></i></h3>
        <div class="cont">
          <div class="r-e-w-release-intro">
            <h4>
              {{$t('releaseIntro')}}
              <div class="r-e-w-btn-group">
                <el-button type="primary" class="edit" size="mini" round v-if="!isEditingIntro && release.intro !== ''" @click="editIntroHandler">{{$t('editBtnText')}}</el-button>
                <template v-if="isEditingIntro">
                  <el-button type="primary" class="save" size="small" round @click="saveIntroHandler">{{$t('saveBtnText')}}</el-button>
                  <el-button class="cnacel" size="small" round @click="cancelEditHandler">{{$t('cancelBtnText')}}</el-button>
                </template>
              </div>
            </h4>
            <div class="r-e-w-edit-box" v-if="isEditingIntro">
              <el-input type="textarea" :rows="4" v-model="tempEditingIntro"></el-input>
            </div>
            <template v-else>
              <div class="r-e-w-edit-add-btn" v-if="release.intro === ''" @click="editIntroHandler">
                {{$t('addIntroBtnText')}}
              </div>
              <p v-else>{{release.intro}}</p>
            </template>
          </div>
          <div class="r-e-w-release-policy">
            <h4>
              {{$t('policy')}}
              <!-- <el-tooltip class="r-e-w-r-p-tip" effect="light" :content="$t('tips[0]')" placement="right" v-if="release.policies.length === 0 && !isShowEditPolicy">
                <i class="el-icon-warning"></i>
              </el-tooltip>
              <div class="r-e-w-btn-group" v-else>
                <el-button type="primary" class="add" size="mini" round v-if="!isShowEditPolicy"  @click="addPolicyHandler"><i class="el-icon-plus"></i></el-button>
                <template v-else>
                  <el-button type="primary" class="save" size="small" round @click="savePolicyHandler">{{$t('saveBtnText')}}</el-button>
                  <el-button class="cnacel" size="small" round @click="cancelPolicyHandler">{{$t('cancelBtnText')}}</el-button>
                </template>
              </div> -->
            </h4>
            <div style="position: relative;">
              <template v-if="!isShowEditPolicy">
                <div class="r-e-w-r-policy-add-btn" v-if="release.policies.length === 0"  @click="addPolicyHandler">
                  {{$t('addPolicyBtnText')}}
                </div>
                <div class="r-e-w-r-p-list" v-else>
                  <policy-list
                          :policyList="release.policies"
                          @add-policy="addPolicyHandler"
                          @update-policies="updatePolicies"
                  ></policy-list>
                </div>
              </template>
              <policy-editor
                      show-footer-btns
                      :policy="editTmpPolicy"
                      class="r-e-w-r-p-editor"
                      v-if="isShowEditPolicy"
                      @save="savePolicyHandler"
                      @cancel="cancelPolicyHandler"
              ></policy-editor>
            </div>
          </div>
        </div>
      </div>
      <div class="r-e-l-row r-e-l-r-version" :class="{ 'tuck-up': isTuckUpVersion }">
        <h3>{{$t('aboutVersion')}} <i class="el-icon-arrow-up" @click="isTuckUpVersion = !isTuckUpVersion"></i></h3>
        <div class="cont">
          <slot name="about-version"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UploadCover from '@/components/UploadCover/index.vue'
  import PolicyEditor from '@/components/PolicyEditor/index.vue'
  // import PolicyList from '@/components/PolicyList/list.vue'
  import PolicyList from '@/components/PolicyList/list/index.vue'
  import policy from "../../../services/policy"

  const defualtImageUrl = '//frcdn.oss-cn-shenzhen.aliyuncs.com/console/img/resource.d29ef4da.jpg'

  export default {
    name: 'release-editor-layout',
    components: {
      PolicyEditor, PolicyList, UploadCover,
    },

    props: {
      release: Object,
      type: String,
      selectedVersion: String
    },

    data() {
      const $i18n = this.$i18n
      return {
        tmpReleaseName: '',
        isEditingReleaseName: false,
        coverImageUrl: this.release.previewImages[0] || defualtImageUrl,
        editTmpPolicy: { policyName:  $i18n.t('tips[3]'), policyText: '' },
        tempEditingIntro: this.release.intro,
        releaseStateText: '',
        isShowEditPolicy: false,
        isEditingIntro: false,
        isTuckUpRelease: true,
        isTuckUpVersion: false,
        isReleaseOnline: false
      }
    },

    watch: {
      release() {
        this.checkReleaseState()
      }
    },

    methods: {
      updateRelease(params, message) {
        return this.$services.ReleaseService.put(this.release.releaseId, params)
          .then(res => {
            const {errcode, ret, msg, data} = res.data
            if (errcode === 0 && ret === 0) {
              this.$emit('update:release', data)
              message && this.$message({ type: 'success', message })
            } else {
              this.$error.showErrorMessage(msg)
            }
            return data
          }).catch(this.$error.showErrorMessage)
      },
      uploadCoverSuccess(urls) {
        var previewImages, coverImageUrl
        if(typeof urls === 'string') {
          previewImages = [ urls ]
          coverImageUrl = urls
        }else {
          previewImages = urls
          coverImageUrl = urls[0]
        }
        this.updateRelease({
          previewImages,
        }, this.$i18n.t('messages[0]'))
        .then(() => {
          this.coverImageUrl = coverImageUrl
        })
      },
      savePolicyHandler() {
        const $i18n = this.$i18n
        const { policyName, policyText } = this.editTmpPolicy

        this.updateRelease({
          policyInfo: {
            addPolicies: [{
              policyName, policyText: window.btoa(policyText)
            }]
          }
        }, $i18n.t('messages[1]'))
          .then(() => {
            this.editTmpPolicy = { policyName: $i18n.t('tips[3]'), policyText: '' }
            this.isShowEditPolicy = false
          })
      },
      cancelPolicyHandler() {
        this.isShowEditPolicy = false
      },
      addPolicyHandler(policy) {
        this.isShowEditPolicy = true
      },
      updatePolicies(policy) {
        this.updateRelease({
          policyInfo: {
            updatePolicies: [ policy ]
          }
        })
          .then(() => {
            const $i18n = this.$i18n
            if(policy.status === 1) {
              this.$message({type: 'success', message: `${$i18n.t('policy')}(${policy.policyName})${$i18n.t('enabled')}！`})
            }else if(policy.status === 0){
              this.$message({type: 'warning', message: `${$i18n.t('policy')}(${policy.policyName})${$i18n.t('disabled')}！`})
            }
          })
      },
      editIntroHandler() {
        this.isEditingIntro = true
        this.tempEditingIntro = this.release.intro
      },
      cancelEditHandler() {
        this.isEditingIntro = false
        this.tempEditingIntro = ''
      },
      saveIntroHandler() {
        const $i18n = this.$i18n
        var successMsg = this.release.intro === '' ? $i18n.t('messages[2]') : $i18n.t('messages[3]')
        const intro = this.tempEditingIntro.replace(/^(\s*)|(\s*)$/g, '')
        this.updateRelease({ intro }, successMsg)
          .then(() => {
            this.isEditingIntro = false
          })
      },
      tapEditName() {
        this.tmpReleaseName = this.release.releaseName
        this.isEditingReleaseName = true
      },
      saveEditName() {
        this.updateRelease({
          "releaseName": this.tmpReleaseName,
        }, this.$i18n.t('messages[4]'))
        .then((data) => {
          this.isEditingReleaseName = false
        })
      },
      cancelEditName() {
        this.tmpReleaseName = this.release.releaseName
        this.isEditingReleaseName = false
      },
      checkReleaseState() {
        const releaseStateTexts = [ this.$i18n.t('tips[1]'), this.$i18n.t('tips[2]') ]
        const policies = this.release.policies
        const leng = policies.length
        if(leng > 0) {
          let releaseState = 0
          for(let i = 0; i < leng; i++) {
            if(policies[i].status === 1) {
              releaseState = 1
              break
            }
          }
          this.releaseState = releaseState
          this.releaseStateText = releaseState === 1 ? '' : releaseStateTexts[1]
        }else {
          this.releaseState = -1
          this.releaseStateText = releaseStateTexts[0]
        }
      }
    },

    created() {
      this.isTuckUpRelease = this.type === 'add'
    },

    mounted() {
      this.checkReleaseState()
    },
  }
</script>

<style lang="less" type="text/less" scoped>
  @import './layout.less';
</style>
<style lang="less" type="text/less">
.release-editor-layout {
  .preview-box {
    .avatar-uploader {
      .el-upload {
        border: none; border-radius: 2px;
      }
      .el-upload-dragger {
        overflow: initial; border-width: 0;
      }
    }
  }
}
</style>
