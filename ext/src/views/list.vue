<style lang="stylus">
    @import '../assets/styl/normalize.css'
    @import '../assets/styl/sd-icons.css'
    @import '../assets/styl/list.styl'
</style>
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
                    <div class="qr-preview">
                        <img src="../assets/images/qrcode.png">
                    </div>
                    <div class="toolbar">
                        <div class="see-outside" v-on:click="showDetail(item.id, item.coverImg)"><i class="icon sd-icon-qrcode"></i>查看详情</div>
                    </div>
                </div>
                <div class="sns-tool">
                    <div class="summary">
                        <span class="merchant-name">{{item.merchantName}}</span>
                        <span class="update-time" v-text="item.revealTime | untilNow"></span>
                    </div>
                    <div class="sns-numbers">
                        <img src="../assets/images/ding.png" class="icon"><span class="number">{{item.likeNum > 0 ? item.likeNum : 0}}</span>
                        <div class="progress">
                            <div class="progress-bar-active" v-bind:style="{width: item.progressAt + '%' }"></div>
                            <div class="progress-anchor-at" v-bind:style="{left: item.progressAt + '%' }"></div>
                        </div>
                        <img src="../assets/images/cai.png" class="icon icon-cai"><span class="number">{{item.unlikeNum > 0 ? item.unlikeNum : 0}}</span>
                        <img src="../assets/images/comment.png" class="icon"><span class="number">{{item.commentNum > 0 ? item.commentNum : 0}}</span>
                        <img src="../assets/images/fav.png" class="icon"><span class="number">{{item.favorNum > 0 ? item.favorNum : 0}}</span>
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
                        pageSize: 20
                    }
                },
                activeId: 0,
                coverImg: '',
                progressAt: 0
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
                var nowTs = new Date().getTime();
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
                    showTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                }

                return showTime;
            }
        },
        ready: function () {
            console.log('[Hui] Detail Page Ready...');
            this.init();
        },
        watch: {
            pageSlided: function (val, oldVal) {

                $('.item-detail').height(val ? 'initial' : $(window).height());
                $('.hui-list').height(val ? $(window).height() : 'initial');
            }
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
                        var item = {};
                        for (var i = 0; i < data.data.result.length; i++) {
                            item = data.data.result[i];
                            item.progressAt = item.likeNum / (item.likeNum + item.unlikeNum) * 100;
                            self.list.push(item);
                        }
                        $('.mask').addClass('hide');
                        self.isLoading = false;
                        self.bindEvents();
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
            },

            bindEvents: function () {
                var _self = this;
                $('html, body').on('scroll', function () {
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
        components: {
            sdHead: require('../components/header.vue'),
            sdItem: require('../components/item.vue')
        }
    }
</script>
