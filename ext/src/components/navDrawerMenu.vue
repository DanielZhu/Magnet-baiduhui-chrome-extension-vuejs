<template>
    <section id="sideBar" class="nav-drawer-list">
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
    .nav-drawer-list
        position: fixed
        top: 0
        bottom: 0
        width: 200px
        background-color: #fff
        color: #313131
        transition: all .3s ease
        &.show
            transform: translateX(200px)
        .list-ul
            border-top: 1px solid #d4d4d4
            overflow: hidden
            padding-top: 9%
            li
                font-size: 16px
                font-weight: 200
                padding: 9% 24px
                text-align: center
                text-indent: 1px
                line-height: 15px
                color: #7f8c8d
                cursor: pointer
                &:last-child
                    margin-bottom: 50px
                &:before
                    color: #2c3e50
                &:hover
                    background-color: #eee
                &.active
                    color: #F54F4F
            .line
                border-top: 1px solid #d4d4d4
            a
                display: block
                color: #313131
</style>
