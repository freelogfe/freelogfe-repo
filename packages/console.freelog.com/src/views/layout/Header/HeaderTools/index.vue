<template>
    <div class="header-tools">
        <template v-if="userType === 1">
            <div class="header-tools__col">
                <a>
                    <div class="header-tool__create">
                        <i class="freelog fl-icon-add"/>
                    </div>
                    <div class="header-tools__dropdown">
                        <div class="header-tools__menu">
                            <router-link
                                to="/resource/editor"
                                class="header-tools__menu__item"
                                target="_blank"
                            >{{$t('layout.createResource')}}
                            </router-link>
                            <a
                                class="header-tools__menu__item"
                                @click="resourceDialogVisible=true"
                            >{{$t('layout.createRelease')}}</a>
                            <!--                        <router-link to="/" class="header-tools__menu__item">-->
                            <!--                            创建mock-->
                            <!--                        </router-link>-->
                            <router-link
                                to="/node/create"
                                class="header-tools__menu__item"
                                target="_blank"
                            >{{$t('layout.createNode')}}
                            </router-link>
                        </div>

                    </div>
                </a>
            </div>

            <div class="header-tools__col" style="padding-right: 10px;">
                <ToolSearch @onConfirm="onSearch"/>
            </div>
        </template>

        <div class="header-tools__col" style="padding-left: 0;">
            <a class="header-tool__avatar" style="padding-left: 20px;">

                <div class="header-tool__avatar__display">
                    <img
                        :src="userInfo && userInfo.headImage"
                        alt=""
                    />
                    <label v-if="userType === 1">{{$t('layout.alphaTest')}}</label>
                </div>
                <div
                    v-if="!!userInfo"
                    class="header-tools__dropdown"
                    style="width: 240px; left: unset; right: -10px; cursor: auto;"
                >
                    <div
                        style="display: flex; flex-direction: column; align-items: center; padding: 20px 0; font-size: 14px;font-weight: 600; color: #999;">
                        <img
                            :src="userInfo && userInfo.headImage"
                            style="height: 60px; width: 60px; border-radius: 50%;"
                            alt=""
                        />
                        <div style="height: 10px;"/>
                        <div style="color: #999; font-size: 16px; font-weight: 600;">{{userInfo && userInfo.username}}
                        </div>
                        <div style="height: 8px;"/>
                        <div style="">{{userInfo && userInfo.mobile}}</div>
                    </div>
                    <a @click="gotoUserProfile">{{$t('layout.personalCenter')}}</a>
                    <a @click="logout">{{$t('layout.logout')}}</a>
                    <!--                    <router-link-->
                    <!--                        :to="'/login'"-->
                    <!--                    >登出-->
                    <!--                    </router-link>-->
                </div>
            </a>
        </div>

        <div class="header-tools__col" style="padding-right: 0">
            <a class="header-tool__language">
                <span>{{$i18n.locale === 'zh-CN'? '中文' : 'English'}} <i class="el-icon-arrow-down"/></span>

                <div class="header-tools__dropdown" style="right: -10px; left: unset;">
                    <div class="header-tools__menu">
                        <a
                            @click="handleCommand('zh-CN')"
                            class="header-tools__menu__item"
                            :class="{'header-tools__menu__item--active':$i18n.locale === 'zh-CN'}"
                        >中文</a>
                        <a
                            @click="handleCommand('en')"
                            class="header-tools__menu__item"
                            :class="{'header-tools__menu__item--active':$i18n.locale === 'en'}"
                        >English</a>
                    </div>

                </div>
            </a>
        </div>

        <el-dialog
            class="my-r-search-dialog"
            :append-to-body="true"
            center
            :title="$t('release.dialogTitle')"
            width="640px"
            :visible.sync="resourceDialogVisible"
        >
            <resource-search
                @select-resource="createNewRelease"
            />
        </el-dialog>
    </div>
</template>

