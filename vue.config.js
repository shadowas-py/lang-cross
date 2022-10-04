// const { defineConfig } = require('@vue/cli-service');

module.exports = {
  transpileDependencies: true,
  publicPath: '/csw-sandbox/',
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => ({
        ...options,
        reactivityTransform: true,
      }));
  },
};
