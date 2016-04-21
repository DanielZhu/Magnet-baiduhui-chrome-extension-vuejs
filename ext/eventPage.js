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

// var chromeVersion = null;
var itemNotifyId = 'notify.hui_info_';
var alarmNameFetchList = 'fetch-list-alarm';
var alarmNameDND = 'dnd-alarm';
var alarmNameCheckingUserFirst = 'checking-user-alarm-1';
var alarmNameCheckingUserSecond = 'checking-user-alarm-2';
var notifyPairsList = [];
var notifySizePerPage = 10;
var unreadCount = 0;
var userStatus = 99;
var USER_STATUS = {
    VALID: 1,
    INVALID: -1,
    TIMEOUT: 0
};

var cxtMenu = [
    {key: 'check_latest', label: '更新优惠'},
    {key: 'user_tipoff', label: '我要爆料'},
    {key: 'open_pc_site', label: '打开PC站'},
    {key: 'do_not_disturb', label: '勿扰', children: [
        {key: 'do_not_disturb_0', label: '关闭'},
        {key: 'do_not_disturb_separator'},
        {key: 'do_not_disturb_30', label: '30分钟'},
        {key: 'do_not_disturb_60', label: '1小时'},
        {key: 'do_not_disturb_120', label: '2小时'},
        {key: 'do_not_disturb_240', label: '4小时'},
        {key: 'do_not_disturb_today', label: '今天'}
    ]}
];

function playAudio() {
    var audio = new Audio('./src/assets/sound/tip.m4a');
    audio.play();
}

function setUpContextMenus() {
    cxtMenu.forEach(function (command) {
        chrome.contextMenus.create({
            title: command.label,
            id: command.key,
            contexts: ['browser_action'],
            type: 'normal'
        });
        if (command.hasOwnProperty('children')) {
            command.children.forEach(function (childCommand) {
                if (childCommand.key.indexOf('separator') !== -1) {
                    chrome.contextMenus.create({
                        parentId: command.key,
                        id: childCommand.key,
                        contexts: ['browser_action'],
                        type: 'separator'
                    });
                }
                else {
                    chrome.contextMenus.create({
                        parentId: command.key,
                        title: childCommand.label,
                        id: childCommand.key,
                        contexts: ['browser_action'],
                        type: 'normal'
                    });
                }
            });
        }
    });
}

function resetToDefault(cb) {
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

    restartFetchingAlarm();

    cb && cb({value: defaultSetting});
}

function syncConfig() {
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

    // var userAgent = window.navigator.userAgent.split(' ');
    // for (var i = 0; i < userAgent.length; i++) {
    //     if (userAgent[i].indexOf('Chrome') !== -1) {
    //         chromeVersion = userAgent[i].substr(userAgent[i].indexOf('/') + 1);
    //         break;
    //     }
    // }

    // var manifestObj = chrome.runtime.getManifest();
    // magnetVersion = manifestObj.version;
    // cv: chromeVersion, mv: magnetVersion
    // storage.set('magnet_config', {set: consts.settingList});
}

function retrieveConfigCached() {
    var config = {};
    var configCached = storage.get(consts.configName) || {};
    if (configCached) {
        config = configCached.data;
    }
    else {
        config = syncConfig();
    }

    return config;
}

function setFetchAlarm() {
    var configCached = retrieveConfigCached();
    var period = configCached['push-frequency'] || 5;

    configCached['push-switch'] && chrome.alarms.create(alarmNameFetchList, {
        periodInMinutes: period
    });

    SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'setFetchingAlarm', 'periodInMinutes', period);
}

function setCheckUserAlarm() {
    // Because the period will be less than 1 minute, so use setInterval instead
    chrome.alarms.create(alarmNameCheckingUserFirst, {
        periodInMinutes: 1
    });

    chrome.alarms.create(alarmNameCheckingUserSecond, {
        periodInMinutes: 1.5
    });

    // SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'checkingUserTimer', 'isAuthed', 1);
}

