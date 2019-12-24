<template>
  <div class="release-editor-contract-wrapper" v-loading="isloading">
    <div class="r-e-c-tags">
      <i class="el-icon-setting success"></i>
      <i class="el-icon-setting error"></i>
      <i class="el-icon-setting warning"></i>
    </div>
    <div class="r-e-c-tree" v-if="cTreeData && contracts.length">
      <div class="r-e-c-btn">{{release.releaseName}}</div>
      <div class="r-e-c-tree-cont">
        <contract-tree
                class="first-level"
                v-for="data in cTreeData"
                :data="data"
                :activeKey.sync="activeKey"
                @activate="showDetailContract"
                @inactivate="hideDetailContract"
        ></contract-tree>
      </div>
    </div>
    <div class="r-e-c-empty-box" v-else>
      未获取到有效的合同信息
    </div>
    <transition name="fade">
      <div class="release-editor-box" v-if="contractDetail" v-show="isShowDetailContract">
        <i class="el-icon-close" @click="hideDetailContract"></i>
        <el-tabs class="rec-tab" v-model="activeContractTab" @tab-click="exchangeContractTab" type="border-card">
          <el-tab-pane
                  v-for="(p, index) in targetData.policies"
                  :key="'p' + index"
                  :label="p.policyName"
                  :name="p.policyName"
          >
            <div class="r-e-info">
              <h4>合约详情</h4>
              <div class="r-e-info-row">
                <span class="r-e-i-label">发行名称</span>{{targetData.label}}
              </div>
              <div class="r-e-info-row">
                <span class="r-e-i-label">资源类型</span>{{targetData.resourceType | pageBuildFilter}}
              </div>
              <div class="r-e-info-row">
                <span class="r-e-i-label">创建日期</span>{{contractDetail.createDate | fmtDate}}
              </div>
              <div class="r-e-info-row">
                <span class="r-e-i-label">合同ID</span>{{contractDetail.contractId}}
              </div>
              <div class="r-e-info-row">
                <span class="r-e-i-label">甲方</span>{{contractDetail.partyOne}}
              </div>
              <div class="r-e-info-row">
                <span class="r-e-i-label">乙方</span>{{contractDetail.partyTwo}}
              </div>
            </div>
            <div class="r-e-c-detail">
              <h4>合同信息</h4>
              <div class="r-e-c-cont">
                <contract-detail
                        class="contract-policy-content"
                        :contract.sync="contractDetail"
                        :policyText="contractDetail.contractClause.policyText"
                        @update-contract="updateContractAfterEvent"
                ></contract-detail>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </transition>
  </div>
</template>

