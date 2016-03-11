/* global chrome:false */
/* global SdHuiCore:false */
/* global SdTJ:false */
// Copyright (c) 2016 Zhu Meng-Dan(Daniel). All rights reserved.
'use strict';

var storage = new Storage();
// var tj = new SdTJ();
var sdHuiCore = new SdHuiCore();

function Magnet() {
    this.configs = [];
    this.chromeVersion = null;
    this.platform = null;
    this.itemNotifyId = 'notification.hui_info';

    // chrome.runtime.onInstalled.addListener(function () {
    //   chrome.tabs.create({url: chrome.runtime.getURL("options.html")});
    // });

    this.syncConfig();
    this.setAlarm();
}

Magnet.prototype = {
    constructor: Magnet,

    syncConfig: function () {
        var me = this;

        chrome.runtime.getPlatformInfo(function (platformInfo) {
            me.platform = platformInfo.os;
        });

        var userAgent = window.navigator.userAgent.split(' ');
        for (var i = 0; i < userAgent.length; i++) {
            if (userAgent[i].indexOf('Chrome') !== -1) {
                this.chromeVersion = userAgent[i].substr(userAgent[i].indexOf('/') + 1);
                break;
            }
        }

        var manifestObj = chrome.runtime.getManifest();
        this.magnetVersion = manifestObj.version;

        storage.set('magnet_config', {cv: this.chromeVersion, mv: this.magnetVersion});
    },

    setAlarm: function () {
        chrome.alarms.create('fetch-list-alarm', {
            periodInMinutes: 1.5
        });
    },

    hideWarning: function (id) {
        chrome.notifications.clear(id, function () {
        });
    },

    pushNotification: function (itemList) {
        var self = this;
        var message = '';
        var title = '';
        var notifyOpts = {};

        switch (itemList.length) {
            case 0:
                message = '暂时更多优惠商品和活动';
                notifyOpts = {
                    iconUrl: 'http://a4.mzstatic.com/us/r30/Purple49/v4/4d/9e/17/4d9e1766-3d9a-b609-d6fe-1d200c1b7739/icon175x175.png',
                    title: '百度惠新优惠商品更新通知',
                    type: 'basic',
                    message: message,
                    priority: 2
                };
                break;
            case 1:
                if (itemList[0].itemType === 1) {
                    title  = '#精选# ';
                    message = itemList[0].price + '元 / '
                            + itemList[0].priceHighlight + ' / '
                            + itemList[0].merchantName + ' / '
                            + itemList[0].shortReason;
                }
                else if (itemList[0].itemType === 2) {
                    title  = '#特卖 | ' + itemList[0].formattedRcmdRsn + '# ';
                    message = itemList[0].merchantName + ' / ' + itemList[0].shortReason;
                }
                notifyOpts = {
                    // iconUrl: 'http://a4.mzstatic.com/us/r30/Purple49/v4/4d/9e/17/4d9e1766-3d9a-b609-d6fe-1d200c1b7739/icon175x175.png',
                    // imageUrl: itemList[0].imageUrl,
                    // type: 'image',
                    iconUrl: itemList[0].imageUrl,
                    title: title + itemList[0].title,
                    type: 'basic',
                    message: message,
                    contextMessage: '',
                    buttons: [{title: '查看详情', iconUrl: './src/assets/images/icon29x29.png'}],
                    isClickable: true,
                    priority: 2
                };
                break;
            default:
                var formatList = [];
                for (var i = 0; i < itemList.length; i++) {
                    var item = itemList[i];
                    if (item.itemType === 1) {
                        title  = '#精选# ';
                    }
                    else if (item.itemType === 2) {
                        title  = '#特卖# ';
                    }
                    formatList.push({
                        title: title + item.title,
                        message: item.title + ' / ' + item.shortReason
                    });
                }
                var iconUrl = formatList.length > 0 ? itemList[0].imageUrl : 'http://a4.mzstatic.com/us/r30/Purple49/v4/4d/9e/17/4d9e1766-3d9a-b609-d6fe-1d200c1b7739/icon175x175.png';
                notifyOpts = {
                    iconUrl: iconUrl,
                    title: '百度惠新优惠商品更新通知',
                    type: 'list',
                    // message: chrome.i18n.getMessage('name') + ' is obsolete ' +
                    message: '更新了' + formatList.length + '个优惠商品和活动',
                    buttons: [{title: '查看详情', iconUrl: './src/assets/images/icon29x29.png'}],
                    isClickable: true,
                    priority: 2,
                    items: formatList
                };
                break;
        }

        itemList.length > 0 && chrome.notifications.create(this.itemNotifyId, notifyOpts, function () {});

        // setTimeout(function () {
        //     self.hideWarning(self.itemNotifyId);
        // }, 60000);

    }
};

function entryPoint () {
    var self = this;
    var magnet = new Magnet();

    chrome.alarms.onAlarm.addListener(function (alarm) {
        // 抓取百度惠精选商品列表定时器
        if (alarm.name === 'fetch-list-alarm') {
            sdHuiCore.getHuiList({
                success: function (data) {
                    var item = {};
                    for (var i = 0; i < data.data.result.length; i++) {
                        item = data.data.result[i];
                        data.data.result[i].progressAt = item.likeNum / (item.likeNum + item.unlikeNum) * 100;
                    }
                    var freshItemCount = sdHuiCore.persistTop20.call(sdHuiCore, data.data.result)

                    var now = new Date();
                    console.log('[Magnet] freshItemCount - ' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ': ' + freshItemCount);
                    for (var j = 0; j < freshItemCount; j++) {
                        console.log(data.data.result[j].id + ' / ' + data.data.result[j].title);
                    }

                    magnet.pushNotification(data.data.result.slice(0, freshItemCount));
                    SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'fetchListAlarm', [{count: freshItemCount}]);
                },
                failure: function (data, textStatus, jqXHR) {
                    console.log('[Magnet] Failed Fetching: '/* + JSON.stringify(data)*/);
                    SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'fetchListAlarm', [{count: -1}]);
                }
            });
        }
    });

    chrome.notifications.onClicked.addListener(function (notifyId) {
        SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'clicked', [{notifyId: notifyId}]);
        chrome.notifications.clear(notifyId, function () {});
        chrome.windows.create({url: 'http://hui.baidu.com', focused: true, incognito: false});
    });

    // 桌面通知按钮监听
    chrome.notifications.onButtonClicked.addListener(function (notifyId, btnIdx) {
        SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'clicked', [{notifyId: notifyId, btnIdx: btnIdx}]);
        switch (notifyId) {
            case magnet.itemNotifyId:
                if (btnIdx === 0) {

                }
                // http://hui.baidu.com/detail.html?id=116765
                break;
            default:

                break;
        }
    });

    // chrome.runtime.onMessage.addListener(
    //     function(request, sender, sendResponse) {

    //     }
    // );
}


entryPoint();
