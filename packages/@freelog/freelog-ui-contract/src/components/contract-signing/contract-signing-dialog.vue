<!--<i18n src="../../i18n-locales/contractSigning.json"></i18n>-->
<template>
  <el-dialog
    :close-on-click-modal="false"
    width="1000px"
    top="5vh"
    :visible.sync="isShowDialog"
    @close="handleClose"
  >
    <div slot="title" class="contract-dialog-title">
      {{$t('contractSigning.dialog.title')}}<span>{{hostname}}</span>
    </div>
    <contract-signing-multi
            :selectedIndex.sync="selectedIndex"
            v-if="presentableList.length"
            :presentableList="presentableList"
            @cancel-sign="cancelSign"
            @updated-contract="hadUpdatedContract"
    ></contract-signing-multi>
  </el-dialog>
</template>

<script>

  import ContractSigningMulti from './signing-multi.vue'
  import en from '@freelog/freelog-i18n/ui-contract/en';
  import zhCN from '@freelog/freelog-i18n/ui-contract/zh-CN';

  export default {
    name: 'f-contract-signing-dialog',
    i18n: {
      messages: {
        en,
        'zh-CN': zhCN,
      }
    },
    components: { ContractSigningMulti },
    props: {
      visible: {
        type: Boolean
      },
      presentableList: {
        type: Array,
      },
      activeIndex: {
        type: Number
      }
    },
    data() {
      return {
        isShowDialog: false,
        callbackData: {},
        selectedIndex: 0,
        lastContractChangeNumber: 0,
        currentContractChangeNumber: 0
      }
    },
    methods: {
      init() {
        this.isShowDialog = this.visible
      },
      cancelSign(data) {
        this.isShowDialog = false
        this.callbackData = data
      },
      handleClose() {
        try {
          this.isShowDialog = false
          const data = {
            data: this.callbackData,
            isUpdatedContract: this.currentContractChangeNumber !== this.lastContractChangeNumber
          }
          this.$emit('close-dialog', data)
          this.$emit('update:visible', false)
          this.lastContractChangeNumber = this.currentContractChangeNumber
        } catch(e) {
          console.log('[e]:', e)
        }
      },
      hadUpdatedContract() {
        this.currentContractChangeNumber += 1
      }
    },
    computed: {
      hostname(){
        return window.location.hostname
      },
    },
    watch: {
      visible(newV) {
        this.isShowDialog = newV
      },
      activeIndex() {
        this.selectedIndex = this.activeIndex
      }
    },
    beforeMount() {
      this.init()
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .contract-dialog-title {
    color: #222;
    font-size: 16px;
    font-weight: bold;
    text-align: left;

    span {
      margin-left: 16px;
    }
  }

</style>
