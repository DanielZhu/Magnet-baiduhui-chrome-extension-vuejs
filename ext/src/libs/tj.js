"use strict";

/**
 * Magnet
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
*/
var SdTJ = {
    category: {
        handpick: 'handpick',
        discover: 'discover',
        promo: 'promo',
        about: 'about',
        lunetteMenu: 'lunetteMenu',
        navDrawerMenu: 'navDrawerMenu',
        bgNotify: 'bgNotify'
    },

    pageLists: {
        handpick: 'handpick',
        discover: 'discover',
        promo: 'promo',
        about: 'about'
    },

   /**
    * 部署百度统计代码的函数
    */
    deployBaiduTJ: function () {
        window._hmt = window._hmt || [];
        (function () {
            var hm = document.createElement('script');
            hm.src = 'https://hm.baidu.com/hm.js?cb10d3b9969d265707399889df18284d';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(hm, s);
        })();
    },

   /**
    * 部署百度统计JSAPI的函数
    *
    * @param {string} pageUrl 页面URL
    */
    trackPageViewTJ: function (pageUrl) {
        if (typeof window._hmt !== 'undefined') {
            window._hmt.push(['_trackPageview', pageUrl]);
        }
    },

   /**
    * 百度统计JSAPI记录行为的函数
    *
    * @param {number} categoryName 类型名
    * @param {number} eventName 事件名
    * @param {Array}  eventParamsList 其他参数
    * @param {number} value 需要获取平均值等的数值项
    *
    * _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
    *
    * category：要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必选。
    * action：用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必选。
    * opt_label：事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项可选。
    * opt_value：事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。
    */
    trackEventTJ: function (categoryName, eventName, eventParamsList, value) {
        if (typeof window._hmt !== 'undefined') {
            var params = [];

            if (eventParamsList) {
                for (var i = 0; i < eventParamsList.length; ++i) {
                    var eventParam = eventParamsList[i];
                    for (var key in eventParam) {
                        if (eventParam.hasOwnProperty(key)) {
                            params.push(key + '=' + eventParam[key]);
                        }
                    }
                }
            }
            window._hmt.push(['_trackEvent', categoryName, eventName, params.join('&'), value]);
        }
    }
};

if (typeof window._hmt === 'undefined') {
    SdTJ.deployBaiduTJ();
}

module.exports = SdTJ;

