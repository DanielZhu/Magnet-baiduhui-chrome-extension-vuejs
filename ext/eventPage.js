/* global chrome:false */
/* global SdHuiCore:false */
/* global consts:false */
/* global SdTJ:false */
// Copyright (c) 2016 Zhu Meng-Dan(Daniel). All rights reserved.
'use strict';

var storage = new Storage();
// var tj = new SdTJ();
var sdHuiCore = new SdHuiCore(storage);

function Magnet() {
    this.configs = [];
    this.chromeVersion = null;
    this.platform = null;
    this.itemNotifyId = 'notify.hui_info_';
    this.alarmNameFetchList = 'fetch-list-alarm';
    this.notifyPairsList = [];
    this.freshCount = 0;
    this.notifySizePerPage = 10;

    this.syncConfig();
    this.setAlarm();
}

function playAudio() {
    var audio = new Audio('./src/assets/sound/tip.m4a');
    audio.play();
}

Magnet.prototype = {
    constructor: Magnet,

    syncConfig: function () {
        var configCached = storage.get(consts.configName) || {};
        var initSetting = consts.settingList;

        // 初始化所有默认配置项，若发现不存在的配置项，补上
        for (var i = 0; i < initSetting.length; i++) {
            var setItem = initSetting[i];
            for (var j = 0; j < setItem.items.length; j++) {
                var item = setItem.items[j];

                if (configCached && configCached.hasOwnProperty('data')) {
                    if (!configCached.data.hasOwnProperty(item.key)) {
                        configCached.data[item.key] = item.init;
                    }
                }
                else {
                    configCached[item.key] = item.init;
                }
            }
        }

        var finalConfig = configCached.hasOwnProperty('data') ? configCached.data : configCached;
        storage.set(consts.configName, finalConfig);

        SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'syncConfig', [{}]);

        return finalConfig;
        // chrome.runtime.getPlatformInfo(function (platformInfo) {
        //     me.platform = platformInfo.os;
        // });

        // var userAgent = window.navigator.userAgent.split(' ');
        // for (var i = 0; i < userAgent.length; i++) {
        //     if (userAgent[i].indexOf('Chrome') !== -1) {
        //         this.chromeVersion = userAgent[i].substr(userAgent[i].indexOf('/') + 1);
        //         break;
        //     }
        // }

        // var manifestObj = chrome.runtime.getManifest();
        // this.magnetVersion = manifestObj.version;
        // cv: this.chromeVersion, mv: this.magnetVersion
        // storage.set('magnet_config', {set: consts.settingList});
    },

    retrieveConfigCached: function () {
        var config = {};
        var configCached = storage.get(consts.configName) || {};
        if (configCached) {
            config = configCached.data;
        }
        else {
            config = this.syncConfig();
        }

        return config;
    },

    setAlarm: function () {
        var configCached = this.retrieveConfigCached();

        configCached['push-switch'] && chrome.alarms.create(this.alarmNameFetchList, {
            periodInMinutes: configCached['push-frequency'] || 5
        });

        SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'setFetchingAlarm', [{}]);
    },

    /**
     * 清楚后台抓取最新列表定时器（推送用）
     *
     * @param  {boolean} flag  新的推送标志(true: 允许推送, false: 不允许推送)
     * @param  {fun} cb 回调
     */
    updateFetchingAlarm: function (flag, cb) {
        var self = this;
        if (flag) {
            storage.updateStorge([{key: 'push-switch', value: flag}], {
                success: function () {
                    self.setAlarm();
                    cb && cb({value: flag});
                }
            });
        }
        else {
            // Todo - 放在clear的回调函数里popup接收不到回参
            cb && cb({value: flag});
            chrome.alarms.clear(this.alarmNameFetchList, function () {
                storage.updateStorge([{key: 'push-switch', value: flag}]);
            });
        }

        SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'updateFetchingAlarm', [{flag: flag}]);
    },

    restartFetchingAlarm: function (cb) {
        var self = this;
        chrome.alarms.clear(this.alarmNameFetchList, function () {
            self.setAlarm();
        });

        SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'restartFetchingAlarm', [{}]);
    },

    hideWarning: function (id) {
        chrome.notifications.clear(id, function () {});
    },

    hideWarningWithDelay: function (id) {
        setTimeout(function () {
            chrome.notifications.clear(id, function () {});
        }, 15000);
    },

    stripHtmlTag: function (htmlString) {
        var divNode = document.createElement('div');
        divNode.innerHTML = htmlString;

        return divNode.innerText;
    },

    getNotifySingleItem: function (item) {
        var configCached = this.retrieveConfigCached();
        var message = '';
        var title = '';
        var notify = {};
        var formattedReason = this.stripHtmlTag(item.formattedRcmdRsn);
        var shortReason = this.stripHtmlTag(item.shortReason);

        if (configCached['push-type']
            && configCached['push-type'].indexOf(consts.pushType[item.itemType]) !== -1) {
            if (item.itemType === 1) {
                title  = '#精选# ';
                message = item.price + '元 / '
                        + item.priceHighlight + ' / '
                        + item.merchantName + ' / '
                        + shortReason;
            }
            else if (item.itemType === 2) {
                title  = '#特卖 | ' + formattedReason + '# ';
                message = item.merchantName + ' / ' + shortReason;
            }

            notify = {
                // iconUrl: 'http://a4.mzstatic.com/us/r30/Purple49/v4/4d/9e/17/4d9e1766-3d9a-b609-d6fe-1d200c1b7739/icon175x175.png',
                // imageUrl: item.imageUrl,
                // type: 'image',
                id: item.id,
                notify: {
                    iconUrl: item.imageUrl,
                    title: title + item.title,
                    type: 'basic',
                    message: message,
                    contextMessage: '',
                    buttons: [{title: '查看详情', iconUrl: './src/assets/images/icon29x29.png'}],
                    isClickable: true,
                    priority: 2
                }
            };
        }

        return notify;
    },

    getNotifyItem4List: function (list) {
        var configCached = this.retrieveConfigCached();

        var formatList = [];
        var title = '';
        var iconUrl = 'http://a4.mzstatic.com/us/r30/Purple49/v4/4d/9e/17/4d9e1766-3d9a-b609-d6fe-1d200c1b7739/icon175x175.png';
        var notify = {};

        for (var i = 0; i < list.length; i++) {
            var item = list[i];

            if (configCached['push-type']
                && configCached['push-type'].indexOf(consts.pushType[item.itemType]) !== -1) {
                if (item.itemType === 1) {
                    title  = '#精选# ';
                }
                else if (item.itemType === 2) {
                    title  = '#特卖# ';
                }

                formatList.push({
                    title: title + item.title,
                    message: item.title + ' / ' + this.stripHtmlTag(item.shortReason)
                });
            }
        }

        if (formatList.length > 0) {
            iconUrl = list[0].imageUrl;
            notify = {
                id: item.id,
                notify: {
                    iconUrl: iconUrl,
                    title: '百度惠新优惠商品更新通知',
                    type: 'list',
                    // message: chrome.i18n.getMessage('name') + ' is obsolete ' +
                    message: '其它' + formatList.length + '个优惠商品和活动',
                    buttons: [{title: '查看详情', iconUrl: './src/assets/images/icon29x29.png'}],
                    isClickable: true,
                    priority: 2,
                    items: formatList
                }
            };
        }
        this.notifyPairsList.push({id: -1});
        return notify;
    },

    pushNotification: function (itemList) {
        var self = this;
        var configCached = this.retrieveConfigCached();
        var notifyList = [];
        var notify = {};
        switch (itemList.length) {
            case 0:
                // notifyList.push({
                //     iconUrl: 'http://a4.mzstatic.com/us/r30/Purple49/v4/4d/9e/17/4d9e1766-3d9a-b609-d6fe-1d200c1b7739/icon175x175.png',
                //     title: '百度惠新优惠商品更新通知',
                //     type: 'basic',
                //     message: '暂时更多优惠商品和活动',
                //     priority: 2
                // });
                break;
            case 1:
                notify = this.getNotifySingleItem(itemList[0]);
                !isObjEmpty(notify) && notifyList.push(notify);
                break;
            default:
                for (var i = 0; i < itemList.length; i++) {
                    if (i < 2) {
                        notify = this.getNotifySingleItem(itemList[i]);
                        !isObjEmpty(notify) && notifyList.push(notify);
                    }
                    else {
                        notify = this.getNotifyItem4List(itemList.slice(i));
                        !isObjEmpty(notify) && notifyList.push(notify);
                        break;
                    }
                }
                break;
        }

        if (notifyList.length > 0) {
            for (var j = 0; j < notifyList.length; j++) {
                chrome.notifications.create(this.itemNotifyId + notifyList[j].id, notifyList[j].notify, function () {});
                this.hideWarningWithDelay(this.itemNotifyId + notifyList[j].id);
            }
            SdTJ.trackEventTJ(SdTJ.category.pushNotify, 'push', [{count: notifyList.length}]);
            configCached['push-audio'] && playAudio();
        }
    },

    /**
     * 更新缓存
     *
     * @param  {Array} pairs 更新的配置项
     */
    updateStorge: function (pairs, opts) {
        if (pairs.length === 0) {
            return;
        }

        // 是否存在有效的更新项目
        var updatedFlag = false;
        var configCached = storage.get(consts.configName);
        if (configCached) {
            for (var i = 0; i < pairs.length; i++) {
                var key = pairs[i].key;
                configCached.data[key] = pairs[i].value;
                updatedFlag = true;
            }
            updatedFlag && storage.set(consts.configName, configCached.data, opts);
        }
        else {
            this.syncConfig();
        }

        SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'updateStorge', [pairs]);
    },

    updateBadge: function (bargeText) {
        var bargeOption = {};
        if (bargeText === 0) {
            bargeText = '';
        }
        bargeOption.text = bargeText.toString();
        chrome.browserAction.setBadgeText(bargeOption);
        SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'updateBadge', [{bargeText: bargeText}]);
    },

    notifyClicked: function (notifyId, btnIdx) {
        var notifyIdArr = notifyId.split('_');
        var id = notifyIdArr[notifyIdArr.length - 1];
        var actionLabel = 'clickedOnList';
        if (id !== -1) {
            actionLabel = 'clickedOnCertainItem';
            if (btnIdx) {
                if (btnIdx === 0) {
                    chrome.tabs.create({url: consts.host + '/detail.html?id=' + id});
                }
                else {
                    // No this kind of button
                }
            }
            else {
                chrome.tabs.create({url: consts.host + '/detail.html?id=' + id});
            }
        }
        else {
            chrome.tabs.create({url: consts.host});
        }

        this.hideWarning(notifyId);
        SdTJ.trackEventTJ(SdTJ.category.pushNotify, actionLabel, [{notifyId: notifyId, btnIdx: btnIdx, id: id}]);
    },

    fetchingAlarmTrigger: function () {
        var self = this;
        // 抓取百度惠精选商品列表定时器
        sdHuiCore.getHuiList({
            pageNo: 1,
            pageSize: self.notifySizePerPage,
            success: function (data) {
                var item = {};
                for (var i = 0; i < data.data.result.length; i++) {
                    item = data.data.result[i];
                    data.data.result[i].progressAt = item.likeNum / (item.likeNum + item.unlikeNum) * 100;
                }

                // 比对结果，包含最新和最旧
                var persistTopResult = sdHuiCore.persistTop20.call(sdHuiCore, data.data.result, 1);
                var freshList = persistTopResult.freshList;
                var freshItemCount = freshList.length;

                // 此次对比时缓存中的数据
                var cachedList = persistTopResult.persistedList;

                var now = new Date();
                console.log('%c[Magnet] freshItemCount - ' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ': ' + freshItemCount, 'color: #E69B95; font-weight: bold;');

                // v1.0.1 - 使用筛选后的增量更新列表，而不再继续截取靠前部分
                self.freshCount += freshItemCount;
                self.updateBadge(self.freshCount);

                if (freshItemCount < self.notifySizePerPage && cachedList.length !== 0 ) {
                    self.pushNotification(freshList);
                }

                SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'fetchListAlarm', [{count: freshItemCount}]);
            },
            failure: function (data, textStatus, jqXHR) {
                console.log('[Magnet] Failed Fetching: '/* + JSON.stringify(data)*/);
                SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'fetchListAlarm', [{count: -1}]);
            }
        });
    }
};

