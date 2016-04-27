<style lang="stylus">
    @import '../assets/styl/sd-icons.css'
    @import "../assets/styl/components/settingHeader.styl"
</style>

<template>
    <header class="setting-header">
        <div class="title-bar"></div>
        <nav class="setting-header-nav">
            <ul>
                <li>欢迎使用</li>
                <li>常规</li>
                <li>推送</li>
                <li>捐赠</li>
            </ul>
        </nav>
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
            nickname: 'Staydan.com',
            inOptionPanel: window.inOptionPanel
        };
    },
    ready: function () {
    },
    watch: {
        shownav: function (val, oldVal) {
            $('#sideBar').toggleClass('slide-leave', !val);
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
