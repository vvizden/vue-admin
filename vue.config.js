'use strict'

const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  devServer: {
    port: 3001,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    // before: require('./mock/mock-server.js'),
    proxy: {
      '/jeecg-boot': {
        target: 'http://127.0.0.1:8080', // 请求本地 需要jeecg-boot后台项目
        ws: false,
        changeOrigin: true,
        //   pathRewrite: {
        //     '/jeecg-boot': ''  //默认所有请求都加了jeecg-boot前缀，需要去掉
        //   }
      },
    },
  },
  chainWebpack(config) {
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
        symbolId: 'icon-[name]',
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
  },
  css: {
    loaderOptions: {
      sass: {
        // 注意：在 sass-loader v7 中，这个选项名是 "data"
        prependData: `@import "~@/styles/variables.sass"`,
      },
      scss: {
        prependData: `@import "~@/styles/variables.scss";`,
      },
    },
  },
}
