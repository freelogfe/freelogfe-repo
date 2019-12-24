<template>
    <div style="height: 100%;">
        <LazyLoadingBox
            v-if="noData === false"
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
                    :type="i.type"
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
        >{{$t('noMock')}}</div>
    </div>
</template>

<script>
    import DepItem from './DepItem.vue';
    import LazyLoadingBox from './LazyLoadingBox.vue';

    export default {
        name: "Mock",
        i18n: { // `i18n` 选项，为组件设置语言环境信息
            messages: {
                en: {
                    pleaseEnter: 'Please enter',
                    noMock: 'You have not created any mock',
                    noConditions: 'Does not meet the conditions of resources',
                },
                'zh-CN': {
                    pleaseEnter: '请输入内容',
                    noMock: '您还没有创建任何mock',
                    noConditions: '没有符合条件的资源',
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
            },
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
                const res = await this.$axios.get('/v1/resources/mocks', {
                    params,
                });
                const data = res.data.data;
                this.dataEnd = data.page * data.pageSize >= data.totalItem;
                // console.log(res, 'resresresresres');
                this.data = [
                    ...this.data,
                    ...data.dataList.map(i => ({
                        id: i.mockResourceId,
                        name: i.fullName,
                        // isOnline: i.status === 1,
                        type: i.resourceType,
                        // version: i.latestVersion.version,
                        date: i.updateDate.split('T')[0],
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
