<template>
    <div style="border: 1px solid #ccc; border-radius: 4px;">
        <div
            style="display: flex; align-items: center; justify-content: space-between; height: 45px; background-color: #fafbfb; padding: 0 15px; border-bottom: 1px solid #ccc; border-radius: 4px;">
            <span class="text-overflow-ellipsis"
                  style="font-size: 16px; color: #333; font-weight: 600; padding-right: 20px; max-width: 350px;">{{policyName}}</span>
            <el-button
                type="primary"
                size="mini"
                round
                @click="$emit('add')"
            >{{$t('license')}}
            </el-button>
        </div>
        <div style="height: 5px;"></div>
        <div style="">
            <pre style="font-size: 14px; color: #333; padding: 20px;">{{policyText}}</pre>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UnsignedContract",
        i18n: {
            messages: {
                en: {
                    license: 'License',
                },
                'zh-CN': {
                    license: '获取授权',
                }
            },
        },
        props: {
            policyName: {
                type: String,
                default: '标题',
            },
            policyText: {
                type: String,
                default: '',
            },
        },
    }
</script>

<style scoped>
    .text-overflow-ellipsis {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
