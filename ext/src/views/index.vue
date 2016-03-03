<template>
    <!-- 全局header -->
    <sd-head></sd-head>
    <div class="mask">
        <img class="loading" src="../assets/images/loading_100.gif">
    </div>
</template>
<script>
    module.exports = {
        ready (){
            setTimeout(() => {
                // this.$route.router.go({ name: 'list'});
            }, 2000);
        },
        components:{
            sdHead: require('../components/header.vue')
        }
    }
</script>
<style lang="stylus">
    @import '../assets/styl/index.styl'
</style>

