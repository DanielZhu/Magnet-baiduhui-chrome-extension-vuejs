<template>
    <!-- 全局header -->
    <sd-head></sd-head>
    <div class="mask">
        <img class="loading" src="../assets/images/loading_100.gif">
    </div>
</template>
<script>
    export default {
        ready (){
            setTimeout(() => {
                this.$route.router.go({ name: 'list'});
            }, 2000);
        },
        components:{
            sdHead: require('../components/header.vue')
        }
    }
</script>
<style lang="stylus">
    .mask
        position: absolute
        width: 100%
        height: 100%
        top: 0
        left: 0
        .loading
            width: 100px
            position: relative
            text-align: center
            left: 50%
            top: 50%
            margin-top: -50px
            margin-left: -50px
</style>

