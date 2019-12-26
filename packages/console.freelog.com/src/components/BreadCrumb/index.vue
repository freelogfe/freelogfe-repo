<template>
    <div class="bread-crumb" v-if="true">
        <template v-for="i in [...list].slice(0, list.length - 1)">
            <router-link
                :to="i.to"
            >{{i.text}}
            </router-link>
            <span>/</span>
        </template>

        <label>{{([...list].pop() || {text: ''}).text}}</label>
    </div>
</template>

<script>
    export default {
        name: "index",
        props: {
            list: {
                type: Array,
                default() {
                    // [{text: '我的资源', to: '/'}, {text: '资源编辑'}]
                    return [];
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .bread-crumb {
        padding: 3px 0;
        line-height: 1;
        display: flex;
        font-size: 14px;
        color: #999;
        align-items: baseline;
        padding-top: 30px;


        & > a {
            cursor: pointer;
            color: #999;
        }

        & > span {
            padding: 0 6px;
        }

        & > label {
            font-size: 18px;
            color: #333;
        }
    }
</style>
