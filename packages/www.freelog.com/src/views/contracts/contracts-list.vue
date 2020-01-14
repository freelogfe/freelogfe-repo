<template>
  <div class="contract-detail-list">
    <el-table :data="list" style="width: 100%" :empty-text="emptyText">
      <el-table-column :label="$t('contracts.tableColumn[0]')" min-width="230">
        <template slot-scope="scope">
          <p class="contract-name">{{ scope.row.contractName }}</p>
          <p class="contract-id">
            <span>{{$t('contracts.id')}}</span>
            <span>{{scope.row.contractId}}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('contracts.tableColumn[1]')" min-width="180">
        <template slot-scope="scope">
          <contract-part :contract="scope.row" partyType="partyTwo"></contract-part>
        </template>
      </el-table-column>
      <el-table-column :label="$t('contracts.tableColumn[2]')" min-width="180">
        <template slot-scope="scope">
          <contract-part :contract="scope.row" partyType="partyOne"></contract-part>
        </template>
      </el-table-column>
      <el-table-column :label="$t('contracts.tableColumn[3]')" min-width="120">
        <template slot-scope="scope">
          <span class="contract-status" :class="['status-'+scope.row.status]">{{ resolveStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('contracts.tableColumn[4]')" min-width="155">
        <template slot-scope="scope">
          <p>{{scope.row.createDate | fmtDate('yyyy.MM.dd')}}</p>
          <!-- <p class="item-updateDate">
            <span>更新时间</span>
            <span>{{scope.row.updateDate | fmtDate('yyyy.MM.dd')}}</span>
          </p> -->
        </template>
      </el-table-column>
      <el-table-column :label="$t('contracts.tableColumn[5]')" width="80">
        <template slot-scope="scope">
          <el-button round size="mini" class="view-btn" @click="viewContractDetail(scope.row)">{{$t('contracts.viewBtn')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ContractPart from './part.vue'
export default {
  name: 'contracts-list',

  components: { ContractPart },

  props: {
    list: {
      type: Array,
      default: () => []
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    }
  },
  
  data() {
    return {
      
    }
  },

  methods: {
    viewContractDetail (row) {
      window.open(`${window.location.origin}/user/contracts/detail?contractId=${row.contractId}`)
    },
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
  }
}
</script>

<style lang="less" type="text/less">
  @import "../../styles/mixin.less";
  .contract-detail-list {
    min-height: 360px; padding: 10px 20px; border: 1px solid #e5e5e5; border-radius: 4px;
    background-color: #fafbfb;

    .el-table {
      th, tr {
        background-color: #fafbfb; color: #666;
      }

      .node-domain {
        .text-ellipsis;
      }
      .contract-row {
        font-size: 14px; color: #222222;
      }
      .contract-name {
        .text-ellipsis;
        font-size: 14px; font-weight: 600; color: #000;
      }
      .contract-type, .contract-id {
        font-size: 12px; color: #bfbfbf;
      }
      .contract-status {
        position: relative;
        height: 16px; margin-right: 5px; padding-left: 15px; 
        line-height: 18px; vertical-align: middle; font-size: 14px;
        transform: scale(.85); color: #333;

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
      .view-btn { color: #333; }
    }
  }

</style>