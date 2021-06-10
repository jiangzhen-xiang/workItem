const path = require('path')
require('babel-polyfill')
const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production0' ? './' : '/'

module.exports = {
  // entry: {
  //   app: ['babel-polyfill', './src/main.js']
  // },
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  // baseUrl: BASE_URL,
  publicPath: BASE_URL,
  // output: {
  //   path: path.resolve(__dirname, 'cluster')
  // },
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  // devServer: {
  //   // proxy: {
  //   //   '/api': {
  //   //     ws: false,
  //   //     target: 'http://172.16.7.204:38200/',
  //   //     changeOrigin: true,
  //   //     pathRewrite: {
  //   //       '/api': '/'
  //   //     }
  //   //   }
  //   // }
  // },
  // },
  transpileDependencies: ['tree-table-vue', 'iview', 'js-base64'],
  chainWebpack: config => {
    //  config.entry('polyfill').add('@babel/polyfill')
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))

    // start icon ======
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    //= ====end icon=====
  },
  //= ======ie11== start ===
  configureWebpack: {
    module: {
      rules: [
        // 'transform-runtime' 插件告诉 Babel
        // 要引用 runtime 来代替注入。
        {
          test: /\.m?js$/,
          include: [
            resolve('src'),
            resolve('test'),
            resolve('node_modules/webpack-dev-server/client'),
            resolve('node_modules/iview/src'),
            resolve('node_modules/tree-table-vue/lib'),
            resolve('node_modules/v-org-tree/dist')
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  },

  // =====ie11===end=====

  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    // proxy: 'http://172.16.7.134:8815'
    // proxy: 'http://172.16.6.207:8815'
    // proxy: 'http://172.16.150.27:8815'
    // proxy: 'http://172.16.150.28:38211'
    proxy: 'http://172.16.150.28:8815'
    // proxy: 'http://localhost:8815'
    // proxy:'http://127.0.0.1:8815'
    // proxy: 'http://172.16.20.28:8815',// 后台本地
  }
}
