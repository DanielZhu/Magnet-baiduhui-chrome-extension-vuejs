/*global storage:false */
"use strict";

/**
 * Magnet 数据本地持久化模块
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
*/
var localStorage = window.localStorage;
var splitStrStart = '<#sdvalid#>';
var splitStrEnd = '</#sdvalid#>';
var splitReg = new RegExp('^(\<#sdvalid#\>)(.*)(\<\/#sdvalid#\>)$');

/**
 * 数据库模块
 */
var Storage = function () {};
var storagePrototype = Storage.prototype;

/**
 * 根据key删除缓存项
 *
 * @param {string} key     [description]
 * @param {Object} options = {   //可选参数
 *    success : function(){} ,   //操作成功时的操作
 *    error : function(){}     //操作失败时的操作
 *  }
 */
storagePrototype.del = function (key, options) {
    if (!localStorage) {
        return;
    }
    options = options || {};
    try {
        localStorage.removeItem(key);
        options.success && options.success();
    }
    catch (e) {
        options.error && options.error();
    }
};

/**
 * 添加缓存项
 *
 * @param {string} key     缓存项主键
 * @param {string} value   缓存值
 * @param {Object} options = {         //可选参数
 *    success : function(){} ,   //操作成功时的操作
 *    error : function(){} ,    //操作失败时的操作
 *    expireTime: number    // 有效时间，单位：ms
 *  }
 */
storagePrototype.set = function (key, value, options) {
    if (!localStorage) {
        return;
    }

    options = options || {};
    try {
        if (options.hasOwnProperty('expireTime')) {
            value = {value: JSON.stringify(value), expireAt: (new Date()).getTime() + options.expireTime};
        }
        // 保证存储完整性
        localStorage.setItem(key, splitStrStart + JSON.stringify(value) + splitStrEnd);
        options.success && options.success();
    }
    catch (e) {
        options.error && options.error();
    }
};

/**
 * 根据key读取缓存数据
 *
 * @param  {string} key 缓存项主键
 * @return {Object/bool}     缓存值/为空或过期时返回false
 */
storagePrototype.get = function (key) {
    if (!localStorage) {
        return;
    }
    var value = localStorage.getItem(key);
    var result = false;

    if (value === null) {
        return false;
    }

    // 检查完整性
    var match = null;
    try {
        if (match = value.match(splitReg)) {
            value = JSON.parse(match[2]);
            if (value.hasOwnProperty('expireAt') && value.expireAt !== '') {
                var currentTimestampSec = (new Date()).getTime();
                if (currentTimestampSec > value.expireAt) {
                    localStorage.removeItem(key);
                    result = false;
                }
                else {
                    result = {data: value.value};
                }
            }
            else {
                result = {data: value};
            }
        }
    }
    catch (e) {
        result = false;
    }

    return result;
};



if (typeof define !== 'undefined') {
    define(function (require) {
        return new Storage();
    });
}
