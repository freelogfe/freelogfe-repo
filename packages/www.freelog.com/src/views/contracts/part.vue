<template>
  <div>
    <div class="part-release" v-if="viewType === 'release' && releaseInfo != null" >
      <el-image style="width: 32px; height: 24px" :src="releaseInfo.previewImages && releaseInfo.previewImages[0] ? releaseInfo.previewImages[0] : '//test-frcdn.oss-cn-shenzhen.aliyuncs.com/console/public/img/resource.jpg'" :fit="fit"></el-image>
      <p>
        {{releaseInfo.releaseName}}
        <router-link v-if="isOwner" :to="`//console.${mainDomain}/release/edit/${releaseInfo.releaseId}`" target="_blank">管理</router-link>
      </p>
    </div>
    <div class="part-node" v-else-if="viewType === 'node' && nodeInfo != null">
      <p>{{nodeInfo && nodeInfo.nodeName}}</p>
      <p><router-link :to="`//${nodeInfo.nodeDomain}.${mainDomain}`" target="_blank">{{`${nodeInfo.nodeDomain}.${mainDomain}`}}</router-link></p>
    </div>
    <div class="part-user" v-else>
      {{userInfo && userInfo.username}}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'contract-part',

  props: {
    contract: Object,
    partyType: String
  },

  data() {
    return {
      mainDomain: window.FreelogApp.Env.mainDomain,
      viewType: 'release',
      releaseInfo: null,
      nodeInfo: null,
      userInfo: null,
      isOwner: false
    }
  },

  computed: {
    ...mapGetters({
      user: 'session'
    }),
  },

  methods: {
    resolveContract() {
      const { contractType } = this.contract
      switch(contractType) {
        // 发行 to 发行
        case 1: {
          this.viewType = 'release'
          if (this.partyType === 'partyOne') {
            this.releaseInfo = this.contract.releaseInfoOne
          } else {
            this.releaseInfo = this.contract.releaseInfoTwo
          }
          this.isOwner = this.releaseInfo.userId ===  this.user.userId
          break
        }
        // 发行 to 节点
        case 2: {
          if (this.partyType === 'partyOne') {
            this.viewType = 'release'
            this.releaseInfo = this.contract.releaseInfoOne
            this.isOwner = this.releaseInfo.userId ===  this.user.userId
          } else {
            this.viewType = 'node'
            this.nodeInfo = this.contract.nodeInfo
          }
          break
        }
        // 节点 to 用户
        case 3: {
          if (this.partyType === 'partyOne') {
            this.viewType = 'node'
            this.nodeInfo = this.contract.nodeInfo
          } else {
            this.viewType = 'user'
            this.userInfo = this.contract.userInfo
          }
          break
        }
      }
    },
    tapManageBtn() {

    }
  },

  watch: {
    contract() {
      this.resolveContract()
    }
  },

  mounted() {
    this.resolveContract()
  },
}
</script>

<style lang="less" scoped>
  .part-release {
    position: relative;
    p {
      // text-overflow: ellipsis; overflow: hidden; white-space: nowrap;
      padding-left: 38px; 
      font-size: 14px; color: #000;
      a {
        margin-left: 10px; padding: 0; font-size: 12px; color: #409EFF;
      }
    }
    
    .el-image {
      position: absolute; top: 50%; left: 0; z-index: 5; transform: translateY(-50%);
    }
  }

  .part-node {
    p { font-size: 14px; color: #000; }
    a { text-decoration: underline; font-size: 12px; color: #333; }
  }
</style>