function fetchUserInfo() {
    sdHuiCore.sendPost({
        apiName: 'myInfo',
        params: {deviceType: 1},
        success: function (data) {
            console.log(JSON.stringify(data));
            userStatusChanged((data.status === 0 && data.msg !== '未登录用户!') ? USER_STATUS.VALID : USER_STATUS.INVALID);
            // SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'fetchListAlarm', 'count', freshItemCount);
        },
        failure: function (data, textStatus, jqXHR) {
            console.log(JSON.stringify(data));
            userStatusChanged(USER_STATUS.INVALID);
            // SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'fetchListAlarm', 'count', -1);
        },
        ontimeout: function (data) {
            console.log(JSON.stringify(data));
            userStatusChanged(USER_STATUS.TIMEOUT);
        }
    });
}

function userStatusChanged(status) {
    if (userStatus !== status) {
        userStatus = status;
        var iconPath = '';
        switch (userStatus) {
            case USER_STATUS.VALID:
                iconPath = consts.extIcons.active;
                break;
            case USER_STATUS.INVALID:
            case USER_STATUS.TIMEOUT:
                iconPath = consts.extIcons.inactive;
                break;
            default:
                iconPath = consts.extIcons.inactive;
                break;
        }
        chrome.browserAction.setIcon({path: iconPath}, function () {});
    }
}

/**
 * 清除后台抓取最新列表定时器（推送用）
 *
 * @param  {boolean} flag  新的推送标志(true: 允许推送, false: 不允许推送)
 * @param  {fun} cb 回调
 */
function updateFetchingAlarm(flag, cb) {
    if (flag) {
        storage.updateStorage([{key: 'push-switch', value: flag}], {
            success: function () {
                setFetchAlarm();
                cb && cb({value: flag});
            }
        });
    }
    else {
        // Todo - 放在clear的回调函数里popup接收不到回参
        cb && cb({value: flag});
        chrome.alarms.clear(alarmNameFetchList, function () {
            storage.updateStorage([{key: 'push-switch', value: flag}]);
        });
    }

    SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'updateFetchingAlarm', 'flag', flag ? 1 : 0);
}

function restartFetchingAlarm(cb) {
    chrome.alarms.clear(alarmNameFetchList, function () {
        setFetchAlarm();
    });

    SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'restartFetchingAlarm');
}

function hideWarning(id) {
    chrome.notifications.clear(id, function () {});
}

function hideWarningWithDelay(id) {
    setTimeout(function () {
        chrome.notifications.clear(id, function () {});
    }, 15000);
}

function stripHtmlTag(htmlString) {
    var divNode = document.createElement('div');
    divNode.innerHTML = htmlString;

    return divNode.innerText;
}

function getNotifySingleItem(item) {
    var configCached = retrieveConfigCached();
    var message = '';
    var title = '';
    var notify = {};
    var formattedReason = stripHtmlTag(item.formattedRcmdRsn);
    var shortReason = stripHtmlTag(item.shortReason);
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
                buttons: [{title: '查看详情', iconUrl: './src/assets/images/icon-29x29.png'}],
                isClickable: true,
                priority: 2
            }
        };
    }

    return notify;
}

function getNotifyItem4List(list) {
    var configCached = retrieveConfigCached();

    var formatList = [];
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
                message: item.title + ' / ' + stripHtmlTag(item.shortReason)
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
                buttons: [{title: '查看详情', iconUrl: './src/assets/images/icon-29x29.png'}],
                isClickable: true,
                priority: 2,
                items: formatList
            }
        };
    }
    notifyPairsList.push({id: -1});
    return notify;
}

function pushNotification(itemList) {
    var configCached = retrieveConfigCached();
    var notifyList = [];
    var notify = {};
    switch (itemList.length) {
        case 1:
            notify = getNotifySingleItem(itemList[0]);
            !isObjEmpty(notify) && notifyList.push(notify);
            break;
        default:
            for (var i = 0; i < itemList.length; i++) {
                if (i < 2) {
                    notify = getNotifySingleItem(itemList[i]);
                    !isObjEmpty(notify) && notifyList.push(notify);
                }
                else {
                    notify = getNotifyItem4List(itemList.slice(i));
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
                    itemNotifyId + notifyList[j].id,
                    notifyList[j].notify,
                    function () {
                        if (!audioPlayDone && configCached['push-audio']) {
                            playAudio();
                            audioPlayDone = true;
                        }
                    }
                );
                hideWarningWithDelay(itemNotifyId + notifyList[j].id);
            }
        }
        // 聚合推送延时到末尾发送
        if (listNotifyItem) {
            setTimeout(function () {
                chrome.notifications.create(
                    itemNotifyId + listNotifyItem.id,
                    listNotifyItem.notify,
                    function () {
                        if (!audioPlayDone && configCached['push-audio']) {
                            playAudio();
                            audioPlayDone = true;
                        }
                    }
                );
                hideWarningWithDelay(itemNotifyId + listNotifyItem.id);
            }, 500);
        }

        SdTJ.trackEventTJ(SdTJ.category.pushNotify, 'push', 'count', notifyList.length);
    }
}

