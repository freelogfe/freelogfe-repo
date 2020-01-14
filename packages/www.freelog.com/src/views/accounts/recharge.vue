<template>
  <div class="account-recharge-view">
    <account-layout :title="navTitle">
      <div class="account-info-wrap">
        <!--<h5>充值方式（{{rechargeMethod}}）</h5>-->
        <el-form label-width="80px"
                 label-position="left">
          <el-form-item :label="$t('accounts.recharge.to')">
            {{renderData.accountName}} <span style="font-size: 20px; vertical-align: middle;">|</span> {{renderData.accountId}}
          </el-form-item>
          <el-form-item :label="$t('accounts.recharge.amount')">
            <el-input size="small" v-model="amount" style="width: 180px;"></el-input>
            <label class="input-tip">{{currencyInfo.abbr}}</label>
          </el-form-item>
          <el-form-item :label="$t('accounts.recharge.payAddr')">
            <div v-if="cardClips.length">
              <el-select v-model="cardNo"
                         size="small"
                         popper-class="cardNo-item-poper"
                         :placeholder="$t('accounts.recharge.payAccountPlaceholder')"
                         @change="changeCardClipHandler"
                         style="width: 600px;">
                <el-option :label="addr.label" :key="index" :value="addr.value"
                           v-for="(addr,index) in cardClips"></el-option>
                <el-option value="">
                  <el-button type="text"
                             @click="addNewCardHandler"
                             class="add-new-card-btn"><i class="el-icon-plus"></i>
                    {{$t('accounts.recharge.addNewText')}}{{addrName}}
                  </el-button>
                </el-option>
              </el-select>
              <div v-if="selectedCard">{{$t('accounts.recharge.currentText')}}{{addrName}}{{$t('accounts.recharge.balanceText')}} <span style="color: #607A97">
                {{selectedCard.balance|humanizeCurrency(currencyInfo.abbr)}}{{currencyInfo.abbr}}</span>
              </div>
            </div>
            <el-button v-else
                       @click="addNewCardHandler"
                       type="text"
                       class="add-new-card-btn"><i class="el-icon-plus"></i>{{$t('accounts.recharge.addText')}}{{addrName}}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <template slot="footer">
        <el-button class="ft-btn" type="primary" @click="rechargeHandler">{{$t('accounts.recharge.btn')}}</el-button>
      </template>
    </account-layout>
  </div>
</template>

<script>
import AccountTypes from '@/config/account-types'
import AccountLayout from '@/views/layout/account.vue'

