// const { defineConfig } = require('@vue/cli-service');

module.exports = {
  transpileDependencies: true,
  publicPath: '/lang-cross/',
  chainWebpack: (config) => {
    config.module.rule('vue').use('vue-loader');
  },
};
