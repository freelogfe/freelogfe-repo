import LazyListView from '@/components/LazyListView/index.vue'
import SearchInput from '@/components/SearchInput/index.vue'
import ListItem from './release.vue'
import NodeExample from './node-example.vue'
import { loadAuthSchemes } from '@/data/scheme/loader'
import { RESOURCE_TYPES } from '@/config/resource'

export default {
	name: 'index-main-view',
	data() {
		return {
			resourceList: [],
			query: '',
			selectedType: this.$route.query.resourceType || 'all',
			tabs: [{
				name: 'market',
				path: '/',
			}, {
				name: 'node-examples',
				path: '/main/node-examples',
			}],
			activeTabName: '',
			searchInputStr: '',
			isInputFocus: false
		}
	},
	components: { ListItem, LazyListView, SearchInput, NodeExample },

	computed: {
		resourceTypes() {
			const $i18n = this.$i18n
			const arr = [{ label: $i18n.t('common.allTypes'), value: 'all' }]
			for (let [label, value] of Object.entries(RESOURCE_TYPES)) {
				arr.push({ label, value })
			}
			return arr
		},
	},

	watch: {
		'$route.query': function () {
			this.query = this.$route.query.q || ''
			this.queryHandler()
		},
		'$route.resourceType': function () {
			this.selectedType = this.$route.query.resourceType || 'all'
			this.queryHandler()
		},
		'$route.path': function () {
			this.resolvePath()
		}
	},

	mounted() {
		const qs = this.$route.query
		if (qs.q) {
			this.query = qs.q
		}
		this.resolvePath()
	},
	methods: {
		focusHandler() {
			this.isInputFocus = true
		},
		blurHandler() {
			this.isInputFocus = false
		},
		resolvePath() {
			const tabs = this.tabs
			const path = this.$route.path
			for(let i = 0; i < tabs.length; i++) {
				if (tabs[i].path === path) {
					this.activeTabName = tabs[i].name
					break
				}
			}
			this.activeTabName = this.activeTabName || tabs[0].name
		},
		exchangeActiveTabName(tab) {
			this.activeTabName = tab.name
			const path = +tab.index < this.tabs.length ? this.tabs[tab.index].path : this.tabs[0].path
			this.$router.push({ path })
		},
		exchangeSelectedResourceType(resourceType) {
			this.selectedType = resourceType 
			if (resourceType === 'all') {
				this.$router.push({ path: '/'})
			} else {
				this.$router.push({
					path: '/', 
					query: { resourceType }
				})
			}
		},
		autoQueryHandler() {
			if (this.timer) {
				clearTimeout(this.timer)
			}
			this.timer = setTimeout(() => {
				this.queryHandler()
			}, 8e2)
		},
    searchHandler(rType) {
			rType = rType === '' ? 'all' : rType
			this.exchangeSelectedResourceType(rType)
    },
		queryHandler() {
			if (this.timer) {
				clearTimeout(this.timer)
			}
			
			this.$refs.resourceList.$emit('reload', {})
		},
		fetchReleaseData(page) {
			const query = {
				page,
				pageSize: 30
			}
			if (this.query) {
				query.keywords = encodeURIComponent(this.query)
			}
			if (this.selectedType !== 'all') {
				query.resourceType = this.selectedType
			} 
			return this.loader(query).then((data) => {
				data.canLoadMore = !(data.dataList < data.pageSize)
				data.dataList = data.dataList.filter(r => r.policies.length > 0 && r.status === 1)
				const releases = data.dataList

				if (releases && releases.length) {
					const releasesMap = {}
					const rids = releases.map((r) => {
						releasesMap[r.resourceId] = r
						return r.resourceId
					})
				}

				return data
			})
		},
		loader(param) {
			if (typeof param === 'object') {
				if (param.keywords) {
					this.query = param.keywords
				}
				param = {
					params: param
				}
			}
			return this.$services.ReleaseService.get(param || {}).then(res => res.getData())
			// return this.$services.allResources.get(param || {}).then(res => res.getData())
		}
	}
}
