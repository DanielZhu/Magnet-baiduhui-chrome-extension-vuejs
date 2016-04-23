<style lang="stylus">
    @import '../assets/styl/sd-icons.css'
    @import "../assets/styl/components/header.styl"
</style>

<template>
    <header id="header">
        <div class="title-bar" transition='header-slide' :class="{'header-slide-enter': shownav, 'header-slide-leave': !shownav}">
            <div class="left-btn">
                <i class="icon sd-icon-bars" v-on:click="shownav = !shownav"></i>
                <i class="icon sd-icon-left-open-big" v-show="back" v-on:click="back = !back"></i>
            </div>
            <div class="title" transition="fly-down" :class="{'fly-down-enter': titleflied, 'fly-down-leave': !titleflied}">{{title}}</div>
            <div class="right-btn">
                <!-- <i class="icon sd-icon-cw" v-on:click="refreshList"></i> -->
            </div>
            <div class="personal-info" v-show="false">
                <!-- <img class="avatar" data-src="{{avatar_src}}" src="../assets/images/img_35*35.svg"> -->
                <p class="nickname">{{nickname}}</p>
            </div>
        </div>
        <sd-nav-drawer transition='slide' :class="{'slide-enter': shownav}"></sd-nav-drawer>
    </header>
</template>

<script>
/**
 * Magnet 头部模块
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
 */
var tj = require('../libs/tj.js');
module.exports = {
    props: ['back', 'titleflied', 'shownav'],
    route: {
        canReuse: false
    },
    data: function () {
        return {
            title: 'Checker For 百度惠',
            nickname: 'Staydan.com'
        };
    },
    ready: function () {
        // tj.trackEventTJ(tj.category.navDrawerMenu, 'compLoaded');
    },
    watch: {
        shownav: function (val, oldVal) {
            $('#sideBar').toggleClass('slide-leave', !val);
            // tj.trackEventTJ(tj.category.navDrawerMenu, 'shownav', 'showing', val ? 1 : 0);
        }
    },
    methods: {
        // refreshList: function () {
        //     this.$parent.refreshList();
        // }
    },
    components: {
        sdNavDrawer: require('./navDrawerMenu.vue')
    }
}
</script>
