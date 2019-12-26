<template>
    <div style="padding-top: 180px; display: flex; justify-content: center;">
        <div>
            <div style="font-size: 22px; font-weight: 600; color: #000; text-align: center;">当前功能仅对内测用户开放</div>
            <div style="height: 80px;"/>
            <div style="display: flex;">
                <el-input
                    style="width: 380px; margin-right: 20px;"
                    v-model="input"
                    placeholder="请输入内测邀请码"
                />
                <el-button
                    type="primary"
                    style="width: 100px; border-radius: 2px;"
                >验证</el-button>
            </div>
            <div style="height: 70px;"/>
            <div style="font-size: 14px; text-align: center;">
                <span style="color: #999;">没有内测邀请码？</span>
                <a style="color: #409eff; font-weight: 600;">申请参加内测</a>
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
            };
        }
    }
</script>

<style scoped lang="less">

</style>
