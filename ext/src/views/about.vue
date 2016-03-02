<style lang="stylus">
    @import '../assets/styl/index.styl'
</style>

<template>
    <sd-head :show.sync="showSlideNav"></sd-head>
    <div class="about-container">

    </div>
    <sd-Lunette-menu :menuExpanded.sync="showLunetteMenu"></sd-Lunette-menu>
</template>

<script>
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
