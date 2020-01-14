<template>
  <div class="contract-detail-view" v-if="contractDetailInfo != null">
    <h3>{{contractDetailInfo.contractName}}</h3>
    <div class="party-bar">
      <div>
        <h4>{{$t('contracts.partyOne')}}</h4>
        <contract-part :contract="contractDetailInfo" partyType="partyOne" v-if="isFetchedParty"></contract-part>
      </div>
      <div>
        <h4>{{$t('contracts.partyTwo')}}</h4>
        <contract-part :contract="contractDetailInfo" partyType="partyTwo" v-if="isFetchedParty"></contract-part>
      </div>
    </div>
    <el-tabs v-model="activeTabName" @tab-click="handleClick">
      <el-tab-pane :label="$t('contracts.content')" name="contract-content">
        <contract-content :contract="contractDetailInfo"></contract-content>
      </el-tab-pane>
      <!-- <el-tab-pane :label="'应用记录'" name="application-record">
        <contracts-list :list="applicationRecords"></contracts-list>
      </el-tab-pane>
      <el-tab-pane :label="'历史记录'" name="history-record">
        <contracts-list :list="historyRecords"></contracts-list>
      </el-tab-pane> -->
      <el-tab-pane :label="$t('contracts.relevancy')" name="relevancy-contract">
        <contracts-list :list="relevancyContracts"></contracts-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ContractPart from './part.vue'
import ContractContent from './content.vue'
import ContractsList from './contracts-list.vue'

export default {
  name: 'contract-detail-view',

  data() {
    return {
      activeTabName: 'contract-content',
      contractId: this.$route.query.contractId || '',
      contractDetailInfo: null,
      isRenderContract: false,
      isFetchedParty: false,
      applicationRecords: null,
      historyRecords: null,
      relevancyContracts: null,
    }
  },

  props: {
    
  },

  components: { ContractPart, ContractContent, ContractsList },

  mounted() {
    this.getContractDetail()
  },

  computed: {
    ...mapGetters({
      user: 'session'
    })
  },

  watch: {
    activeTabName() {
      switch(this.activeTabName) {
        // case 'application-record': {
        //   if (this.applicationRecords ==  null) {
        //     this.getInfo('v1/myContracts/list?page=1&pageSize=10&identityType=2')
        //       .then(data => {
        //         this.applicationRecords = data.dataList
        //       })
        //   }
        //   break
        // }
        case 'relevancy-contract': {
          if (this.relevancyContracts == null) {
            this.getInfo(`v1/myContracts/list?page=1&pageSize=100&identityType=1&partyOne=${this.contractDetailInfo.partyOne}&partyTwo=${this.contractDetailInfo.partyTwo}`)
              .then(data => {
                this.relevancyContracts = data.dataList.filter(c => c.contractId != this.contractDetailInfo.contractId)
              })
          }
          break
        }
      }
    }
  },

  methods: {
    getInfo(url) {
      return this.$axios.get(url)
        .then(resp => resp.data)
        .then((res) => {
          if (res.errcode === 0 && res.data) {
            return res.data
          } else {
            return null
          }
        })
        .catch(e => this.$error.showErrorMessage(res.msg))
    },
    getContractDetail() {
      if (this.contractId !== '') {
        this.getInfo(`/v1/contracts/${this.contractId}`)
          .then(data => {
            this.contractDetailInfo = data
            this.resolveContractDetail()
          })
      } 
    },
    resolveContractDetail() {
      const { contractType, partyOne, partyTwo } = this.contractDetailInfo
      switch(contractType) {
        // 发行 to 发行
        case 1: {
          Promise.all([ this.getReleaseInfo(partyOne), this.getReleaseInfo(partyTwo) ])
            .then(([ rInfo1, rInfo2 ]) => {
              this.contractDetailInfo.releaseInfoOne = rInfo1
              this.contractDetailInfo.releaseInfoTwo = rInfo2
              this.isFetchedParty = true
            })
          break
        }
        // 发行 to 节点
        case 2: {
          Promise.all([ this.getReleaseInfo(partyOne), this.getNodeInfo(partyTwo) ])
            .then(([ rInfo1, nInfo2 ]) => {
              this.contractDetailInfo.releaseInfoOne = rInfo1
              this.contractDetailInfo.nodeInfo = nInfo2
              this.isFetchedParty = true
            })
          break
        }
        // 节点 to 用户
        case 3: {
          Promise.all([ this.getNodeInfo(partyOne), this.getUserInfo(partyTwo) ])
            .then(([ nInfo1, uInfo2 ]) => {
              this.contractDetailInfo.nodeInfo = nInfo1
              this.contractDetailInfo.userInfo = uInfo2
              this.isFetchedParty = true
            })
          break
        }
        default: 
      }
    },
    getReleaseInfo(releaseId) {
      return this.getInfo(`/v1/releases/${releaseId}`)
    },
    getPresentableInfo(presentableId) {
      return this.getInfo(`/v1/presentables/${presentableId}`)
    },
    getNodeInfo(nodeId) {
      return this.getInfo(`/v1/nodes/${nodeId}`)
    },
    getUserInfo(userId) {
      return this.getInfo(`/v1/userinfos/${userId}`)
    },
    goBack() {
      this.$refs.layout.goBack()
    }
  },

  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped type="text/less">
@import '../../styles/variables.less';
.contract-detail-view {
  width: @main-content-width-1190; margin: auto;
  h3 { 
    margin-bottom: 30px; padding-bottom: 5px; border-bottom: 1px solid #D8D8D8;
    font-size: 20px; font-weight: 600; color: #000; line-height: 28px; 
  }
  .party-bar {
    display: flex; margin-bottom: 40px;
    & > div { flex: 1; padding-right: 20px; }
    h4 { 
      margin-bottom: 12px;
      font-size: 12px; color: #999; font-weight: 400; line-height: 17px; 
    }
  }
}

@media screen and (max-width: 1250px) {
  .contract-detail-view {
    width: @main-content-width-990;
  }
}

</style>
<style lang="less" type="text/less">
@import '../../styles/variables.less';
.main-app-content.contract-detail #breadcrumb-wrap { width: @main-content-width-1190; }
@media screen and (max-width: 1250px) {
  .main-app-content.contract-detail #breadcrumb-wrap {
    width: @main-content-width-990;
  }
}
.el-tabs__header {
  margin-bottom: 0;
  .el-tabs__nav-wrap {
    &::after { display: none; }
    .el-tabs__active-bar { display: none; }
    .el-tabs__item {
      padding: 0 15px; color: #999; font-weight: 400;
      &.is-active {
        font-size: 14px; font-weight: 600; color: #333;
      }
    }
  }
}
.el-tab-pane {
  background-color: #fafbfb;
}

</style>