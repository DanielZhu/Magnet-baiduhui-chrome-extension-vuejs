<template>
    <section id="lunette-menu" class="lunette-menu-list" v-show="true">
        <ul class="list-ul">
            <li class="icon-hui" v-link="{'name':'list', query: {tab: 'hui'}}">
                <a href="javascript:;" class="a-hui">
                    <i class="fa fa-bluetooth fa-2x"></i>
                </a>
            </li>
            <li class="icon-extension" v-link="{name: 'about', query: {tab: 'extension'}}">
                <a href="javascript:;" class="a-extension">
                    <span>B</span>
                </a>
            </li>
            <li class="icon-donate" v-link="{name: 'about', query: {tab: 'donate'}}">
                <a href="javascript:;" class="a-donate">
                    <span>C</span>
                </a>
            </li>
            <li class="icon-feedback" v-link="{name: 'about', query: {tab: 'feedback'}}">
                <a href="javascript:;" class="a-feedback">
                    <span>D</span>
                </a>
            </li>
            <li class="icon-other" v-link="{name: 'about', query: {tab: 'feedback'}}">
                <a href="javascript:;" class="a-other">
                    <span>E</span>
                </a>
            </li>
        </ul>
        <div class="menu-switch">
            <div class="left-hyphen"></div>
            <div class="right-hyphen"></div>
        </div>
    </section>
</template>
<script>
    module.exports = {
        replace: true,
        props: ['show']
    };
</script>

<style lang="stylus" scoped>
    @import '../assets/styl/components/lunetteMenu.styl'
</style>
