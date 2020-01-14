<template>
  <div class="fl-pagination" v-loading="loading">
    <el-table
            ref="table"
            @row-click="rowClickHandler"
            @selection-change="selectionChangeHandler"
            v-bind="tableProps"
            :empty-text="emptyText"
            style="width: 100%">
      <slot name="list"></slot>
    </el-table>
    <slot name="empty" v-if="tableProps.data.length === 0"></slot>
    <div class="fl-pg-ft clearfix" v-if="showFooter">
      <slot name="footer"></slot>
      <el-pagination
        class="fl-pg-info"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>


<script>
  import { axios } from '@freelog/freelog-common-lib'

  export default {
    name: 'fl-pagination',
    props: {
      emptyText: {
        type: String,
        default: '暂无数据'
      },
      pagination: {
        type: Object,
        default() {
          return {
            pageSize: 10
          }
        }
      },
      config: Object,
      rowClickHandler: {
        type: Function,
        default: () => {}
      },
      selectionChangeHandler: {
        type: Function,
        default: (args) => {}
      },
      formatHandler: Function,
      showFooter: {
        type: Boolean,
        'default': true
      }
    },
    data() {
      return {
        total: 8,
        tableProps: {
          data: []
        },
        currentPage: 1,
        pageSize: parseInt(window.sessionStorage.getItem(`${this.$route.fullPath}_page_size`)) || 10,
        loading: false
      }
    },
    watch: {
      pagination: {
        deep: true,
        handler() {
          this.reload()
        }
      },
      pageSize() {
        this.reload()
      }
    },
    methods: {
      
      loadData() {
        if (!this.pagination.target) {
          throw new Error('need pagination target param')
        }

        const params = {
          page: this.currentPage,
          pageSize: this.pageSize
        }

        this.source = axios.CancelToken.source()
        if (this.pagination.params) {
          Object.assign(params, this.pagination.params)
        }
        
        return this.$axios.get(this.pagination.target, {
          params,
          cancelToken: this.source.token
        }).then((res) => {
          if(res.data) {
            if (res.data.ret === 0 && res.data.errcode === 0) {
              return res.data.data
            }
            throw new Error(res.data.msg)
          }
        })
      },
      update(data) {
        if (!data || !data.dataList) return
        this.total = data.totalItem || data.dataList.length
        const list = (typeof this.formatHandler === 'function') ? this.formatHandler(data.dataList) : data.dataList
        this.tableProps.data = list
      },
      reload() {
        this.currentPage = 1
        if (this.loading && this.source) {
          this.loading = false
          this.source.cancel('cancel')
        }
        this.load()
      },
      load() {
        if (this.loading) return

        this.loading = true
        this.loadData()
          .then(this.update.bind(this))
          .then(() => {
            this.loading = false
            window.sessionStorage.setItem(`${this.$route.fullPath}_page_size`, this.pageSize)
          })
          .catch((err) => {
            if (!err.message || err.message !== 'cancel') {
              this.$error.showErrorMessage(err)
            }
            this.loading = false
          })
      },
      handleSizeChange(val) {
        this.pageSize = val
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.load()
      },
    },
    mounted() {
      Object.assign(this.tableProps, this.config)
      this.load()
    },
  }
</script>

<style lang="less">
  @import "index.less";
</style>
