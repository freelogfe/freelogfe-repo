<template>
    <div style="height: 100%;">
        <LazyLoadingBox
            v-if="data.length > 0"
            :end="dataEnd"
            @toBottom="toBottom"
        >
            <!-- :disabled="exists.includes(i.id)" -->
            <div style="padding: 0 90px;">
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

        <div style="line-height: 300px; font-size: 16px; color: #333; text-align: center;"
             v-if="data.length === 0">
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
                    noCollection: 'You are not collecting any issue you in the market after the release of the collection will show up here'
                },
                'zh-CN': {
                    noCollection: '您还没有收藏任何发行，您在发行市场收藏的发行之后将会出现在这里'
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
                page: 1,
                data: [],
                dataEnd: false,
            };
        },
        methods: {
            async search() {
                const params = {
                    page: this.page,
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
                        // disabled: false,
                    }))
                ].filter(i => i.id !== this.currentID);
            },
            toBottom() {
                this.page++;
                this.search();
            },
        },
    }
</script>

<style scoped>

</style>
