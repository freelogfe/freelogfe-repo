<template>
    <div class="add-and-replace">
        <a
            style="color: #333; font-size: 14px; padding: 10px; cursor: pointer;"
            @click="dialogVisible = true"
        >
            <i class="el-icon-plus" style="font-size: 16px; font-weight: 600;"/>
            <span style="vertical-align: center;">新增测试展品</span>
        </a>

        <a
            @click="elDialogVisible = true"
            style="color: #333; font-size: 14px; padding: 10px; cursor: pointer;"
        >
            <i class="el-icon-refresh" style="font-size: 16px; font-weight: 600;"/>
            <span style="vertical-align: center;">替换依赖</span>
        </a>

        <DepDialog
            v-if="dialogVisible"
            :showMock="true"
            :exists="[]"
            :existMocks="[]"
            @addARelease="addARelease"
            @addAMock="addAMock"
            @removeARelease="removeARelease"
            @removeAMock="removeAMock"
            @onClose="dialogVisible = false"
            :currentID="''"
        />

        <el-dialog
            :visible="elDialogVisible"
            width="840px"
            :before-close="handleClose"
            custom-class="custom-class"
            :close-on-click-modal="false"
        >
            <div>
                <div style="text-align: right; padding-right: 10px; padding-top: 5px">
                    <i
                        @click="elDialogVisible = false"
                        class="el-icon-close"
                        style="font-size: 10px; color: #999; cursor: pointer;"
                    />
                </div>

                <div v-if="controlShowHide"
                     style="padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
                    <Replacer @onChange="replacerChange"/>
                    <i class="el-icon-back" style="transform: rotate(180deg)"/>
                    <Replaced @onChange="replacedChange"/>
                </div>

                <div
                    style="height: 50px; align-items: center; display: flex; flex-direction: row-reverse; padding: 0 20px;"
                >
                    <el-button
                        type="primary"
                        size="mini"
                        style="font-size: 14px;"
                        @click="confirmReplace"
                        :disabled="!replacer || !replaced"
                    >替换
                    </el-button>
                    <el-button
                        type="text"
                        size="mini"
                        style="font-size: 14px; padding: 0 20px; color: #999;"
                        @click="elDialogVisible = false"
                    >取消
                    </el-button>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import {decompile} from '@freelog/nmr_translator';
    import DepDialog from '@/components/DependentReleaseList/DepDialog/index.vue';
    import Replacer from './Replacer/index.vue';
    import Replaced from './Replaced/index.vue';

    export default {
        name: "index",
        components: {
            DepDialog,
            Replacer,
            Replaced,
        },
        props: {
            matchTestResult: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                elDialogVisible: false,
                dialogVisible: false,
                replacer: null,
                replaced: null,
                controlShowHide: true,
            };
        },
        methods: {
            async addARelease(data) {
                // console.log(data, 'datadata');
                const ruleObj = {
                    "tags": null,
                    "replaces": [],
                    "online": null,
                    "operation": "add",
                    "candidate": {
                        "name": data.name,
                        "type": "release",
                        versionRange: data.version,
                    },
                    "presentableName": data.name.replace(/^(.*)\//, '') + '_' + Array(4).fill(null).map(i => Math.floor(Math.random() * 36).toString(36)).join(''),
                };
                // console.log(JSON.stringify(ruleObj));
                const testRuleText = decompile([ruleObj]) + '\n';
                // console.log(testRuleText, 'testRuleText');
                const {nodeId} = this.$route.params;
                const res = await this.$axios.put(`/v1/testNodes/${nodeId}/additionalTestRule`, {
                    testRuleText: Buffer.from(testRuleText).toString('base64'),
                });
                if (res.data.errcode !== 0 || res.data.ret !== 0) {
                    return this.$message.error(JSON.stringify(res.data.data.errors));
                }
                // this.$message.success('添加规则成功');
                // this.$emit('success');
                this.pushRuleSuccess(res.data.data);
            },
            async addAMock(data) {
                const ruleObj = {
                    "tags": null,
                    "replaces": [],
                    "online": null,
                    "operation": "add",
                    "candidate": {
                        "name": data.name,
                        "type": "mock",
                        // versionRange: data.version,
                    },
                    "presentableName": data.name.replace(/^(.*)\//, '') + '_' + Array(4).fill(null).map(i => Math.floor(Math.random() * 36).toString(36)).join(''),
                };
                const {nodeId} = this.$route.params;
                const testRuleText = decompile([ruleObj]) + '\n';
                const res = await this.$axios.put(`/v1/testNodes/${nodeId}/additionalTestRule`, {
                    testRuleText: Buffer.from(testRuleText).toString('base64'),
                });
                if (res.data.errcode !== 0 || res.data.ret !== 0) {
                    return this.$message.error(JSON.stringify(res.data.data.errors));
                }
                this.pushRuleSuccess(res.data.data);

            },
            removeARelease() {

            },
            removeAMock() {

            },
            replacerChange(data) {
                this.replacer = data;
            },
            replacedChange(data) {
                this.replaced = data;
            },
            /**
             * 替换
             * @returns {Promise<ElMessageComponent>}
             */
            async confirmReplace() {
                const {nodeId} = this.$route.params;
                const testRuleText = handleRulesToNewText(this.replaced, this.replacer, this.matchTestResult);
                const res = await this.$axios.post(`/v1/testNodes`, {
                    nodeId,
                    testRuleText: Buffer.from(testRuleText).toString('base64'),
                });
                if (res.data.errcode !== 0 || res.data.ret !== 0) {
                    return this.$message.error(JSON.stringify(res.data.msg));
                }
                this.controlShowHide = false;
                setTimeout(() => {
                    this.controlShowHide = true;
                }, 30);
                this.pushRuleSuccess(res.data.data);
            },
            pushRuleSuccess(result) {
                this.$message.success('添加规则成功');
                this.$emit('success', result);
                this.elDialogVisible = false;
                this.dialogVisible = false;
                this.replacer = null;
                this.replaced = null;
            }
        }
    }

    /**
     * 将规则转换成 规则语言 文本
     */
    function handleRulesToNewText(replaced, replacer, matchTestResult = {}) {
        const testRules = [...matchTestResult.testRules];
        let rulesText = matchTestResult.ruleText;
        const changedPresentableName = new Set();
        for (const item of replaced.scope) {
            const arr = item.split('->');
            const presentableName = arr.shift();
            const scope = arr.map(i => text2Obj(i));
            changedPresentableName.add(presentableName);
            const rule = testRules.find(i => i.presentableName === presentableName);
            if (!rule) {
                testRules.push(newAlterRule(replaced, replacer, presentableName, scope.length > 0 ? [scope] : []));
            } else {
                updateAlterRule(replaced, replacer, rule, scope.length > 0 ? [scope] : []);
            }
        }
        for (const item of changedPresentableName) {
            const rule = testRules.find(i => i.presentableName === item);
            const oldText = rule.text;
            console.log(JSON.stringify(rule), 'rulerulerulerulerule');
            const newText = decompile([rule]);
            console.log(newText, 'newTextnewText');
            if (oldText) {
                rulesText = rulesText.replace(oldText, newText);
            } else {
                rulesText += ('\n' + newText);
            }
        }

        return rulesText;
    }

    /**
     * 新增 presentable 对象
     */
    function newAlterRule(replaced, replacer, presentableName, scopes = []) {
        const ruleObj = {
            text: '',
            "tags": null,
            "replaces": [
                {
                    "replaced": {
                        "name": replaced.name,
                        "versionRange": replaced.version,
                        "type": replaced.version ? 'release' : 'mock',
                    },
                    "replacer": {
                        "name": replacer.name,
                        "type": (typeof replacer.customer === 'boolean') ? "release" : 'mock',
                        versionRange: replacer.customer ? replacer.inputVersion : replacer.selectedVersion,
                    },
                    "scopes": scopes,
                }
            ],
            "online": null,
            "operation": "alter",
            "presentableName": presentableName,
        };
        return ruleObj;
    }

    /**
     * 更新已存在的 presentable
     * @param replaced
     * @param replacer
     * @param rule
     * @param scopes
     */
    function updateAlterRule(replaced, replacer, rule, scopes = []) {
        // console.log(replaced, replacer, rule, scopes, 'rulerulerule');
        const replaced1 = {
            name: replaced.name,
            versionRange: replaced.version,
            // type: replaced.version ? 'release' : 'mock',
            "type": replaced.version ? 'release' : 'mock',
        };
        const replacer1 = {
            name: replacer.name,
            // type: (typeof replacer.customer === 'boolean') ? 'release' : 'mock',
            "type": (typeof replacer.customer === 'boolean') ? "release" : 'mock',
            versionRange: replacer.customer ? replacer.inputVersion : replacer.selectedVersion,
        };
        // console.log(replaced1, 'replaced1');
        // console.log(replacer1, 'replacer1');
        const replace = rule.replaces.find(i => (toEqual(replaced1, i.replaced) && toEqual(replacer1, i.replacer)));
        if (replace) {
            return replace.scopes.push(scopes[0]);
        }
        rule.replaces.push({
            replaced: replaced1,
            replacer: replacer1,
            scopes: scopes,
        });

    }

    /**
     * 将文本 release 或 mock 转换成对象
     * @param text
     * @returns {{versionRange: *, name: *, type: (string)}}
     */
    function text2Obj(text) {
        const arr = text.split(/[:@]/);
        // console.log(arr, 'arrarr');
        return {
            name: arr[1],
            versionRange: arr[0] === '#' ? undefined : (arr[2] || '*'),
            type: arr[0] === '$' ? 'release' : 'mock',
        };
    }

    /**
     * 两个 release 或 mock 对象是否相等
     * @param obj1
     * @param obj2
     * @returns {boolean}
     */
    function toEqual(obj1, obj2) {
        console.log(obj1, obj2, 'obj1, obj2');
        return obj1.name === obj2.name
            && obj1.type === obj2.type
            && obj1.versionRange === obj2.versionRange;
    }
</script>

<style lang="less">
    .add-and-replace {
        .custom-class {
            .el-dialog__header {
                display: none;
            }

            .el-dialog__body {
                padding: 0;
            }
        }
    }

</style>
