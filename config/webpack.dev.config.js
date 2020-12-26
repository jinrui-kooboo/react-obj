const path = require("path");
// html自动打包
// var HtmlWebpackPlugin = require("html-webpack-plugin");
// 清空上一次的打包文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // 模式 开始模式 会自动预设安装插件 模式不同安装插件不同
  mode: 'production',// production 生产模式  development 开发模式

  /* 入口 */
  entry:  path.join(__dirname, "../src/index.js"),

  /* 输出到dist目录，输出文件名字为bundle.js */
  output: {
    path: path.join(__dirname, "../dist"),
    filename: '[name].[chunkhash].js',
  },
  // 加载打包前的代码
  devtool: "inline-source-map",

  /* cacheDirectory是用来缓存编译结果，下次编译加速 */
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader?cacheDirectory=true"],
        include: path.join(__dirname, "../src"),
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader","postcss-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // 控制小于10K的图片会被转成base64编码，直接插入HTML中.
              limit: 10240,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // new HtmlWebpackPlugin({
    //   /* html压缩 */
    //   minify: true,
    //   template: path.join(__dirname, "../src/index.html"),
    // }),
    new CleanWebpackPlugin()
  ],
  
  // 优化项配置
  optimization: { 
    // 分割代码块
    splitChunks: { 
      // -默认作用于异步chunk，值为all/initial/async/function(chunk),
      // -值为function时第一个参数为遍历所有入口chunk时的chunk模块，
      // -chunk._modules为chunk所有依赖的模块，通过chunk的名字和所有依赖模块的resource可以自由配置,
      // -会抽取所有满足条件chunk的公有模块，以及模块的所有依赖模块，包括css
      // chunks: "all"
      // 设置缓存组用来抽取满足不同规则的chunk
      cacheGroups: {
        // 抽取第三方模块
        vendor: { 
          name: 'vendor',// 模块名
          test: /node_modules/, // 如果你多次引用了node_modules第三方模块,就抽取出来
          chunks: "all"
        }
      }
    }
  },

  // webpack-dev-server
  devServer: {
    contentBase: path.join(__dirname, "../dist"),
    compress: true, // gzip压缩
    host: "0.0.0.0", // 允许ip访问
    hot: true, // 热更新
    historyApiFallback: true, // 解决启动后刷新404
    port: 8000, // 端口
    proxy: {
      // 配置服务代理
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: { "^/api": "" }, // 转换请求 /api/users 为 http://localhost:3000/users
        changeOrigin: true,
      },
    },
  },
};
