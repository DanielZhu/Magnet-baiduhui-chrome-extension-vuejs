"use strict";

/**
 * Magnet
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
*/
var _hmt = _hmt || [];
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
        // (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?cb10d3b9969d265707399889df18284d";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        // })();
    },

    deployGA: function () {
        // Standard Google Universal Analytics code
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-32456518-2', 'auto');
        // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
        ga('set', 'checkProtocolTask', function(){});
        ga('require', 'displayfeatures');
        ga('send', 'pageview', '/options.html');
    },

   /**
    * 部署百度统计JSAPI的函数
    *
    * @param {string} pageUrl 页面URL
    */
    trackPageViewTJ: function (pageUrl) {
        window._hmt.push(['_trackPageview', pageUrl]);
        if (window && window.ga) {
            ga('send', 'pageview', pageUrl);
        }
    },

   /**
    * 百度统计JSAPI记录行为的函数
    *
    * @param {number} categoryName 类型名
    * @param {number} eventName 事件名
    * @param {Array}  label 其他参数
    * @param {number} value 需要获取平均值等的数值项
    *
    * window._hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
    *
    * usage: trackEventTJ('category', 'action', 'label');
    * usage: trackEventTJ('category', 'action', 'label', value);  //  value is a number.
    * usage: trackEventTJ('category', 'action', {'nonInteraction': 1});
    * category：要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必选。
    * action：用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必选。
    * opt_label：事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项可选。
    * opt_value：事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。
    */
    trackEventTJ: function (category, action, label, value) {
        var params = [];

        if (label) {
            for (var i = 0; i < label.length; ++i) {
                var eventParam = label[i];
                for (var key in eventParam) {
                    if (eventParam.hasOwnProperty(key)) {
                        params.push(key + '=' + eventParam[key]);
                    }
                }
            }
        }

        // console.log("%csend: " + category + " " + action + " " + JSON.stringify(label), "color: #333;font-size:0.6em");

        // patch: seems arguments isn't really an array so let's create one from it
        var argumentsArray = [].splice.call(arguments, 0);

        var gaArgs = ['send', 'event'];
        // append other arguments
        gaArgs = gaArgs.concat(argumentsArray);

        // send to google
        if (window && window.ga) {
            window.ga.apply(this, gaArgs);
        }

        window._hmt.push(['_trackEvent', category, action, params.join('&'), value]);
    }
};

if (_hmt.length === 0) {
    SdTJ.deployBaiduTJ();
}

if (typeof window.ga === 'undefined') {
    SdTJ.deployGA();
}

if (typeof define !== 'undefined') {
    define(function (require) {
        return SdTJ;
    });
}

