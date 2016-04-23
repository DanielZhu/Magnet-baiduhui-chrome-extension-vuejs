'use strict'

export default function (router) {
    router.map({
        '/': {				//首页
            name: 'home',
            component: require('./views/welcome.vue')
        },
        '*': {
            component: require('./views/welcome.vue')
        },
        '/list': {               //首页
            name: 'list',
            component: require('./views/index.vue')
        },
        '/setting': {               //首页
            name: 'setting',
            component: require('./views/setting.vue')
        },
        '/about': {               //关于
            name: 'about',
            component: require('./views/about.vue')
        },
        // '/topic/:id': {               //专题
        //     name: 'topic',
        //     component: function (resolve) {
        //         require(['./views/topic.vue'], resolve);
        //     }
        // },
        // '/add': {               //首页
        //     name: 'add',
        //     component: function (resolve) {
        //         require(['./views/new.vue'], resolve);
        //     },
        //     auth: true
        // },
        // '/message': {               //消息
        //     name: 'message',
        //     component: function (resolve) {
        //         require(['./views/message.vue'], resolve);
        //     },
        //     auth: true
        // },

        // '/login': {               //登录
        //     name: 'login',
        //     component: function (resolve) {
        //         require(['./views/login.vue'], resolve);
        //     }
        // },
        // '/user/:loginname': {               //用户信息
        //     name: 'user',
        //     component: function (resolve) {
        //         require(['./views/user.vue'], resolve);
        //     }
        // }
    })
}
