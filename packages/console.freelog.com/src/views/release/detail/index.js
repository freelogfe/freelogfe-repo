import { format } from 'date-fns'
import { mapGetters } from 'vuex'
import RichEditor from '@/components/RichEditor/index.vue'
import SchemeManage from '../scheme/index.vue'
import ReleaseDependItem from '../scheme/depend-item.vue'
import SignedConfirm from './signed-confirm.vue'
import PoliciesCompare from './policies-compare.vue'
import signPolicyList from './sign-policy-list.vue'
import { versionDescendingOrder, togglePolicy } from '@/lib/utils.js'

export default {
  name: "release-detail",
  components: { RichEditor, SchemeManage, ReleaseDependItem, signPolicyList, SignedConfirm, PoliciesCompare },
  data() {
    return {
      releaseId: this.$route.params.releaseId,
      releaseName: this.$route.query.releaseName,
      activeReleaseVersion: this.$route.query.version,
      isOwnRelease: false,
      isOnline: true,
      isUsable: true,
      isShowContentLoading: false,
      isCollectedRelease: false,
      release: null,
      selectedRelease: null,
      baseUpcastReleasesList: [],
      contractsMap: {},
      nodeContractsMap: {},
      nodeContracts: [],
      checkedNodeList: [],
      checkedNodeId: '',
      rSubordinateNodes: [],
      upcastDepReleasesMap: null,
      pCombinationIDMap: {},
      resourceDetail: {
        resourceInfo: {
          description: ''
        }
      },
      compareDialogVisible: false,
      signDialogVisible: false,
    }
  },
  computed: Object.assign({
    projection() {
      return ["releaseId", "resourceType", "releaseName", "latestVersion", "baseUpcastReleases", "policies", "updateDate","status"].join(',')
    },
    releaseMap() {
      const map = {}
      map[this.release.releaseId] = this.release
      this.baseUpcastReleasesList.forEach(r => {
        map[r.releaseId] = r
      })
      return map
    },
    nodeMap() {
      const map = {}
      if (this.nodes != null) {
        for(let node of this.nodes) {
          map[node.nodeId] = node
        }
      }
      return map
    },
    checkedNode() {
      return this.nodeMap[this.checkedNodeId] || {
        nodeId: '',
        nodeName: '',
        isSigned: false
      }
    },
    nodeSelections() {
      const tmpMap = {}
      for (let node of this.rSubordinateNodes) {
        tmpMap[node.nodeId] = node
      }
      return this.nodes.map(node => {
        if (tmpMap[node.nodeId] != null) {
          node.isSigned = true
          node.presentableId = tmpMap[node.nodeId].presentableId
        } else {
          node.isSigned = false 
        }
        return node
      })
    },
    checkedNodeNameIsSigned() {
      for (let node of this.rSubordinateNodes) {
        if (node.nodeId === this.checkedNodeId) {
          return true
        }
      }
      return false
    },
    targetResourceId() {
      const rVersions = this.release.resourceVersions
      var resourceId = ''
      for(let i = 0; i < rVersions.length; i++) {
        if(rVersions[i].version === this.activeReleaseVersion) {
          resourceId = rVersions[i].resourceId
          break
        }
      }
      return resourceId
    }
  }, mapGetters({
    nodes: 'nodes',
    session: 'session'
  })),
  watch: {
    activeReleaseVersion(newV, oldV) {
      if(oldV !== '') {
        this.$router.replace(`/release/detail/${this.release.releaseId}?version=${newV}`)
        this.fetchResourceDetail()
      }
    },
    async checkedNodeId() {
      this.isShowContentLoading = true
      const contracts = await this.getContracts(this.checkedNodeId)
      if(contracts != null) {
        const map = {}
        const nodeContracts = contracts.map(c => (map[c.targetId + '-' + c.policyId] = c))
        this.resolveReleaseSelectedPolicies(map)
        this.nodeContracts = nodeContracts
        this.isShowContentLoading = false
      } 
    },
  },
  async created() {
    try {
      if (this.releaseId) {
        await this.fetchReleaseDetail(true)
      } else if (this.releaseName){
        await this.fetchReleaseDetail(false)
      }
      this.fetchReleaseSubordinateNodes()
      this.getColleactedStatus()
    } catch(e) {
      console.error(e)
    }
  },
  methods: {
    async getData(apiPromise) {
      const response = await apiPromise
      const res = response.data
      if (res.errcode === 0) {
        return res
      } else {
        this.$error.showErrorMessage(res.msg)
        return null
      }
    },
    getReleaseDetailById() {
      return this.$services.ReleaseService.get(this.releaseId)
    },
    getReleaseDetailByName() {
      return this.$services.ReleaseService.get(`/detail?releaseName=${encodeURIComponent(this.releaseName)}`)
    },
    async fetchReleaseDetail(isById = true) {
      let res = null
      if (isById) {
        res = await this.getData(this.getReleaseDetailById())
      } else {
        res = await this.getData(this.getReleaseDetailByName())
      }
      if(res != null) {
        await this.resolveReleaseDetail(res.data)
      } 
    },
    // 获取发行详情
    async resolveReleaseDetail(data) {
      this.releaseId = data.releaseId
      this.release = this.selectedRelease = data
      this.release.selectedPolicies = []
      this.isOnline = this.release.status === 1
      if (this.activeReleaseVersion == null) {
        this.activeReleaseVersion = data.latestVersion.version
      }
      
      this.formatReleaseData()
      this.fetchResourceDetail()
      this.fetchUpcastDepReleases()
      if(this.session && this.session.user) {
        this.isOwnRelease = this.release.userId === this.session.user.userId
      }
    },
    // 获取资源详情
    async fetchResourceDetail() {
      if (this.targetResourceId === '') return 
      const res = await this.getData(this.$services.ResourceService.get(this.targetResourceId))
      if (res != null) {
        this.resourceDetail.resourceInfo = res.data
      }
    },
    // 获取 依赖发行的上抛发行详情
    async fetchUpcastDepReleases() {
      const bUpcastReleases = this.release.baseUpcastReleases
      if(bUpcastReleases.length) {
        const ids = bUpcastReleases.map(r => r.releaseId).join(',')
        const p = this.$services.ReleaseService.get(`list?releaseIds=${ids}&projection=${this.projection}`)
        const res = await this.getData(p)
        if(res != null) {
          const arr = res.data || []
          this.upcastDepReleasesMap = {}
          for(let i = 0; i < arr.length; i++) {
            this.isUsable = arr[i].status === 1 && this.isUsable
            let releaseId = arr[i].releaseId
            arr[i].policies = arr[i].policies.map(p => {
              p.pCombinationID = `${arr[i].releaseId}-${p.policyId}`
              this.pCombinationIDMap[p.pCombinationID] = { releaseName: arr[i].releaseName, policyName: p.policyName }
              return p
            })
            arr[i].selectedPolicies = []
            this.upcastDepReleasesMap[releaseId] = arr[i]
          }
          this.baseUpcastReleasesList = arr
        }
      }
    },
    async getContracts(nodeId) {
      if(this.nodeContractsMap[nodeId]) {
        return this.nodeContractsMap[nodeId]
      } else {
        const contracts = await this.fetchContracts(nodeId)
        return contracts
      }
    },
    // 获取发行与节点的签约数据
    async fetchContracts(nodeId) {
      const targetIds = [this.releaseId]
      this.baseUpcastReleasesList.forEach(r => targetIds.push(r.releaseId))
      const p = this.$services.ContractService.get('list', {
        params: {
          contractType: 2,
          targetIds: targetIds.join(','),
          partyTwo: nodeId
        }
      })
      const res = await this.getData(p)
      if(res != null) {
        this.nodeContractsMap[nodeId] = res.data.map(c => {
          this.contractsMap[c.contractId] = c
          return c
        })
        return res.data
      }
    },
    resolveReleaseSelectedPolicies(contractsMap) {
      var targetReleases = [ this.release, ...this.baseUpcastReleasesList ]
      for(let r of targetReleases) {
        for(let p of r.policies) {
          const contract = contractsMap[p.pCombinationID]
          if (contract) {
            p.contract = contract
            p.contractId = contract.contractId
            p.isSelected = true
            togglePolicy(r.selectedPolicies, p, 'add')
          } else {
            p.contract = null
            p.contractId = ''
            p.isSelected = false
            togglePolicy(r.selectedPolicies, p, 'delete')
          }
        }
      }
    },
    // 查询当前发行已签约生成presentables列表，从而获知发行已和哪些节点签约
    async fetchReleaseSubordinateNodes() {
      const p = this.$services.PresentablesService.get(`list`, {
        params: {
          releaseIds: this.releaseId,
          userId: this.session.user.userId,
          projection: 'nodeId,presentableId'
        }
      })
      const res = await this.getData(p)
      if(res != null) {
        this.rSubordinateNodes = res.data
      } 
    },
    // 获取 收藏状态
    async getColleactedStatus() {
      const res = await this.getData(this.$services.collections.get(`isCollection?releaseIds=${this.releaseId}`))
      if(res != null && res.data && res.data.length > 0) {
        this.isCollectedRelease = res.data[0].isCollection
      }else {
        this.isCollectedRelease = false
      }
    },
    // 重新处理发行详情数据
    formatReleaseData() {
      this.release.policies = this.release.policies.filter(p => p.status === 1).map(p => {
        p.pCombinationID = `${this.release.releaseId}-${p.policyId}`
        this.pCombinationIDMap[p.pCombinationID] = { releaseName: this.release.releaseName, policyName: p.policyName }
        return p
      })
      this.release.resourceVersions = this.release.resourceVersions.sort(versionDescendingOrder).map(i => {
        i.createDate = format(i.createDate, 'YYYY-MM-DD')
        return i
      })
    },
    // 处理 收藏
    async collectReleaseHandler() {
      if(!this.isCollectedRelease) {
        const res = await this.getData(this.$services.collections.post({ releaseId: this.releaseId }))
        if(res != null) {
          this.isCollectedRelease = true
        }
      }else {
        const res = await this.getData(this.$services.collections.delete(this.releaseId))
        if(res != null) {
          this.isCollectedRelease = false
        }
      }
    }, 
    // 切换“选中的发行”
    exchangeSelectedRelease(release) {
      this.selectedRelease = release
    },
    exchangeComparePolicy(item, index) {
      item.activeIndex = index
    },
    showSignBox() {
      if(!this.isUsable) return 

      var message = ''
      if(this.checkedNodeId === '') {
        message = this.$i18n.t('messages[0]')
      }else {
        var tmpArr = []
        if(this.release.selectedPolicies.length === 0) {
          tmpArr.push(this.release.releaseName)
        }
        this.baseUpcastReleasesList.forEach(r => {
          if(r.selectedPolicies.length === 0) {
            tmpArr.push(r.releaseName)
          }
        })
        if(tmpArr.length > 0) {
          message = `${this.$i18n.t('release')}${tmpArr.join(',')}”${this.$i18n.t('messages[1]')}`
        }
      }
      
      if(message === '') {
        this.signDialogVisible = true
      }else {
        this.$message({ type: 'warning', message })
      }
    },
    async signNewPolicy() {
      try {
        const p = this.$services.PresentablesService.put(this.checkedNode.presentableId, {
          resolveReleases: this.getRosolveReleases(),
        })
        const res = await this.getData(p)
        if (res != null) {
          const message = this.$i18n.t('messages[2]')
          this.$message({ type: 'success', message })
          const contracts = await this.fetchContracts(this.checkedNodeId)
          if(contracts != null) {
            const map = {}
            const nodeContracts = contracts.map(c => (map[c.targetId + '-' + c.policyId] = c))
            this.resolveReleaseSelectedPolicies(map)
            this.nodeContracts = nodeContracts
          } 
        }
      } catch(e) {
        console.error(e)
      }
    },
    // 获取授权：即创建presentable
    async authSign() {
      try {
        const nodeId = this.checkedNodeId
        var regE = new RegExp(`${this.release.username}/`, 'i')
        const self = this
        const p = this.$services.PresentablesService.post({
          nodeId,
          releaseId: this.releaseId,
          presentableName: this.release.releaseName.replace(regE, ''),
          version: this.activeReleaseVersion,
          resolveReleases: this.getRosolveReleases(),
        })
        const res = await this.getData(p)
        if(res != null) {
          const { nodeId, presentableId } = res.data
          this.rSubordinateNodes.push({ nodeId, presentableId })
          this.signDialogVisible = false
          const message = this.$i18n.t('messages[3]')
          this.$message({ type: 'success', message, duration: 500, onClose() {
            self.$router.push(`/node/manager-release/${presentableId}`)
          }})
        }
      } catch(e) {
        console.error(e)
      }
    },
    // 签约数据：已选择发行以及其上抛发行的策略
    getRosolveReleases() {
      const tmpMap = {}
      var targetArr = []
      targetArr = [ ...targetArr, ...resolveSelectedPolicies(this.release) ]
      this.baseUpcastReleasesList.forEach(release => {
        targetArr = [ ...targetArr, ...resolveSelectedPolicies(release) ]
      })
      return targetArr

      function resolveSelectedPolicies(release) {
        const targetArr = []
        release.selectedPolicies.forEach(p => {
          const { policyId } = p
          const { releaseId } = release
          if(tmpMap[releaseId]) {
            tmpMap[releaseId].contracts.push({ policyId })
          }else {
            const rItem = { releaseId, contracts:[{ policyId }]}
            tmpMap[releaseId] = rItem
            targetArr.push(rItem)
          }
        })
        return targetArr
      }
    },
    
  }
}
