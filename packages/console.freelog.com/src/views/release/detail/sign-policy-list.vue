<i18n src="./detail.i18n.json"></i18n>
<template>
  <div>
    <div class="signed-list" v-if="signedPolicies.length">
      <h3>
        {{checkedNodeIsSigned ? $t('signPolicyBox.titles[0]') + checkedNodeName : $t('signPolicyBox.titles[1]')}}
        <el-tooltip placement="right" :content="$t('signPolicyBox.tips[0]')" >
          <i class="el-icon-info"></i>
        </el-tooltip>
      </h3>
      <div class="s-l-item" v-for="policy in signedPolicies" :key="policy.pCombinationID">
        <div class="p-name" :class="{'isSigned': checkedNodeIsSigned}" @click="selectPolicy(signedPolicies, policy)">
          <template v-if="!checkedNodeIsSigned"> 
            <span class="p-n-check-box" v-if="!policy.isSelected"></span>
            <i class="el-icon-check" v-else></i>
          </template>
          {{policy.policyName}}
          <span class="contract-status" :class="['status-'+policy.contract.status]">{{policy.statusTip}}</span>
        </div>
        <div class="p-auth-info">
          <span>{{$t('signPolicyBox.contractID')}}：{{policy.contract.contractId}}</span>
          <span>{{$t('signPolicyBox.signingDate')}}：{{policy.contract.updateDate | fmtDate}}</span>
        </div>
        <div class="p-detail">
          <contract-detail
                  class="contract-policy-content"
                  :contract.sync="policy.contract"
                  :policyText="policy.contract.contractClause.policyText"
                  @update-contract="updateContractAfterEvent(policy)"></contract-detail>
        </div>
      </div>
    </div>
    <div class="no-sign-list" v-if="nodSignPolicies.length">
      <h3>
        {{signedPolicies.length > 0 ? $t('signPolicyBox.tips[1]') : $t('btns.sign')}}
        <el-tooltip placement="right" effect="light">
          <div class="s-m-w-c-ubh-tip" slot="content">
            {{$t('signPolicyBox.signState')}}
            <ul>
              <li>{{$t('signPolicyBox.signRuleState1')}}</li>
              <li>{{$t('signPolicyBox.signRuleState2')}}</li>
            </ul>
          </div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </h3>
      <div class="no-s-l-item" v-for="p in nodSignPolicies" :key="p.policyId">
        <div class="p-name" :class="{'isSigned': checkedNodeIsSigned}" @click="selectPolicy(nodSignPolicies, p)">
          <template v-if="checkedNodeIsSigned">
            <el-button class="p-sign-btn" type="primary" size="mini" @click="signNewPolicy(p)">{{$t('btns.sign')}}</el-button>
          </template>
          <template v-else>
            <span class="p-n-check-box" v-if="!p.isSelected"></span>
            <i class="el-icon-check" v-else></i>
          </template>
          {{p.policyName}}<span v-if="p.status === 0">（{{$t('offline')}}）</span>  
        </div>
        <div class="p-detail">
          <pre class="p-segment-text" >{{fmtPolicyTextList(p)}}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { beautifyPolicy } from '@freelog/freelog-policy-lang'
