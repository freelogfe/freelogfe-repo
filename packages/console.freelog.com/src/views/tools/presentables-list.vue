<i18n src="./tools.i18n.json"></i18n>
<template>
  <div class="tool-presentables-list">
    <div class="tpl-header">
      <h3>
        <span>{{$t('presentablesListTitle')}}</span>
        <el-select class="tpl-node-select" v-model="checkedNodeId" placeholder="请选择节点">
          <el-option v-for="node in nodes" :key="node.nodeId" :label="node.nodeName" :value="node.nodeId"></el-option>
        </el-select>
        <a :href="nodeSiteMap[checkedNodeId]" target="_blank"> {{nodeSiteMap[checkedNodeId]}}</a>
      </h3>
      <div class="tpl-btn-group">
        <el-button type="primary" @click="refreshPresentablesList">刷新列表</el-button>
      </div>
    </div>

    <template v-if="checkedNodeId !== ''">
      <f-pagination class="presentables-list-table"
                ref="presentableslistRef"
                :config="tableConfig"
                :formatHandler="formatHandler"
                :pagination="paginationConfig"
                :empty-text="pagenationEmptyText"
                :selectionChangeHandler="handleSelectionChange">
        <template slot="list">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column :label="$t('presentablesList.name')">
            <template slot-scope="scope">
              <div class="tpl-item-name-box">
                <el-button type="primary" size="mini">{{scope.row.releaseInfo.version}}</el-button>
                <div class="tpl-item-name" :title="scope.row.presentableName" v-if="!scope.row.isEdittingName">
                  <router-link :to="scope.row._toMangeDetailLink" target="_blank">{{scope.row.presentableName}}</router-link>
                  <i class="el-icon-edit" @click="editNameHandler(scope.row)"></i>
                </div>
                <el-input v-model="scope.row.presentableName" placeholder="请输入节点发行名称" v-else></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('presentablesList.type')" width="160">
            <template slot="header" slot-scope="scope">
              <el-dropdown class="tpl-types" @command="handleSelectType">
                <span class="el-dropdown-link">
                  {{$t('presentablesList.type')}} {{selectedType === 'all' ? '': ` ${selectedType}`}}<i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in resourceTypes" :key="item.value" :command="item.value">{{item.label}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <div class="trl-item-type"> {{scope.row.releaseInfo.resourceType}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('presentablesList.tags')" width="180">
            <template slot-scope="scope">
              <tags :value="scope.row.userDefinedTags" actionText="新标签" @input="(tags) => tagsChangeHandler(scope.row, tags)"></tags>
            </template>
          </el-table-column>
          <el-table-column :label="$t('presentablesList.onlineStatus')" width="80"> 
            <template slot-scope="scope">
              <el-switch 
                v-model="scope.row.lineStatus" @change="onlineChangeHandler(scope.row)"
                active-color="#13ce66" inactive-color="#ff4949"
                active-value="online" inactive-value="offline"></el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t('presentablesList.operate')" width="140">
            <template slot-scope="scope">
              <div class="tpl-row-btns">
                <el-button size="mini" @click="tapUpgradeBtn(scope.row)">{{$t('presentablesList.upgradeBtnText')}}</el-button>
                <el-button size="mini" @click="tapSaveBtn(scope.row)" v-if="scope.row.isChangePresentable">{{$t('presentablesList.saveBtnText')}}</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </f-pagination>
    </template>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import FPagination from '@/components/Pagination/index.vue'
  import FPolicyTabs from '@/components/PolicyTabs/index.vue'
  import Tags from '@/components/Tags/index.vue'
  import { RESOURCE_TYPES } from '@/config/resource'

  export default {
    name: 'tool-presentables-list',
    props: {},
    components: { FPagination, FPolicyTabs, Tags },
    data() {
      const qResourceType = this.$route.query.resourceType
      return {
        search: '',
        loader: null,
        tableConfig: {
          rowClassName: 'presentable-row',
          'cell-class-name': 'rel-row-cell',
          'show-header': true
        },
        paginationConfig: {
          pageSize: 20,
          reloadCount: 0,
          target: '/v1/presentables',
          params: {
            nodeId: '',
            isOnline: 2,
            resourceType: qResourceType != null ? qResourceType : undefined
          }
        },
        selectedType: qResourceType != null ? qResourceType : 'all',
        checkedNodeId: '',
        nodeSiteMap: {},
        selectedPresentables: []
      }
    },
    computed: {
      resourceTypes() {
        const $i18n = this.$i18n
        const arr = [{ label: $i18n.t('releaseList.allTypes'), value: 'all' }]
        for(let [label, value] of Object.entries(RESOURCE_TYPES)) {
          arr.push({ label, value })
        }
        return arr
      },
      ...mapGetters({
        session: 'session',
        nodes: 'nodes'
      }),
    },
    watch: {
      nodes() {
        this.resolveNodes()
      },
      checkedNodeId() {
        this.paginationConfig.params.nodeId = this.checkedNodeId
      }
    },
    mounted() {
      this.initView()
      this.resolveNodes()
    },
    methods: {
      resolveNodes() {
        if(this.nodes.length) {
          this.nodes.forEach(node => {
            this.nodeSiteMap[node.nodeId] = `${window.location.protocol}//${node.nodeDomain}.${window.FreelogApp.Env.mainDomain}`
          })
          this.checkedNodeId = this.nodes[0].nodeId
        }
      },
      initView() {
        if(this.nodes && this.nodes.length) {
          this.checkedNodeId = this.nodes[0].nodeId
        }
      },
      formatHandler(list) {
        if (!list || !list.length) {
          return []
        }
        
        list = list.map(presentable => {
          presentable.isEdittingName = false
          presentable.isChangePresentable = false
          presentable.lineStatus = +presentable.isOnline === 1 ? 'online' : 'offline'
          presentable._toMangeDetailLink = `/node/manager-release/${presentable.presentableId}`
          return presentable
        })
        list.sort((p1, p2) => +new Date(p2.updateDate) - (+new Date(p1.updateDate)))
        return list
      },
      refreshPresentablesList() {
        this.$refs.presentableslistRef.reload()
      },
      handleSelectType(command) {
        this.selectedType = command
        this.$router.push({
          query: { resourceType: command }
        })
        if(this.selectedType === 'all') {
          this.paginationConfig.params.resourceType = undefined
        }else {
          this.paginationConfig.params.resourceType = this.selectedType
        }
      },
      handleSelectionChange(selections) {
        this.selectedPresentables = selections
      },
      updatePresentable(presentable) {
        const { presentableName, userDefinedTags, releaseInfo: { releaseId } } = presentable
        
        return this.$services.PresentablesService.put(presentable.presentableId, {
          presentableName, userDefinedTags
        })
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            this.$message.success('保存成功！')
            presentable.isEdittingName = false
            presentable.isChangePresentable = false
          }else {
            this.$message.error('保存失败！')
          }
        })
      },
      tapSaveBtn(row) {
        this.updatePresentable(row)
      },
      tapUpgradeBtn(presentable) {
        const {presentableId, releaseInfo: {version, releaseId}} = presentable
        this.$services.ReleaseService.get(releaseId)
            .then(res => res.data)
            .then(res => {
                var _version = version
                if (res.errcode === 0) {
                    const {latestVersion} = res.data
                    _version = latestVersion.version
                }
                return _version
            })
            .then(_v => {
                return this.$services.PresentablesService.put(`${presentableId}/switchPresentableVersion`, {version: _v})
            })
            .then(res => res.data)
            .then(res => {
                if (res.errcode === 0) {
                    this.$message({type: 'success', message: '升级成功！'})
                } else {
                    this.$message({type: 'error', message: '升级失败！'})
                }
            })
            .catch(this.$error.showErrorMessage)
      },
      editNameHandler(row) {
        row.isEdittingName = true
        row.isChangePresentable = true
      },
      onlineChangeHandler(row) {
        const { lineStatus, presentableId, presentableName } = row
        var online = lineStatus === 'online' ? 1 : 0
        return this.$services.PresentablesService.put(`${presentableId}/switchOnlineState`, {
          onlineState: online
        })
        .then(res => res.data)
        .then(res => {
          if(res.errcode === 0) {
            const msg = online === 1 ? "上线成功！" : "下线成功！"
            this.$message.success(`「${presentableName}」${msg}`)
            row.online = online
          }else {
            const msg = online === 1 ? "上线失败！" : "下线失败！"
            this.$message.error(`「${presentableName}」${msg}:${res.msg}`)
            row.lineStatus = online === 1 ? "offline" : "online"
          }
        })
      },
      tagsChangeHandler(row, tags) {
        row.userDefinedTags = tags
        row.isChangePresentable = true
      }
    }
  }