export default {
  name: 'account-recharge-view',

  data() {
    return {
      amount: '',
      cardNo: '',
      cardClips: [],
      selectedCard: null,
      renderData: Object.assign(this.$route.params, this.$route.query)
    }
  },

  props: {},

  components: { AccountLayout },

  mounted() {
    this.loadCardclips()
      .then((list) => {
        this.cardClips = list.map(this.resolveCard)
      })

    if (this.renderData.accountId &&
        (!this.renderData.balance || !this.renderData.accountName)) {
      this.loadAccountInfo()
    }
  },

  computed: {
    navTitle() {
      return this.currencyInfo.name + this.$i18n.t('accounts.recharge.title')
    },
    currencyInfo() {
      const i = this.renderData.currencyType
      return this.$i18n.t(`accounts.currencyAccounts[${i}]`)
    },
    rechargeMethod() {
      let method
      switch (this.renderData.currencyType) {
        case 1:
          method = this.$i18n.t('accounts.recharge.currencyTypes[0]')
          break
        case 2:
        case 3:
        case 4:
        default:
          method = this.$i18n.t('accounts.recharge.currencyTypes[1]')
      }

      return method
    },
    addrName() {
      let name
      switch (this.renderData.currencyType) {
        case 1:
          name = this.$i18n.t('accounts.addrName[0]')
          break
        case 2:
        case 3:
        case 4:
        default:
          name = this.$i18n.t('accounts.addrName[1]')
      }

      return name
    }
  },

  methods: {
    loadAccountInfo() {
      this.$axios.get(`/v1/pay/accounts/${this.renderData.accountId}`)
        .then((res) => {
          const { data } = res.data
          if (res.data.ret === 0 && res.data.errcode === 0) {
            Object.assign(this.renderData, data)
          }
        })
    },
    resolveCard(card) {
      card.label = `${card.cardAlias || card.bankName} | ${card.cardNo}`
      card.value = card.cardNo
      return card
    },
    loadCardclips() {
      return this.$axios.get(`/v1/pay/cardclips?currencyType=${this.renderData.currencyType}`)
        .then((res) => {
          const { data } = res
          if (this.isSuccess(data)) {
            return data.data
          }
          return Promise.reject(data.msg)
        })
    },
    isSuccess(data) {
      return (data.ret === 0 && data.errcode === 0)
    },
    rechargeHandler() {
      this.$axios.post('/v1/pay/recharge', {
        accountId: this.renderData.accountId,
        cardNo: this.cardNo,
        amount: this.currencyInfo.unit * this.amount
      }).then((res) => {
        const { data } = res
        if (data.ret === 0 && data.errcode === 0) {
          let msg
          switch (data.data.tradeStatus) {
            case 1:
              msg = this.$i18n.t('accounts.recharge.tradeStatus[0]')
              break
            case 2:
              msg = this.$i18n.t('accounts.recharge.tradeStatus[1]')
              break
            case 3:
              msg = this.$i18n.t('accounts.recharge.tradeStatus[2]')
              break
            case 4:
              msg = this.$i18n.t('accounts.recharge.tradeStatus[3]')
              break
            default:
              msg = data.msg
          }

          if ([1, 3].includes(data.data.tradeStatus)) {
            this.$message.success(msg)
            this.$router.push('/user/accounts')
          } else {
            this.$message.error(msg)
          }
        } else {
          throw new Error(data.msg)
        }
      }).catch(this.$error.showErrorMessage)
    },
    addNewCardHandler() {
      this.$router.push({
        path: '/user/accounts/add',
        query: {
          currencyType: this.renderData.currencyType,
          backPath: this.$route.fullPath
        }
      })
    },
    changeCardClipHandler(cardNo) {
      const cardClips = this.cardClips
      this.selectedCard = null
      for (let i = 0; i < cardClips.length; i += 1) {
        if (cardClips[i].cardNo === cardNo) {
          this.loadAccountBalance(cardClips[i])
            .then((account) => {
              this.selectedCard = account
            })
        }
      }
    },
    loadAccountBalance(account) {
      return this.$axios.get('/v1/pay/helper/feather/balance', {
        params: {
          address: account.cardNo
        }
      }).then((res) => {
        const {
          data, ret, errcode, msg
        } = res.data
        if (ret === 0 && errcode === 0) {
          account.balance = data.balance
        } else {
          console.error(msg)
          account.balance = 0
        }
        return account
      })
    },
  }
}
</script>

<style lang="less" scoped type="text/less">
  .account-recharge-view {
    .account-info-content {
      display: flex;
      justify-content: center;
      .account-info-item {
        margin-right: 50px;
      }
    }

    .account-info-wrap {
      width: 740px;
      .input-tip {
        color: #999999;
        font-size: 14px;
        margin-left: 10px;
      }

      .form-item-tip {
        color: #999999;
        font-size: 14px;
      }
    }

    h5 {
      color: #999999;
      font-size: 12px;
      padding-left: 10px;
      padding-bottom: 5px;
      margin-bottom: 30px;
      border-bottom: 1px solid #EEEEEE;
    }
  }
</style>


<style lang="less">
  .cardNo-item-poper {
    .add-new-card-btn {
      padding: 0;
      .el-icon-plus {
        font-weight: bold;
        margin-right: 5px;
      }
    }
  }
</style>
