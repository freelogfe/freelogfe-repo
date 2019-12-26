import OverviewHeader from './OverviewHeader';
import ModuleBlock from './ModuleBlock';
import BlockItem from './BlockItem';
import ConfirmInput from './ConfirmInput';
import FreelogTags from '@/components/Tags/index.vue';
import ContentBlock from './ContentBlock.vue';
import DisplayEditContracts from './DisplayEditContracts/index.vue';
import {decompile} from "@freelog/nmr_translator";
import BreadCrumb from '@/components/BreadCrumb/index.vue';

export default {
    name: 'index',
    components: {
        ConfirmInput,
        BlockItem,
        ModuleBlock,
        OverviewHeader,
        FreelogTags,
        DisplayEditContracts,
        ContentBlock,
        BreadCrumb,
    },
    data() {
        return {
            // 对应的正式 PresentableId
            nodePresentableId: '',
            testResourceID: '',
            matchTestResult: {},
            nodeId: '',
            originInfo: null,
            isOnline: false,
            testResourceName: '',
            versions: [],
            versionValue: '',
            userDefinedTags: [],
            activatedThemeId: '',
        };
    },
    mounted() {
        this.handleData(true);
        // this.matchTestResources();
    },
    methods: {
        async matchTestResources(nodeId) {
            // const {nodeId} = this.$route.params;
            const res = await this.$axios.post(`/v1/testNodes/${nodeId}/matchTestResources`);
            const result = res.data.data;
            // console.log(result.themeId, 'result.themeIdresult.themeId');
            this.activatedThemeId = result.themeId;
            this.matchTestResult = {
                ruleText: result.ruleText,
                testRules: result.testRules.map(i => ({text: i.text, ...i.ruleInfo}))
            };
            // console.log(this.matchTestResult, 'this.matchTestResult');
        },
        async handleData(bool = false) {
            const {testResourceID} = this.$route.params;
            const res = await this.$axios.get(`/v1/testNodes/testResources/${testResourceID}`);
            // console.log(res, 'RRRRRRRRR');
            const data = res.data.data;

            this.nodeId = data.nodeId;
            this.testResourceID = testResourceID;
            this.nodePresentableId = data.nodePresentableId;
            if (bool) {
                this.matchTestResources(data.nodeId);
            }

            this.originInfo = {
                theID: data.originInfo.id,
                name: data.originInfo.name,
                previewImage: data.previewImages[0],
                type: data.originInfo.type,
                version: data.originInfo.versions.reverse()[0],
                intro: data.intro,
                resourceType: data.resourceType,
            };

            this.isOnline = data.differenceInfo.onlineStatusInfo.isOnline === 1;
            this.versions = data.originInfo.versions;
            this.versionValue = data.originInfo.version;
            this.testResourceName = data.testResourceName;
            this.userDefinedTags = data.differenceInfo.userDefinedTagInfo.tags;
        },
        pushRuleSuccess(result) {
            this.activatedThemeId = result.themeId;
            this.matchTestResult = {
                ruleText: result.ruleText,
                testRules: result.testRules.map(i => ({text: i.text, ...i.ruleInfo}))
            };
            this.handleData();
        },
        /**
         * 上下线
         */
        async onLineAndOffLine() {
            // console.log('SSSSXXXXXXXX');
            const testRules = [...this.matchTestResult.testRules];
            const oldRulesText = this.matchTestResult.ruleText;
            const testResourceName = this.testResourceName;
            // const isOnline = this.isOnline;

            const rule = testRules.find(i => i.presentableName === testResourceName);
            // console.log(rule, 'rulerulerulerule');
            let newRulesText;
            if (rule) {
                rule.online = !this.isOnline;
                const ruleText = decompile([rule]);
                newRulesText = oldRulesText.replace(rule.text, ruleText);
            } else {
                const ruleObj = {
                    "tags": null,
                    "replaces": [],
                    "online": !this.isOnline,
                    "operation": "alter",
                    "presentableName": testResourceName,
                };
                // console.log(decompile([ruleObj]), 'decompile([ruleObj])');
                newRulesText = oldRulesText + '\n' + decompile([ruleObj]);
            }

            const res = await this.$axios.post(`/v1/testNodes`, {
                nodeId: this.nodeId,
                testRuleText: Buffer.from(newRulesText).toString('base64'),
            });

            if (res.data.errcode !== 0 || res.data.ret !== 0) {
                return this.$message.error(JSON.stringify(res.data.data.errors));
            }
            this.isOnline ? this.$message.success('下线成功') : this.$message.success('上线成功');
            // this.handleTableData();
            this.pushRuleSuccess(res.data.data);
        },
        /**
         * 激活主题
         */
        async activateTheme() {
            const testRules = [...this.matchTestResult.testRules];
            const oldRulesText = this.matchTestResult.ruleText;
            const testResourceName = this.testResourceName;

            const rule = testRules.find(i => i.operation === 'activate_theme');

            let newRulesText;
            if (rule) {
                newRulesText = oldRulesText.replace(rule.text, `activate_theme ${testResourceName}`);
            } else {
                newRulesText = `activate_theme ${testResourceName}` + '\n' + oldRulesText;
            }

            const res = await this.$axios.post(`/v1/testNodes`, {
                nodeId: this.nodeId,
                testRuleText: Buffer.from(newRulesText).toString('base64'),
            });

            if (res.data.errcode !== 0 || res.data.ret !== 0) {
                return this.$message.error(JSON.stringify(res.data.data.errors));
            }
            this.$message.success('激活成功');
            this.pushRuleSuccess(res.data.data);

        },
        async confirmChange(value) {
            console.log(value, 'valuevaluevalue');
            const testRules = [...this.matchTestResult.testRules];
            const oldRulesText = this.matchTestResult.ruleText;

            const rule = testRules.find(i => i.presentableName === this.testResourceName);
            rule.presentableName = value;
            const ruleText = decompile([rule]);

            const newRulesText = oldRulesText.replace(rule.text, ruleText);
            // console.log(newRulesText, 'newRulesTextnewRulesText');
            const res = await this.$axios.post(`/v1/testNodes`, {
                nodeId: this.nodeId,
                testRuleText: Buffer.from(newRulesText).toString('base64'),
            });
            if (res.data.errcode !== 0 || res.data.ret !== 0) {
                return this.$message.error(JSON.stringify(res.data.data.errors));
            }
            this.$message.success('更新名称成功');
            // this.handleTableData();
            this.pushRuleSuccess(res.data.data);
        },
        async setTags(val) {

            const testRules = [...this.matchTestResult.testRules];
            const oldRulesText = this.matchTestResult.ruleText;

            let newRulesText;
            const rule = testRules.find(i => i.presentableName === this.testResourceName);
            if (rule) {
                rule.tags = val;
                const ruleText = decompile([rule]);
                newRulesText = oldRulesText.replace(rule.text, ruleText);
            } else {
                const ruleObj = {
                    "tags": val,
                    "replaces": [],
                    "online": null,
                    "operation": "alter",
                    "presentableName": this.testResourceName,
                };
                newRulesText = oldRulesText + '\n' + decompile([ruleObj]);
            }

            const res = await this.$axios.post(`/v1/testNodes`, {
                nodeId: this.nodeId,
                testRuleText: Buffer.from(newRulesText).toString('base64'),
            });

            if (res.data.errcode !== 0 || res.data.ret !== 0) {
                return this.$message.error(JSON.stringify(res.data.data.errors));
            }
            this.$message.success('标签设置成功');
            this.pushRuleSuccess(res.data.data);
        },
        async setVersion(val) {
            const testRules = [...this.matchTestResult.testRules];
            const oldRulesText = this.matchTestResult.ruleText;

            let newRulesText;
            const rule = testRules.find(i => i.presentableName === this.testResourceName);
            if (rule) {
                if (rule.operation === 'add') {
                    rule.candidate.versionRange = val;
                } else {
                    rule.replaces.push({
                        "replaced": {
                            "name": this.originInfo.name,
                            "versionRange": '*',
                            "type": 'release',
                        },
                        "replacer": {
                            "name": this.originInfo.name,
                            "type": "release",
                            versionRange: val,
                        },
                        "scopes": [],
                    });
                }
                const ruleText = decompile([rule]);
                newRulesText = oldRulesText.replace(rule.text, ruleText);
            } else {
                const ruleObj = {
                    text: '',
                    "tags": null,
                    "replaces": [
                        {
                            "replaced": {
                                "name": this.originInfo.name,
                                "versionRange": '*',
                                "type": 'release',
                            },
                            "replacer": {
                                "name": this.originInfo.name,
                                "type": "release",
                                versionRange: val,
                            },
                            "scopes": [],
                        }
                    ],
                    "online": null,
                    "operation": "alter",
                    "presentableName": this.testResourceName,
                };
                const ruleText = decompile([ruleObj]);
                newRulesText = oldRulesText + '\n' + ruleText;

            }

            const res = await this.$axios.post(`/v1/testNodes`, {
                nodeId: this.nodeId,
                testRuleText: Buffer.from(newRulesText).toString('base64'),
            });
            if (res.data.errcode !== 0 || res.data.ret !== 0) {
                return this.$message.error(JSON.stringify(res.data.data.errors));
            }
            this.$message.success('设置版本成功');
            this.pushRuleSuccess(res.data.data);
        }
    },
    watch: {
        userDefinedTags(val, oldVal) {
            if (!oldVal || JSON.stringify(val) === JSON.stringify(oldVal)) {
                return;
            }
            // console.log(val);
            this.setTags(val);
        },
        versionValue(val, oldVal) {
            if (!oldVal) {
                return;
            }
            // console.log(val);
            this.setVersion(val);
        },
    }
}
