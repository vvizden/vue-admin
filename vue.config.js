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
}
