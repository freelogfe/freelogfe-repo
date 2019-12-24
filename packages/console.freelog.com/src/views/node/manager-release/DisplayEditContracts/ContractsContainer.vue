<template>
    <div>
        <div style="height: 30px;"></div>
        <div style="color: #999; font-size: 14px;">{{title}}</div>
        <div style="height: 10px;"></div>

        <slot/>
    </div>
</template>

<script>
    export default {
        name: "ContractsContainer",
        props: {
            title: {
                type: String,
                default: '小标题',
            }
        }
    }
</script>

<style scoped>

</style>
