<template>
    <div
        style="border-bottom: 1px solid #e1e1e1; height: 68px; display: flex; justify-content: space-between; align-items: center;">
        <div>
            <div style="display: flex; align-items: center;">
                <span class="ellipsis"
                      style="padding-right: 20px; font-size: 20px; color: #333; max-width: 500px; display: inline-block;">{{name}}</span>
                <span
                    v-if="!isOnline"
                    style="background-color: #cdcdcd; border-radius: 2px; color: #fff; font-size: 12px; padding: 2px 9px;">{{$t('noOnline')}}</span>
            </div>
            <div style="font-size: 14px; color: #999;">
                <span>{{type | pageBuildFilter}}</span>
                <span v-if="!!version"> | v{{version}}</span>
                <span> | {{date}}</span>
            </div>
        </div>
        <!--        <el-button type="primary" round size="small" style="width: 70px;">加入</el-button>-->
        <el-button
            v-if="!showRemove"
            type="primary"
            round
            size="small"
            style="width: 70px; padding-left: 0; padding-right: 0;"
            :disabled="disabled"
            @click="$emit('click')"
        >{{disabled ? $t('added'): $t('add')}}
        </el-button>
        <el-button
            v-else
            type="danger"
            round
            size="small"
            style="width: 70px; padding-left: 0; padding-right: 0;"
            :disabled="disabled"
            @click="$emit('remove')"
        >{{$t('remove')}}
        </el-button>
    </div>
</template>

<script>
    export default {
        name: 'DepItem',
        i18n: { // `i18n` 选项，为组件设置语言环境信息
            messages: {
                en: {
                    noOnline: 'No Online',
                    added: 'Added',
                    add: 'Add',
                    remove: 'Remove'
                },
                'zh-CN': {
                    noOnline: '未上线',
                    added: '已添加',
                    add: '加入',
                    remove: '移除',
                },
            }
        },
        props: {
            name: {
                type: String,
                default: '',
            },
            isOnline: {
                type: Boolean,
                default: true,
            },
            type: {
                type: String,
                default: '',
            },
            version: {
                type: String,
                default: '',
            },
            date: {
                type: String,
                default: '',
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            showRemove: {
                type: Boolean,
                default: false,
            },
        },
    }
</script>

<style scoped>
    .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
