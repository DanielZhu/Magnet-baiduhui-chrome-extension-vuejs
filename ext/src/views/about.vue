<style lang="stylus">
    @import '../assets/styl/about.styl'
</style>

<template>
    <sd-head :shownav.sync="showSlideNav" :back.sync="pageSlided" :titleflied.sync="toast.show"></sd-head>
    <div class="about-container">
        <section class="sec-item sec-about-hui">
            <div class="about-header">关于百度惠</div>
            <article>
                百度惠是百度旗下消费导购平台。我们致力于以客观中立的态度，为您推荐最具品质和性价比的消费信息。
                <br/><br/>
                如今，网购日益成为大家生活中不可缺少的一部分。但是，对于普通消费者来说，一面是促销手段层出不穷的商家，一面是品种繁多浩如烟海的商品，如何能够在网购过程中规避风险、选择靠谱的商家、买到最具性价比的产品，需要花费大量的时间去做功课和比价。即使如此，效率仍然相对有限。
                <br/><br/>
                而百度惠要做的事，就是帮助大家规避网购风险，降低网购成本。
                <br/><br/>
                在这里，您不但能真正在购物中省钱，体验到“一样的人民币，不一样的购买力”，还能掌握到最一针见血的纯干货消费知识，买得明白，买得超值。
                <br/><br/>

                <span class="highlight-vline">|</span> 精选好货推荐：<br/><br/>

                专业编辑精选，而非盲目选择<br/><br/>

                关注商品品质，而非只看低价<br/><br/>

                靠谱货源，只来自优质B2C商家，而非鱼龙混杂<br/><br/>


                <span class="highlight-vline">|</span> 最佳购买决策：<br/><br/>

                商品价格趋势一目了然，历史最低价的最佳入手时机<br/><br/>

                一站式货比N家，全网比价的最佳入手商家<br/><br/>

                <span class="highlight-vline">|</span> 聪明购物体验：<br/><br/>

                收藏所爱，降价必知，等待抄底<br/><br/>

                猜你所爱，优惠不止，不再错过<br/><br/>
            </article>
        </section>
        <section class="sec-item sec-about-extension">
            <div class="about-header">关于百度惠Chrome Extension</div>
            <article>
                本插件为非官方『百度惠』谷歌浏览器插件，包含推送功能，欢迎使用。<br/><br/>

                <strong>v1.0.7 / 2016.04.07</strong><br/><br/>
                <p>Bug Fix</p><br/>

                <p>- 修复首次刷新缓存记录失败的问题</p>
                <p>- 列表页添加接口请求超时的提示</p><br/>

                <p>优化</p><br/>

                <p>- 通过点击推送项目查看详情时，角标减1</p>
                <p>- 修复点击推送项后，chrome不被主动激活为活跃窗口的问题</p><br/>

                <strong>v1.0.6 / 2016.04.05</strong><br/><br/>
                <p>Bug Fix</p><br/>

                <p>- 当某些外部资源无法加载导致阻塞，无法显示插件野蛮的问题</p><br/>

                <strong>v1.0.5 / 2016.04.05</strong><br/><br/>
                <p>优化</p><br/>

                <p>- 改善统计</p>
                <p>- 列表页与推送 对晒单、经验等其余类型进行兼容（老用户需在设置页面手动激活新推送类型）</p><br/>

                <strong>v1.0.4 / 2016.04.04</strong><br/><br/>
                <p>新功能</p><br/>

                <p>- 加入欢迎闪屏</p>
                <p>- 新增『恢复初始设置』选项</p><br/>

                <p>优化</p><br/>

                <p>- 列表页对晒单、经验等其余类型进行兼容</p>
                <p>- 改善首屏弹出时间过长的问题</p><br/>

                <strong>v1.0.3 / 2016.03.25</strong><br/><br/>

                <p>优化</p><br/>

                <p>- Build Job 调整</p>
                <p>- 查看优惠详情内容可以选择跳转到百度惠PC站查看</p>
                <p>- 优化插件内详情页的样式</p>
                <p>- 剔除接口中间跳转，加快访问</p><br/>

                <strong>v1.0.2 / 2016.03.17</strong><br/><br/>
                <p>新功能</p><br/>

                <p>- 首页，列表加载失败后，加入重试按钮</p><br/>

                <p>优化</p><br/>

                <p>- 改善统计</p>
                <p>- Logo角标数字更正为优惠项增量数</p>
                <p>- 缓存为空时的新增量优惠项目不作推送</p>
                <p>- 插件安装后，后台将立即请求10条数据缓存</p><br/>

                <p>Bug Fix</p><br/>

                <p>- 首页，加载更多项目失败时，页码还在往上累加的错误</p>
                <p>- 首页，翻页后，缓存被旧数据覆盖的问题（由v1.0.1改动引起）</p>
                <p>- 设置，推送频率修改后没有立即生效的问题</p>
                <p>- 推送项目后的点击跳转问题</p><br/>

                <strong>v1.0.1 / 2016.03.15</strong><br/><br/>
                <p>Bug Fix</p><br/>
                <p>- 推送特卖活动时，修复了显示多余HTML标记文本的问题</p>
                <p>- 在页面上修改推送开关后，实时停止推送</p>
                <p>- 支持优惠详细介绍中的百度VIP外链跳转（保障你的返利权利）</p>
                <p>- 修复推送时，因消息排序导致的推送内容错误问题</p><br/>

                <p>优化</p><br/>
                <p>- 部分界面显示问题</p>
                <p>- 单条手动推送入口增加显示门槛</p><br/>

                <strong>v1.0.0 / 2016.03.13</strong><br/><br/>
                <p>- 支持百度惠首页精选频道商品浏览</p>
                <p>- 支持查看精选商品和活动详情</p>
                <p>- 支持查看详情页内评论</p>
                <p>- 插件支持页面内设置</p>
                <p>- 支持实时推送与音效（可定制）</p>
                <p>- 永久缓存一页最新的优惠列表（可定制）</p><br/><br/>
            </article>
        </section>
        <section class="sec-item sec-about-donate">
            <div class="about-header">感谢信</div>
            <article>
                哈喽，亲爱的用户：
                <br/><br/>
                很高兴您费尽千幸万苦安装了此插件，希望她能帮你买买买咯， ~ ^_^ ~<br/><br/>

                另外，小丹农民（俗称码农）觉得第一个版本还比较粗糙，但为了方便大家使用（尤其是实时推送功能），所以决定提前发布该插件，试用下来，推送功能还是非常实用的，绝对能帮助我们大家了解买买买的实时行情。<br/><br/>

                再有，该插件使用的数据皆来自于百度惠官方数据，请不要怀疑哦！<br/><br/>

                P.S. 为什么这页的图标是纸币呢，因为本来这里的标题是『能给开发GG买个甜甜圈么？』，但就如上面所描述的，该版本还比较粗糙，本农民不好意思这么做。<br/><br/>

                <span class="highlight-text">声明：该插件使用的所有来自于百度惠网站(http://hui.baidu.com)的数据的版权都属于百度惠官方团队所有。 本插件不具有以上数据的所有权，对于数据有任何疑问，欢迎在谷歌Chrome官方插件商店留言，或者发送邮件至：hui@baidu.com</span><br/><br/>
            </article>
        </section>
        <section class="sec-item sec-about-feedback">
            <div class="about-header">提点意见</div>
            <article>
                亲爱的用户，用下来有意见了么？<br/><br/>

                您可以将您的意见反馈到以下联系方式给开发GG：<br/><br/>

                - email: enterzhu@gmail.com<br/><br/>
                - 插件下载页面下方评论处
            </article>
        </section>
        <section class="sec-item sec-about-other">
            <div class="about-header">其它</div>
            <article>
                此处该放什么呢，还没想好。<br/><br/>

                希望百度惠越做越好！！！<br/><br/>
            </article>
        </section>
    </div>
    <sd-Lunette-menu :menu-expanded.sync="showLunetteMenu"></sd-Lunette-menu>
</template>

<script>
/**
 * Magnet 帮助页
 *
 * @author Daniel Zhu<enterzhu@gmail.com>
 */
var tj = require('../libs/tj.js');
module.exports = {
    route: {
        canReuse: true,
        data (transition) {
            let query = transition.to.query;
            this.seQuery.tab = query.tab || 'hui';
            this.updateView();
        }
    },
    data: function () {
        var self = this;
        return {
            showLunetteMenu: false,
            pageSlided: false,
            seQuery: {
                tab: 'hui'
            },
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
        tj.trackPageViewTJ(tj.pageLists.about);
        tj.trackEventTJ(tj.category.about, 'pageLoaded', [{}]);
        this.updateView();
    },
    methods: {
        updateView: function () {
            $('.sec-item').toggleClass('hidden', true);
            $('.sec-about-' + this.seQuery.tab).toggleClass('hidden', false);
            tj.trackEventTJ(tj.category.about, 'view', [{tab: this.seQuery.tab}]);
        }
    },
    components: {
        sdHead: require('../components/header.vue'),
        sdLunetteMenu: require('../components/lunetteMenu.vue'),
    }
};
</script>
