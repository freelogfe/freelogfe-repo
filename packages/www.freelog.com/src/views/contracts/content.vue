<template>
  <div class="contract-content">
    <div class="contract-content-header">
      <div>
        <h5>{{$t('contracts.statusText')}}</h5>
        <div class="contract-status" :class="['status-'+contract.status]">{{ resolveStatus(contract.status) }}</div>
      </div>
      <div>
        <h5>{{$t('contracts.signTime')}}</h5>
        <div>{{contract.createDate | fmtDate('yyyy.MM.dd')}}</div>
      </div>
      <div>
        <h5>{{$t('contracts.updateTime')}}</h5>
        <div>{{contract.updateDate | fmtDate('yyyy.MM.dd')}}</div>
      </div>
      <div>
        <h5>{{$t('contracts.id')}}</h5>
        <div>{{contract.contractId}}</div>
      </div>
    </div>
    <div class="contract-content-body">
      <contract-detail :contract="contract"></contract-detail>
    </div>
  </div>
</template>

<script>
import { ContractDetail } from '@freelog/freelog-ui-contract'
export default {
  name: 'contract-content',

  props: {
    contract: Object,
  },

  components: {
    ContractDetail
  },

  data() {
    return {}
  },

  methods: {
    resolveStatus(status) {
      const statusArr = this.$i18n.t('contracts.status')
      let text
      switch (status) {
        case 1:
          text = statusArr[0]
          break
        case 2:
          text = statusArr[0]
          break
        case 4:
          text = statusArr[1]
          break
        case 3:
        case 5:
        case 6:
          text = statusArr[2]
          break
        default:
          text = statusArr[3]
      }

      return text
    },
  },
}
</script>

<style lang="less">
  .contract-content {
    border: 1px solid #E5E5E5; border-radius: 4px;
    background-color: #fafbfb;
    .contract-content-header {
      display: flex; 
      padding: 12px 20px; border-bottom: 1px solid #E5E5E5;
      font-size: 14px; font-weight: 600; color: #333;
      & > div { 
        flex: 1; 
        h5 { 
          margin-bottom: 6px; line-height: 17px; 
          font-size: 12px; font-weight: 400; color: #999; 
        }
        .contract-status {
          position: relative;
          height: 16px; margin-right: 5px; padding-left: 15px; 
          line-height: 18px; vertical-align: middle; font-size: 14px; font-size: 600;
          color: #333;

          &::after {
            content: '';
            position: absolute; top: 50%; left: 0; z-index: 10; transform: translateY(-50%);
            width: 10px; height: 10px; border-radius: 5px;
          }

          &.status-1,
          &.status-2 {
            &::after { background-color: #F5A623; }
          }

          &.status-4 {
            &::after { background-color: #7ED321; }
          }

          &.status-3,
          &.status-5,
          &.status-6 {
            &::after { background-color: #E36161; }
          }
        }
      }
    }
    .contract-content-body {
      padding: 20px;
    }
  }
</style>