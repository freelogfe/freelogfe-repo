<i18n src="./create.i18n.json"></i18n>
<template>
  <div id="release-create" v-loading="resourceDetail === null" v-if="resourceDetail !== null">
    <el-form class="r-c-w-cont" ref="createReleaseForm" :model="formData" :rules="rules">
      <div class="r-c-w-row r-c-w-resource clearfix">
        <!-- <div class="preview-box">
          <img :src="previewImage" alt="" :class="{'resource-default-preview':!previewImage}">
        </div> -->
        <div class="cont">
          <h2>
            <img class="resource-default-preview" alt="" />
            <span>{{resourceDetail.aliasName}}</span>
            <div class="rcw-info">
              {{resourceDetail.resourceType | pageBuildFilter}} | {{resourceDetail.updateDate | fmtDate}}
            </div>
          </h2>
          <p class="rcw-intro">
            {{resourceDetail.intro || $t('noDesc')}}
          </p>
        </div>
      </div>
      <div class="r-c-w-row r-c-w-name">
        <h3>{{$t('name')}}<span>·{{$t('tips[0]')}}</span></h3>
        <el-form-item prop="releaseName" class="cont">
          <span>*</span>
          {{session.user.username}} /
          <el-input
                  autofocus
                  validate-event
                  show-word-limit
                  maxlength="100"
                  v-model="formData.releaseName"/>
        </el-form-item>
      </div>
      <div class="r-c-w-row r-c-w-cover">
        <h3>{{$t('cover')}}</h3>
        <UploadCover :imageUrl="coverImageUrl" :onUploaded="uploadCoverSuccess"></UploadCover>
      </div>
      <div class="r-c-w-row r-c-w-upcast" v-if="depReleasesList.length">
        <h3>{{$t('basicUpcast')}}<span>·{{$t('tips[1]')}}</span></h3>
        <div class="cont">
          <div
                  class="upcast-release-item"
                  v-for="(item, index) in baseUpcastReleases"
                  :key="'upcast-release-' + index"
          ><i class="el-icon-back"></i>{{item.releaseName}}
          </div>
          <div class="no-upcase-releases" v-if="baseUpcastReleases.length === 0">{{$t('noBasicUpcast')}}</div>
        </div>
      </div>
      <div class="r-c-w-row r-c-w-version">
        <h3>{{$t('version')}}</h3>
        <el-form-item prop="version" class="cont">
          <span>*</span>
          <el-input v-model="formData.version"></el-input>
        </el-form-item>
      </div>
      <div class="r-c-w-row r-c-w-scheme" v-if="depReleasesList.length">
        <h3>{{$t('scheme')}}</h3>
        <div class="cont">
          <scheme-manage
                  type="create"
                  :baseUpcastReleases.sync="baseUpcastReleases"
                  :depReleasesList="depReleasesList"
                  :depReleasesDetailList.sync="depReleasesDetailList"
                  @update-resolved-releases="updateResolvedReleases"
          ></scheme-manage>
        </div>
      </div>
    </el-form>
    <div class="r-c-w-footer">
      <div class="body">
        <div class="cancel" @click="cancelCreateRelease">{{$t('cancelBtnText')}}</div>
        <el-button class="create" type="primary" size="small" round @click="createRelease('createReleaseForm')">{{$t('createBtnText')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import UploadCover from '@/components/UploadCover/index.vue'
  import SchemeManage from '../scheme/index.vue'
  import {mapGetters} from 'vuex'
  import config from '@/config/index'

  export default {
    name: 'release-creator',
    components: { SchemeManage, UploadCover },
    data() {
      const $i18n = this.$i18n
      const validateName = (rule, value, callback) => {
        if(value.length < 1 || value.length > 60) {
          callback($i18n.t('messages[0]'))
        }else if(config['COMMON_NAME_REGEXP'].test(value)) {
          callback()
        }else {
          callback($i18n.t('messages[1]') + '：\ / : * ? " < > | @ # $')
        }
      }
      const validateVersion = (rule, value, callback) => {
        if(/^\d+\.\d+.\d+$/.test(value)) {
          callback()
        }else {
          callback(new Error($i18n.t('messages[2]')))
        }
      }

      return {
        resourceDetail: null,
        releaseName: '',
        coverImageUrl: '',
        formData: {
          releaseName: '',
          version: '0.1.0'
        },
        rules: {
          releaseName: [
            { required: true, message: $i18n.t('messages[3]'), trigger: 'blur'},
            { validator: validateName, trigger: 'blur' }
          ],
          version: [
            { required: true, message: $i18n.t('messages[4]'), trigger: 'blur'},
            { validator: validateVersion, trigger: 'blur' }
          ]
        },
        baseUpcastReleases: [],
        depReleasesList: [],
        depReleasesDetailList: [],
        upcastDepReleasesIds: [],
        upcastDepReleasesMap: {},
        resolvedReleases: []
      }
    },
    computed: Object.assign({
      projection() {
        return ["releaseId", "resourceType", "releaseName", "latestVersion", "baseUpcastReleases", "policies", "updateDate",].join(',')
      },
      previewImage() {
        if (!this.resourceDetail) {
          return ''
        } else {
          return this.resourceDetail.previewImages[0] || ''
        }
      }
    }, mapGetters({
      session: 'session'
    })),
    watch: {
      dependencies() {

      },
    },
    methods: {
      updateResolvedReleases(resolvedReleases) {
        this.resolvedReleases = resolvedReleases
      },
      cancelCreateRelease() {
        this.$router.go(-1)
        // this.$router.push(`/resource/detail/${this.resourceDetail.resourceId}`)
      },
      getFormData() {
        const data = {
          resourceId: this.resourceDetail.resourceId,
          releaseName: this.formData.releaseName,
          version: this.formData.version,
          baseUpcastReleases: this.baseUpcastReleases.map(r => {
            return {releaseId: r.releaseId}
          }),
          resolveReleases: this.resolvedReleases
        }
        if (this.coverImageUrl !== '') {
          data.previewImages = [this.coverImageUrl]
        }
        return data
      },
      createRelease(formName) {
        const $i18n = this.$i18n
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const formData = this.getFormData()
            this.$services.ReleaseService.post(formData)
              .then(res => res.data)
              .then(res => {
                if (res.errcode === 0 && res.data) {
                  this.$message({type: 'success', message: $i18n.t('messages[5]')})
                  if (res.data.releaseId) {
                    this.$router.push(`/release/edit/${res.data.releaseId}`)
                  }
                } else {
                  this.$message({type: 'error', message: res.msg})
                }
              })
              .catch(e => this.$message({type: 'error', message: e.toString()}))
          } else {
            return false;
          }
        })
      },
      uploadCoverSuccess(url) {
        this.coverImageUrl = url
      },
    },
    created() {
      if (this.$route.query.resourceId) {
        this.$services.resource.get(this.$route.query.resourceId)
        .then(res => res.data)
        .then(res => {
          if (res.errcode === 0) {
            this.resourceDetail = res.data
            this.depReleasesList = res.data.systemMeta.dependencies || []
            this.formData.releaseName = res.data.aliasName
          } else {
            this.$message({type: 'error', message: res.msg})
          }
        })
        .catch(e => this.$message({type: 'error', message: e.toString()}))
      }

    },
  }
