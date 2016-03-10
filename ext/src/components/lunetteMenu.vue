<style lang="stylus" scoped>
    @import '../assets/styl/components/lunetteMenu.styl'
</style>

<template>
    <div id="lunette-menu" class="lunette-menu-list" transition="menu-anim" :class="{'menu-anim-enter': menuExpanded}">
        <ul class="list-ul">
            <li class="icon-hui" v-link="{'name':'list', query: {tab: 'hui'}}">
                <a href="javascript:;" class="a-hui">
                    <i class="fa fa-bluetooth"></i>
                </a>
            </li>
            <li class="icon-extension" v-link="{name: 'about', query: {tab: 'extension'}}">
                <a href="javascript:;" class="a-extension">
                    <span><i class="fa fa-bluetooth"></i></span>
                </a>
            </li>
            <li class="icon-donate" v-link="{name: 'about', query: {tab: 'donate'}}">
                <a href="javascript:;" class="a-donate">
                    <span><i class="fa fa-bluetooth"></i></span>
                </a>
            </li>
            <li class="icon-feedback" v-link="{name: 'about', query: {tab: 'feedback'}}">
                <a href="javascript:;" class="a-feedback">
                    <span><i class="fa fa-bluetooth"></i></span>
                </a>
            </li>
            <li class="icon-other" v-link="{name: 'about', query: {tab: 'feedback'}}">
                <a href="javascript:;" class="a-other">
                    <span><i class="fa fa-bluetooth"></i></span>
                </a>
            </li>
        </ul>
    </div>
    <div class="menu-switch" :class="{active: menuExpanded}" v-on:click="menuExpanded = !menuExpanded">
        <div class="left-hyphen"></div>
        <div class="right-hyphen"></div>
    </div>
</template>
<script>
/**
 * Magnet 半圆导航模块
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
 */
var tj = require('../libs/tj.js');
module.exports = {
    replace: true,
    props: ['menuExpanded'],
    ready: function () {
        tj.trackEventTJ(tj.category.lunetteMenu, 'compLoaded', [{}]);
    },
    watch: {
        menuExpanded: function (val, oldVal) {
            tj.trackEventTJ(tj.category.lunetteMenu, 'menuExpanded', [{expanded: menuExpanded}]);
        }
    },
    methods: {

    }
};
</script>
