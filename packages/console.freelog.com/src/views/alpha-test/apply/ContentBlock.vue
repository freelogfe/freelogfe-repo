<template>
    <div>
        <div style="font-size: 12px; color: #999;">
            <i
                v-if="required"
                style="color: #e91515;"
            >*</i>
            <span>{{title}}</span>
        </div>
        <div style="height: 10px;"/>
        <slot/>
    </div>
</template>

<script>

    export default {
        name: "ContentBlock",
        props: {
            title: String,
            required: {
                type: Boolean,
                default: false,
            }
        }
    }
</script>

<style scoped>

</style>
