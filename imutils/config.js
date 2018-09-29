// 配置
var envir = 'pre',
  CONFIG = {},
  configMap = {
    test: {
      appkey: '3ee032ac53f77af2dd508b941d091f60',
      url: 'https://apitest.ontheroadstore.com'
    },

    pre: {
      appkey: '3ee032ac53f77af2dd508b941d091f60',
      url: 'https://apitest.ontheroadstore.com'
    },
    online: {
      appkey: '3ee032ac53f77af2dd508b941d091f60',
      url: 'https://apitest.ontheroadstore.com'
    }
  };
CONFIG = configMap[envir];
// 是否开启订阅服务
CONFIG.openSubscription = true

module.exports = CONFIG