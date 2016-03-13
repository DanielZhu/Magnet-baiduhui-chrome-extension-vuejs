"use strict";


/**
 * Magnet
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
*/
let consts = {
    configName: 'magnet_config',
    cacheListName: 'hui_list',
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
                    init: '精选, 特卖'
                },
                {
                    id: 104,
                    key: 'push-frequency',
                    label: '频率',
                    values: [5, 10, 20, 30, 60],
                    type: 'radio',
                    init: 10
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
        }
    ],

    placeholder: function (pageUrl) {

    }
};

if (typeof define !== 'undefined') {
    define(function (require) {
        return consts;
    });
}

