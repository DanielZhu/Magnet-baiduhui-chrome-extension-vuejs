<style lang="stylus">
    @import '../assets/styl/welcome.styl'
</style>

<template>
    <div class="welcome">
        <img src="../assets/images/trans_logo.png" class="logo">
    </div>
</template>

<script>
module.exports = {
    data: function () {
        return {
        }
    },
    ready: function () {
        var self = this;

        setTimeout(function () {
            self.$route.router.go({name: 'list'});
        }, 1100);
    }
}
</script>
