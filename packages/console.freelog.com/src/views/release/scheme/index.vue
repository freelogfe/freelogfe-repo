<i18n src="./scheme.i18n.json"></i18n>
<template>
  <div class="scheme-manage-wrapper" v-loading="isLoading">
    <div class="s-m-w-tags">
      <template v-if="type !== 'create'">
        <span><i class="contract-status status-2"></i>{{$t('contractStatus[0]')}}</span>
        <span><i class="contract-status status-4"></i>{{$t('contractStatus[1]')}}</span>
        <span><i class="contract-status status-6"></i>{{$t('contractStatus[2]')}}</span>
      </template>
      <span><i class="el-icon-top"></i>{{$t('contractStatus[3]')}}</span>
    </div>
    <div class="cont clearfix">
      <div class="s-m-w-c-left">
        <div
                v-for="(rItem, index) in depReleasesDetailList"
                :key="'dep-box-'+index"
        >
          <release-depend-item
                  :release="rItem"
                  :is-active="selectedRelease.releaseId === rItem.releaseId"
                  :resolveStatus="rItem.resolveStatus"
                  :contractsMap="contractsMap"
                  @exchange-item="exchangeSelectedRelease"></release-depend-item>
          <release-depend-item
                  v-for="(urItem, _index) in rItem.baseUpcastReleases"
                  :key="'dep-item-'+_index"
                  is-scond-level
                  :release="urItem"
                  :is-active="selectedRelease.releaseId === urItem.releaseId"
                  :resolveStatus="urItem.resolveStatus"
                  :contractsMap="contractsMap"
                  @exchange-item="exchangeSelectedRelease"></release-depend-item>
        </div>
      </div>
      <div class="s-m-w-c-right">
        <template v-if="type === 'create'">
          <div class="s-m-w-c-upcast-box">
            <div class="s-m-w-c-ub-head">
              <el-radio v-model="isSelectedReleaesUpcast" :label="true">{{$t('upcast')}}</el-radio>  
              <el-tooltip placement="right" effect="light">
                <i class="el-icon-info" :class="[{ 'selected': isSelectedReleaesUpcast }]"></i>
                <div class="s-m-w-c-ubh-tip" slot="content">
                  如果因为某些原因无法和依赖发行的授权方达成合约，您可以选择将依赖上抛给最终整合方解决。
                  <ul>
                    <li>请注意依赖发行一旦被上抛就不能再签约了。</li>
                    <li>基础上抛是在发行的第一个版本的授权方案中被上抛的依赖。</li>
                    <li>基础上抛贯穿发行的所有版本，发行中新版本上抛的依赖都不能超过基础上抛的范围。</li>
                  </ul>
                </div>
              </el-tooltip>
            </div>
          </div>
          <div class="s-m-w-c-p-wrapper" :class="[{ 'disabled': isSelectedReleaesUpcast }]">
            <div class="s-m-w-c-head">
               <el-radio v-model="isSelectedReleaesUpcast" :label="false">{{$t('signContractBtnText')}}</el-radio>  
               <el-tooltip placement="right" effect="light">
                <div class="s-m-w-c-ubh-tip" slot="content">
                  作为被授权方，如果您满足且接受授权方的授权策略，则可以选择和授权方签约。授权双方之间存在一个按照未来发生的事件改变资源授权状态的机制，称之为合约。
                  <ul>
                    <li>合约的复用：授权方和被授权方的合约在同一个授权方（节点或发行）范围内可以复用。</li>
                    <li>合约的启用和停用：如果您和授权方的多个授权策略签订了多个合约，则在管理合约时，至少要有一个合约是启用状态。您可以选择启用或者停用其中某一个或某几个合约，在授权链中，系统仅会验证启用合约的授权状态。</li>
                  </ul>
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
            <div
                    class="s-m-w-c-policy"
                    :class="{ 'offline': policy.status === 0 && !(contractsMap && contractsMap[policy.contractId]) }"
                    v-for="(policy, index) in tmpNoSignedPolicies"
                    :key="'p-nosigned-' + index"
            >
              <div class="smw-c-p-box">
                <div class="p-name" :class="[type]" @click="selectPolicy(tmpNoSignedPolicies, policy, index)">
                  <span class="p-n-check-box" v-if="!policy.isSelected"></span>
                  <i class="el-icon-check" v-else></i>
                  {{policy.policyName}}<span v-if="policy.status === 0">（{{$t('offline')}}）</span>  
                </div>
                <div class="p-detail">
                  <pre class="p-segment-text" >{{fmtPolicyTextList(policy)}}</pre>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>  
          <div class="s-m-w-c-p-wrapper" :class="[{ 'disabled': isSelectedReleaesUpcast }]">
            <template v-if="tmpSignedPolicies.length">
              <div class="s-m-w-c-head">
                <div class="p-auth-info" v-if="selectedRelease.contracts && selectedRelease.contracts.length > 0">
                  <div>
                    <label>{{$t('partyA')}}：</label> 
                    <router-link :to="`/release/detail/${selectedRelease.releaseId}?version=${selectedRelease.latestVersion.version}`">
                      {{selectedRelease.releaseName}}
                    </router-link> 
                  </div>
                  <div><label>{{$t('partyB')}}：</label><span>{{release.releaseName}}</span></div>
                </div>
              </div>
              <h4 class="s-m-w-c-p-title">
                {{type !== 'edit' ? $t('signedContracts') : $t('signStatus[0]')}} 
                <el-tooltip placement="right" :content="$t('tips[2]')" v-if="type !== 'edit'" >
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </h4> 
              <div
                class="s-m-w-c-policy"
                :class="{ 
                  'offline': policy.status === 0 && !(contractsMap && contractsMap[policy.contractId]),
                  'disabled': policy.isEnbledContract === false
                }"
                v-for="(policy, index) in tmpSignedPolicies"
                :key="'p-signed-' + index"
              >
                <div class="smw-c-p-signed" v-if="contractsMap && contractsMap[policy.contractId]">
                    <div class="p-name" :class="[type]" @click="selectPolicy(tmpSignedPolicies, policy, index)">
                      <template v-if="type !== 'edit'">
                          <span class="p-n-check-box" v-if="!policy.isSelected"></span>
                        <i class="el-icon-check" v-else></i>
                      </template>
                      {{policy.policyName}}
                      <span class="contract-status" :class="['status-'+contractsMap[policy.contractId].status]">{{contractsMap[policy.contractId].statusTip}}</span>
                      <el-dropdown class="p-enabled-btn" @command="toggleEnabledContract" v-if="type === 'edit'">
                        <span>{{ policy.isEnbledContract ? $t('policyStatus[0]') : $t('policyStatus[1]')}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item :command="index+'-1'" v-if="!policy.isEnbledContract">{{$t('applyBtnText')}}</el-dropdown-item>
                          <el-dropdown-item :command="index+'-0'" v-else>{{$t('layAsideBtnText')}}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                    <div class="p-auth-info">
                      <span>{{$t('contractID')}}：{{policy.contractId}}</span>
                      <span>{{$t('signingDate')}}：{{contractsMap[policy.contractId].updateDate | fmtDate}}</span>
                    </div>
                    <div class="p-detail">
                      <contract-detail
                              class="contract-policy-content"
                              :contract.sync="contractsMap[policy.contractId]"
                              :policyText="contractsMap[policy.contractId].contractClause.policyText"
                              @update-contract="updateContractAfterEvent"></contract-detail>
                    </div>
                </div>
              </div>
            </template>
            <template v-if="tmpNoSignedPolicies.length">
              <h4 class="s-m-w-c-p-title"> 
                {{isSelectedReleaesUpcast ? $t('tips[0]') : $t('tips[1]')}} 
                <el-tooltip placement="right" effect="light">
                  <i class="el-icon-info"></i>
                  <div class="s-m-w-c-ubh-tip" slot="content">
                    基础上抛是在发行的第一个版本的授权方案中被上抛的依赖。基础上抛贯穿发行的所有版本，发行中新版本上抛的依赖都不能超过基础上抛的范围。
                  </div>
                </el-tooltip>
              </h4>
              <div
                class="s-m-w-c-policy"
                :class="{ 'offline': policy.status === 0 && !(contractsMap && contractsMap[policy.contractId]) }"
                v-for="(policy, index) in tmpNoSignedPolicies"
                :key="'p-' + index"
              >
                <div class="smw-c-p-box">
                  <div class="p-name" :class="[type]" @click="selectPolicy(tmpNoSignedPolicies, policy, index)">
                      <template v-if="type !== 'edit'">
                          <span class="p-n-check-box" v-if="!policy.isSelected"></span>
                        <i class="el-icon-check" v-else></i>
                      </template>
                    {{policy.policyName}}<span v-if="policy.status === 0">（{{$t('offline')}}）</span>
                    <div class="p-signed-btn" @click="policySignImmediately(policy)" v-if="type === 'edit'">{{$t('signContractBtnText')}}</div>
                  </div>
                  <div class="p-detail"><pre class="p-segment-text" >{{fmtPolicyTextList(policy)}}</pre></div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
      <scheme-float-ball
            class="s-m-w-c-floatball"
            :selectedAuthSchemes="selectedAuthSchemes"
            :upcastReleases="baseUpcastReleases"
            v-if="type === 'create'"></scheme-float-ball>
    </div>
  </div>
</template>

<script>
  import SchemeManage from './scheme.js'
  export default SchemeManage
</script>

<style lang="less">
  .s-m-w-c-ubh-tip{
    width: 420px; padding: 10px; 

    ul {
      margin-top: 15px; list-style-type: disc;
      li { margin-left: 15px; line-height: 20px; color: #333; }
    }
  } 
  // .el-tooltip__popper.is-light {
  //   border-color: #fff;
  //   box-shadow: 1px 1px 3px rgba(0,0,0,.3);
  // }
</style>

<style lang="less" type="text/less" scoped>
  @import './index.less';
</style>
