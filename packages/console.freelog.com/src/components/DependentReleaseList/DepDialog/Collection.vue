<template>
    <div style="height: 100%;">

        <!--        :endText="(data && data.length === 0) ? '没有符合条件的发行' : ''"-->
        <LazyLoadingBox
            :end="dataEnd"
            v-if="noData === false"
            :endText="(data && data.length === 0) ? $t('noConditions') : ''"
            @toBottom="toBottom"
        >
            <!-- :disabled="exists.includes(i.id)" -->
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

        <div
            style="line-height: 300px; font-size: 16px; color: #333; text-align: center;"
            v-if="noData === true"
        >
            {{$t('noCollection')}}
        </div>
    </div>
</template>

<script>

    import DepItem from './DepItem.vue';
    import LazyLoadingBox from './LazyLoadingBox.vue';

    export default {
        name: "Collection",
        i18n: { // `i18n` 选项，为组件设置语言环境信息
            messages: {
                en: {
                    noCollection: 'You are not collecting any issue you in the market after the release of the collection will show up here',
                    pleaseEnter: 'Please enter',
                    noConditions: 'Does not meet the conditions of release',
                },
                'zh-CN': {
                    noCollection: '您还没有收藏任何发行，您在发行市场收藏的发行之后将会出现在这里',
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
        mounted() {
            this.search();
        },
        data() {
            return {
                input: '',
                page: 1,
                data: [],
                dataEnd: false,
                noData: null,
            };
        },
        methods: {
            async search() {
                const params = {
                    page: this.page,
                    keywords: this.input,
                    pageSize: 10,
                };
                const res = await this.$axios.get('/v1/collections/releases', {
                    params,
                });
                const data = res.data.data;
                // console.log(res, 'resresresresres');
                this.dataEnd = data.page * data.pageSize >= data.totalItem;
                this.data = [
                    ...this.data,
                    ...data.dataList.map(i => ({
                        id: i.releaseId,
                        name: i.releaseName,
                        // isOnline: i.status === 1,
                        isOnline: i.releaseStatus === 1,
                        type: i.resourceType,
                        version: i.latestVersion.version,
                        date: i.releaseUpdateDate.split('T')[0],
                        versions: i.resourceVersions.map(i => i.version),
                        // disabled: false,
                    }))
                ].filter(i => i.id !== this.currentID);
                this.noData = (this.noData === null && this.data.length === 0);
            },
            toBottom() {
                this.page++;
                this.search();
            },
        },
        watch: {
            input() {
                this.page = 1;
                this.data = [];
                this.search();
            },
        },
    }
</script>

<style scoped>

</style>
