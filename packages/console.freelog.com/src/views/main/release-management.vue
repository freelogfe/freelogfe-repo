<template>
    <div class="release-management">
			<el-tabs class="main-c-tabs" v-model="activeTabName" @tab-click="exchangeActiveTabName">
				<el-tab-pane v-for="tab in tabs" :key="tab.path" :label="tab.label" :name="tab.name">
					<component :is="tab.component"></component>
				</el-tab-pane>
  		</el-tabs>
    </div>
</template>

<script>
	import ResourceList from '../resource/list/index.vue'
	import ReleaseList from '../release/list/index.vue'
	import ReleaseCollections from '../release/list/collections.vue'

	export default {
		name: 'release-management',
		components: {
			ResourceList, ReleaseList, ReleaseCollections
		},
		data() {
			const $i18n = this.$i18n 
			return {
				activeTabName: '',
				tabs: [{
					label: $i18n.t('routes.myResources'),
					name: 'resource-list',
					path: '/release-management/resource/list',
					component: ResourceList,
				}, {
					label: $i18n.t('routes.myReleases'),
					name: 'release-list',
					path: '/release-management/release/list',
					component: ReleaseList,
				}, {
					label: $i18n.t('routes.myCollections'),
					name: 'release-collections',
					path: '/release-management/release/collections',
					component: ReleaseCollections,
				}],
			}
		},
		watch: {
			'$route.path': function () {
				this.resolvePath()
			}
		},
		mounted() {
			this.resolvePath()
		},
		methods: {
			resolvePath() {
				const tabs = this.tabs
				const path = this.$route.path
				for(let i = 0; i < tabs.length; i++) {
					if (tabs[i].path === path) {
						this.activeTabName = tabs[i].name
						return
					}
				}
				this.activeTabName = tabs[0].name
			},
			exchangeActiveTabName(tab) {
				this.activeTabName = tab.name
				const path = +tab.index < this.tabs.length ? this.tabs[tab.index].path : this.tabs[0].path
				this.$router.push({ path })
			},
		},
	}
</script>

<style lang="less" scoped>
    @import "index.less";
</style>

<style lang="less">
    .index-main-container {
		
        .fl-lazy-list-view.resource-list {
            > ul {
                display: flex;
                flex-wrap: wrap;
                margin-left: -20px;
                justify-content: center;
            }
        }

        .res-placeholder-item,
        .resource-list-item {
            width: 220px;
            margin-left: 20px;
        }

        .resource-list-item {
            overflow: hidden;
            border-radius: 4px;
            background-color: #FFFFFF;
            margin-bottom: 20px;
            box-shadow: rgba(0, 0, 0, .2) 0 2px 2px 0;
		}
	}
	.release-management {
		.main-c-tabs {
			.el-tabs__header {
				background-color: #FAFBFB;
			}
		}
		.my-resources, .my-releases, .my-collections {
			.search-input {
				.el-input__inner {
					border-color: transparent; background-color: rgba(0, 0, 0, .03);
				}
				.el-input__prefix {
					left: 8px; line-height: 36px;
				}
				&.focus {
					.el-input__inner {
						// background-color: #fff;
					}
					.el-input__suffix {
						right: 8px; line-height: 36px;
					}
				}
			}
		}
		.el-table__header {
			th {
				.cell {
					color: #666;
				}
			}
		}
	}
</style>
