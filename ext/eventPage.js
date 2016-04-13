/* global chrome:false */
/* global SdHuiCore:false */
/* global consts:false */
/* global SdTJ:false */
/* global isObjEmpty:false */
// Copyright (c) 2016 Zhu Meng-Dan(Daniel). All rights reserved.
'use strict';

var storage = new Storage();
// var tj = new SdTJ();
var sdHuiCore = new SdHuiCore(storage, consts);

function Magnet() {
    this.configs = [];
    this.chromeVersion = null;
    this.platform = null;
    this.itemNotifyId = 'notify.hui_info_';
    this.alarmNameFetchList = 'fetch-list-alarm';
    this.alarmNameDND = 'dnd-alarm';
    this.notifyPairsList = [];
    this.freshCount = 0;
    this.notifySizePerPage = 10;
    this.unreadCount = 0;
    this.cxtMenu = [
        {key: 'open_pc_site', label: '打开PC站'},
        {key: 'user_tipoff', label: '我要爆料'},
        {key: 'check_latest', label: '检查优惠'},
        {key: 'do_not_disturb', label: '勿扰', children: [
            {key: 'do_not_disturb_0', label: '关闭'},
            {key: 'do_not_disturb_30', label: '30分钟'},
            {key: 'do_not_disturb_60', label: '1小时'},
            {key: 'do_not_disturb_120', label: '2小时'},
            {key: 'do_not_disturb_240', label: '4小时'},
            {key: 'do_not_disturb_today', label: '今天'}
        ]}
    ];

    this.syncConfig();
    this.setAlarm();
}

function playAudio() {
    var audio = new Audio('./src/assets/sound/tip.m4a');
    audio.play();
}

