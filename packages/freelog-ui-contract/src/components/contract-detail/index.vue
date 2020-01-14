<i18n src="../../i18n-locales/contract-detail.json"></i18n>
<template>
  <div class="contract-detail-content-wrapper" >
    <template v-if="contract && (contract.status === 2 || contract.status === 4)">
      <div
              v-html="contractDetail"
              @click="handlerProxy"
      ></div>
      <el-dialog
              :title="dialogTitle"
              ref="eventDialog"
              :visible.sync="showEventExecDialog"
              :before-close="closeDialogHandler"
              append-to-body
              :center=true
              width="475px"
      >
        <component
                :is="eventComponent"
                :contractDetail="contract"
                @close="closeDialogHandler"
                :params="targetContractEvent"
        ></component>
      </el-dialog>
    </template>
    <pre class="policy-text" v-else>{{beautifulPolityText}}</pre>
  </div>
</template>

<script>
  import { beautifyPolicy, highlightPolicy } from '@freelog/freelog-policy-lang'
  import {
    LicenseEvent,
    TransactionEvent,
    // EscrowConfiscate,
    eventComponentMap
  } from '../contract-events/index'

  export default {
    name: 'f-contract-detail',
    props: {
      contract: {
        // type: Object,
        required: true
      },
      policyText: {
        type: String
      },
    },
    components: {
      TransactionEvent, LicenseEvent,
      // EscrowConfiscate,
    },
    data() {
      return {
        dialogTitle: '',
        eventComponent: '',
        showEventExecDialog: false,
        targetContractEvent: {},
      }
    },
    computed: {
      contractId() {
        return this.contract.contractId
      },
      partyTwoUserId() {
        return this.contract.partyTwoUserId
      },
      fsmStates() {
        return this.contract.contractClause.fsmStates
      },
      currentFsmState() {
        return this.contract.contractClause && this.contract.contractClause.currentFsmState || 'none'
      },
      beautifulPolityText() {
        return beautifyPolicy(this.contract.contractClause.policyText || '')
      },
      contractDetail() {
        return highlightPolicy(this.contract.contractClause.policyText || '')
      },
    },
    methods: {
      toggleClass($dom, className) {
        const curClassName = $dom.className
        if (curClassName.indexOf(className) !== -1) {
          $dom.className = curClassName.replace(className, '')
        } else {
          $dom.className = `${curClassName} ${className}`
        }
      },
      highlightCurrentState(state) {
        if (this.currentFsmState !== 'none') {
          const $currentDom = this.$el.querySelector('.bp-state.active')
          const $targDom = this.$el.querySelector(`.bp-s-${state || this.currentFsmState}`)
          $currentDom && this.toggleClass($currentDom, 'active')
          $targDom && this.toggleClass($targDom, 'active')
        }
      },
      handlerProxy(event) {
        const dataset = event.target.dataset
        const handlerName = dataset.handler
        if (this[handlerName]) {
          const transitionData = this.getStateTransitionData(dataset.transition)
          if (transitionData !== null) {
            const {code, params, eventId} = transitionData
            this[handlerName](code, params, eventId)
          }
        }
      },
      // 合同事件处理 执行合同
      executeContractHandler(params) {
        switch (params.type) {
          case 'signingEvent':
          case 'transactionEvent':
          case 'escrowExceedAmount':
          case 'escrowConfiscated':
          case 'escrowRefunded': {
            const { componentName } = eventComponentMap[params.type]
            this.targetContractEvent = params
            this.eventComponent = componentName
            this.dialogTitle = this.$t(`eventTitles['${params.type}']`)
            this.showEventExecDialog = true
            break
          }
          default: {
            // this.updateContractDetail()
          }
        }
      },
      getStateTransitionData(transition) {
        if (this.fsmStates[this.currentFsmState]) {
          const transitionMap = this.fsmStates[this.currentFsmState].transition
          return transitionMap[transition]
        }
        return null
      },
      // 签约协议
      signingEvent(code, params, eventId) {
        const options = Object.assign({}, params, {
          type: 'signingEvent',
          eventId,
          licenseIds: params.licenseResourceId,
          contractId: this.contractId
        })
        this.executeContractHandler(options)
      },
      cycleEndEvent(code, params, eventId) {
      },
      // 交易事件
      transactionEvent(code, params, eventId) {
        const options = Object.assign({}, params, {
          type: 'transactionEvent',
          payType: 'transaction',
          eventId,
          amount: params.amount.literal,
          contractId: this.contractId
        })
        this.executeContractHandler(options)
      },
      settlementEvent(code, params, eventId) {
      },
      viewCountEvent(code, params, eventId) {
      },
      recontractCountEvent(code, params, eventId) {
      },
      presentCountEvent(code, params, eventId) {
      },
      // 收取保证金 - 弹窗 - 支付
      escrowExceedAmount(code, params, eventId) {

        const options = Object.assign({}, params, {
          type: 'escrowExceedAmount',
          payType: 'escrowExceed',
          eventId,
          amount: params.amount.literal,
          contractId: this.contractId
        })
        this.executeContractHandler(options)
      },
      // 保证金没收
      escrowConfiscated(code, params, eventId) {
        const options = Object.assign({}, params, {
          type: 'escrowConfiscated',
          payType: 'escrowConfiscated',
          eventId,
          contractId: this.contractId
        })
        this.executeContractHandler(options)
      },
      // 保证金赎回
      escrowRefunded(code, params, eventId) {
        const options = Object.assign({}, params, {
          type: 'escrowRefunded',
          payType: 'escrowRefunded',
          eventId,
          partyTwoUserId: this.partyTwoUserId,
          contractId: this.contractId
        })
        this.executeContractHandler(options)
      },
      cycleEndEvent(code, params, eventId) {
      },
      customEvent(code, params, eventId) {
      },
      closeDialogHandler({shouldUpdate}) {
        this.showEventExecDialog = false
        if (shouldUpdate) {
          this.$emit('update-contract', {shouldUpdate})
        }
      }
    },
    created() {
      if (this.contract && !this.contract.contractClause) {
        this.$axios.get(`/v1/contracts/${this.contract.contractId}`)
          .then(resp => resp.data)
          .then(res => {
            if (res.errcode === 0) {
              this.$emit('update:contract', res.data)
            }
          })
      }
    },
    mounted() {
      this.contract && this.highlightCurrentState()
    },
    updated() {
      this.contract && this.highlightCurrentState()
    }
  }
</script>

<style lang="less" type="text/less">

  // policy 高亮
  .beauty-poliycy-box {
    min-width: 200px;
    display: inline-block;
    font-size: 14px;
    line-height: 1.6;
    color: #999;
    overflow: hidden;

    .bp-audience {
      margin-bottom: 10px;
    }
    .bp-declaration, .bp-state, .bp-s-row:not(:first-child) {
      padding-left: 20px;
    }

    .bp-state.active {
      min-width: 400px; margin-bottom: 5px; padding: 8px 20px;
      border: 1px solid #B3D7FF; border-radius: 20px;
      background: #E3F0FF; color: #222;
    }
    .bp-state.active .bp-s-transition {
      color: #EE6723;
    }

    .bp-state .bp-s-event {
      pointer-events: none;
    }
    .bp-state.active .bp-s-event {
      display: inline-block;
      cursor: pointer;
      color: #3e94f3;
      pointer-events: auto;
    }
  }


</style>

