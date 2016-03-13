<template>
    <section id="sideBar" class="nav-drawer-list">
        <ul class="list-ul">
            <li class="icon-home" v-link="'list'">首页</li>
            <li class="icon-setting" v-link="{name: 'setting', query: {nav: 'push-frequency'}}">设置</li>
            <li class="icon-about" v-link="'about'">关于</li>
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
        canReuse: false
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
            margin: 0 24px
            border-top: 1px solid #d4d4d4
            overflow: hidden
            padding-top: 9%
            li
                font-size: 14px
                font-weight: 200
                padding: 9% 0
                text-align: left
                text-indent: 1px
                line-height: 15px
                color: #7f8c8d
                &:last-child
                    margin-bottom: 50px
                &:before
                    color: #2c3e50
            .line
                border-top: 1px solid #d4d4d4
            a
                display: block
                color: #313131
</style>
