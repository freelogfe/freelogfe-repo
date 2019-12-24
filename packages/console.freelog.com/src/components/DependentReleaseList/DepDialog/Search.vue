<template>
    <LazyLoadingBox
        :end="dataEnd"
        :endText="(data && data.length === 0) ? $t('noConditions') : ''"
        @toBottom="toBottom"
    >
        <div style="padding: 0 90px;">
            <div style="height: 40px;"></div>
            <el-input
                v-model="input"
                :placeholder="$t('pleaseEnter')"
            >
                <i slot="prefix" class="el-input__icon el-icon-search"/>
            </el-input>
            <div style="height: 30px;"></div>

            <DepItem
                v-for="i in data"
                :name="i.name"
                :isOnline="i.isOnline"
                :type="i.type"
                :version="i.version"
                :date="i.date"
                @click="$emit('add', i)"
                :showRemove="exists.includes(i.id)"
                @remove="$emit('remove', i)"
            />
        </div>
    </LazyLoadingBox>
</template>

<script>
    import DepItem from './DepItem.vue';
    import LazyLoadingBox from './LazyLoadingBox.vue';

    export default {
        name: "Search",
        i18n: { // `i18n` 选项，为组件设置语言环境信息
            messages: {
                en: {
                    pleaseEnter: 'Please enter',
                    noConditions: 'Does not meet the conditions of release',
                },
                'zh-CN': {
                    pleaseEnter: '请输入内容',
                    noConditions: '没有符合条件的发行',
                },
            }
        },
        components: {
            DepItem,
            LazyLoadingBox,
        },
        props: {
            exists: {
                type: Array,
                default() {
                    return [];
                },
            },
            currentID: {
                type: String,
                default: '',
            }
        },
        data() {
            return {
                input: '',
                page: 1,
                data: [],
                dataEnd: false,
                searchTimeout: null,
            };
        },
        mounted() {
            // this.$refs.boxRef.onscroll = () => {
            //     if (this.dataEnd) {
            //         return;
            //     }
            //
            // };
            this.search();
        },
        methods: {
            async search() {
                const params = {
                    page: this.page,
                    keywords: this.input,
                    pageSize: 20,
                };
                const res = await this.$axios.get('/v1/releases', {
                    params,
                });
                // console.log(res, 'resresresresres');
                const data = res.data.data;
                this.dataEnd = data.page * data.pageSize >= data.totalItem;
                this.data = [
                    ...this.data,
                    ...data.dataList.map(i => ({
                        id: i.releaseId,
                        name: i.releaseName,
                        isOnline: i.status === 1,
                        type: i.latestVersion.resourceInfo.resourceType,
                        version: i.latestVersion.version,
                        date: i.updateDate.split('T')[0],
                        versions: i.resourceVersions.map(i => i.version),
                        // disabled: false,
                    }))
                ].filter(i => i.id !== this.currentID && i.isOnline);
            },
            toBottom() {
                this.page++;
                this.search();
            },
        },

        watch: {
            input() {
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }
                this.searchTimeout = setTimeout(() => {
                    this.page = 1;
                    this.data = [];
                    this.search();
                }, 1000);

            },
        },
    }
</script>

<style scoped>

</style>
