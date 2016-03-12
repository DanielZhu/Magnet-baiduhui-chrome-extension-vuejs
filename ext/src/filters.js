"use strict"

import utils from  './libs/utils'


/**格式化时间
 *  @param {string} time 需要格式化的时间
 *  @param {bool} friendly 是否是fromNow
 */
exports.getLastTimeStr = (time, friendly) => {
    if (friendly) {
        return utils.MillisecondToDate(new Date() - new Date(time));
    } else {
        return utils.fmtDate(new Date(time),'yyyy-MM-dd hh:mm');
    }
}

/** 获取文字标签
 *  @param {string} tab Tab分类
 *  @param {bool} good 是否是精华帖
 *  @param {bool} top 是否是置顶帖
 */
exports.getTabStr = (tab, good, top) => {
    let str = "";
    if (top) {
        str = "置顶";
    } else if (good) {
        str = "精华";
    } else {
        switch (tab) {
            case "share":
                str = "分享";
                break;
            case "ask":
                str = "问答";
                break;
            case "job":
                str = "招聘";
                break;
            default:
                str = "暂无";
                break;
        }
    }
    return str;
};

/** 获取标签样式
 *  @param {string} tab Tab分类
 *  @param {bool} good 是否是精华帖
 *  @param {bool} top 是否是置顶帖
 */
exports.getTabClassName = (tab, good, top) => {
    let className = '';

    if (top) {
        className = "top";
    } else if (good) {
        className = "good";
    } else {
        switch (tab) {
            case "share":
                className = "share";
                break;
            case "ask":
                className = "ask";
                break;
            case "job":
                className = "job";
                break;
            default:
                className = "default";
                break;
        }
    }
    return className;
};

/** 获取title文字
 *  @param {string} tab Tab分类
 */
exports.getTitleStr = tab => {
    let str = "";
    switch (tab) {
        case "share":
            str = "分享";
            break;
        case "ask":
            str = "问答";
            break;
        case "job":
            str = "招聘";
            break;
        case "good":
            str = "精华";
            break;
        default:
            str = "全部";
            break;
    }
    return str;
};


exports.untilNow = function (value) {
    // var value = '2016-01-31 00:07:00';
    var date = new Date(value);
    var originTs = date.getTime();
    var nowTs = new Date().getTime();
    var delta = (nowTs -  originTs) / 1000;
    var showTime = '';

    if (delta < 60) {
        // 1分钟内
        showTime = Math.round(delta) + '秒前';
    }
    else if (delta < 60 * 60) {
        // 一小时内
        showTime = Math.round(delta / 60) + '分钟前';
    }
    else if (delta < 24 * 60 * 60) {
        // 1天内
        showTime = Math.round(delta / (60 * 60)) + '小时前';
    }
    else if (delta < 7 * 24 * 60 * 60) {
        // 7天内
        showTime = Math.round(delta / (24 * 60 * 60)) + '天前';
    }
    else {
        showTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }

    return showTime;
};
