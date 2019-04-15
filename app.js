//app.js
// data数据不区分大小写
import util from './utils/util.js'
import {
  wx_login,
  req,
  sensors
} from './utils/api.js'
import {
  initSensors,
  sensorsFuns
} from './utils/sensors_fun.js';
initSensors(sensors) //神策初始化
App({
  onLaunch: function() {

    // 存储手机型号
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
        if (res.model.indexOf('iPhone X') >= 0) {
          this.globalData.isIphoneX = true
        }
        // 判断当前环境，填写baseUrl//实际上是baseUrl，只是其他地方都写错了。
        this.globalData.bastUrl = res.platform == 'devtools' ? 'https://api.ontheroadstore.com/' : 'https://api.ontheroadstore.com/'
        //this.globalData.bastUrl = res.platform == 'devtools' ? 'https://apitest.ontheroadstore.com/' : 'https://apitest.ontheroadstore.com/'
      }
    })
    this.login()
    sensorsFuns(sensors, this) //神策一些方法处理，传入sensors和app 
  },
  onShow: function() {},
  onHide: function() {},
  onError: function() {},
  login: function(callback) {
    // 登录
    wx_login(this.globalData.bastUrl).then(res => {
      req(this.globalData.bastUrl, 'appv4/user/simple', {}, "GET", true).then(res => {
        this.globalData.hsUserInfo = res.data
        this.globalData.authorizationStatus = true
        sensors.login(res.data.id) //神策登录
        if (callback) {
          callback()
        }
      })
    })
  },
  ifLogin: function(succback, failback, ifGoBind) {
    let globalUserInfo = this.globalData.hsUserInfo;
    let authorizationStatus = this.globalData.authorizationStatus;
    if (globalUserInfo && globalUserInfo.telphone) {
      if (succback) {
        succback(globalUserInfo);
      }
    } else {
      if (failback) {
        failback();
      }
      if (ifGoBind) {
        wx.navigateTo({
          url: '/pages/relevanceTel/relevanceTel',
        })
      }
    }
  },
  /*获取当前页url*/
  getCurrentPageUrl: function() {
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let url = currentPage.route //当前页面url
    return url
  },
  globalData: {
    bastUrl: null,//实际上是baseUrl，只是其他地方都写错了。
    isIphoneX: false,
    userInfo: null, //wx返回的基本信息
    systemInfo: null,
    authorizationStatus: false,
    token: '',
    hsUserInfo: null, //hs保存的用户信息
    //神策使用数据
    sensors: {
      pageType: '',
      navBar:'',//底部nav
    }, 
  }
})