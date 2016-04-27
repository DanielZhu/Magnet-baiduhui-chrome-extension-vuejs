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
            <div class="v-separator"></div>
           <div class="lvl-block points-info">
                <p class="label">积分</p>
                <p class="value">{{myInfo.pointsTotal}}</p>
            </div>
            <div class="menu-switch" :class="{active: menuExpanded}" v-on:click="menuExpanded = !menuExpanded">
                <div class="left-hyphen"></div>
                <div class="right-hyphen"></div>
            </div>
        </div>
        <div class="drag-to-signin-guide" v-show="isLoginIn && (readyDrag || signInNow || showSignInResult)">
            <div class="drag-to-signin-guide-dest" :class="{'show-result': signInNow || showSignInResult, loading: signInNow}" v-bind:style="{right: dragToSignInGuideDestPosX + 'px', boxShadow: shadowX + 'px 0px 2px 2px #dd3066'}">
                <i class="el-hidden sd-icon-cancel"></i>
                <i class="el-hidden sd-icon-check-1"></i>
            </div>
            <div class="avatar-area" v-show="!myInfo.signed && !signInNow && !showSignInResult">
                <img src="{{myInfo.portrait}}" class="avatar-img" v-bind:style="{marginLeft: draggedDist +'px'}">
            </div>
        </div>
        <div class="login-bar" v-show="!isLoginIn">
            <div class="login-btn" v-on:click="gotoLogin" data-highlight="gray">登录</div>
        </div>
        <div class="signin-bar" v-show="isLoginIn">
            <div class="drag-to-signin" v-show="!myInfo.signed">
                <div class="sd-icon-right-open-big drag-to-signin-guide-arrow highlight"><i class="sd-icon-right-open-big"></i><i class="sd-icon-right-open-big"></i></div>
                <div class="swiper-btn" v-bind:style="{marginLeft: draggedDist +'px'}" v-on:mousedown="readyToDrag" v-on:mousemove="inDragging" v-on:mouseleave="endDragging" v-on:mouseup="endDragging">滑动签到</div>
            </div>
            <div class="today-has-signed" v-show="myInfo.signed && !showSignInResult"><i class="icon sd-icon-check-1"></i>今日已签到</div>
            <div class="signed-message" v-show="showSignInResult">
                <i class="sd-icon-cancel"></i>
                <i class="sd-icon-check-1"></i>
                <span class="signed-message-text"></span>
            </div>
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
            signInNow: false,
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
        this.fetchUserInfo();
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

        fetchUserInfo: function () {
            var self = this;
            sdHuiCore.sendPost({
                apiName: 'myInfo',
                params: {
                    deviceType: 1
                },
                success: function (data) {
                    self.isLoginIn = !(data.status === 1 && data.msg === '用户未登录');
                    if (self.isLoginIn) {
                        self.myInfo = data.data.result;
                        $('.today-has-signed .sd-icon-check-1').show();
                    }
                    else {
                        self.menuExpanded = false;
                    }
                },
                failure: function (data, textStatus, jqXHR) {
                    self.isLoginIn = false;
                },
                ontimeout: function (data) {
                    self.isLoginIn = false;
                }
            });
        },

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
            this.signInNow = true
            this.dragToSignInGuideDestPosX = 100;
            sdHuiCore.sendPost({
                apiName: 'mySignInToday',
                params: {deviceType: 1},
                success: function (data) {
                    if (data.msg === '今日已经签到，不能重复签到。\n') {
                        self.fetchUserInfo();
                    }
                    else {
                        self.showSignInResult = true;
                        $('.signed-message').fadeIn();
                        $('.signed-message-text').text(data.status === 0 ? '' : data.msg);
                        setTimeout(function () {
                            self.showSignInResult = false;
                            self.fetchUserInfo();
                        }, 2500);
                    }

                    $('.sd-icon-cancel').toggleClass('el-hidden', data.status === 0);
                    $('.sd-icon-check-1').toggleClass('el-hidden', data.status !== 0);

                    self.signInNow = false;
                    self.readyDrag = false;
                    self.isSignInDragging = false;
                    self.shadowX = 0;
                    self.draggedDist = 0;
                },
                failure: function (data, textStatus, jqXHR) {
                    self.showSignInResult = true;

                    $('.sd-icon-cancel').show();
                    $('.sd-icon-check-1').hide();
                    $('.signed-message').fadeIn();

                    $('.signed-message-text').text('签到失败');
                    self.signInNow = false;
                    self.readyDrag = false;
                    self.isSignInDragging = false;
                    self.shadowX = 0;
                    self.draggedDist = 0;
                    setTimeout(function () {
                        self.showSignInResult = false;
                        $('.signed-message').fadeOut();
                    }, 2500);
                },
                ontimeout: function (data) {
                    $('.signed-message-text').text('通讯超时');
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
