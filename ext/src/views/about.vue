<style lang="stylus">
    @import '../assets/styl/about.styl'
</style>

<template>
    <sd-head :show.sync="showSlideNav"></sd-head>
    <div class="about-container">
        <section class="sec-item sec-about-hui">
            <header>关于百度惠</header>
            <article>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content
            </article>
        </section>
        <section class="sec-item sec-about-extension">
            <header>关于百度惠Chrome Extension</header>
            <article>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content
            </article>
        </section>
        <section class="sec-item sec-about-donate">
            <header>买杯甜甜圈？</header>
            <article>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content
            </article>
        </section>
        <section class="sec-item sec-about-feedback">
            <header>提点意见</header>
            <article>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content
            </article>
        </section>
        <section class="sec-item sec-about-other">
            <header>提点</header>
            <article>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content<br>
                content/content/content/content
            </article>
        </section>
    </div>
    <sd-Lunette-menu :menuExpanded.sync="showLunetteMenu"></sd-Lunette-menu>
</template>

<script>
/**
 * Magnet 帮助页
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
 */
module.exports = {
    data: function () {
        showLunetteMenu: true
    },
    methods: {

    },
    components: {
        sdHead: require('../components/header.vue'),
        sdLunetteMenu: require('../components/lunetteMenu.vue'),
    }
};
</script>
