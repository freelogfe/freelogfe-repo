<template>
    <div ref="boxRef" style="height: 100%; overflow-y: auto;">
        <slot/>
        <div
            ref="loadingRef"
            style="font-size: 14px; color: #999; text-align: center; line-height: 40px; padding-top: 10px;"
        >
            <span v-show="!end">{{$t('loading')}}</span>
            <span v-show="end">{{$t('end')}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'LazyLoadingBox',
        i18n: { // `i18n` 选项，为组件设置语言环境信息
            messages: {
                en: {
                    loading: 'Loading...',
                    end: 'End'
                },
                'zh-CN': {
                    loading: '加载中......',
                    end: '加载完毕'
                },
            }
        },
        props: {
            end: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                func: null,
            };
        },
        mounted() {
            this.$refs.boxRef.onscroll = () => {
                if (this.end) {
                    return;
                }
                if (this.$refs.boxRef.getBoundingClientRect().bottom >= this.$refs.loadingRef.getBoundingClientRect().top) {
                    this.func = this.handleEvent;
                    setTimeout(() => {
                        if (this.func) {
                            this.func();
                            this.func = null;
                        }
                    }, 1000);

                }
            };
        },
        methods: {
            handleEvent() {
                this.$emit('toBottom');
            },
        }
    }
</script>

<style scoped>

</style>
