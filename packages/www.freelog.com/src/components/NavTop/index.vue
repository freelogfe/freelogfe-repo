<template>
    <header class="nav-header">
        <div class="brand">
            <router-link to="/" class="">
                <i class="freelog fl-icon-logo-freelog" />
            </router-link>
        </div>
        <HeaderTools/>
    </header>
</template>

<script>
    import Header from './index'

    export default Header
</script>

<style scoped lang="less">
    @import "index.less";
</style>


