<style lang="stylus">
    @import '../assets/styl/normalize.css'
    @import '../assets/styl/sd-icons.css'
    @import '../assets/styl/components/item.styl'
</style>

<template>
    <div class="item-detail">
        <!-- <div class="mask"></div> -->
        <!-- <img :src="coverImg" class="item-preview-img" transition="zoom-in-center"> -->
        <div class="item-brief">
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
        </div>
        <div class="sns-tool">
            <div class="sns-numbers">
                <i class="icon sd-icon-thumbs-o-up"></i><span class="number">{{item.likeNum > 0 ? item.likeNum : 0}}</span>
                <div class="progress">
                    <div class="progress-bar-active" v-bind:style="{width: progressAt + '%' }"></div>
                    <div class="progress-anchor-at" v-bind:style="{left: progressAt + '%' }"></div>
                </div>
                <i class="icon sd-icon-thumbs-o-down"></i><span class="number">{{item.unlikeNum > 0 ? item.unlikeNum : 0}}</span>
            </div>
            <div class="sns-interact">
                <div class="sns-interact-comment">
                    <i class="icon sd-icon-bubble-comment-streamline-talk"></i><span class="">评论</span><span class="number">{{item.commentNum > 0 ? item.commentNum : 0}}</span>
                </div>
                <div class="sns-interact-fav">
                    <i class="icon sd-icon-heart-o"></i><span class="">收藏</span>
                </div>
            </div>
            <div class="away">
                <div class="btn btn-away">去{{item.merchantAlias}}瞧瞧</div>
                <span class="update-time" v-text="item.revealTime"></span>
            </div>
        </div>
        <div class="detail-short-reason">
            <span class="reason-item">{{item.shortReason}}</span>
            <img src="{{item.portrait}}" class="revealer-avatar">
            <span class="revealer">{{item.revealerName}}</span>
        </div>
        <div class="description">
            {{{item.recommendReasonWithRichText}}}
        </div>
        <div class="separator"></div>
        <sd-comments :list="commentList"></sd-comments>
    </div>
</template>

<script>
/**
 * Magnet 优惠商品项
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
 */
module.exports = {
    replace: true,
    props: ['activeId', 'coverImg'],
    data: function () {
        return {
            id: [],
            reqDone: false,
            item: {},
            commentList: {},
            progressAt: 0
        };
    },
    ready: function () {
        this.init();
    },
    watch: {
        activeId: function (val, oldVal) {
            this.getHuiItemDetail(val);
            this.getHuiItemDetailComment(val);
        }
    },
    methods: {
        getHuiItemDetail: function (itemId) {
            var self = this;
            self.id = itemId;

            // $.get('http://localhost/api/api.php/hui/ios/version', function (d) {
            //     console.log(d);
            // });

            $.post('http://localhost/api/api.php/hui/detail',
                JSON.stringify({id: self.id}),
                function (data, textStatus, jqXHR) {
                    self.item = data.data.result;
                    self.progressAt = self.item.likeNum / (self.item.likeNum + self.item.unlikeNum) * 100;
                }, 'json'
            )
            .fail(function (data, textStatus, jqXHR) {
                console.log(data);
            });
        },

        getHuiItemDetailComment: function (itemId) {
            // {"targetType":1,"targetId":103407,"page":{"pageNo":1,"pageSize":30,"order":"desc","orderBy":"ctime"}}
            var self = this;

            var param = {
                targetType: 1,
                targetId: itemId,
                pageNo: 1,
                pageSize: 30,
                order: "desc",
                orderBy: "ctime"
            };

            $.post('http://localhost/api/api.php/hui/comment',
                JSON.stringify(param),
                function (data, textStatus, jqXHR) {
                    self.commentList = data.data.result;
                }, 'json'
            )
            .fail(function (data, textStatus, jqXHR) {
                console.log(data);
            });
        },

        init: function () {
            console.log(this.activeId);
        }
    },
    components: {
        sdComments: require('./comments.vue'),
    }
};
</script>