<script>
  import { ContractDetail } from '@freelog/freelog-ui-contract'
  import ContractTree from './contract-tree.vue'
  import { CONTRACT_STATUS_COLORS } from '@/config/contract'
  export default {
    name: 'release-editor-contract',
    components: {
      ContractDetail, ContractTree
    },
    props: {
      release: Object,
      contracts: {
        type: Array,
        default: []
      },
      depReleasesDetailList: {
        type: Array,
        default: []
      },
    },
    data() {
      return {
        isShowDetailContract: false,
        isloading: false,
        cTreeData: [],
        contractDetail: null,
        targetData: null,
        activeContractTab: '',
        activeContractTabIndex: 0,
        activeKey: '',
        activeRelease: null,
        releaseIdNameMap: {}
      }
    },
    computed: {
      contractsMap() {
        const map = {}
        this.contracts.forEach(c => {
          map[c.contractId] = c
        })
        return map
      }
    },
    watch: {
      contracts() {
        this.reResolveTreeData()
      },
      depReleasesDetailList() {
        this.reResolveTreeData()
      },
    },
    methods: {
      reResolveTreeData() {
        const tmpTreeData = []
        const rtData = this.depReleasesDetailList

        var key = 'tree-node-i-'
        let firstLevelNodeIndex = -1, secondLevelNodeIndex = 0
        for(let i = 0; i < rtData.length; i++) {
          const { contracts, baseUpcastReleases, releaseId, releaseName } = rtData[i]
          const isParentHasContracts = contracts && contracts.length > 0
          if(isParentHasContracts) {
            firstLevelNodeIndex++
            secondLevelNodeIndex = 0
            tmpTreeData[firstLevelNodeIndex] = this.getTreeNode(rtData[i], key + i)
          }
          this.releaseIdNameMap[releaseId] = releaseName

          baseUpcastReleases.forEach((item) => {
            if(item.contracts && item.contracts.length > 0) {
              let tmpNode = this.getTreeNode(item, key + i)
              if(isParentHasContracts) {
                tmpNode.key = tmpNode.key + '-' + secondLevelNodeIndex
                secondLevelNodeIndex++
                tmpTreeData[firstLevelNodeIndex].children.push(tmpNode)
              }else {
                firstLevelNodeIndex++
                secondLevelNodeIndex = 0
                tmpTreeData[firstLevelNodeIndex] = tmpNode
              }
            }
          })
        }
        this.cTreeData = tmpTreeData
      },
      getTreeNode(item, key) {
        try {
          var tmpNode = {
            key,
            isShowChildren: true,
            children: [],
            label: item.releaseName,
            resourceType: item.resourceType,
            contracts: item.contracts,
            contractType: this.getNodeContractType(item.contracts),
            policies: item.policies
          }
        }catch (e) {
          console.log('e --', e)
        }

        return tmpNode
      },
      getNodeContractType(contracts){
        var isWarning = false
        let type = ''
        if(contracts && contracts.length) {
          for(let i = 0; i < contracts.length; i++) {
            const { contractId } =  contracts[i]
            const contract = this.contractsMap[contractId]
            if(contract) {
              type = CONTRACT_STATUS_COLORS[contract.status] ? CONTRACT_STATUS_COLORS[contract.status].type : ''
              if(type === 'success') {
                return type
              }
              if(type === 'warning') {
                isWarning = true
              }
            }
          }
        }
        return isWarning ? 'warning' : type
      },
      updateContractAfterEvent() {},
      exchangeContractTab(data) {
        this.activeContractTabIndex = +data.index
        this.handlerContract(this.targetData)
      },
      showDetailContract(data) {
        if(data.contracts.length) {
          this.activeContractTabIndex = 0
          if(this.targetData !== data && this.isShowDetailContract) {
            this.isShowDetailContract = false
            setTimeout(() => {
              this.handlerContract(data)
            }, 300)
          }else {
            this.handlerContract(data)
          }
        }
      },
      handlerContract(data) {
        const { contractId } = data.contracts[this.activeContractTabIndex]
        this.activeContractTab = data.policies[this.activeContractTabIndex].policyName
        const { partyOne, partyTwo } = this.contractsMap[contractId]
        this.contractDetail = this.contractsMap[contractId]
        this.contractDetail.partyOne = this.releaseIdNameMap[partyOne] || partyOne
        this.contractDetail.partyTwo = this.releaseIdNameMap[partyTwo] || partyTwo
        this.isShowDetailContract = true
        this.targetData = data
      },
      hideDetailContract() {
        this.activeKey = ''
        this.isShowDetailContract = false
      }
    },
    created() {
      if(this.release && this.release.releaseId) {
        this.releaseIdNameMap[this.release.releaseId] = this.release.releaseName
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>


  .fade-enter-active {
    transition: all .5s ease;
  }
  .fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-enter, .fade-leave-to {
    transform: translateX(100px);
    opacity: 0;
  }

  .release-editor-contract-wrapper {
    position: relative;
    min-height: 570px; padding: 12px;
    background-color: #FAFBFB; font-size: 12px;

    .r-e-c-tags {
      text-align: right;
      .el-icon-setting {
        margin-left: 10px; font-size: 16px; font-weight: bold;
        &.success{ color: #50C190; }
        &.error{ color: #E35A5F; }
        &.warning{ color: #E6A232; }
      }
    }

    .r-e-c-tree {
      overflow: auto; margin-top: 30px; padding: 0 30px;

      .r-e-c-btn {
        display: inline-block; box-sizing: border-box;
        width: 180px; padding: 8px; border-radius: 30px;
        background-color: #579CEE; color: #fff; text-align: center;
      }

      .r-e-c-tree-cont {
        position: relative;
        margin-left: 90px; margin-top: 40px; padding-left: 30px; z-index: 10;
        &:before {
          content: '';
          position: absolute; top: -40px; left: 0; z-index: 10;
          width: 6px; height: 75px; border: 1px solid #BABABA; border-top-width: 0; border-right-width: 0;
          border-bottom-left-radius: 6px;
        }
      }
    }

    .release-editor-box {
      overflow: hidden; box-sizing: border-box;
      position: absolute; top: 40px; right: 12px; z-index: 10;
      width: 350px; height: 540px; border-radius: 6px;
      background-color: #fff; box-shadow: 0 0 5px rgba(0, 0, 0, .3);

      .el-icon-close {
        position: absolute; top: 2px; right: 2px; z-index: 10;
        padding: 8px; font-size: 14px; color: #666; cursor: pointer;
        &:hover { color: #333; }
      }

      .r-e-info {
        color: #666;
        margin-top: 12px; padding: 0 24px;
        h4 {
          position: relative; margin-bottom: 15px;
          &:after {
            content: '';
            position: absolute; top: 50%; left: -8px; z-index: 5;
            width: 3px; height: 12px; background-color: #666;
            transform: translateY(-50%);
          }
        }
      }
      .r-e-info-row {
        padding: 6px 0;
        span { display: inline-block; width: 60px; font-weight: 600; }
      }
      .r-e-c-detail {
        margin-top: 40px;

        h4 {
          position: relative; padding-left: 24px; margin-bottom: 5px;
        }
        .r-e-c-cont {
          height: 232px; overflow: auto;
          padding: 10px 24px; border-top: 1px solid #bbb; background-color: #FAFBFB;
        }
        .beauty-poliycy-box .bp-state.active{ min-width: auto; }
      }
    }
    .r-e-c-empty-box { padding-top: 20px; font-size: 18px; text-align: center; }
  }
</style>

<style lang="less" type="text/less">
  .release-editor-contract-wrapper {
    .r-e-c-detail {
      .beauty-poliycy-box{
        .bp-state.active{ min-width: auto; }
      }
    }
    .release-editor-box {
      .el-tabs.rec-tab {
        margin-top: 0;
        .el-tabs__header .el-tabs__nav {
          margin-left: 0; padding: 0;
          .el-tabs__nav {
            margin-left: 0;
          }
        }
        .el-tabs__nav-scroll {
          padding-right: 30px;
          .el-tabs__item { padding: 0 15px; }
        }
        .el-tabs__content { padding: 0; }
      }
    }
  }
</style>
