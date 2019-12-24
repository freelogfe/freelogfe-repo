<template>
    <el-popover
        placement="bottom-end"
        width="400"
        trigger="click"
        v-model="popoverShow"
    >
        <!--                            <el-button slot="reference">focus 激活</el-button>-->
        <!--        <a-->
        <!--            style="font-size: 12px; display: flex; align-items: center; cursor: pointer;"-->
        <!--            slot="reference"-->
        <!--        >-->
        <!--            <span>版本范围</span>-->
        <!--            <i class="el-icon-d-arrow-right" style="transform: rotate(90deg); font-size: 12px;"/>-->
        <!--        </a>-->
        <slot slot="reference"/>

        <div style="width: 100%; overflow: hidden;">
            <div style="display: flex; align-items: center;">
                <Radio
                    :selected="customer === false"
                    @click="customer = false"
                />

                <span style="padding: 0 10px; font-size: 14px; color: #333;">{{$t('selected')}}</span>
                <el-select
                    size="mini"
                    style="width: 100px;"
                    v-model="selectedVersion"
                    :disabled="customer !== false"
                >
                    <!--                    <el-option label="最新版本" value="*"/>-->
                    <el-option
                        v-for="v in [...versions].reverse()"
                        :label="v"
                        :value="v"
                    />
                </el-select>
                <div
                    style="font-size: 12px; display: flex; align-items: center; justify-content: flex-end; flex-shrink: 1; width: 200px;">
                    <el-checkbox
                        size="mini"
                        v-model="checked"
                        :disabled="customer !== false"
                    />
                    <span style="padding-left: 8px;">{{$t('allowsChanges')}}</span>
                </div>
            </div>
            <div style="height: 10px;"/>
            <div>
                <div style="display: flex; align-items: center;">
                    <Radio :selected="customer === true" @click="customer = true"/>
                    <span style="padding: 0 10px; font-size: 14px; color: #333;">{{$t('custom')}}</span>
                </div>
                <div v-show="customer === true">
                    <div style="height: 5px;"></div>
                    <el-input
                        v-model="inputVersion"
                        :placeholder="$t('enterSemver')"
                        style="display: block;"
                    />
                </div>
            </div>
            <div style="height: 10px;"></div>
            <div
                style="align-items: center; display: flex; flex-direction: row-reverse; width: 100%;"
            >
                <el-button
                    type="primary"
                    size="mini"
                    style="font-size: 12px;"
                    @click="confirm"
                    :disabled="customer === null || (customer === true && !semverValid())"
                >{{$t('confirm')}}</el-button>
                <el-button
                    type="text"
                    size="mini"
                    style="font-size: 12px; padding: 0 20px; color: #999;"
                    @click="popoverShow = false"
                >{{$t('cancel')}}</el-button>
            </div>
        </div>
    </el-popover>
</template>

<script>
    import semver from 'semver';
    import Radio from './Radio';

    export default {
        name: "index",
        i18n: { // `i18n` 选项，为组件设置语言环境信息
            messages: {
                en: {
                    selected: 'Selected',
                    custom: 'Custom',
                    allowsChanges: 'Allows changes version',
                    enterSemver: 'Enter semver version range',
                    confirm: 'Confirm',
                    cancel: 'Cancel',
                },
                'zh-CN': {
                    selected: '选定版本',
                    custom: '自定义',
                    allowsChanges: '允许使用当前版本的最新变动',
                    enterSemver: '输入semver版本范围',
                    confirm: '确定',
                    cancel: '取消',
                },
            }
        },
        components: {
            Radio,
        },
        props: {
            versions: {
                type: Array,
                default() {
                    return [];
                }
            },
            version: {
                type: String,
                default: '',
            }
        },
        data() {
            return {
                popoverShow: false,
                customer: null,
                selectedVersion: this.version.replace('^', ''),
                checked: this.version.startsWith('^'),
                // versions: ['1.1.2', '1.2.2'],
                inputVersion: this.version
            }
        },
        methods: {
            confirm() {
                // const version = customer ===
                // console.log(this.selectedVersion, this.inputVersion, '##########');
                let version = '';
                if (this.customer === false) {
                    version = (this.checked ? '^' : '') + this.selectedVersion;
                } else if (this.customer === true) {
                    version = this.inputVersion;
                }
                this.popoverShow = false;
                this.$emit('onConfirm', version);
            },
            semverValid() {
                return this.inputVersion && semver.validRange(this.inputVersion);
            }
        }
    }
</script>

<style scoped>

</style>
