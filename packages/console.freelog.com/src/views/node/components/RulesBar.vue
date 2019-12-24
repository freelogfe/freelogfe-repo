<template>
    <div class="rules-bar">
        <i
            v-for="j in rules"
            class="freelog"
            :class="getIconClass(j)"
        />
        <div v-if="rules.length === 0"></div>
    </div>
</template>

<script>
    export default {
        name: "RulesBar",
        props: {
            // add alter set_tags replace show hide
            rules: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        methods: {
            /**
             * 获取图标 class
             * @param operation
             * @returns {string}
             */
            getIconClass(operation) {
                switch (operation) {
                    case 'add':
                        // return 'el-icon-plus';
                        return 'fl-icon-add';
                    case 'alter':
                        // return 'el-icon-setting';
                        return 'fl-icon-edit';
                    case 'replace':
                        // return 'el-icon-refresh';
                        return 'fl-icon-replace';
                    case 'hide':
                        // return 'el-icon-bottom';
                        return 'fl-icon-outline';
                    case 'show':
                        // return 'el-icon-top';
                        return 'fl-icon-online';
                    case 'set_tags':
                        // return 'el-icon-tickets';
                        return 'fl-icon-tag';
                    default:
                        return '';
                }
            },
        }
    }
</script>

<style scoped lang="less">
    .rules-bar {
        color: #333;
        display: inline-block;

        i {
            padding: 4px;
        }

        div {
            border-top: 1px solid #b5b5b5;
            width: 16px;
        }

    }
</style>
