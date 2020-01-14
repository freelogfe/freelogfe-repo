<template>
    <div style="width: 900px; margin: 0 auto;">
        <div style="height: 40px;"/>
        <div style="font-size: 22px; font-weight: 600; color: #000; text-align: center;">当前功能仅对内测用户开放</div>
        <div style="height: 45px;"/>
        <ContentBlock title="用户名">
            <div style="font-size: 14px; font-weight: 600; color: #000;">{{userInfo && userInfo.username}}</div>
        </ContentBlock>
        <div style="height: 30px;"/>
        <ContentBlock title="申请结果通知方式">
            <div style="font-size: 14px; font-weight: 600; color: #000;">{{userInfo && (userInfo.mobile || userInfo.email)}}</div>
        </ContentBlock>
        <div style="height: 30px;"/>
        <ContentBlock
            title="职业"
            required
        >
            <el-input
                style="width: 380px; margin-right: 20px; border-radius: 2px;"
                v-model="career"
                placeholder="请输入您的职业"
            />
        </ContentBlock>
        <div style="height: 30px;"/>
        <ContentBlock
            title="所在区域"
            required
        >
            <el-select
                v-model="province"
                placeholder="请选择省"
                @change="city = ''"
                style="width: 140px; border-radius: 2px; margin-right: 20px;"
            >
                <el-option
                    v-for="item in provinces"
                    :key="item"
                    :label="item"
                    :value="item"/>
            </el-select>
            <el-select
                v-model="city"
                placeholder="请选择城市"
                :disabled="!province"
                style="width: 140px; border-radius: 2px;"
            >
                <el-option
                    v-for="item in citys"
                    :key="item"
                    :label="item"
                    :value="item"/>
            </el-select>
        </ContentBlock>
        <div style="height: 30px;"/>
        <ContentBlock
            title="请留下您常用的创作平台或社区的个人主页网址，或者微信公众号ID"
            required
        >
            <el-input
                style="display: block; border-radius: 2px;"
                :rows="4"
                type="textarea"
                placeholder=""
                resize="none"
                v-model="description"/>
        </ContentBlock>
        <div style="height: 60px;"/>
        <div style="display: flex; justify-content: center;">
            <el-button
                style="border-radius: 2px;"
                type="primary"
                :disabled="!career || !province || !city || !description"
                @click="submit"
            >提交申请
            </el-button>
        </div>
        <!--        <div style="height: 40px;"/>-->
    </div>
</template>

<script>
    import ContentBlock from "./ContentBlock";
    import region from './region';

    export default {
        name: "index",
        components: {
            ContentBlock
        },
        data() {
            return {
                career: '',
                province: '',
                city: '',
                description: '',
                userInfo: null,
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            async initData() {
                const {data} = await this.$axios.get('/v1/userinfos/current');

                this.userInfo = data.data;
            },
            async submit() {
                const {data} = await this.$axios.post('/v1/testQualifications/beta/apply', {
                    province: this.province,
                    city: this.city,
                    occupation: this.career,
                    description: this.description,
                });

                if (data.ret !== 0 || data.errcode !== 0) {
                    return this.$message.error(data.msg);
                }

                this.$router.replace('/alpha-test/success');
            }
        },
        computed: {
            provinces() {
                return region.map(i => i.provinceName)
            },
            citys() {
                return (region.find(i => i.provinceName === this.province) || {citys: []}).citys.map(j => j.citysName);
            },
        }
    }
</script>

<style scoped>

</style>
