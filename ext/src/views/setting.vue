<style lang="stylus">
    @import '../assets/styl/setting.styl'
</style>

<template>
    <sd-toast :showing="toast.show" :msg="toast.msg" :icontype="toast.type"></sd-toast>
    <sd-head :shownav.sync="showSlideNav" :titleflied.sync="toast.show"></sd-head>
    <div class="setting-container">
        <aside class="setting-nav">
            <div v-for="set in setting" class="nav-item">
                <div data-id="set.id">
                <p v-text="set.label"></p>
                <div v-for="value in set.items" class="nav-item-sub">
                    <div v-text="value.label" data-subid="value.id" class="nav-item-sub-label"></div>
                </div>
            </div>
        </aside>
        <section class="setting-area">
            <div v-for="set in setting" class="item">
                <div data-id="{{set.id}}">
                <p v-text="set.label" class="item-lable"></p>
                <div v-for="subitem in set.items" data-key="{{set.key}}" class="item-sub">
                    <div class="item-sub-label">
                        {{subitem.label}}
                        <span v-if="subitem.type === 'singleradio'">（点击激活或失效）</span>
                        <span v-if="subitem.type === 'checkbox'">（多选）</span>
                        <span v-if="subitem.type === 'radio'">（单选）</span>
                    </div>
                    <div class="item-sub-wrapper" data-key="{{subitem.key}}">

                        <!-- For Button -->
                        <div v-if="subitem.type == 'btn'" class="btn" data-key="{{subitem.key}}" v-text="subitem.value" :class="{'active': settingValue[subitem.key]}" v-on:click="btnHandler(subitem.key)"></div>

                        <!-- For switcher || singleradio -->
                        <div v-if="subitem.type == 'singleradio'" class="switcher" data-key="{{subitem.key}}" :class="{'active': settingValue[subitem.key]}" v-on:click="switcherHandler(subitem.key, !settingValue[subitem.key])"></div>

                        <!-- For checkbox -->
                        <div v-if="subitem.type == 'checkbox'" class="checkbox" data-key="{{subitem.key}}" v-for="value in subitem.values" :class="{'active': settingValue[subitem.key].indexOf(value) !== -1}" v-text="value" v-on:click="checkboxHandler(subitem.key, value)"></div>

                        <!-- For Multi-Select -->
                        <div v-if="subitem.type == 'radio'" class="radio item-sub-value" data-key="{{subitem.key}}"  v-for="value in subitem.values" :class="{'active': value == settingValue[subitem.key]}" v-text="value" v-on:click="radioHandler(subitem.key, value)">
                        </div>

                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
/**
 * Magnet 设置页
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
 */

var storage = require('../libs/storage');
var tj = require('../libs/tj');
var consts = require('../libs/consts');
module.exports = {
    route: {
        canReuse: false
    },
    data: function () {
        var self = this;
        return {
            setting: consts.settingList,
            settingValue: storage.get(consts.configName).data,
            toast: {
                show: false,
                msg: '加载中',
                type: 'error',
                hideDelay: 3000,
                // 因为Vuejs还不能对绑定对象中的变量进行实时监控，所以当子控件的绑定属性值在子控件中被改变时，父控件感知不到，于是需要在外部进行销毁操作
                hideToast: function () {
                    setTimeout(function () {
                        self.toast.show = false;
                    }, self.toast.hideDelay);
                }
            }
        }
    },
    ready: function () {
        tj.trackPageViewTJ(tj.pageLists.setting);
        tj.trackEventTJ(tj.category.setting, 'pageLoaded', [{}]);
    },
    methods: {
        btnHandler: function (key) {
            var self = this;
            switch (key) {
                case 'cache-clear':
                    storage.del(consts.cacheListName, {
                        success: function () {
                            self.toast.type = 'info';
                            self.toast.show = true;
                            self.toast.msg = '清空缓存成功'
                            self.toast.hideToast();
                        },
                        error: function () {
                            self.toast.show = true;
                            self.toast.msg = '清空缓存失败'
                            self.toast.hideToast();
                        }
                    });
                    tj.trackEventTJ(tj.category.setting, 'clearCache', [{}]);
                    break;
                case 'reset-default':
                    chrome.runtime.sendMessage({
                        type: 'resetToDefault'
                    }, function(res) {
                        self.settingValue = res.value;
                    });
                    break;
                default:
                    break;
            }
        },
        switcherHandler: function (key, value) {
            var self = this;
            if (key === 'push-switch') {
                // 推送开关需要单独向后端推送更新，以便让eventpage立即关闭alarm
                chrome.runtime.sendMessage({
                    type: 'updateFetchingAlarm',
                    pushFlag: value
                }, function(res) {
                    self.settingValue[key] = res.value;
                });
            }
            else {
                // 其余单选设置立即更新即可
                storage.updateStorge([{key: key, value: value}], {
                    success: function () {
                        self.settingValue[key] = value;
                    }
                });
            }
            tj.trackEventTJ(tj.category.setting, 'switcher-' + key, [{value: value}], value);
        },
        checkboxHandler: function (key, value) {
            var self = this;
            var boxValue = this.settingValue[key];
            if (boxValue.indexOf(value) === -1) {
                if (boxValue.trim().length === 0) {
                    boxValue = value;
                }
                else {
                    boxValue += ',' + value;
                }
            }
            else {
                var boxValueArr = boxValue.split(',');
                var idx = boxValueArr.indexOf(value);
                boxValueArr.splice(idx, 1);
                boxValue = boxValueArr.join(',');
            }

            storage.updateStorge([{key: key, value: boxValue}], {
                success: function () {
                    self.settingValue[key] = boxValue;
                }
            });
            tj.trackEventTJ(tj.category.setting, 'checkbox-' + key, [{value: boxValue}], boxValue);
        },
        radioHandler: function (key, value) {
            var self = this;

            storage.updateStorge([{key: key, value: value}], {
                success: function () {
                    self.settingValue[key] = value;

                    if (key === 'push-frequency') {
                        // 推送开关需要单独向后端推送更新，以便让eventpage立即关闭alarm
                        chrome.runtime.sendMessage({
                            type: 'restartFetchingAlarm'
                        }, function() {});
                    }
                }
            });

            tj.trackEventTJ(tj.category.setting, 'radio-' + key, [{value: value}], value);
        }
    },
    components: {
        sdToast: require('../components/toast.vue'),
        sdHead: require('../components/header.vue')
    }
};
</script>
