/*global storage:false */
"use strict";

/**
 * Magnet
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
*/
var SdHuiCore = function (storage) {
    this.storage = storage;
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

    xhr.open('POST', inParams.url, true);

    //set headers
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.setRequestHeader('charset', 'UTF-8');

    // xhr.onload = function (data) {
    // };

    xhr.onreadystatechange = function (res) {
        if(res.currentTarget.readyState == 4 && res.currentTarget.status == 200) {
            inParams.callback.success && inParams.callback.success(JSON.parse(res.currentTarget.responseText));
        }
        else {
            inParams.callback.failure && inParams.callback.failure({
                responseText: res.currentTarget.responseText,
                readyState: res.currentTarget.readyState,
                status: res.currentTarget.status
            });
        }
    }

    xhr.send(inParams.body);
    return xhr;
};

/**
 * 根据key删除缓存项
 *
 * @param {string} key     [description]
 * @param {Object} options = {   //可选参数
 *    success : function(){} ,   //操作成功时的操作
 *    error : function(){}     //操作失败时的操作
 *  }
 */
sdHuiCorePrototype.getHuiList = function (opts) {
    var self = this;
    var ajax = new Ajax();
    ajax.post({
        url: "http://hui.baidu.com/facade/hui/se/list",
        body: JSON.stringify({
            page: {
                pageNo: 1,
                pageSize: 10
            },
            condition: {}
        }),
        timeout: 5000,
        callback: {
            success: function (data) {
                opts.success(data);
            },
            failure: function (data) {
                opts.failure(data);
            }
        }
    });
};

sdHuiCorePrototype.persistTop20 = function (newList) {
    var huiListPersist = this.storage.get('hui_list');
    var persistedList = (huiListPersist && JSON.parse(huiListPersist.data)) || [];
    this.storage.set('hui_list', JSON.stringify(newList.slice(0, 10)));

    // 返回更新量
    return this.calcUpdatedList(newList, persistedList);
};

sdHuiCorePrototype.calcUpdatedList = function (newList, oldList) {
    var freshList = [];

    for (var i = 0; i < newList.length; i++) {
        var newItem = newList[i];
        var duplicated = false;
        for (var j = 0; j < oldList.length; j++) {
            var oldItem = oldList[j];
            if (newItem.id === oldItem.id
                /*&& new Date(newItem.updateTime).getTime() - new Date(oldItem.updateTime).getTime() <= 0*/) {
                duplicated = true;
                console.log('%c [Dup] No.%s %s / %s', 'color: #999;font-size: 12px;', i, newList[i].id, newList[i].title);
                break;
            }
        }
        !duplicated && freshList.push(newItem);
        !duplicated && console.log('%c [Uni] No.%s %s / %s', 'color: #EA6591;font-size: 12px;', i, newList[i].id, newList[i].title);
    }

    return freshList;
};

if (typeof define !== 'undefined') {
    define(function (require) {
        return SdHuiCore;
    });
}
