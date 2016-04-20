<template>
    <section id="sideBar" class="nav-drawer-list">
        <div class="user-info">

        </div>
        <ul class="list-ul">
            <li class="icon-home" v-link="{path: '/list', activeClass: 'active'}">首页</li>
            <li class="icon-setting" v-link="{path: '/setting', query: {nav: 'push-frequency'}, activeClass: 'active'}">设置</li>
            <li class="icon-about" v-link="{path: '/about', activeClass: 'active'}">关于</li>
        </ul>
    </section>
</template>
<script>
/**
 * Magnet 侧边抽屉模块
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
*/
module.exports = {
    replace: true,
    props: ['show'],
    route: {
        canReuse: true
    }
}
</script>

<style lang="stylus">
    @import '../assets/styl/components/navDrawerMenu.styl'
</style>
