"use strict";


/**
 * Magnet
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
*/
var consts = {

    /**
     * 环境参数
     *
     * dev_ext ：插件内调试模式
     * dev_html ：插件外浏览器内调试模式
     * pro_ext : 插件内发布时，编译时使用
     */
    env: 'pro_ext',

    debug: true,

    host: 'http://hui.baidu.com/',
    apiProxyHost: 'http://www.staydan.com/api/api.php/hui/',
    apiHost: 'http://hui.baidu.com/facade/',
    apiList: {
        recmdList: 'hui/rcmdse/list',
        itemDetail: 'hui/detail/get',
        itemComment: 'comment/page'
    },

    configName: 'magnet_config',
    cacheListName: 'hui_list',

    pushType: {
        1: '精选',
        2: '特卖'
    },
    failFunnyTips: ['', '失败乃成功之母', '事不过三', '数据在哪里啊，数据在哪里', '我有一只小毛驴，从来也不骑',
        '今天天气好晴朗，处处好风光',
        '蓝蓝天空，太阳公公，小狗追着小蜜蜂',
        '百度惠，助你买买买',
        '刷了这么多次，不如去商店里给我写个评价吧',
        '', '', '', '尿点来了'
    ],
    settingList: [
        {
            id: 1,
            key: 'push',
            label: '推送',
            items: [
                {
                    id: 101,
                    key: 'push-switch',
                    label: '开关',
                    type: 'singleradio',
                    init: true
                },
                {
                    id: 102,
                    key: 'push-audio',
                    label: '音效',
                    type: 'singleradio',
                    init: true
                },
                {
                    id: 103,
                    key: 'push-type',
                    label: '类型',
                    values: ['精选', '特卖'],
                    type: 'checkbox',
                    init: '精选,特卖'
                },
                {
                    id: 104,
                    key: 'push-frequency',
                    label: '频率',
                    values: [3, 5, 10, 20, 30, 60],
                    type: 'radio',
                    init: 5
                }
            ]
        },
        {
            id: 2,
            key: 'loading',
            label: '加载项',
            items: [
                {
                    id: 201,
                    key: 'num-loading',
                    label: '每页条数',
                    values: [10, 20, 30],
                    type: 'radio',
                    init: 10
                }
            ]
        },
        {
            id: 3,
            key: 'cache',
            label: '缓存项',
            items: [
                {
                    id: 301,
                    key: 'cache-clear',
                    label: '历史缓存',
                    value: '清空缓存',
                    type: 'btn'
                }
            ]
        },
        {
            id: 4,
            key: 'global',
            label: '全局设置',
            items: [
                {
                    id: 401,
                    key: 'reset-default',
                    label: '全局设置',
                    value: '恢复默认设置',
                    type: 'btn'
                }
            ]
        }
    ],

    getApiHost: function () {
        return this.env === 'pro_ext' ? this.apiHost : '/facade/';
    },

    getApiPath: function (apiName) {
        return this.apiList.hasOwnProperty(apiName) && this.apiList[apiName];
    }
};

if (typeof define !== 'undefined') {
    define(function (require) {
        return consts;
    });
}

