<template>
    <div style="height: 100%;">
        <LazyLoadingBox
            v-if="data.length > 0"
            :end="dataEnd"
            @toBottom="toBottom"
        >
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
                    @remove="$emit('remove', i)"/>
            </div>
        </LazyLoadingBox>
        <div style="line-height: 300px; font-size: 16px; color: #333; text-align: center;"
             v-if="data.length === 0">
            {{$t('noRelease')}}
        </div>
    </div>
</template>

<script>
    import DepItem from './DepItem.vue';
    import LazyLoadingBox from './LazyLoadingBox.vue';

    export default {
        name: 'Release',
        i18n: { // `i18n` 选项，为组件设置语言环境信息
            messages: {
                en: {
                    noRelease: 'You have not created any issue'
                },
                'zh-CN': {
                    noRelease: '您还没有创建任何发行'
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
                    isSelf: 1,
                    page: this.page,
                    pageSize: 10,
                };
                const res = await this.$axios.get('/v1/releases', {
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
                        isOnline: i.status === 1,
                        type: i.latestVersion.resourceInfo.resourceType,
                        version: i.latestVersion.version,
                        date: i.updateDate.split('T')[0],
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
