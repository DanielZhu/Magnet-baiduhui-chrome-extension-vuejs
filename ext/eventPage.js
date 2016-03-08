"use strict";
// Copyright (c) 2016 Zhu Meng-Dan(Daniel). All rights reserved.

var storage = new Storage();
var sdHuiCore = new SdHuiCore();

function Magnet() {
    this.configs = [];
    this.chromeVersion = null;
    this.platform = null;

    // chrome.runtime.onInstalled.addListener(function () {
    //   chrome.tabs.create({url: chrome.runtime.getURL("options.html")});
    // });

    this.syncConfig();
    this.setAlarm();
}

Magnet.prototype = {
    constructor: Magnet,
    warningId: 'notification.hui_info',

    syncConfig: function () {
        var me = this;

        chrome.runtime.getPlatformInfo(function (platformInfo) {
            me.platform = platformInfo.os;
        });

        var userAgent = window.navigator.userAgent.split(" ");
        for (var i = 0; i < userAgent.length; i++) {
            if (userAgent[i].indexOf("Chrome") !== -1) {
                this.chromeVersion = userAgent[i].substr(userAgent[i].indexOf("/") + 1);
                break;
            }
        }

        var manifestObj = chrome.runtime.getManifest();
        this.magnetVersion = manifestObj.version;

        storage.set('magnet_config', {cv: this.chromeVersion, mv: this.magnetVersion});
    },

    setAlarm: function () {
        chrome.alarms.create('fetch-list-alarm', {
            periodInMinutes: 1
        });
    },

    hideWarning: function (id) {
        chrome.notifications.clear(id, function() {
        });
    },

    pushNotification: function (itemList) {
        var self = this;
        switch (itemList.length) {
            case 0:
                chrome.notifications.create(this.warningId, {
                    iconUrl: 'http://a4.mzstatic.com/us/r30/Purple49/v4/4d/9e/17/4d9e1766-3d9a-b609-d6fe-1d200c1b7739/icon175x175.png',
                    title: '百度惠新优惠商品更新通知',
                    type: 'basic',
                    message: '暂时更多优惠商品和活动',
                    priority: 2
                }, function() {});
                break;
            case 1:
                chrome.notifications.create(this.warningId, {
                    // iconUrl: 'http://a4.mzstatic.com/us/r30/Purple49/v4/4d/9e/17/4d9e1766-3d9a-b609-d6fe-1d200c1b7739/icon175x175.png',
                    // imageUrl: itemList[0].imageUrl,
                    // type: 'image',
                    iconUrl: itemList[0].imageUrl,
                    title: '百度惠新优惠商品更新通知',
                    type: 'basic',
                    message: itemList[0].title + ' / ' + itemList[0].shortReason,
                    buttons: [{ title: '查看详情' }],
                    isClickable: true,
                    priority: 2
                }, function() {});

                break;
            default:
                var formatList = [];
                for (var i = 0; i < itemList.length; i++) {
                    var item = itemList[i];
                    formatList.push({
                        // id: item.id,
                        title: item.title,
                        // shortReason: item.shortReason,
                        // merchantAlias: item.merchantAlias,
                        // price: item.price,
                        message: item.title + ' / ' + item.shortReason
                    });
                }
                var iconUrl = formatList.length > 0 ? formatList[0].imageUrl : null;
                chrome.notifications.create(this.warningId, {
                    iconUrl: 'http://a4.mzstatic.com/us/r30/Purple49/v4/4d/9e/17/4d9e1766-3d9a-b609-d6fe-1d200c1b7739/icon175x175.png',
                    title: '百度惠新优惠商品更新通知',
                    type: 'list',
                    // message: chrome.i18n.getMessage('name') + ' is obsolete ' +
                    message: '更新了' + formatList.length + '个优惠商品和活动',
                    buttons: [{ title: '查看详情' }],
                    isClickable: true,
                    priority: 2,
                    items: formatList
                }, function() {});
                break;
        }

        setTimeout(function () {
            self.hideWarning(self.warningId);
        }, 60000);

    }
};

function entryPoint () {
    var magnet = new Magnet();

    chrome.alarms.onAlarm.addListener(function (alarm) {
        console.log('[Magnet] Alarm');
        // 抓取百度惠精选商品列表定时器
        if (alarm.name === 'fetch-list-alarm') {
            console.log('[Magnet] Alarm: ' + JSON.stringify(alarm));

            sdHuiCore.getHuiList({
                success: function (data) {
                    var item = {};
                    for (var i = 0; i < data.data.result.length; i++) {
                        item = data.data.result[i];
                        data.data.result[i].progressAt = item.likeNum / (item.likeNum + item.unlikeNum) * 100;
                    }
                    var freshItemCount = sdHuiCore.persistTop20.call(sdHuiCore, data.data.result)

                    console.log('[Magnet] freshItemCount - ' + new Date().getTime() + ': ' + freshItemCount);

                    magnet.pushNotification(data.data.result.slice(0, freshItemCount));
                },
                failure: function (data, textStatus, jqXHR) {
                    console.log(data);
                }
            });
        }
    });
    // chrome.runtime.onMessage.addListener(
    //     function(request, sender, sendResponse) {

    //     }
    // );
}


entryPoint();
