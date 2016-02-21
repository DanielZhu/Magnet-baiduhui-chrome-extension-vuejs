<template>
<sd-head :show.sync="showSlideNav" :back.sync="pageSlided"></sd-head>
<div class="slide-paging" transition="page" :class="{'page-enter': pageSlided}">
    <div class="hui-list">
        <ul>
            <li v-for="item in list" data-id="{{item.id}}">
                <div class="hui-item">
                    <div class="cover-img">
                        <img :src="item.coverImg" data-src="../assets/images/img_120*120.svg">
                    </div>
                    <div class="item-brief">
                        <div class="info">
                            <div class="feed-info">
                                <img v-show="item.feedLogo" :src="item.feedLogo" data-src="../assets/images/img_80*35.svg" class="feed-logo">
                                <div class="title">{{item.title}}</div>
                            </div>
                            <div class="price-cut reason">
                                <div class="highlight-area" v-show="item.itemType === 1">
                                    <p class="reason-item price">{{item.price}}</p>
                                    <p class="reason-item highlight" v-show="item.priceHighlight">{{item.priceHighlight}}</p>
                                </div>
                                <div class="reason-item formatted-rcmd-reason" :class="item.itemType===1 ? 'pull-right' : ''">
                                    <!-- <label class="reason-item highlight" v-show="item.appPriceOnly">手机专享</label> -->
                                    <label v-html="item.formattedRcmdRsn"></label>
                                </div>
                            </div>
                            <div class="short-reason">
                                <p class="reason-item">{{item.shortReason}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sns">
                    <div class="fav-layer">
                        <img src="../assets/images/fav-heart.png" class="icon-fav">
                    </div>
                    <div class="toolbar">
                        <div class="see-outside" v-on:click="showDetail(item.id, item.coverImg)">查看详情</div>
                    </div>
                </div>
                <div class="sns-tool">
                    <div class="summary">
                        <span class="merchant-name">{{item.merchantName}}</span>
                        <span class="update-time" v-text="item.revealTime | untilNow"></span>
                    </div>
                    <div class="sns-numbers">
                        <img src="../assets/images/ding.png" class="icon"><span class="number">({{item.likeNum > 0 ? item.likeNum : 0}})</span>
                        <img src="../assets/images/cai.png" class="icon"><span class="number">({{item.unlikeNum > 0 ? item.unlikeNum : 0}})</span>
                        <img src="../assets/images/comment.png" class="icon"><span class="number">({{item.commentNum > 0 ? item.commentNum : 0}})</span>
                        <img src="../assets/images/fav.png" class="icon"><span class="number">({{item.favorNum > 0 ? item.favorNum : 0}})</span>
                    </div>
                    <div class="revealer">
                        <span class="name">{{item.revealerName}}</span>
                    </div>
                </div>
            </li>
            <div class="loading-more">Loading...</div>
        </ul>
    </div>
    <sd-item :active-id="activeId" :cover-img="coverImg"></sd-item>
</div>
</template>

<script>
    module.exports = {
        data: function () {
            return {
                pageSlided: false,
                isLoading: false,
                list: [],
                reqParam: {
                    condition: {},
                    page: {
                        pageNo: 1,
                        pageSize: 10
                    }
                },
                activeId: 0,
                coverImg: ''
            }
        },
        route:{
            // data (transition){
            //     let query = transition.to.query,tab = query.tab || 'all';

            //     //记录首次加载的查询条件
            //     if(this.searchDataStr == ""){
            //         this.searchDataStr = JSON.stringify(this.searchKey);
            //     }
            //     //如果从左侧切换分类，则清空查询条件
            //     if(transition.from.name === "house-list"){
            //         //this.searchKey.page = 1;
            //         this.searchKey.limit = 20;
            //         this.searchKey = JSON.parse(this.searchDataStr);
            //     }


            //     //如果从详情返回并且typeid一样才去sessionStorge
            //     if(sessionStorage.searchKey && transition.from.name === "topic"
            //         && sessionStorage.tab == tab){
            //         this.topics = JSON.parse(sessionStorage.topics);
            //         this.searchKey = JSON.parse(sessionStorage.searchKey);
            //         this.$nextTick(()=> $(window).scrollTop(sessionStorage.scrollTop));
            //     }
            //     else{
            //         //页面初次加载获取的数据
            //         this.searchKey.tab = query.tab;
            //         this.getTopics();
            //     }
            //     this.showMenu = false;

            //     //滚动加载
            //     $(window).on('scroll', () => {
            //         this.getScrollData();
            //     });

            // },
            // deactivate (transition){
            //     $(window).off('scroll');
            //     if(transition.to.name === "topic"){
            //         sessionStorage.scrollTop = $(window).scrollTop();
            //         sessionStorage.topics = JSON.stringify(this.topics);
            //         sessionStorage.searchKey = JSON.stringify(this.searchKey);
            //         sessionStorage.tab = transition.from.query.tab || 'all';
            //     }
            //     else{
            //         sessionStorage.removeItem("topics");
            //         sessionStorage.removeItem("searchKey");
            //         sessionStorage.removeItem("tab");
            //     }
            //     transition.next();
            // }
        },
        filters: {
            untilNow: function (value) {
                // var value = '2016-01-31 00:07:00';
                var date = new Date(value);
                var originTs = date.getTime();
                var nowTs = (new Date()).getTime();
                var delta = (nowTs -  originTs) / 1000;
                var showTime = '';

                if (delta < 60) {
                    // 1分钟内
                    showTime = Math.round(delta) + '秒前';
                }
                else if (delta < 60 * 60) {
                    // 一小时内
                    showTime = Math.round(delta / 60) + '分前';
                }
                else if (delta < 24 * 60 * 60) {
                    // 1天内
                    showTime = Math.round(delta / (60 * 60)) + '小时前';
                }
                else if (delta < 7 * 24 * 60 * 60) {
                    // 7天内
                    showTime = Math.round(delta / (24 * 60 * 60)) + '天前';
                }
                else {
                    showTime = date.getYear() + '-' + date.getFullMonth() + '-' + date.getDay();
                }

                return showTime;
            }
        },
        ready: function () {
            console.log('[Hui] Detail Page Ready...');
            this.init();
        },
        methods:{
            loadMore: function () {
                this.reqParam.page.pageNo += 1;
                !this.isLoading && this.getHuiItems(this.reqParam);
            },

            getHuiItems: function (params) {
                var self = this;
                self.isLoading = true;
                $.post('http://localhost/api/api.php/hui/list',
                    JSON.stringify(params.page),
                    function (data, textStatus, jqXHR) {
                        console.log(data);
                        for (var i = 0; i < data.data.result.length; i++) {
                            self.list.push(data.data.result[i]);
                        };
                        $('.mask').addClass('hide');
                        self.isLoading = false;
                    }, 'json'
                )
                .fail(function (data, textStatus, jqXHR) {
                    self.isLoading = false;
                    console.log(data);
                });
            },

            init: function () {
                console.log('[Hui] Detail Page Initing...');
                this.getHuiItems(this.reqParam);
                this.bindEvents();
            },

            bindEvents: function () {
                var _self = this;
                $(window).on('scroll', function () {
                    if (_self.pageSlided) {
                        return;
                    }
                    var scrollH = $.type($('body').scrollTop()) === 'number' ? $('body').scrollTop() : $(document).scrollTop();
                    var viewportHeight = $(window).height();

                    if (scrollH + viewportHeight >= $('body').height()) {
                        _self.loadMore();
                    }
                });
            },

            showDetail: function (id, coverImg) {
                this.pageSlided = !this.pageSlided;
                this.activeId = id;
                this.coverImg = coverImg;
                var offset = $('img[src="' + coverImg + '"]').offset();
                var pos = {
                    top: offset.top - $('body').scrollTop(),
                    left: offset.left
                };


                console.log(pos);
            }
        },
        components:{
            sdHead: require('../components/header.vue'),
            sdItem: require('../components/item.vue')
        }
    }
</script>
<style lang="stylus">
    @import '../../node_modules/normalize.css/normalize.css'
    @import '../assets/styl/index.styl'

    .slide-paging
        width: 1200px
        position: relative
        overflow-x: hidden

    .page-transition
        overflow: hidden
        transition: all .2s linear
        z-index: 40
        transform: translate3d(0%, 0, 0)
    .page-enter
        transform: translate3d(-600px, 0, 0)
    .page-leave
        transform: translate3d(-600px, 0, 0)

    .hui-list
        position: relative
        background-color: #fff
        width: 600px
        float: left
        padding-top: 60px
        z-index: 20
        li
            position: relative
            border-bottom: 1px solid #eee
            padding-bottom: 10px
            &:hover
                &:before
                    //content: ''
                    display: block
                    background-image: url('../assets/images/half-transparent-cover.png')
                    background-size: 100% 100%
                    background-repeat: repeat-x
                    position: absolute
                    left: 0
                    top: -30px
                    width: 100%
                    height: 30px
                &:after
                    //content: ''
                    display: block
                    background-image: url('../assets/images/half-transparent-cover.png')
                    background-size: 100% 100%
                    background-repeat: repeat-x
                    position: absolute
                    left: 0
                    bottom: -30px
                    width: 100%
                    height: 30px
                    transform: rotate(-180deg)
                .sns
                    display: block
                    opacity: 1
                    transition: all .3s ease-in
            .sns-tool
                box-sizing: border-box
                display: inline-block
                font-size: 12px
                color: #9d9d9d
                text-align: left
                width: 100%
                padding-left: 15px
                .summary
                    width: 120px
                    display: inline-block
                    .merchant-name
                        text-align: left
                    .update-time
                        text-align: right
                        float: right
                .sns-numbers
                    width: 40%
                    text-align: center
                    display: inline-block
                    .icon
                        width: 15px
                        height: auto
                        display: inline-block
                        margin-left: 15px
                        vertical-align: middle
                    .number
                        height: 15px
                .revealer
                    float: right
                    padding-right: 20px
                    display: inline-block
                    text-align: right
                    color: #7392B5
            .hui-item
                position: relative
                width: 100%
                display: flex
                display: -webkit-flex
                .cover-img
                    margin: 15px
                    width: 120px
                    height: 120px
                    z-index: 1
                    background-color: #fff
                    border: 1px solid #eee
                    img
                        position: relative
                        width: 100%
                .item-brief
                    flex: 1
                    position: relative
                    .info
                        position: absolute
                        left: 0
                        top: 0
                        width: 100%
                        padding-top: 15px
                        bottom: 15px
                        .feed-info
                            width: 100%
                            line-height: 35px
                            height: 35px
                            vertical-align: middle
                            text-align: left
                            margin-right: 10px
                            white-space: nowrap
                            .title
                                width: calc(100% - 100px)
                                font-size: 15px
                                line-height: 35px
                                display: inline-block
                                text-overflow: ellipsis
                                overflow: hidden
                                font-weight: bold
                            .feed-logo
                                height: 35px
                                border: 1px solid #eee
                        .reason
                            line-height: 34px
                            padding-left: 0
                        .price-cut
                            position: relative
                            height: 45px
                            margin: 5px 0 0 0
                            background-color: #f6f6f6
                            border: none
                            text-align: left
                            display: flex
                            display: -webkit-flex
                            -webkit-align-items: center
                            .highlight-area
                                position: relative
                                top: 0
                                left: 0
                                background-color: #F9DEE7
                                width: 40%
                                padding-left: 20px
                                height: 45px
                                line-height: 45px
                                white-space: nowrap
                            .reason-item
                                display: inline-block
                                margin: 0 5px
                            .price
                                color: #DD3067
                                font-size: 22px
                                min-width: 60px
                            .formatted-rcmd-reason
                                height: 45px
                                line-height: 45px
                                flex: 1
                                padding-right: 15px
                                em
                                    padding: 0 3px
                                span
                                    color: #DD3067
                            .highlight
                                background-color: #fff
                                border: 1px solid #DD3067
                                font-size: 12px
                                line-height: 20px
                                padding: 0 5px
                        .short-reason
                            color: #9d9d9d
                            text-align: left
                            font-size: 12px
                            position: absolute
                            bottom: 0px
            .sns
                position: absolute
                opacity: 0
                right: 0
                top: 0
                width: 20%
                height: 100%
                background-color: rgba(0, 0, 0, .7)
                text-align: center
                .fav-layer
                    position: absolute
                    top: ((150 - 40)/2) px
                    left: 50%
                    .icon-fav
                        width: 55px
                        height: 40px
                        margin-left: -22.5px
                        margin-top: -20px
                .toolbar
                    position: absolute
                    bottom: 0
                    left: 0
                    width: 100%
                    height: 40px
                    margin: 0
                    padding: 0
                    background-color: #DD7797
                    display: inline
                    color: #fff
                    box-sizing: border-box
                    line-height: 40px
                    font-size: 18px
                    .see-outside
                        width: 100%
                        height: 40px
                        float: right
                        background-color: #86A4D5
                        box-sizing: border-box
                        display: inline-block
    .pull-left
        text-align: left
    .pull-right
        text-align: right
    .loading-more
        text-align: center
        color: #666
        padding: 20px 0
</style>