function entryPoint () {
    var magnet = new Magnet();

    chrome.runtime.onInstalled.addListener(function () {
        magnet.syncConfig();
        magnet.fetchingAlarmTrigger();
        console.log('installed');
    });

    chrome.alarms.onAlarm.addListener(function (alarm) {
        if (alarm.name === 'fetch-list-alarm') {
            magnet.fetchingAlarmTrigger();
        }
    });

    chrome.notifications.onClicked.addListener(function (notifyId) {
        magnet.notifyClicked(notifyId);
    });

    // 桌面通知按钮监听
    chrome.notifications.onButtonClicked.addListener(function (notifyId, btnIdx) {
        magnet.notifyClicked(notifyId, btnIdx);
    });

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            switch (request.type) {
                case 'pushItem':
                    magnet.pushNotification(request.list);
                    break;
                case 'updateStorage':
                    // Todo - Consider move storage related into eventpage
                    magnet.updateStorge([request.set]);
                    break;
                case 'getMagnetConfig':
                    // Todo - it'll cost too much time and waste
                    sendResponse(magnet.retrieveConfigCached());
                    break;
                case 'clearBadge':
                    magnet.freshCount = 0;
                    magnet.updateBadge(0);
                    break;
                case 'updateFetchingAlarm':
                    magnet.updateFetchingAlarm(request.pushFlag, function (res) {
                        sendResponse(res);
                    });
                    break;
                case 'restartFetchingAlarm':
                    magnet.restartFetchingAlarm();
                    break;
                default:
                    break;
            }
        }
    );
}


entryPoint();
