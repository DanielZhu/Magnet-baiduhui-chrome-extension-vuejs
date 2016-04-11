<style lang="stylus">
    .comment
        .header
            margin-bottom: 10px
            color: #DD3067
            padding: 10px 20px
            font-size: 16px
        .c-empty
            padding: 20px
            color: #b9b9b9
            text-align: center
        .c-list
            .c-list-item
                padding: 10px
                list-style: none
                border-bottom: 1px solid #D0D0D0
                &:last-child
                    border-bottom: none
                .c-user
                    width: 60px
                    float: left
                    text-align: center
                    .c-user-avatar
                        position: relative
                        width: 50px
                        height: 50px
                        border-radius: 50%
                    .c-layer
                        font-size: 10px
                        color: #999
                .c-comments
                    font-size: 13px
                    margin-left: 60px
                    padding-left: 10px
                    align-items: center
                    .c-nickname
                        color: #03A7A7
                    .c-content
                        padding: 5px 0
                    .c-time
                        color: #999
                        font-size: 10px
                .c-reply-list
                    margin-left: 50px
                    .c-list-item
                        border-top: 1px solid #E4E4E4
                        border-bottom: none
                        .c-user
                            width: 30px
                            .c-user-avatar
                                width: 30px
                                height: 30px
                        .c-comments
                            margin-left: 30px
</style>

<template>
    <section class="comment">
        <div class="header">最新评论</div>
        <div class="c-empty" v-show="list.length === 0">大家还没说什么</div>
        <ul class="c-list" v-show="list.length > 0">
            <li v-for="item in list" class="c-list-item clearfix">
                <div class="c-user">
                    <img :src="item.portrait" class="c-user-avatar">
                    <p class="c-layer">{{item.layer}}楼</p>
                </div>
                <div class="c-comments clearfix">
                    <p class="c-nickname">{{item.userName}}</p>
                    <p class="c-content">{{item.content}}</p>
                    <p class="c-time">{{item.ctime}}</p>
                </div>
                <ul class="c-reply-list">
                    <li v-for="item in item.reply" class="c-list-item clearfix">
                        <div class="c-user">
                            <img :src="item.portrait" class="c-user-avatar">
                        </div>
                        <div class="c-comments">
                            <p class="c-nickname">{{item.userName}}</p>
                            <p class="c-content">{{item.content}}</p>
                            <p class="c-time">{{item.ctime}}</p>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </section>
</template>

<script>
/**
 * Magnet 评论模块
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
*/
var tj = require('../libs/tj.js');
module.exports = {
    replace: true,
    props: ['list'],
    data: function () {
        return {
            hasErr: false,
            // content:'',
            // userId:localStorage.userId || '',
            // authorTxt:'<br/><br/><a class="form" href="https://github.com/shinygang/Vue-cnodejs">I‘m webapp-cnodejs-vue</a>',
        };
    },
    ready: function () {
        // tj.trackEventTJ(tj.category.itemComment, 'compLoaded');
    },
    methods: {

    }
}
</script>
