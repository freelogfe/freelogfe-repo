<template>
  <div class="my-profile-view" v-if="session">
    <h2>个人资料</h2>
    <div class="my-profile-info">
      <div class="my-profile-row" :class="[avatarCls]">
        <label>{{$t('profile.userAvatar')}}</label>
        <div class="my-profile-row__content">
          <el-button type="text" class="user-avatar-btn" @click="showImageCropUploader=true">
            <img v-show="session.avatarUrl" class="user-avatar" :src="session.avatarUrl" @error="imgErrorHandler"
                :alt="$t('profile.userAvatar')">
            <span v-if="!session.avatarUrl">{{$t('profile.editAvatar')}}</span>
            <div class="edit-avatar-part">{{$t('profile.editAvatar')}}</div>
          </el-button>
          <crop-image v-model="showImageCropUploader"
                      :avatarUrl="session.avatarUrl"
                      :upload-success="uploadSuccessHandler"></crop-image>
        </div>
      </div>
      <div class="my-profile-row">
        <label>{{$t('profile.userName')}}</label>
        <div class="my-profile-row__content">
          {{session.userName ? session.userName : $t('profile.noUserAvatar')}}
        </div>
      </div>
    </div>
    <h2>账号安全</h2>
    <div class="my-profile-account">
      <div class="my-profile-row">
        <label>{{$t('profile.email')}}</label>
        <div class="my-profile-row__content">
          <span>{{session.email ? session.email : $t('profile.noMail')}}</span>
          <el-tooltip effect="dark" content="功能稍后开放" placement="left">
            <el-button type="primary" disabled>绑定邮箱</el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="my-profile-row">
        <label>{{$t('profile.phoneNumber')}}</label>
        <div class="my-profile-row__content">
          <span>{{session.mobile ? session.mobile : $t('profile.noPhoneNumber')}}</span>
          <el-tooltip effect="dark" content="功能稍后开放" placement="left">
            <el-button type="primary" disabled>更换手机</el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="my-profile-row">
        <label>{{$t('profile.password')}}</label>
        <div class="my-profile-row__content">
          <span>*****</span>
          <el-tooltip effect="dark" content="功能稍后开放" placement="left">
            <el-button type="primary" disabled>更换密码</el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CropImage from '@/components/CropImage/index.vue'

export default {
  name: 'my-profile',

  data() {
    return {
      showImageCropUploader: false,
      avatarCls: ''
    }
  },

  components: { CropImage },

  computed: {
    ...mapGetters({
      session: 'session'
    })
  },

  mounted() {
  },

  watch: {
    'session.avatarUrl': function avatarUrl() {
      if (this.session.avatarUrl) {
        this.avatarCls = ''
      }
    }
  },
  methods: {
    imgErrorHandler() {
      this.avatarCls = 'not-found-img'
      this.$store.dispatch('changeAvatar', '')
    },
    uploadSuccessHandler() {
      this.$store.dispatch('changeAvatar')
      this.showImageCropUploader = false
    }
  }
}
</script>

<style lang="less" scoped type="text/less">
  .my-profile-view {
    // display: flex; justify-content: center; align-items: center;
    min-width: 480px; max-width: 900px; margin: auto;

    h2 { 
      padding: 5px 0; border-bottom: 1px solid #D8D8D8;
      font-size: 16px; font-weight: 600; color: #000; }

    .my-profile-info {
      padding: 20px 0 80px 0;
    }

    .my-profile-account {
      padding: 20px 0;
      .my-profile-row__content {
        .el-button--primary { float: right; }
      }
    }

    .my-profile-account, .my-profile-info {
      .my-profile-row {
        display: flex; align-items: center;
        padding: 18px 0;
        label { margin-right: 70px; font-size: 14px; color: #999; }
        .my-profile-row__content {
          flex: 1;
          line-height: 40px; font-size: 14px; font-weight: 600; color: #333;
        }
      }
    }

    .not-found-img {
      .user-avatar-btn span {
        display: inline-block;
        width: 80px; height: 80px; border: 1px solid #EEEEEE; border-radius: 50%;
        line-height: 80px;
      }
    }
    .user-avatar-btn {
      position: relative; padding: 0;

      .edit-avatar-part {
        position: absolute; top: 1px; left: 1px;
        width: 81px; height: 81px; border-radius: 50%;
        line-height: 81px; background-color: #333333; color: white;
        transition: all .3s; transform: scale(0); opacity: 0;
      }

      &:hover .edit-avatar-part{
        transform: scale(1); opacity: .8;
      }
    }
    .user-avatar {
      width: 81px; height: 81px; margin-right: 20px;
      border: 1px solid #EEEEEE; border-radius: 50%;
    }
    .profile-info-item {
      display: flex; align-items: center;
      width: 400px; margin-bottom: 5px; padding: 0 20px; border-bottom: 1px solid #ededed;
      color: #999;
    }
  }
</style>


<style lang="less" type="text/less">
  .my-profile-view {
    .profile-info-item .el-form-item__label {
      width: 110px !important;
    }
  }
</style>