Magnet.prototype = {
    constructor: Magnet,

    setUpContextMenus: function () {
        this.cxtMenu.forEach(function (command) {
            chrome.contextMenus.create({
                title: command.label,
                id: command.key,
                contexts: ['browser_action'],
                type: 'normal'
            });
            if (command.hasOwnProperty('children')) {
                command.children.forEach(function (childCommand) {
                    chrome.contextMenus.create({
                        parentId: command.key,
                        title: childCommand.label,
                        id: childCommand.key,
                        contexts: ['browser_action'],
                        type: 'normal'
                    });
                });
            }
        });
    },

    resetToDefault: function (cb) {
        var initSetting = consts.settingList;
        var defaultSetting = {};

        for (var i = 0; i < initSetting.length; i++) {
            var setItem = initSetting[i];
            for (var j = 0; j < setItem.items.length; j++) {
                var item = setItem.items[j];
                defaultSetting[item.key] = item.init;
            }
        }

        storage.set(consts.configName, defaultSetting);

        SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'resetToDefault');

        this.restartFetchingAlarm();

        cb && cb({value: defaultSetting});
    },

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

        SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'syncConfig', '');

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
        var period = configCached['push-frequency'] || 5;

        configCached['push-switch'] && chrome.alarms.create(this.alarmNameFetchList, {
            periodInMinutes: period
        });

        SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'setFetchingAlarm', 'periodInMinutes', period);
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
            storage.updateStorage([{key: 'push-switch', value: flag}], {
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
                storage.updateStorage([{key: 'push-switch', value: flag}]);
            });
        }

        SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'updateFetchingAlarm', 'flag', flag ? 1 : 0);
    },

    restartFetchingAlarm: function (cb) {
        var self = this;
        chrome.alarms.clear(this.alarmNameFetchList, function () {
            self.setAlarm();
        });

        SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'restartFetchingAlarm');
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
        var notifyId = -1;

        if (configCached['push-type']
            && configCached['push-type'].indexOf(consts.pushType[item.itemType]) !== -1) {
            if (item.itemType === 1) {
                title  = '【' + item.price + '元】';
                if (item.priceHighlight.trim().length !== 0) {
                    message = item.priceHighlight + '，';
                }
                message += shortReason;
                notifyId = 'detail_' + item.id;
            }
            else if (item.itemType === 2) {
                message = formattedReason;
                notifyId = 'detail_' + item.id;
            }
            else if (item.itemType === 3 || item.itemType === 4) {
                message = shortReason;
                notifyId = 'article_' + item.url;
            }

            notify = {
                id: notifyId,
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
        var notifyId = -1;

        for (var i = 0; i < list.length; i++) {
            var item = list[i];

            // type: 1: 精选, 2: 特卖, 3: 晒单, 4: 经验
            if (configCached['push-type']
                && configCached['push-type'].indexOf(consts.pushType[item.itemType]) !== -1) {
                if (item.itemType === 1 || item.itemType === 2) {
                    notifyId = 'detail_' + item.id;
                }
                else if (item.itemType === 3 || item.itemType === 4) {
                    notifyId = 'article_' + item.url;
                }

                formatList.push({
                    title: item.title,
                    message: item.title + ' / ' + this.stripHtmlTag(item.shortReason)
                });
            }
        }

        if (formatList.length > 0) {
            iconUrl = list[0].imageUrl;
            notify = {
                id: notifyId,
                notify: {
                    iconUrl: iconUrl,
                    title: '其它' + formatList.length + '个优惠商品和活动',
                    type: 'list',
                    // message: chrome.i18n.getMessage('name') + ' is obsolete ' +
                    message: '百度惠新优惠商品更新通知',
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
            var audioPlayDone = false;
            var listNotifyItem = false;
            for (var j = 0; j < notifyList.length; j++) {
                if (notifyList[j].notify.type === 'list') {
                    listNotifyItem = notifyList[j];
                }
                else {
                    chrome.notifications.create(
                        this.itemNotifyId + notifyList[j].id,
                        notifyList[j].notify,
                        function () {
                            if (!audioPlayDone && configCached['push-audio']) {
                                playAudio();
                                audioPlayDone = true;
                            }
                        }
                    );
                    this.hideWarningWithDelay(this.itemNotifyId + notifyList[j].id);
                }
            }
            // 聚合推送延时到末尾发送
            if (listNotifyItem) {
                setTimeout(function () {
                    chrome.notifications.create(
                        self.itemNotifyId + listNotifyItem.id,
                        listNotifyItem.notify,
                        function () {
                            if (!audioPlayDone && configCached['push-audio']) {
                                playAudio();
                                audioPlayDone = true;
                            }
                        }
                    );
                    self.hideWarningWithDelay(self.itemNotifyId + listNotifyItem.id);
                }, 500);
            }

            SdTJ.trackEventTJ(SdTJ.category.pushNotify, 'push', 'count', notifyList.length);
        }
    },

    /**
     * 更新缓存
     *
     * @param  {Array} pairs 更新的配置项
     */
    updateStorage: function (pairs, opts) {
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
                var optValue = (typeof pairs[i].value === 'boolean' ? (pairs[i].value ? 1 : 0) : pairs[i].value);
                SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'updateStorage', key, optValue);
            }
            updatedFlag && storage.set(consts.configName, configCached.data, opts);
        }
        else {
            this.syncConfig();
        }
    },

    updateBadge: function (bargeText, bgColor) {
        // 先勿扰断言
        var configCached = this.retrieveConfigCached();
        var dndExpiredAt = configCached['dnd-expired-at'];
        var now = new Date();
        var bargeOption = {};

        if (typeof bargeText === 'number' && bargeText >= 0) {
            this.unreadCount = bargeText;
        }

        if (dndExpiredAt && now <= dndExpiredAt) {
            bargeText = 'DND';
            bgColor = '#000';
        }
        else {
            if (bargeText === 0) {
                bargeText = '';
            }
            if (!bgColor) {
                bgColor = '#d00';
            }
            SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'updateBadge', 'bargeText', parseInt(bargeText, 10));
        }
        bargeOption.text = bargeText.toString();

        chrome.browserAction.setBadgeText(bargeOption);
        chrome.browserAction.setBadgeBackgroundColor({color: bgColor});
    },

    updateBadgeByNotifyClicked: function () {
        var self = this;
        chrome.browserAction.getBadgeText({}, function (obj) {
            if (obj === 'DND') {
                self.unreadCount -= 1;
            }
            else {
                self.unreadCount = parseInt(obj, 10) - 1;
            }
            self.updateBadge(self.unreadCount > 0 ? self.unreadCount : 0);
        });
    },

    notifyClicked: function (notifyId, btnIdx) {
        var notifyIdArr = notifyId.split('_');
        var id = notifyIdArr[notifyIdArr.length - 1];
        var channel = notifyIdArr[notifyIdArr.length - 2];
        var actionLabel = 'clickedOnList';

        if (id !== -1) {
            actionLabel = 'clickedOnCertainItem';
            if (btnIdx) {
                if (btnIdx === 0) {
                    this.updateBadgeByNotifyClicked.call(this);
                    this.openTabForUrl(consts.host + channel + '.html?id=' + id + '&' + consts.tjDetailRedirect);
                }
                else {
                    // No this kind of button
                }
            }
            else {
                this.updateBadgeByNotifyClicked.call(this);
                chrome.tabs.create({url: consts.host + channel + '.html?id=' + id + '&' + consts.tjDetailRedirect}, function (tab) {
                    chrome.windows.update(tab.windowId, {focused: true}, function () {});
                });
            }
        }
        else {
            this.updateBadge(0);
            chrome.tabs.create({url: consts.host + '?' + consts.tjDetailRedirect});
        }

        this.hideWarning(notifyId);
        SdTJ.trackEventTJ(SdTJ.category.pushNotify, actionLabel, 'notifyId', +id);
    },

    fetchingAlarmTrigger: function (oldBadge) {
        var self = this;
        // 抓取百度惠精选商品列表定时器
        this.updateBadge('...');
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
                // v1.0.8 - Fix: sometime the Badge Text will be update to empty
                if (oldBadge) {
                    self.unreadCount = oldBadge + freshItemCount;
                    self.updateBadge(self.unreadCount > 0 ? self.unreadCount : 0);
                }
                else {
                    chrome.browserAction.getBadgeText({}, function (obj) {
                        if (obj === 'DND') {
                            self.unreadCount += freshItemCount;
                        }
                        else {
                            self.unreadCount = (parseInt(obj, 10) || 0) + freshItemCount;
                        }

                        self.updateBadge(self.unreadCount > 0 ? self.unreadCount : 0);
                    });
                }

                if (freshItemCount < self.notifySizePerPage && cachedList.length !== 0) {
                    var configCached = self.retrieveConfigCached();
                    var dndExpiredAt = configCached['dnd-expired-at'];
                    if (!dndExpiredAt || (dndExpiredAt && now > dndExpiredAt)) {
                        self.updateStorage([{key: 'dnd-expired-at', value: false}]);
                        self.pushNotification(freshList);
                    }
                }

                SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'fetchListAlarm', 'count', freshItemCount);
            },
            failure: function (data, textStatus, jqXHR) {
                if (oldBadge) {
                    self.updateBadge(oldBadge > 0 ? oldBadge : 0);
                }
                else {
                    self.updateBadge(0);
                }
                console.log('[Magnet] Failed Fetching: ' + JSON.stringify(data));
                SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'fetchListAlarm', 'count', -1);
            }
        });
    },

    openTabForUrl: function (url) {
        chrome.tabs.create({url: url}, function (tab) {
            chrome.windows.update(tab.windowId, {focused: true}, function () {});
        });
    },

    draw: function () {
        var canvas = document.createElement('canvas'); // Create the canvas
        canvas.width = 19;
        canvas.height = 19;

        var ctx = canvas.getContext('2d');

        var huiIcon = new Image();
        huiIcon.src = './src/assets/images/icon19x19.png';
        // huiIcon.style.position = 'relative';
        // huiIcon.style.width = '100%';
        // huiIcon.style.height = '100%';

        huiIcon.onload = function () {
            ctx.drawImage(huiIcon, 0, 0);
            chrome.browserAction.setIcon({
                imageData: ctx.getImageData(0, 0, 19, 19)
            });
        };

    }
};