</script>

<style lang="less" scoped>
.tool-presentables-list {
  .tpl-header {
    position: relative; background-color: #f5f5f5;

    h3 { 
      height: 72px;  padding: 0 20px;
      span { line-height: 72px; font-size: 16px; }
      .tpl-node-select { display: inline-block; margin: 0 12px; }
    }
    .tpl-btn-group {
      position: absolute; top: 0; right: 0;
      padding: 15px 20px; border-bottom: 1px solid #eee;  
    }
  }

  .tpl-item-name-box {
    display: flex; align-items: center; cursor: pointer;
    transform: translateX(-8px);

    .el-button { width: 62px; padding: 4px 6px; transform: scale(.7); }
    
    .tpl-item-name { 
      font-weight: 600; 
      a {
        color: #333;
        &:hover { text-decoration: underline; }
      }
    }
  }

  .tpl-row-btns {
    .el-button {
      padding: 4px 10px; margin-left: 0; margin-right: 8px;
    }
  }
  
}

</style>
<style lang="less">
  .tool-presentables-list {
    .tpl-types {
      display: block; padding: 0; color: #000;
    }
    .button-new-tag { margin-bottom: 0; padding: 7px 8px; }
    .user-defined-tag {
      padding-left: 0;
      &:before, &:after { display: none; }
      .el-tag {
        z-index: 5;
        margin-right: 8px; padding: 0 0 0 6px; border-left-width: 1px;
        .el-icon-close { right: 0; }
      }
    }
    
  }
  .tpl-node-select {
    .el-input__inner { height: 34px; line-height: 34px; font-size: 12px; }
    .el-input__icon { line-height: 34px; }
  }
</style>