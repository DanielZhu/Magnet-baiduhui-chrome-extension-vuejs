<style lang="stylus">
    @import '../assets/styl/normalize.css'
    @import '../assets/styl/sd-icons.css'
    @import '../assets/styl/components/toast.styl'
    @import '../assets/styl/list.styl'
</style>
<template>
    <div class="home" style="display: none;">
        <sd-toast :showing="toast.show" :msg="toast.msg" :icontype="toast.type"></sd-toast>
        <sd-head :shownav.sync="showSlideNav" :back.sync="pageSlided" :titleflied.sync="toast.show"></sd-head>
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
                                    <div v-if="item.itemType === 1 || item.itemType === 2" class="item-normal">
                                        <div class="price-cut reason">
                                            <div class="highlight-area" v-if="item.itemType === 1">
                                                <p class="reason-item price">{{item.price}}</p>
                                                <p class="reason-item highlight" v-show="item.priceHighlight">{{item.priceHighlight}}</p>
                                            </div>
                                            <div class="reason-item formatted-rcmd-reason" :class="item.itemType===1 ? 'pull-right' : ''" v-html="item.formattedRcmdRsn">
                                            </div>
                                        </div>
                                        <div class="short-reason">
                                            <p class="reason-item">{{item.shortReason}}</p>
                                        </div>
                                    </div>
                                    <div v-if="item.itemType === 3 || item.itemType === 4" class="item-exp">
                                        <div class="price-cut reason">
                                            <div class="reason-item formatted-rcmd-reason">{{item.shortReason}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sns">
                            <div class="qr-preview">
                                <!-- <img src="../assets/images/qrcode.png"> -->
                            </div>
                            <div class="toolbar">
                                <div class="open-hui-site" v-on:click="showDetail(item)" v-if="item.itemType !== 3 && item.itemType !== 4">本页查看</div>
                                <div class="see-outside" v-on:click="sendMessage(item)"><i class="icon sd-icon-bell-o"></i></div>
                                <div class="see-detail" v-on:click="openHuiPcDetailSite(item)"><i class="icon sd-icon-qrcode"></i>查看详情</div>
                            </div>
                        </div>
                        <div class="sns-tool">
                            <div class="summary">
                                <span class="merchant-name">{{item.merchantName}}</span>
                                <span class="update-time" v-text="item.revealTime | untilNow"></span>
                            </div>
                            <div class="sns-numbers">
                                <i class="icon sd-icon-thumbs-o-up"></i><span class="number">{{item.likeNum > 0 ? item.likeNum : 0}}</span>
                                <div class="progress">
                                    <div class="progress-bar-active" v-bind:style="{width: item.progressAt + '%' }"></div>
                                    <div class="progress-anchor-at" v-bind:style="{left: item.progressAt + '%' }"></div>
                                </div>
                                <div class="sns-item"><i class="icon sd-icon-thumbs-o-down"></i><span class="number">{{item.unlikeNum > 0 ? item.unlikeNum : 0}}</span></div>
                                <div class="sns-item"><i class="icon sd-icon-bubble-comment-streamline-talk"></i><span class="number">{{item.commentNum > 0 ? item.commentNum : 0}}</span></div>
                                <div class="sns-item" v-if="item.itemType !== 3 && item.itemType !== 4"><i class="icon sd-icon-heart-o"></i><span class="number">{{item.favorNum > 0 ? item.favorNum : 0}}</span></div>
                            </div>
                            <div class="revealer">
                                <span class="name">{{item.revealerName}}</span>
                            </div>
                        </div>
                    </li>
                    <div class="loading-tips loading">
                        <div class="loading-more">加载中...</div>
                        <div class="loading-retry">
                            <p>点击重试 <label v-show="fetchFailedTips.counter >= 10">受挫了<span>{{fetchFailedTips.counter}}</span>次</label></p>
                            <p class="tip">{{fetchFailedTips.tips[fetchFailedTips.counter - 1]}}</p>
                        </div>
                    </div>
                </ul>
            </div>
            <sd-item :active-id="activeId" :cover-img="coverImg"></sd-item>
        </div>
    </div>
</template>

<script>
/**
 * Magnet 列表页
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
 */
var storage = require('../libs/storage.js');
var tj = require('../libs/tj.js');
var consts = require('../libs/consts.js');
var SdHuiCore = require('../libs/sdHuiCore.js');
var sdHuiCore = new SdHuiCore(storage, consts);
module.exports = {
    data: function () {
        var self = this;
        return {
            configCached: {},
            pageSlided: null,
            showSlideNav: null,
            isLoading: false,
            isUsingPersistData: true,
            list: [],
            reqParam: {
                condition: {},
                page: {
                    pageNo: 1,
                    pageSize: 10
                }
            },
            activeId: 0,
            coverImg: '',
            toast: {
                show: false,
                msg: '加载中',
                type: 'error',
                hideDelay: 3000,
                // 因为Vuejs还不能对绑定对象中的变量进行实时监控，所以当子控件的绑定属性值在子控件中被改变时，父控件感知不到，于是需要在外部进行销毁操作
                hideToast: function () {
                    setTimeout(function () {
                        self.toast.show = false;
                    }, self.toast.hideDelay);
                }
            },
            fetchFailedTips: {
                counter: 0,
                tips: consts.failFunnyTips
            }
        }
    },
    route: {
        canReuse: true
    },
    filters: {},
    ready: function () {
        var self = this;

        self.init();
        ['dev_ext', 'pro_ext'].indexOf(consts.env) !== -1 && self.clearBadge();
        $('.home').fadeIn();
        tj.trackPageViewTJ(tj.pageLists.handpick);
        tj.trackEventTJ(tj.category.handpick, 'pageLoaded');
    },
    watch: {
        // showSlideNav: function (val, oldVal) {
        // },
        pageSlided: function (val, oldVal) {
            $('.item-detail').height(val ? 'initial' : $(window).height());
            $('.hui-list').height(val ? $(window).height() : 'initial');

            $('.slide-paging').toggleClass('page-leave', !val);
            tj.trackPageViewTJ(val ? tj.pageLists.about : tj.pageLists.handpick);
            tj.trackEventTJ(tj.category.handpick, 'pageSlided', 'isFirstPage', !val ? 1 : 0);
        }
    },
    methods:{
        retrieveConfigCached: function () {
            var config = {};
            var configCached = storage.get(consts.configName) || {};
            if (configCached) {
                config = configCached.data;
            }

            return config;
        },

        clearBadge: function () {
            chrome.runtime.sendMessage({
                type: "clearBadge"
            }, function(res) {

            });
        },

        // refreshList: function () {
        //     this.reqParam.page.pageNo = 1;
        //     this.list = [];
        //     this.loadMore();
        // },

        loadMore: function () {
            this.configCached = this.retrieveConfigCached();
            this.reqParam.page.pageSize = this.configCached['num-loading'] || 10;

            !this.isLoading && this.getHuiItems(this.reqParam);
        },

        openHuiPcDetailSite: function (item) {
            var link = consts.host;

            link += (item.itemType === 3 || item.itemType === 4) ? 'article.html?id=' + item.url : 'detail.html?id=' + item.id;
            chrome.tabs.create({url: link + '&' + consts.tjDetailRedirect});
            tj.trackEventTJ(tj.category.handpick, 'openHuiPcDetail', 'id', item.id);
        },

        sendMessage: function (item) {
            chrome.runtime.sendMessage({
                type: "pushItem",
                list: [item],
            }, function(response) {

            });
        },

        getHuiItems: function (params) {
            var self = this;
            self.isLoading = true;
            $('.loading-tips').removeClass('failed').addClass('loading');

            // 抓取百度惠精选商品列表定时器
            sdHuiCore.getHuiList({
                pageNo: params.page.pageNo,
                pageSize: params.page.pageSize,
                success: function (data) {
                    var item = {};
                    for (var i = 0; i < data.data.result.length; i++) {
                        item = data.data.result[i];
                        data.data.result[i].progressAt = item.likeNum / (item.likeNum + item.unlikeNum) * 100;
                    }

                    var freshList = sdHuiCore.persistTop20.call(sdHuiCore, data.data.result, params.page.pageNo).freshList;
                    var freshItemCount = freshList.length;

                    // 更新列表
                    if (self.isUsingPersistData) {
                        // 首屏翻新，不去除二次编辑更新过的项目
                        self.list = data.data.result;
                        self.isUsingPersistData = false;
                        $('body').animate({
                            scrollTop: 0
                        });
                    }
                    else {
                        // 增量更新时，必须去除二次编辑更新的项目
                        self.list = self.list.concat(freshList);
                    }

                    if (self.toast.show) {
                        var oldFreshNum = ~~self.toast.msg.slice(0, self.toast.msg.indexOf('个'));
                        self.toast.msg = (oldFreshNum + freshItemCount) + '个新优惠';
                        self.toast.hideDelay += 3000;
                    }
                    else {
                        self.toast.type = 'info';
                        self.toast.show = true;
                        self.toast.msg = freshItemCount === 0 ? '已经是最新的了' : freshItemCount + '个新优惠';
                        self.toast.hideToast();
                    }
                    console.log('[Magnet] freshItemCount: ' + freshItemCount);
                    $('.mask').addClass('hide');
                    self.isLoading = false;
                    self.bindToolbar();
                    $('.loading-tips').removeClass('failed').addClass('loading');
                    tj.trackEventTJ(tj.category.handpick, 'loadListMore', 'pageNo', params.page.pageNo);
                    self.reqParam.page.pageNo += 1;
                },
                failure: function (data, textStatus, jqXHR) {
                    self.isLoading = false;
                    $('.loading-tips').removeClass('loading').addClass('failed');
                    self.fetchFailedTips.counter++;
                    tj.trackEventTJ(tj.category.handpick, 'loadListMore', 'pageNo', 0);
                },
                ontimeout: function (data) {
                    self.toast.type = 'info';
                    self.toast.show = true;
                    self.toast.msg = '超时了，往下翻页重试';
                    self.toast.hideToast();
                }
            });
        },

        init: function () {
            this.configCached = this.retrieveConfigCached();
            this.reqParam.page.pageSize = this.configCached['num-loading'];
            var huiListPersist = storage.get('hui_list');
            this.list = (huiListPersist && JSON.parse(huiListPersist.data)) || [];

            this.getHuiItems(this.reqParam);
            this.bindEvents();
        },

        bindEvents: function () {
            var self = this;

            $(window).on('scroll',function() {
                if (self.pageSlided || self.isLoading) {
                    return;
                }
                var scrollH = $.type($('body').scrollTop()) === 'number' ? $('body').scrollTop() : $(document).scrollTop();
                var viewportHeight = $(window).height();

                if (scrollH + viewportHeight >= $('body').height()) {
                    tj.trackEventTJ(tj.category.handpick, 'pageFlipping', 'listLength', self.list.length);
                    self.loadMore();
                }
            });

            $('.loading-tips').click(function () {
                if ($('.loading-tips').hasClass('failed')) {
                    self.loadMore();
                }
            });

            this.bindToolbar();
        },

        bindToolbar: function () {
            setTimeout(function () {
                $('.sns')
                    .on('mouseover', '.toolbar', function () {
                        $(this).find('.open-hui-site').addClass('hovering');
                    })
                    .on('mouseleave', '.toolbar', function () {
                        $(this).find('.open-hui-site').removeClass('hovering');
                    });
            }, 1000);
        },

        showDetail: function (item) {
            this.pageSlided = !this.pageSlided;
            this.activeId = item.id;
            this.coverImg = item.coverImg;
            var offset = $('img[src="' + item.coverImg + '"]').offset();
            var pos = {
                top: offset.top - $('body').scrollTop(),
                left: offset.left
            };

            tj.trackEventTJ(tj.category.handpick, 'showDetail', 'id', item.id);
        }
    },
    components: {
        sdHead: require('../components/header.vue'),
        sdItem: require('../components/item.vue'),
        sdToast: require('../components/toast.vue')
    }
}
</script>
