<style lang="stylus">
    .separator
        position: relative
        height: 1px
        width: 100%
        border-top: 1px solid #D0D0D0
    .item-detail
        position: relative
        margin-top: 60px
        width: 600px
        float: left
        text-align: left
        .item-preview-img
            position: relative
            transition: all .3s ease
            width: 300px
            height: 300px
            text-align: left
        .item-brief
            position: relative
            .feed-info
                width: 100%
                vertical-align: middle
                text-align: left
                margin-right: 10px
                white-space: nowrap
                padding: 10px
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
        .detail-short-reason
            padding: 10px
            margin: 10px 0
            background-color: #E6DFFF
            color: #999
            text-align: left
            font-size: 12px
            .revealer
                float: right
                padding-right: 5px
                display: inline-block
                text-align: right
                color: #7392B5
            .revealer-avatar
                float: right
                width: 20px
                height: 20px
                overflow: hidden
                border-radius: 50%

        .description
            padding: 10px
            line-height: 1.8
            p img
                text-align: center
        .sns-tool
            box-sizing: border-box
            font-size: 12px
            color: #9d9d9d
            text-align: left
            width: 100%
            padding-right: 15px
            margin: 10px 0
            display: flex
            justify-content: center
            vertical-align: middle
            min-height: 55px
            .sns-numbers
                flex: 1
                height: 55px
                line-height: 55px
                text-align: center
                .progress
                    position: relative
                    width: 130px
                    height: 2px
                    margin: 0 5px
                    border-radius: 2px
                    display: inline-block
                    background-color: lightgray
                    .progress-bar-active
                        position: relative
                        background-color: #EA6591
                        height: 2px
                        width: 50%
                        transition: all .2s linear
                    .progress-anchor-at
                        position: absolute
                        top: -8px
                        left: 50%
                        width: 4px
                        margin-left: -4px
                        border-width: 4px
                        border-style: solid
                        border-color: transparent
                        border-top-color: #EA6591
                        transition: all .2s linear
                .icon
                    width: 15px
                    height: auto
                    display: inline-block
                    vertical-align: middle
                .number
                    height: 15px
                    margin-left: 2px
            .sns-interact
                flex: 1
                height: 55px
                line-height: 55px
                text-align: center
                .sns-interact-comment, .sns-interact-fav
                    display: inline-block
                    margin: 0 8px
                    span
                        margin: 0 5px
                .number
                    margin-left: 3px
                .icon
                    width: 15px
                    height: auto
                    margin: 0 4px
                    display: inline-block
                    vertical-align: middle
            .away
                width: 120px
                text-align: center
                .btn-away
                    background-color: #EA6591
                    padding: 5px 8px
                    color: #fff
                    letter-spacing: 1px
                .update-time
                    color: #999
                    display: block
                    margin-top: 5px

    .mask
        position: absolute
        width: 100%
        height: 100%
        background: #000
        opacity: .7
        top: 0
        left: 0

    .zoom-in-center-transition
        transform: translate3d(0%, 0%, 0)
    .zoom-in-center-enter
        transform: translate3d(50%, 50%, 0)
    .zoom-in-center-leave
        transform: translate3d(0%, 0%, 0)
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
                <img src="../assets/images/ding.png" class="icon"><span class="number">({{item.likeNum > 0 ? item.likeNum : 0}})</span>
                <div class="progress">
                    <div class="progress-bar-active" v-bind:style="{width: progressAt + '%' }"></div>
                    <div class="progress-anchor-at" v-bind:style="{left: progressAt + '%' }"></div>
                </div>
                <img src="../assets/images/cai.png" class="icon"><span class="number">({{item.unlikeNum > 0 ? item.unlikeNum : 0}})</span>
            </div>
            <div class="sns-interact">
                <div class="sns-interact-comment">
                    <img src="../assets/images/comment.png" class="icon"><span class="">评论</span><span class="number">{{item.commentNum > 0 ? item.commentNum : 0}}</span>
                </div>
                <div class="sns-interact-fav">
                    <img src="../assets/images/fav.png" class="icon"><span class="">收藏</span>
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
