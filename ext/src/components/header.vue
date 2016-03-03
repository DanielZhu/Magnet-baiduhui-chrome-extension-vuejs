<style lang="stylus">
    @import '../assets/styl/normalize.css'
    @import '../assets/styl/sd-icons.css'
    @import "../assets/styl/components/header.styl"
</style>

<template>
    <header>
        <sd-nav-drawer transition='slide' :show='showSlideNav' :class="{'slide-enter': showSlideNav}"></sd-nav-drawer>
        <div class="title-bar" transition="header-slide" :class="{'header-slide-enter': showSlideNav}">
            <div class="left-btn">
                <i class="icon sd-icon-bars" v-on:click="toggleSlideNav"></i>
                <!-- <i class="icon sd-icon-external-link"></i> -->
                <i class="icon sd-icon-left-open-big" v-show="back" v-on:click="back = !back"></i>
            </div>
            <div class="title">{{title}}</div>
            <div class="right-btn">
                <i class="icon sd-icon-info"></i>
            </div>
            <div class="personal-info" v-show="false">
                <img class="avatar" data-src="{{avatar_src}}" src="../assets/images/img_35*35.svg">
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
module.exports = {
    props: ['back'],
    data: function () {
        return {
            showSlideNav: false,
            title: 'Checker For 百度惠',
            nickname: 'Staydan.com'
        };
    },
    methods: {
        toggleSlideNav: function () {
            this.showSlideNav = !this.showSlideNav;
        }
    },
    components: {
        sdNavDrawer: require('./navDrawerMenu.vue')
    }
}
</script>
