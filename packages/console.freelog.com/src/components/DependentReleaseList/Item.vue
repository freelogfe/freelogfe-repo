<template>
    <div style="display: flex; align-items: center;">
        <div
            style="height: 40px; display: flex; align-items: center; padding-left: 5px; width: 50%;"
        >
            <a
                style="height: 20px; width: 20px; align-items: center; justify-content: center; display: flex;"
                :style="{cursor: !this.isLock ? 'pointer' : 'not-allowed'}"
                @click="onRemoveBtnClick"
            >
                <i
                    style="font-size: 18px;"
                    :style="{color: !this.isLock ? '#f02323': '#666'}"
                    :class="this.isLock ? 'el-icon-goods': 'el-icon-remove'"
                />
            </a>
            <span style="padding-left: 15px; font-size: 14px; color: #333; font-weight: 500;">{{this.name}}</span>
            <span
                v-if="!isOnline"
                style="background-color: #cdcdcd; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 12px; width: 70px; height: 22px; margin-left: 20px;"
            >{{$t('notOnline')}}</span>
        </div>

        <div v-if="version && !!versions && versions.length > 0" style="width: 50%; display: flex; align-items: center;">
            <SemverVersion
                v-if="!this.isLock && versions && versions.length > 0"
                :version="version"
                :versions="versions"
                @onConfirm="$emit('onVersionChange', $event)"
            >
                <a style="display: flex; cursor: pointer;">
                    <div style="font-size: 12px; color: #999; padding-right: 8px;">{{$t('versionRange')}}：{{version}}
                    </div>
                    <i class="freelog fl-icon-edit" style="font-size: 12px;"/>
                </a>
            </SemverVersion>
            <div v-else style="display: flex;">
                <!--                <div style="font-size: 12px; color: #999; padding-right: 8px;">版本范围：{{version === '*' ? '最新版本':-->
                <!--                    version}}-->
                <!--                </div>-->
                <div style="font-size: 12px; color: #999; padding-right: 8px;">{{$t('versionRange')}}：{{version}}</div>
            </div>
        </div>

    </div>
</template>

<script>
    import SemverVersion from './SemverVersion';

    export default {
        name: 'Item',
        i18n: { // `i18n` 选项，为组件设置语言环境信息
            messages: {
                en: {
                    versionRange: 'Version Range',
                    notOnline: 'No Online',
                },
                'zh-CN': {
                    versionRange: '版本范围',
                    notOnline: '未上线',
                },
            }
        },
        components: {
            SemverVersion
        },
        props: {
            isLock: {
                type: Boolean,
                default: false,
            },
            name: {
                type: String,
                default: '',
            },
            isOnline: {
                type: Boolean,
                default: true,
            },
            versions: Array,
            version: {
                type: String,
                default: '',
            }
            // onRemove: {
            //     type: Function,
            //     default() {
            //
            //     },
            // }
        },
        data() {
            return {
                // iconClass: {
                //     'el-icon-goods': this.isLock,
                //     'el-icon-remove': !this.isLock,
                // },
            };
        },
        methods: {
            onRemoveBtnClick() {
                if (this.isLock) {
                    return;
                }
                this.$emit('onRemove');
            },
        },

    }
</script>

<style scoped>

</style>