</script>

<style lang="less" type="text/less" scoped>
  @import '../../../styles/variables.less';

  @media screen and (max-width: 1250px) {
    #release-create {
      .r-c-w-cont {
        width: @main-content-width-990;
      }
    }
  }

  #release-create {
    padding-left: 50px;

    .r-c-w-cont {
      width: @main-content-width-1190;
      margin: 0 auto 65px auto;
      padding-top: 40px;
    }

    .r-c-w-row {
      margin-bottom: 30px;
      h3 {
        position: relative;
        margin-bottom: 5px; padding: 10px;

        &:before {
          content: '';
          position: absolute; left: 0; top: 50%; z-index: 1;
          width: 3px; height: 12px;
          background-color: #333; transform: translateY(-50%);
        }

        span { margin-left: 20px; font-size: 12px; font-weight: 400; color: #999; }
      }
    }

    .r-c-w-resource {
      margin-bottom: 20px; padding: 14px 20px; border-radius: 10px;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);

      .preview-box {
        float: left; overflow: hidden;
        width: 100px; height: 75px; border-radius: 2px;
        box-shadow: 0 0 1px #999;

        img { display: block; width: 100%; height: 100%; }
      }
      .cont {
        h2 {
          display: flex; align-items: center;
          font-size: 16px;
          img { width: 40px; height: 30px; margin-right: 16px; }
          span { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin-right: 14px; }
        }
      }
      .rcw-info {
        font-size: 13px; font-weight: 400; color: #999;
      }
      .rcw-intro {
        display: -webkit-box;
        overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        margin-top: 12px; margin-bottom: 2px;
        font-size: 13px;
      }
    }

    .r-c-w-name {
      .cont {
        font-size: 18px;
        color: #333;
      }
      span {
        margin-right: 5px;
        color: #FA686D;
      }

      .el-input {
        width: 340px;
      }
    }

    .r-c-w-upcast {
      .upcast-release-item {
        position: relative;
        display: inline-block;
        margin-right: 15px;
        height: 26px;
        padding: 0 16px 0 26px;
        border: 1px solid #FFA6A8;
        border-radius: 14px;
        line-height: 26px;
        background-color: #FFF4F4;
        color: #333;
        font-weight: 500;
      }
      .el-icon-back {
        position: absolute;
        left: 12px;
        top: 50%;
        z-index: 1;
        transform: translateY(-50%) rotate(90deg);
        color: #EA7171;
        font-weight: bold;
      }
      .no-upcase-releases {
        color: #333;
      }
    }

    .r-c-w-version {
      .cont {
        display: flex;
        align-items: center;
      }

      span {
        margin-right: 5px;
        color: #FA686D;
      }
      .el-input {
        width: 210px;
      }
      .release-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 300px;
        padding: 5px;
        margin-left: 30px;
        line-height: 30px;
        background-color: #FAFBFB;
        img {
          float: left;
          width: 40px;
          height: 30px;
          margin-right: 5px;
        }
        span {
          display: inline-block;
        }
      }
    }

    .r-c-w-scheme {
      margin-bottom: 54px;
    }

    .r-c-w-footer {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 99;
      padding-left: 50px;
      box-shadow: 0 0px 1px #0006;
      background-color: #fff;
      text-align: right;

      .body {
        width: @main-content-width-990;
        margin: auto;
        padding: 10px 0;
      }
      .cancel {
        display: inline-block;
        margin-right: 10px;
        padding: 6px 12px;
        cursor: pointer;
        &:hover {
          color: #999;
        }
      }
    }
  }

</style>

<style lang="less" type="text/less">
  #release-create {
    .el-input {
      .el-input__inner {
        padding-right: 55px;
      }
      .el-input__count {
        .el-input__count-inner {
          background-color: inherit;
        }
      }
    }
    .el-form-item__content {
      display: inline-block;
      .el-form-item__error {
        white-space: nowrap;
        left: 106%; top: 50%; transform: translateY(-50%);
      }
    }
    .r-c-w-name {
      .el-form-item__content {
        .el-form-item__error { left: 103%; }
      }
    }
  }
</style>
