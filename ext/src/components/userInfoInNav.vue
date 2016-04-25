<style lang="stylus" scoped>
    @import '../assets/styl/components/userInfoInNav.styl'
</style>

<template>
    <div id="user-info-in-nav" class="user-info-in-nav-container">
        <!-- 未登录 -->
         <div class="user-login-wrap" v-show="!isLoginIn">
            <div class="avatar-area"><img src="../assets/images/avatar-default.png" class="avatar-img"></div>
        </div>
        <!-- 已登录 -->
        <div class="user-info-signed-wrap" v-show="isLoginIn">
            <div class="user-info-more"></div>
            <div class="avatar-area">
                <img src="{{myInfo.portrait}}" class="avatar-img">
            </div>
           <div class="user-info-area">
                <p class="nickname"><span>Hi~</span> {{myInfo.userName}}</p>
                <div class="progress">
                    <div class="podium-start">Lv{{myInfo.level}}</div>
                    <div class="podium-end">Lv{{myInfo.level + 1}}</div>
                    <div class="progress-bar-active" v-bind:style="{width: myInfo.schedule }"></div>
                    <img src="../assets/images/hui-doll-jump.gif" class="progress-anchor-at" v-bind:style="{left: myInfo.schedule }">
                </div>
            </div>
        </div>
        <div class="user-lvl-wrap" :class="{active: menuExpanded}" v-show="isLoginIn">
            <div class="lvl-block lvl-info">
                <p class="label">等级</p>
                <p class="value">Lv.<span>{{myInfo.level}}</span></p>
            </div>
           <div class="lvl-block points-info">
                <p class="label">积分</p>
                <p class="value">{{myInfo.pointsTotal}}</p>
            </div>
            <div class="menu-switch" :class="{active: menuExpanded}" v-on:click="menuExpanded = !menuExpanded">
                <div class="left-hyphen"></div>
                <div class="right-hyphen"></div>
            </div>
        </div>
        <div class="drag-to-signin-guide" v-show="isLoginIn && (readyDrag || signiningNow || showSignInResult)">
            <div class="drag-to-signin-guide-dest" :class="{'show-result': signiningNow || showSignInResult, loading: signiningNow}" v-bind:style="{right: dragToSignInGuideDestPosX + 'px', boxShadow: shadowX + 'px 0px 2px 2px #dd3066'}">
                <i class="sd-icon-cancel"></i>
                <i class="sd-icon-check-1"></i>
            </div>
            <div class="avatar-area" v-show="!myInfo.signed && !signiningNow && !showSignInResult">
                <img src="{{myInfo.portrait}}" class="avatar-img" v-bind:style="{marginLeft: draggedDist +'px'}">
            </div>
        </div>
        <div class="login-bar" v-show="!isLoginIn">
            <div class="login-btn" v-on:click="gotoLogin">登录</div>
        </div>
        <div class="signin-bar" v-show="isLoginIn">
            <div class="drag-to-signin" v-show="!myInfo.signed">
                <div class="sd-icon-right-open-big drag-to-signin-guide-arrow highlight"><i class="sd-icon-right-open-big"></i><i class="sd-icon-right-open-big"></i></div>
                <div class="swiper-btn" v-bind:style="{marginLeft: draggedDist +'px'}" v-on:mousedown="readyToDrag" v-on:mousemove="inDragging" v-on:mouseleave="endDragging" v-on:mouseup="endDragging">滑动签到</div>
            </div>
            <div class="today-has-signed" v-show="myInfo.signed"><i class="icon sd-icon-check-1"></i>今日已签到</div>
        </div>
    </div>
</template>
<script>
/**
 * Magnet 左侧导航栏中的用户信息入口
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
 */
