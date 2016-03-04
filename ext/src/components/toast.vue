<style lang="stylus" scoped>
    @import '../assets/styl/components/toast.styl'
</style>

<template>
    <div id="toast" class="toast-container"  v-show="show">
        <div class="toast-wrap">
            <i class="toast-icon toast-icontype"></i>
            <p class="toast-label" v-text="msg"></p>
        </div>
        <div class="countdown-timer" transition="countdown" :class="{'countdown-enter': countdownShow}"></div>
        <div class="toast-bg"></div>
    </div>
</template>
<script>
/**
 * Magnet 提示模块
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
 */
module.exports = {
    replace: true,
    props: ['show', 'msg', 'icontype'],
    data: function () {
        return {
            countdownShow: false
        }
    },
    watch: {
        show: function (val, oldVal) {
            val ? this.in() : this.out();
        }
    },
    methods: {
        in: function () {
            var self = this;
            this.show = true;
            setTimeout(function () {
                self.countdownShow = true
                self.out();
            }, 500);
        },

        out: function () {
            var self = this;
            setTimeout(function (e) {
                self.show = false;
                self.countdownShow = false
            }, 3000);
        }
    }
};
</script>
