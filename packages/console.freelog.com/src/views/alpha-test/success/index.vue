<template>
    <div>
        <div style="height: 160px;"/>
        <div style="margin: 0 auto; text-align: center;">
            <i
                class="freelog fl-icon-shenqingchenggong"
                style="color: #7ed321; font-size: 76px;"
            />
            <div style="height: 32px;"/>
            <div style="color: #000; font-size: 18px;">申请提交成功</div>
            <div style="height: 50px;"/>
            <div style="color: #000; font-size: 14px;">我们会尽快审核您的申请，审核结果会通过您的注册邮箱或者手机号发送给你，敬请留意。</div>
            <div style="height: 70px;"/>
            <el-button
                type="primary"
                @click="gotoUserCenter"
            >进入个人中心
            </el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        methods: {
            gotoUserCenter() {
                window.location.href = window.location.origin.replace('//console.', '//www.') + '/user/profile';
            }
        }
    }
</script>

<style scoped>

</style>
