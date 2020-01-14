<template>
    <div style="padding-top: 180px; display: flex; justify-content: center;">
        <div>
            <div style="font-size: 22px; font-weight: 600; color: #000; text-align: center;">当前功能仅对内测用户开放</div>
            <div style="height: 80px;"/>
            <div style="display: flex;">
                <div style="position: relative; height: 40px;">
                    <el-input
                        style="width: 380px; margin-right: 20px;"
                        v-model="input"
                        placeholder="请输入内测邀请码"
                    />
                    <div
                        v-show="error"
                        style="color: #e91515; font-size: 14px; line-height: 1; padding-top: 10px; position: absolute; top: 100%;"
                    >无效邀请码，请重新输入
                    </div>
                </div>
                <el-button
                    type="primary"
                    style="width: 100px; border-radius: 2px;"
                    @click="submit"
                    :disabled="!input"
                >验证
                </el-button>
            </div>
            <div style="height: 70px;"/>
            <div
                style="font-size: 14px; text-align: center;"
                v-if="status !== 0"
            >
                <span style="color: #999;">没有内测邀请码？</span>
                <router-link
                    style="color: #409eff; font-weight: 600;"
                    to="/alpha-test/apply"
                >申请参加内测
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                input: '',
                error: false,
                status: 0,
            };
        },
        mounted() {
            this.getApplyRecords();
        },
        methods: {
            async getApplyRecords() {
                const authInfoText = document.cookie.split('; ').find(i => i.startsWith('authInfo='));
                // console.log(authInfoText, 'authInfoText');
                if (!authInfoText) {
                    return;
                }
                const authInfo = JSON.parse(Buffer.from(authInfoText.replace('authInfo=').split('.')[1], 'base64').toString());
                // console.log(authInfo, 'authInfoauthInfo');
                const {data} = await this.$axios.get('/v1/testQualifications/beta/applyRecords', {
                    params: {page: 1, pageSize: 1, userId: authInfo.userId},
                });

                if (data.ret !== 0 || data.errcode) {
                    return this.$message.error(data.msg);
                }

                const dataList = data.data.dataList;
                // if (dataList.length === 0) {
                //     return this.$router.replace('/alpha-test/input');
                // }

                this.status = dataList[0] ? dataList[0].status : 0;
            },
            async submit() {
                const {data} = await this.$axios.post('/v1/testQualifications/beta/activate', {
                    code: this.input,
                });
                // console.log(data, 'datadata');

                if (!data.data) {
                    return this.error = true;
                }

                const {data: data2} = await this.$axios.get('/v1/userinfos/current');
                window.localStorage.setItem('user_session', JSON.stringify(data2.data));

                setTimeout(() => {
                    window.location.reload();

                    // setTimeout(() => {
                    //     this.$router.replace('/');
                    // }, 30);
                }, 30);

            }
        }
    }
</script>

<style scoped lang="less">

</style>
