<style lang="stylus">
    .header-slide-transition
        overflow: hidden
        transition: all .2s linear
        z-index: 40
        padding-left: 0
    .header-slide-enter
        padding-left: 200px
    .header-slide-leave
        padding-left: 0

    header
        position: fixed
        top: 0
        width: 600px
        min-height: 60px
        z-index: 100
        .btn
            width: 30px
            height: auto
            padding: 5px
        .title-bar
            height: 60px
            width: 100%
            display: flex
            display: -webkit-flex
            background-color: #fff
            align-items: center
            -webkit-align-items: center
            border-bottom: 1px solid #eee
            .left-btn, .right-btn
                min-width: 30px
                text-align: left
                padding: 10px
                img
                    max-height: 28px
                    max-width: 30px
            .title
                flex: 1
                text-align: center
                font-size: 20px
                color: #DD3067
            .personal-info
                width: 150px
                text-align: right
</style>

<template>
    <header>
        <sd-nav-drawer transition='slide' :show='showSlideNav' :class="{'slide-enter': showSlideNav}"></sd-nav-drawer>
        <div class="title-bar" transition="header-slide" :class="{'header-slide-enter': showSlideNav}">
            <div class="left-btn">
                <img class="btn" v-on:click="toggleSlideNav" src="../assets/images/menu.png">
                <!-- <img class="btn" src="../assets/images/open-outside.png"> -->
                <img class="btn" src="../assets/images/back.png" v-show="back" v-on:click="back = !back">
            </div>
            <div class="title">{{title}}</div>
            <div class="right-btn">
                <!-- <img class="btn" src="../assets/images/info.png"> -->
            </div>
            <div class="personal-info" v-show="false">
                <img class="avatar" data-src="{{avatar_src}}" src="../assets/images/img_35*35.svg">
                <p class="nickname">{{nickname}}</p>
            </div>
        </div>
    </header>
</template>

<script>

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
