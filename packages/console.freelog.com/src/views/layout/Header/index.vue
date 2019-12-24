<template>
    <header class="nav-header">
        <div class="brand">
            <router-link to="/" class="">
                <i
                    class="freelog fl-icon-logo-freelog"
                />
            </router-link>
            <!--      <span class="page-title">{{pageTitle}}</span>-->
            <HeaderMenu style="margin-left: 45px;"/>
        </div>

        <HeaderTools/>

        <!--      v-if="session.user"-->
        <!--        <nav class="toolbar">-->
        <!--      <ul class="navbar-menu">-->
        <!--        <li class="nav-right-menu-item">-->
        <!--          <search-input @search="searchHandler"></search-input>-->
        <!--          &lt;!&ndash;<el-button type="text"><i class="el-icon-search"></i></el-button>&ndash;&gt;-->
        <!--        </li>-->
        <!--        <li class="nav-right-menu-item" hidden>-->
        <!--          <el-button type="text"><i class="el-icon-bell"></i></el-button>-->
        <!--          <el-badge value="1" class="badge-item"></el-badge>-->
        <!--        </li>-->
        <!--        <li class="nav-right-menu-item my-profile" v-if="session">-->
        <!--          &lt;!&ndash;<img class="avatar" :src="session.user&&session.user.meta.avatar" alt="">&ndash;&gt;-->
        <!--          <el-popover-->
        <!--                  placement="bottom-end"-->
        <!--                  title=""-->
        <!--                  style="padding: 0;"-->
        <!--                  popper-class="nav-list-pop-wrap"-->
        <!--                  trigger="hover">-->
        <!--            <template slot="reference">-->
        <!--              <span class="user-profile">-->
        <!--                <img v-if="avatarUrl" :src="avatarUrl" alt="" @error="errorImageHandler">-->
        <!--                <i v-else class="el-icon-fa-user-circle" :title="session.user.nickname"></i>-->
        <!--              </span><span style="margin-left: 5px; color: #fff;">{{session.user.nickname}}</span>-->
        <!--            </template>-->

        <!--            <ul class="my-profile-items">-->
        <!--              <li class="my-profile-item center hover" @click="logout">-->
        <!--                <img class="tool-icon" src="../../../assets/img/icons/logout.png" alt="">{{ $t('common.logout')}}-->
        <!--              </li>-->
        <!--            </ul>-->
        <!--          </el-popover>-->
        <!--        </li>-->
        <!--        <li class="nav-right-menu-item my-profile" v-else>-->
        <!--          <router-link :to="loginLink" class="nav-link">-->
        <!--            {{ $t('common.login')}}/{{ $t('common.register')}}-->
        <!--          </router-link>-->
        <!--        </li>-->
        <!--        <li class="nav-right-menu-item">-->
        <!--          <el-dropdown @command="handleCommand" trigger="click" style="height: 30px; vertical-align: middle;">-->
        <!--            <span class="el-dropdown-link">-->
        <!--              <img class="language-icon" src="../../../assets/img/icons/language.png" alt="">-->
        <!--            </span>-->
        <!--            <el-dropdown-menu slot="dropdown">-->
        <!--              <el-dropdown-item command="zh-CN">中文</el-dropdown-item>-->
        <!--              <el-dropdown-item command="en">English</el-dropdown-item>-->
        <!--            </el-dropdown-menu>-->
        <!--          </el-dropdown>-->
        <!--        </li>-->
        <!--      </ul>-->
        <!--        </nav>-->
    </header>
</template>

<script>
    import Header from './index'

    export default Header
</script>

<style scoped lang="less">
    @import "index.less";
</style>


<style lang="less">
    /*.el-popover.nav-list-pop-wrap {*/
    /*    padding: 0;*/
    /*}*/

    /*.nav-header {*/
    /*    .nav-right-menu-item {*/
    /*        .fl-search-input-wrap {*/
    /*            .el-button {*/
    /*                padding: 0;*/
    /*                vertical-align: middle;*/
    /*            }*/
    /*        }*/
    /*    }*/
    /*}*/
</style>
