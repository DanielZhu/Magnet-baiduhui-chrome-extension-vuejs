/*global storage:false */
/*global consts:false */

"use strict";

/**
 * Magnet
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
*/
var SdHuiCore = function (storage, consts) {
    this.storage = storage;
    this.consts = consts;
};
var sdHuiCorePrototype = SdHuiCore.prototype;

function Ajax() {
    this.loadXMLHttp = function () {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }

        return xmlhttp;
    };
}

Ajax.prototype.post = function (inParams) {
    var xhr = this.loadXMLHttp();
    xhr.timeout = inParams.timeout || 7000;

    xhr.open('POST', inParams.url, true);

    // set headers
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.setRequestHeader('charset', 'UTF-8');

    // xhr.onload = function (data) {
    // };

    xhr.onreadystatechange = function (res) {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                inParams.callback.success && inParams.callback.success(JSON.parse(xhr.responseText));
            } else {
                inParams.callback.failure && inParams.callback.failure({
                    responseText: res.currentTarget.responseText,
                    readyState: res.currentTarget.readyState,
                    status: res.currentTarget.status
                });
            }

            xhr.onreadystatechange = new Function();
            xhr = null;
        }
    };
    xhr.ontimeout = inParams.callback.hasOwnProperty('ontimeout') && inParams.callback.ontimeout;
    xhr.send(inParams.body);
    return xhr;
};

sdHuiCorePrototype.sendPost = function (opts) {
    var self = this;
    var ajax = new Ajax();
    ajax.post({
        url: self.consts.getApiHost() + self.consts.getApiPath(opts.apiName),
        body: JSON.stringify(opts.params),
        timeout: opts.timeout || 7000,
        callback: {
            success: function (data) {
                opts.success(data);
            },
            failure: function (data) {
                opts.failure(data);
            },
            ontimeout: function (data) {
                opts.ontimeout && opts.ontimeout(data);
            }
        }
    });
};

sdHuiCorePrototype.persistTop20 = function (newList, pageNo) {
    var huiListPersist = this.storage.get('hui_list');
    var persistedList = (huiListPersist && JSON.parse(huiListPersist.data)) || [];

    logIdAndTitle(newList, 'color: #B87EE4;font-size: 12px;');
    logIdAndTitle(persistedList, 'color: #999;font-size: 12px;');

    // 最新一页的数据才考虑缓存
    pageNo === 1 && this.storage.set('hui_list', JSON.stringify(newList.slice(0, 10)));

    // 返回更新量
    var freshList = this.calcUpdatedList(newList, persistedList);

    return {
        freshList: freshList,
        persistedList: persistedList
    };
};

sdHuiCorePrototype.calcUpdatedList = function (newList, oldList) {
    var freshList = [];

    console.log('%c old vs new: %s / %s', 'color: #B87EE4;font-size: 12px;', oldList.length, newList.length);
    for (var i = 0; i < newList.length; i++) {
        var newItem = newList[i];
        var duplicated = false;
        for (var j = 0; j < oldList.length; j++) {
            var oldItem = oldList[j];
            // For Debug
            // if (newItem.id === 118267) {
            //     break;
            // }
            if (newItem.id === oldItem.id) {
                duplicated = true;
                // console.log('%c [Dup] No.%s %s / %s', 'color: #999;font-size: 12px;', i, newList[i].id, newList[i].title);
                break;
            }
        }

        if (!duplicated) {
            freshList.push(newItem);
            console.log('%c [Uni] No.%s %s / %s', 'color: #B87EE4;font-size: 12px;', i, newList[i].id, newList[i].title);
        }
    }

    return freshList;
};

function logIdAndTitle (list, style) {
    for (var key in list) {
        if (list.hasOwnProperty(key)) {
            console.log('%c No.%s %s / %s', style, key, list[key].id, list[key].title);
        }
    }
}

if (typeof define !== 'undefined') {
    define(function (require) {
        return SdHuiCore;
    });
}
