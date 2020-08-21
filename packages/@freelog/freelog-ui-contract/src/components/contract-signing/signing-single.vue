<!--<i18n src="../../i18n-locales/contractSigning.json"></i18n>-->
<template>
  <div class="ss-content">
    <template v-if="type ==='single'">
      <div class="ss-cont-header">
        {{presentableName}}
        <span :class="['sc-tag', `sc-tag-${dContractType}`]">{{dContractTagName}}</span>
      </div>
    </template>
    <template>
      <resource-contract
        v-if="isRenderResoureContract"
        :defaultContract.sync="defaultContract"
        :presentable="presentable">
      </resource-contract>
    </template>
  </div>
</template>

<script>
  import resourceContract from './signing-box.vue'
  import { getContractState, } from './common.js'
  import contractMixins from '../../mixins.js'
  import en from '@freelog/freelog-i18n/ui-contract/en'
  import zhCN from '@freelog/freelog-i18n/ui-contract/zh-CN'

  export default {
    name: 'f-contract-signing-single',
    i18n: {
      messages: {
        en,
        'zh-CN': zhCN,
      }
    },
    components: {
      resourceContract,
    },
    props: {
      type: {
        type: String,
        default: 'single'
      },
      presentable: {
        type: Object,
        required: true
      }
    },
    mixins: [ contractMixins ],
    data() {
      return {
        isRenderResoureContract: false,
        defaultContract: null,
        dContractType: '',
        dContractTagName: '',
        contracts: [],
      }
    },
    computed: {
      // 节点资源名称
      presentableName() {
        return this.presentable.presentableName
      },
    },
    methods: {
      async reInitialData() {
        this.isRenderResoureContract = false
        this.getContracts()
        this.$forceUpdate()
      },
      // 获取该资源的所有合同
      async getContracts() {
        const userId = await this.getUserId()
        const { presentableId } = this.presentable
        return this.$axios.get(`/v1/contracts/list?targetIds=${presentableId}&partyTwo=${userId}&contractType=3`)
          .then(res => {
            if(res.data.errcode === 0) {
              return res.data.data
            }else {
              return Promise.reject(rea.data.msg)
            }
          })
          .then(contracts => {
            this.contracts = contracts
            this.presentable.policies = this.presentable.policies.filter(p => p.status === 1)
            this.resolveContracts()
            this.resolveDefaultContractState()
            this.isRenderResoureContract = true
          })
          .catch(this.$message.error)
      },
      resolveContracts (){
        var map = {}
        this.contracts.forEach(contract => {
          if(contract.isDefault) {
            this.defaultContract = contract
          }
          map[contract.policyId] = contract
        })

        this.presentable.policies.forEach(p => {
          p.contract = map[p.policyId] || null
        })
        this.$set(this.presentable, this.presentable.policies)
      },
      resolveDefaultContractState() {
        const { type, tagName } = getContractState.call(this, this.defaultContract)
        this.dContractType = type
        this.dContractTagName = tagName
      }
    },
    watch: {
      defaultContract() {
        this.$emit('update-default-contract', this.defaultContract)
      },
      presentable() {
        this.contracts = []
        this.reInitialData()
      }
    },
    beforeMount() {
      this.reInitialData()
    },
    destroyed() {

    }
  }
</script>

<style lang='less' scoped type="text/less">

  .ss-content {
    box-sizing: border-box; overflow: hidden;
    padding: 0 45px; text-align: left;

    .ss-cont-header {
      padding: 5px 0 10px;
      border-bottom: 1px solid #eee;
      font-size: 16px;
      color: #222;
      font-weight: bold;

    }
  }
</style>