function updateStorage(pairs, opts) {
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
        syncConfig();
    }
}

function updateBadge(bargeText, bgColor) {
    // 先勿扰断言
    var configCached = retrieveConfigCached();
    var dndExpiredAt = configCached['dnd-expired-at'];
    var now = new Date();
    var bargeOption = {};

    if (typeof bargeText === 'number' && bargeText >= 0) {
        unreadCount = bargeText;
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
}

function updateBadgeByNotifyClicked() {
    chrome.browserAction.getBadgeText({}, function (obj) {
        if (obj === 'DND') {
            unreadCount -= 1;
        }
        else {
            unreadCount = parseInt(obj, 10) - 1;
        }
        updateBadge(unreadCount > 0 ? unreadCount : 0);
    });
}

function notifyClicked(notifyId, btnIdx) {
    var notifyIdArr = notifyId.split('_');
    var id = notifyIdArr[notifyIdArr.length - 1];
    var channel = notifyIdArr[notifyIdArr.length - 2];
    var actionLabel = 'clickedOnList';

    if (id !== -1) {
        actionLabel = 'clickedOnCertainItem';
        if (btnIdx) {
            if (btnIdx === 0) {
                updateBadgeByNotifyClicked.call(this);
                openTabForUrl(consts.host + channel + '.html?id=' + id + '&' + consts.tjDetailRedirect);
            }
            else {
                // No this kind of button
            }
        }
        else {
            updateBadgeByNotifyClicked.call(this);
            var outerLink = consts.host + channel + '.html?id=' + id + '&' + consts.tjDetailRedirect;
            chrome.tabs.create({url: outerLink}, function (tab) {
                chrome.windows.update(tab.windowId, {focused: true}, function () {});
            });
        }
    }
    else {
        updateBadge(0);
        chrome.tabs.create({url: consts.host + '?' + consts.tjDetailRedirect});
    }

    hideWarning(notifyId);
    SdTJ.trackEventTJ(SdTJ.category.pushNotify, actionLabel, 'notifyId', +id);
}

function fetchingAlarmTrigger(oldBadge) {
    // 抓取百度惠精选商品列表定时器
    updateBadge('...');
    sdHuiCore.sendPost({
        apiName: 'recmdList',
        params: {
            page: {
                pageNo: 1,
                pageSize: notifySizePerPage || 10
            },
            condition: {}
        },
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
                unreadCount = oldBadge + freshItemCount;
                updateBadge(unreadCount > 0 ? unreadCount : 0);
            }
            else {
                chrome.browserAction.getBadgeText({}, function (obj) {
                    if (obj === 'DND') {
                        unreadCount += freshItemCount;
                    }
                    else {
                        unreadCount = (parseInt(obj, 10) || 0) + freshItemCount;
                    }

                    updateBadge(unreadCount > 0 ? unreadCount : 0);
                });
            }

            var configCached = retrieveConfigCached();
            var dndExpiredAt = configCached['dnd-expired-at'];
            if (!dndExpiredAt || (dndExpiredAt && now > dndExpiredAt)) {
                if (freshItemCount < notifySizePerPage && cachedList.length !== 0) {
                    updateStorage([{key: 'dnd-expired-at', value: false}]);
                    pushNotification(freshList);
                }
                if (freshItemCount > 0) {
                    var badgeIconAnimate = new BadgeIconAnimate(consts.extIcons.active);
                    var animBaBadgeNew = configCached['anim-ba-badge-new'];
                    switch (animBaBadgeNew) {
                        case '随机':
                            badgeIconAnimate.randomAnim();
                            break;
                        case '快旋':
                            badgeIconAnimate.startShake();
                            break;
                        case '飞入':
                            badgeIconAnimate.randomFlayIn();
                            break;
                        default:
                            badgeIconAnimate.randomAnim();
                            break;
                    }
                }
            }

            SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'fetchListAlarm', 'count', freshItemCount);
        },
        failure: function (data, textStatus, jqXHR) {
            if (oldBadge) {
                updateBadge(oldBadge > 0 ? oldBadge : 0);
            }
            else {
                updateBadge(0);
            }
            console.log('[Magnet] Failed Fetching: ' + JSON.stringify(data));
            SdTJ.trackEventTJ(SdTJ.category.bgNotify, 'fetchListAlarm', 'count', -1);
        }
    });
}

