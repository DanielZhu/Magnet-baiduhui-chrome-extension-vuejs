'use strict'


var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var PORT = process.env.PORT || 8055;
config.entry.unshift('webpack-dev-server/client?http://localhost:8055', "webpack/hot/dev-server");
config.plugins.push(new webpack.HotModuleReplacementPlugin());

// 这里配置：请求http://localhost:9090/api，
// 相当于通过本地node服务代理请求到了http://cnodejs.org/api
// http://hui.baidu.com/facade/hui/rcmdse/list
// var proxy = [{
//     path: '/facade/*',
//     target: 'http://hui.baidu.com',
//     host: 'baidu.com',
//     secure: false
// }];


// 启动服务
var app = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    proxy: {
        '/facade/*': {
            target: 'http://hui.baidu.com/',
            secure: false,
            changeOrigin: true
        }
    }
});
app.listen(PORT, 'localhost');