import { ContractDetail } from '@freelog/freelog-ui-contract'
import { CONTRACT_STATUS_TIPS } from '@/config/contract.js'
import { togglePolicy } from '@/lib/utils'
export default {
  name: 'sign-policy-list',
  components: { ContractDetail },
  props: {
    policies: {
      type: Array,
      default: () => []
    },
    contracts: {
      type: Array,
      default: () => []
    },
    release: {
      type: Object,
      default: () => {}
    },
    checkedNode: Object
  },
  data() {
    return {
      nodSignPolicies: [],
      signedPolicies: []
    }
  },
  computed: {
    checkedNodeId() {
      return this.checkedNode.nodeId
    },
    checkedNodeName() {
      return this.checkedNode.nodeName
    },
    checkedNodeIsSigned() {
      return this.checkedNode.isSigned
    }
  },
  watch: {
    policies() {
      this.resolvePolicies()
    },
    contracts() {
      this.resolvePolicies()
    },
  },
  mounted() {
    this.resolvePolicies()
  },
  methods: {
    fmtPolicyTextList(p) {
      return beautifyPolicy(p.policyText)
    },
    resolvePolicies() {
      this.signedPolicies = this.getSignedPolicies()
      this.nodSignPolicies = this.getNoSignedPolicies()
    },
    getNoSignedPolicies() {
      return this.policies.filter(p => p.contract == null).map(p => {
        p.statusTip = ''
        return p
      })
    },
    getSignedPolicies() {
      return this.policies.filter(p => p.contract != null).map(p => {
        p.statusTip = CONTRACT_STATUS_TIPS[p.contract.status]
        return p
      })
    },
    // 选择策略
    selectPolicy(policies, policy) {
      if(this.checkedNodeId === '') {
        this.$message({
          message: '请先选择签约节点',
          type: 'warning'
        })
        return 
      }

      policy.isSelected = !policy.isSelected
      this.policies = this.policies.map(p => p)
      if(policy.isSelected) {
        togglePolicy(this.release.selectedPolicies, policy, 'add')
      }else {
        togglePolicy(this.release.selectedPolicies, policy, 'delete')
      }
    },
    signNewPolicy(policy) {
      togglePolicy(this.release.selectedPolicies, policy, 'add')
      this.$emit('sign-new-policy')
    },
    updateContractAfterEvent() {
      this.resolvePolicies()
    },
  },
}
</script>

<style lang="less">
.no-sign-list, .signed-list {
  h3 {
    margin-bottom: 8px;
    font-size: 14px; color: #4497EC;
  }
}
.no-s-l-item, .s-l-item  {
  margin-bottom: 20px; border: 1px solid #ccc; border-top-left-radius: 4px; border-top-right-radius: 4px;
  color: #333;
  
  .p-name {
    position: relative; cursor: pointer;
    padding: 10px 0 10px 40px;
    font-size: 16px; color: #333;
    &.isSigned { padding-left: 15px; background-color: #FAFBFB; }
    .p-sign-btn {
      float: right;
      margin-right: 15px; border-radius: 20px;
      font-size: 12px; 
    }

    .p-n-check-box {
      display: inline-block;
      position: absolute; left: 15px; top: 50%; z-index: 10; transform: translateY(-50%);
      width: 16px; height: 16px; border: 1px solid #333; border-radius: 2px;
    }

    .el-icon-check {
      position: absolute; left: 13px; top: 50%; z-index: 10; transform: translateY(-50%);
      padding-left: 3px; font-size: 14px; font-weight: bold; color: #fff;
      &:after {
        content: '';
        position: absolute; left: 2px; top: -2px; z-index: -2;
        width: 16px; height: 16px; border: 1px solid #4497EC; border-radius: 2px;
        background-color: #4497EC; color: #fff;
      }
    }
  }
  .p-detail {
    padding: 10px 15px; font-size: 14px;  border-top: 1px solid #ccc;
  }
}

.signed-list {
  margin-bottom: 20px;
}
.s-l-item {
  position: relative;
  border: 1px solid #ccc; border-radius: 4px; background-color: #FAFBFB;
  
  .p-name{ 
    margin-top: 8px; font-weight: 600;

    .contract-status {
      display: inline-block; 
      margin-left: 10px; padding: 0 10px; border: 1px solid; border-radius: 12px;
      font-size: 14px;
    
      &.status-0 { color: #fff; border-color: #999; background: #999; }
      &.status-1, &.status-2 { color: #FBB726; border-color: #FBB726; }
      &.status-4 { color: #45BC7B; border-color: #45BC7B; }
      &.status-3, &.status-5, &.status-6 { color: #fff; border-color: #E35A5F; background: #E35A5F; }
    }
  }

  .p-auth-info {
    padding: 5px 15px 10px; 
    span { display: inline-block; width: 49%; color: #999; }
  }
}
  
</style>