function openTabForUrl(url) {
    chrome.tabs.create({url: url}, function (tab) {
        chrome.windows.update(tab.windowId, {focused: true}, function () {});
    });
}

// function getCookie() {
//     chrome.cookies.getAll({}, function(cookies) {
//         for (var i in cookies) {
//             console.log(JSON.stringify(cookies[i]));
//         }
//     });
//     // chrome.cookies.get({
//     //     url: '.baidu.com',
//     //     name: 'BDUSS'
//     // }, function (cookie) {
//     // });
// }

// chrome.cookies.onChanged.addListener(function(info) {
//     console.log("onChanged" + JSON.stringify(info));
// });

// 注册各种事件
chrome.runtime.onInstalled.addListener(function () {
    syncConfig();
    setUpContextMenus();
    fetchingAlarmTrigger();
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    switch (alarm.name) {
        // 拉取定时器
        case alarmNameFetchList:
            // getCookie();
            chrome.browserAction.getBadgeText({}, function (obj) {
                if (obj !== 'DND') {
                    unreadCount = parseInt(obj, 10) || 0;
                }
                fetchingAlarmTrigger(unreadCount);
            });
            break;
        // DND定时器
        case alarmNameDND:
            updateStorage([{key: 'dnd-expired-at', value: false}]);
            updateBadge(unreadCount);
            break;
        case alarmNameCheckingUserFirst:
        case alarmNameCheckingUserSecond:
            fetchUserInfo();
            break;
        default:
            break;
    }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        case 'open_pc_site':
            openTabForUrl(consts.host);
            break;
        case 'user_tipoff':
            openTabForUrl(consts.host + 'tipoff.html');
            break;
        case 'check_latest':
            chrome.browserAction.getBadgeText({}, function (obj) {
                if (obj !== 'DND') {
                    unreadCount = parseInt(obj, 10) || 0;
                }
                fetchingAlarmTrigger(unreadCount);
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
        else if (dndTimeMinutes === 'separator') {

        }
        else {
            dndExpireTime = nowTime + dndTimeMinutes * 60 * 1000;
        }

        switch (info.parentMenuItemId) {
            case 'do_not_disturb':
                updateStorage([{key: 'dnd-expired-at', value: dndExpireTime}]);
                if (dndExpireTime) {
                    updateBadge('DND', '#000');
                    chrome.alarms.clear(alarmNameDND, function () {
                        chrome.alarms.create(alarmNameDND, {
                            delayInMinutes: +dndTimeMinutes
                        });
                    });
                }
                else {
                    updateBadge(unreadCount);
                    chrome.alarms.clear(alarmNameDND, function () {});
                }
                break;
        }
    }
});

chrome.notifications.onClicked.addListener(function (notifyId) {
    notifyClicked(notifyId);
});

// 桌面通知按钮监听
chrome.notifications.onButtonClicked.addListener(function (notifyId, btnIdx) {
    notifyClicked(notifyId, btnIdx);
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {
            case 'pushItem':
                pushNotification(request.list);
                break;
            case 'updateStorage':
                // Todo - Consider move storage related into eventpage
                updateStorage([request.set]);
                break;
            case 'getselfConfig':
                // Todo - it'll cost too much time and waste
                sendResponse(retrieveConfigCached());
                break;
            case 'clearBadge':
                updateBadge(0);
                break;
            case 'updateFetchingAlarm':
                updateFetchingAlarm(request.pushFlag, function (res) {
                    sendResponse(res);
                });
                break;
            case 'restartFetchingAlarm':
                restartFetchingAlarm();
                break;
            case 'resetToDefault':
                resetToDefault(function (res) {
                    sendResponse(res);
                });
                break;
            default:
                break;
        }
    }
);

syncConfig();
setFetchAlarm();
setCheckUserAlarm();

// Show the instant user status as soon as the extension was installed
fetchUserInfo()
