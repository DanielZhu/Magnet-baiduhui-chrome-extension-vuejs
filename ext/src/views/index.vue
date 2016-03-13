<style lang="stylus">
    @import '../assets/styl/normalize.css'
    @import '../assets/styl/sd-icons.css'
    @import '../assets/styl/components/toast.styl'
    @import '../assets/styl/list.styl'
</style>
<template>
    <div class="home">
        <sd-toast :showing="toast.show" :msg="toast.msg" :icontype="toast.type"></sd-toast>
        <sd-head :shownav.sync="showSlideNav" :back.sync="pageSlided" :titleflied.sync="toast.show"></sd-head>
        <div class="slide-paging" transition="page" :class="{'page-enter': pageSlided, 'page-leave': !pageSlided}">
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
                                <div class="see-detail" v-on:click="showDetail(item)"><i class="icon sd-icon-qrcode"></i>查看详情</div>
                                <div class="see-outside" v-on:click="sendMessage(item)"><i class="icon sd-icon-bell-o"></i></div>
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
                                <i class="icon sd-icon-thumbs-o-down"></i><span class="number">{{item.unlikeNum > 0 ? item.unlikeNum : 0}}</span>
                                <i class="icon sd-icon-bubble-comment-streamline-talk"></i><span class="number">{{item.commentNum > 0 ? item.commentNum : 0}}</span>
                                <i class="icon sd-icon-heart-o"></i><span class="number">{{item.favorNum > 0 ? item.favorNum : 0}}</span>
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
module.exports = {
    data: function () {
        var self = this;
        return {
            pageSlided: false,
            showSlideNav: false,
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
            }
        }
    },
    route: {
        canReuse: false
    },
    filters: {},
    ready: function () {
        console.log('[Hui] Detail Page Ready...');
        var configCached = this.retrieveConfigCached();
        this.reqParam.page.pageSize = configCached['num-loading'];
        this.init();
        this.clearBadge();
        tj.trackPageViewTJ(tj.pageLists.handpick);
        tj.trackEventTJ(tj.category.handpick, 'pageLoaded', [{}]);
    },
    watch: {
        showSlideNav: function (val, oldVal) {
            console.log('showSlideNav: ' + val);
        },
        pageSlided: function (val, oldVal) {
            console.log('pageSlided: ' + val);
            $('.item-detail').height(val ? 'initial' : $(window).height());
            $('.hui-list').height(val ? $(window).height() : 'initial');

            tj.trackPageViewTJ(val ? tj.pageLists.about : tj.pageLists.handpick);
            tj.trackEventTJ(tj.category.handpick, 'pageSlided', [{isFirstPage: !val}]);
        }
    },
    methods:{
        retrieveConfigCached: function () {
            var config = {};
            var configCached = storage.get(consts.configName) || {};
            if (configCached) {
                config = configCached.data;
            }
            else {
                config = this.syncConfig();
            }

            return config;
        },

        clearBadge: function () {
            chrome.runtime.sendMessage({
                type: "clearBadge"
            }, function(res) {

            });
        },

        refresh: function () {

        },

        loadMore: function () {
            var configCached = this.retrieveConfigCached();
            this.reqParam.page.pageSize = configCached['num-loading'] || 10;

            this.reqParam.page.pageNo += 1;
            !this.isLoading && this.getHuiItems(this.reqParam);
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
            $.ajaxSetup({
                url: 'http://localhost/api/api.php/hui/list',
                timeout: 5000,
                type: 'POST',
                data: JSON.stringify(params.page),
                success: function (data) {
                    var item = {};
                    for (var i = 0; i < data.data.result.length; i++) {
                        item = data.data.result[i];
                        data.data.result[i].progressAt = item.likeNum / (item.likeNum + item.unlikeNum) * 100;
                    }
                    var freshItemCount = self.persistTop20.call(self, data.data.result)

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

                    tj.trackEventTJ(tj.category.handpick, 'loadListMore', [params.page], data.data.result.length);
                },
                error: function (data, textStatus, jqXHR) {
                    self.isLoading = false;
                    console.log(data);
                    tj.trackEventTJ(tj.category.handpick, 'loadListMore', [params.page], 0);
                }
            });
            $.ajax();
        },

        init: function () {
            console.log('[Hui] Detail Page Initing...');
            var huiListPersist = storage.get('hui_list');
            this.list = (huiListPersist && JSON.parse(huiListPersist.data)) || [];

            this.getHuiItems(this.reqParam);
            this.bindEvents();
        },

        persistTop20: function (newList) {
            console.log('newList: ' + newList.length);
            var huiListPersist = storage.get('hui_list');
            var persistedList = (huiListPersist && JSON.parse(huiListPersist.data)) || [];
            console.log('persistedList: ' + persistedList.length);
            if (this.isUsingPersistData) {
                this.list = newList;
                this.isUsingPersistData = false;
            }
            else {
                this.list = this.list.concat(newList);
            }
            storage.set('hui_list', JSON.stringify(this.list.slice(0, 10)));

            // 返回更新量
            return this.calcUpdatedCount(newList, persistedList);
        },

        calcUpdatedCount: function (newList, oldList) {
            var freshItemCount = 0;

            for (var i = 0; i < newList.length; i++) {
                var newItem = newList[i];
                var duplicated = false;
                for (var j = 0; j < oldList.length; j++) {
                    var oldItem = oldList[j];
                    if (newItem.id === oldItem.id
                        && new Date(newItem.updateTime).getTime() - new Date(oldItem.updateTime).getTime() <= 0) {
                        duplicated = true;
                    }
                }
                !duplicated && freshItemCount++;
            }

            return freshItemCount;
        },

        bindEvents: function () {
            var self = this;

            $(window).on('scroll',function() {
                // console.log($(window).scrollTop());
                if (self.pageSlided || self.isLoading) {
                    return;
                }
                var scrollH = $.type($('body').scrollTop()) === 'number' ? $('body').scrollTop() : $(document).scrollTop();
                var viewportHeight = $(window).height();

                if (scrollH + viewportHeight >= $('body').height()) {
                    console.log('[Magnet] Loading more');
                    tj.trackEventTJ(tj.category.handpick, 'pageFlipping', [{listLength: self.list.length}], self.list.length);
                    self.loadMore();
                }
            });
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

            tj.trackEventTJ(tj.category.handpick, 'showDetail', [{id: item.id}], item.price);
        }
    },
    components: {
        sdHead: require('../components/header.vue'),
        sdItem: require('../components/item.vue'),
        sdToast: require('../components/toast.vue')
    }
}
</script>
