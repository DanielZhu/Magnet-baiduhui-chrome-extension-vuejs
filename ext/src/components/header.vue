<style lang="stylus">
    @import '../assets/styl/normalize.css'
    @import '../assets/styl/sd-icons.css'
    @import "../assets/styl/components/header.styl"
</style>

<template>
    <header id="header">
        <sd-nav-drawer transition='slide' :class="{'slide-enter': shownav, 'slide-leave': !shownav}"></sd-nav-drawer>
        <div class="title-bar" transition='header-slide' :class="{'header-slide-enter': shownav, 'header-slide-leave': !shownav}">
            <div class="left-btn">
                <i class="icon sd-icon-bars" v-on:click="shownav = !shownav"></i>
                <!-- <i class="icon sd-icon-external-link"></i> -->
                <i class="icon sd-icon-left-open-big" v-show="back" v-on:click="back = !back"></i>
            </div>
            <div class="title" transition="fly-down" :class="{'fly-down-enter': titleflied, 'fly-down-leave': !titleflied}">{{title}}</div>
            <div class="right-btn">
                <!-- <i class="icon sd-icon-info" v-on:click="shownav = !shownav"></i> -->
            </div>
            <div class="personal-info" v-show="false">
                <!-- <img class="avatar" data-src="{{avatar_src}}" src="../assets/images/img_35*35.svg"> -->
                <p class="nickname">{{nickname}}</p>
            </div>
        </div>
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
        // tj.trackEventTJ(tj.category.navDrawerMenu, 'compLoaded', [{}]);
    },
    watch: {
        shownav: function (val, oldVal) {
            tj.trackEventTJ(tj.category.navDrawerMenu, 'shownav', [{showing: val}], );
        }
    },
    methods: {

    },
    components: {
        sdNavDrawer: require('./navDrawerMenu.vue')
    }
}
</script>