function entryPoint () {
    var magnet = new Magnet();

    chrome.runtime.onInstalled.addListener(function () {
        magnet.syncConfig();
        magnet.setUpContextMenus();
        magnet.fetchingAlarmTrigger();
        // magnet.draw();
    });

    chrome.alarms.onAlarm.addListener(function (alarm) {
        switch (alarm.name) {
            // 拉取定时器
            case magnet.alarmNameFetchList:
                chrome.browserAction.getBadgeText({}, function (obj) {
                    if (obj !== 'DND') {
                        magnet.unreadCount = parseInt(obj, 10) || 0;
                    }
                    magnet.fetchingAlarmTrigger(magnet.unreadCount);
                });
                break;
            // DND定时器
            case magnet.alarmNameDND:
                magnet.updateStorage([{key: 'dnd-expired-at', value: false}]);
                magnet.updateBadge(magnet.unreadCount);
                break;
            default:
                break;
        }
    });

    chrome.contextMenus.onClicked.addListener(function (info, tab) {
        switch (info.menuItemId) {
            case 'open_pc_site':
                magnet.openTabForUrl(consts.host);
                break;
            case 'user_tipoff':
                magnet.openTabForUrl(consts.host + 'tipoff.html');
                break;
            case 'check_latest':
                chrome.browserAction.getBadgeText({}, function (obj) {
                    if (obj !== 'DND') {
                        magnet.unreadCount = parseInt(obj, 10) || 0;
                    }
                    magnet.fetchingAlarmTrigger(magnet.unreadCount);
                });
                break;
            case 'do_not_disturb':
                // Leave this to the ParentMenuItemId Switch Handler
                break;
            default:
                break;
        }

        if (info.hasOwnProperty('parentMenuItemId')) {
            var menuItemArr = info.menuItemId.split('_');
            var dndTimeMinutes = menuItemArr[menuItemArr.length - 1];
            var now = new Date();
            var nowTime = now.getTime();
            var dndExpireTime = null;
            if (dndTimeMinutes === 'today') {
                now.setDate(now.getDate() + 1);
                now.setHours(0).setMinutes(0).setSeconds(0);
                dndExpireTime = now.getTime();
                dndTimeMinutes = (now.getTime() - nowTime) / 1000 / 60;
            }
            else if (dndTimeMinutes === '0') {
                dndExpireTime = false;
            }
            else {
                dndExpireTime = nowTime + dndTimeMinutes * 60 * 1000;
            }

            switch (info.parentMenuItemId) {
                case 'do_not_disturb':
                    magnet.updateStorage([{key: 'dnd-expired-at', value: dndExpireTime}]);
                    if (dndExpireTime) {
                        magnet.updateBadge('DND', '#000');
                        chrome.alarms.clear(magnet.alarmNameDND, function () {
                            chrome.alarms.create(magnet.alarmNameDND, {
                                delayInMinutes: +dndTimeMinutes
                            });
                        });
                    }
                    else {
                        magnet.updateBadge(magnet.unreadCount);
                        chrome.alarms.clear(magnet.alarmNameDND, function () {});
                    }
                    break;
            }
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
                    magnet.updateStorage([request.set]);
                    break;
                case 'getMagnetConfig':
                    // Todo - it'll cost too much time and waste
                    sendResponse(magnet.retrieveConfigCached());
                    break;
                case 'clearBadge':
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
                case 'resetToDefault':
                    magnet.resetToDefault(function (res) {
                        sendResponse(res);
                    });
                    break;
                default:
                    break;
            }
        }
    );
}


entryPoint();