var consts = require('../libs/consts');
var SdHuiCore = require('../libs/sdHuiCore.js');
var sdHuiCore = new SdHuiCore(null, consts);
module.exports = {
    replace: true,
    props: ['showing', 'icontype'],
    route: {
        canReuse: false
    },
    data: function () {
        return {
            msg: '',
            signiningNow: false,
            isLoginIn:false,
            draggedDist: 0,
            isSignInDragging: false,
            menuExpanded: false,
            countdownShow: false,
            myInfo: {},
            readyDrag: false,
            mouseStartPos: {},
            dragToSignInGuideDestPosX: 0,
            shadowX: 0,
            showSignInResult: false
        }
    },
    ready: function () {
        var self = this;
        sdHuiCore.sendPost({
            apiName: 'myInfo',
            params: {
                deviceType: 1
            },
            success: function (data) {
                data = {
                    "status": 0,
                    "msg": "",
                    "data": {
                        "result": {
                            "userId": 368195903,
                            "userName": "OKIJUP",
                            "portrait": "http://himg.bdimg.com/sys/portrait/item/3f394f4b494a5550f215.jpg",
                            "signed": 0,
                            "pointsToday": 1,
                            "pointsTotal": 7523,
                            "experienceToday": 1,
                            "experienceTotal": 15023,
                            "level": 6,
                            "expForNextLevel": 2977,
                            "schedule": "50%",
                            "days": 0,
                            "blocked": 0,
                            "unreadMsgNum": 0,
                            "totalMsgNum": 31,
                            "commentsCount": 19,
                            "tipoffCount": 45,
                            "storeCount": 4,
                            "hasSigned": 0,
                            "bonusPointsForSignup": 0,
                            "nextDays": 3,
                            "nextPoints": 10,
                            "medal": []
                        },
                        "page": null,
                        "condition": null
                    }
                };
                self.isLoginIn = !(data.status === 1 || data.msg === '用户未登录');
                if (self.isLoginIn) {
                    self.myInfo = data.data.result;
                }
                else {
                    self.menuExpanded = false;
                }
            },
            failure: function (data, textStatus, jqXHR) {

            },
            ontimeout: function (data) {

            }
        });
    },
    watch: {
        draggedDist: function (val, oldVal) {
            if (this.isSignInDragging) {
                var destWidth = $('.drag-to-signin-guide-dest').width();
                var gap = 20 + val - $('.drag-to-signin-guide-dest').offset().left;
                var absDist = Math.abs(gap);
                $('.drag-to-signin-guide-dest').toggleClass('highlight', absDist < 8);
                var shadowXMax = 5;
                if (absDist < 30) {
                    this.shadowX = shadowXMax * (gap / destWidth * 2);
                }
            }
        }
    },
    methods: {

        inDragging: function (e) {
            if (this.readyDrag) {
                var mousePos = {
                    x: e.screenX,
                    y: e.screenY
                };
                var moveDist = mousePos.x - this.mouseStartPos.x;
                if (moveDist> 0 && moveDist < $('.drag-to-signin').width() - $('.swiper-btn').outerWidth()) {
                    this.draggedDist = moveDist;
                }

                this.isSignInDragging = true;
            }
        },

        endDragging: function (e) {
            if (this.readyDrag) {
                var absDist = Math.abs(20 + this.draggedDist - $('.drag-to-signin-guide-dest').offset().left);

                if (absDist < 2) {
                    this.signInToday();
                    console.log('Sending Sign In Request');
                }
                else {
                    this.readyDrag = false;
                    this.isSignInDragging = false;
                    this.shadowX = 0;
                    this.draggedDist = 0;
                }

            }
        },

        readyToDrag: function (e) {
            $('.sd-icon-cancel').hide();
            $('.sd-icon-check-1').hide();
            this.mouseStartPos = {
                x: e.screenX,
                y: e.screenY
            };

            this.readyDrag = true;
            this.isSignInDragging = false;

            var randomNum;
            do {
                randomNum = Math.random() * 100;
                if (randomNum > 15) {
                    this.dragToSignInGuideDestPosX = randomNum;
                }
            } while (randomNum < 15)
        },

        signInToday: function () {
            var self = this;
            this.signiningNow = true
            this.dragToSignInGuideDestPosX = 100;
            sdHuiCore.sendPost({
                apiName: 'mySignInToday',
                params: {deviceType: 1},
                success: function (data) {
                    self.showSignInResult = true;
                    var isLoginIn = !(data.status === 1 || data.msg === '用户未登录');
                    if (isLoginIn) {
                        self.msg = '签到成功';
                        $('.sd-icon-cancel').hide();
                        $('.sd-icon-check-1').show();
                    }
                    else {
                        self.msg = '签到失败';
                        $('.sd-icon-cancel').show();
                        $('.sd-icon-check-1').hide();
                    }

                    self.signiningNow = false;
                    self.readyDrag = false;
                    self.isSignInDragging = false;
                    self.shadowX = 0;
                    self.draggedDist = 0;
                    setTimeout(function () {
                        self.showSignInResult = false;
                    }, 2000);
                },
                failure: function (data, textStatus, jqXHR) {
                    self.showSignInResult = true;

                    $('.sd-icon-cancel').show();
                    $('.sd-icon-check-1').hide();
                    self.msg = '签到失败';
                    self.signiningNow = false;
                    self.readyDrag = false;
                    self.isSignInDragging = false;
                    self.shadowX = 0;
                    self.draggedDist = 0;
                    setTimeout(function () {
                        self.showSignInResult = false;
                    }, 2000);
                },
                ontimeout: function (data) {
                    $('.sd-icon-cancel').show();
                    $('.sd-icon-check-1').hide();
                    self.showSignInResult = true;
                    self.msg = '签到失败';
                    self.signiningNow = false;
                    self.readyDrag = false;
                    self.isSignInDragging = false;
                    self.shadowX = 0;
                    self.draggedDist = 0;
                    setTimeout(function () {
                        self.showSignInResult = false;
                    }, 2000);
                }
            });
        },

        gotoLogin: function () {
            chrome.tabs.create({url: 'https://passport.baidu.com/v2/?login&u=http://hui.baidu.com'}, function (tab) {
                chrome.windows.update(tab.windowId, {focused: true}, function () {});
            });
        }
    }
};
</script>