<script>
    import ToolSearch from './ToolSearch';
    import ResourceSearch from '@/views/resource/search/search.vue'
    import {getCookieLocale, getUserInfoFromLocalStorage} from '@/lib/utils';

    export default {
        name: "index",
        components: {
            ToolSearch,
            ResourceSearch,
        },
        data() {
            return {
                resourceDialogVisible: false,
                userInfo: null,
                userType: (getUserInfoFromLocalStorage() || {userType: 0}).userType,
            };
        },
        mounted() {
            this.listenWindowVisibility();
            this.handleUserInfo();
        },
        methods: {
            /**
             * 监听窗口激活事件
             */
            listenWindowVisibility() {
                // 不同浏览器 hidden 名称
                const hiddenProperty = 'hidden' in document ? 'hidden' :
                    'webkitHidden' in document ? 'webkitHidden' :
                        'mozHidden' in document ? 'mozHidden' :
                            null;
                // console.log(hiddenProperty, 'hiddenPropertyhiddenProperty');
                // 不同浏览器的事件名
                const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
                const onVisibilityChange = () => {
                    // console.log('111111');
                    if (document[hiddenProperty]) {
                        // 窗口隐藏
                        // console.log(Date(), 'hidden');
                    } else {
                        // 窗口可见
                        // console.log(Date(), 'visible');
                        // this.handleTableData();
                        // if ($i18n.locale === 'zh-CN')
                        // console.log('@#@#@#@#@#@#@');
                        const locale = getCookieLocale();
                        if (locale && locale !== this.$i18n.locale) {
                            window.location.reload();
                        }
                    }
                };
                document.addEventListener(visibilityChangeEvent, onVisibilityChange);
            },
            onSearch(value) {
                // console.log(value, 'VVVVVVV');
                this.$router.push({path: '/', query: {q: value}})
            },
            async handleUserInfo() {
                const {data} = await this.$axios.get('/v1/userinfos/current');

                this.userInfo = data.data;
                window.localStorage.setItem('user_session', JSON.stringify(data.data));
            },
            gotoUserProfile() {
                window.location.href = window.location.origin.replace('//console.', '//www.') + '/user/profile';
            },
            handleCommand(lang) {
                if (lang === this.$i18n.locale) return;
                const langMap = {
                    'en': 'English',
                    'zh-CN': '中文'
                };
                this.$confirm(this.$t('header.langSwitchQuestion', {lang: langMap[lang]}))
                    .then(() => {
                        window.localStorage.setItem('locale', lang);
                        document.cookie = 'locale=' + lang + `; path=/; domain=${window.origin.split('.').slice(-2).join('.')}`;
                        this.$i18n.locale = lang;
                        window.location.reload();
                    }).catch(() => {
                })
            },
            createNewRelease(resource) {
                // this.resourceDialogVisible = false;
                // this.$router.
                window.open(`/release/create?resourceId=${resource.resourceId}`);
            },
            async logout() {
                const {data} = await this.$axios.get('/v1/passport/logout');
                // console.log(data, 'DDDDDDDDD');
                if (data.ret !== 0 || data.errcode !== 0) {
                    return this.$message.error(data.msg);
                }
                window.localStorage.removeItem('user_session');
                // if (data)
                this.$router.push('/login');
            }
        }
    }
</script>

<style scoped lang="less">
    .header-tools {
        display: flex;
        height: 100%;
        /*color: #fff;*/

        .header-tools__col {
            display: flex;
            padding: 0 15px;
            height: 100%;
            align-items: center;
            justify-content: center;

            a {
                position: relative;
                display: flex;
                cursor: pointer;
                height: 100%;
                align-items: center;

                .header-tools__dropdown {
                    position: absolute;
                    display: none;
                    top: 100%;
                    left: -10px;
                    font-size: 14px;
                    color: #999;
                    background-color: #333;
                    width: 180px;
                    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.2);

                    .header-tools__menu {
                        padding: 10px 0;

                        .header-tools__menu__item {
                            /*display: block;*/
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 0 20px;
                            box-sizing: border-box;
                            line-height: 40px;
                            color: #999;

                            /*& > a {*/
                            /*    background-color: #444;*/
                            /*    color: #999;*/
                            /*    font-size: 12px;*/
                            /*    line-height: 20px;*/
                            /*    padding: 0 6px;*/
                            /*    font-weight: 600;*/
                            /*}*/

                            &:hover {
                                background-color: #444;
                                color: #ddd;
                                font-weight: 600;

                                /*& > a {*/
                                /*    background-color: #555;*/
                                /*    color: #ddd;*/
                                /*}*/
                            }

                            &.header-tools__menu__item--active {
                                color: #fff;
                                font-weight: 600;
                            }
                        }
                    }
                }

                &:hover {
                    .header-tools__dropdown {
                        display: inline-block;
                    }

                    .header-tool__create {
                        background-color: #61afff;
                    }

                    & > span {
                        color: #ddd;
                        font-weight: 600;
                    }
                }
            }
        }
    }

    .header-tool__create {
        width: 40px;
        height: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #409eff;
        border-radius: 13px;

        &:hover {
            background-color: #61afff;
        }

        & > i {
            font-size: 14px;
            color: #fff;
        }
    }

    .header-tool__avatar {
        /*width: 32px;*/
        display: block;

        .header-tool__avatar__display {
            display: flex;
            align-items: center;

            & > img {
                background: rgba(142, 142, 147, 0.4);
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: block;
                border: none;
            }

            & > label {
                margin-left: 10px;
                /*display: none;*/
                background-color: #409eff;
                color: #fff;
                width: 36px;
                line-height: 20px;
                height: 20px;
                text-align: center;

                border-radius: 10px;
                font-size: 12px;
                font-weight: 600;
            }
        }


        a {
            padding: 0 20px;
            line-height: 60px;
            display: block;
            border-top: 1px solid #444;
            color: #999;

            &:hover {
                background-color: #444;
                color: #ddd;
            }
        }
    }

    .header-tool__language {
        & > span {
            color: #999;
            font-size: 14px;
            display: flex;
            align-items: center;

            & > i {
                margin-left: 3px;
                transition: all 400ms;
            }
        }

        &:hover {
            & > span {

                & > i {
                    transform: rotate(-180deg);
                }
            }
        }
    }
</style>

<style lang="less">
    .my-r-search-dialog {
        .el-dialog__body {
            overflow: auto;
            height: 300px;
            margin: 0 20px;
            padding: 20px 45px 0;
            border-top: 1px solid #D8D8D8;

            .el-input__inner {
                padding-left: 30px;
            }
        }
    }
</style>
