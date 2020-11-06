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
        let barHeight = res.statusBarHeight?res.statusBarHeight:20
        // if (res.model.indexOf('iPhone X') >= 0) {
        if(barHeight>20){
          this.globalData.isIphoneX = true
        }
        // 判断当前环境，填写baseUrl//实际上是baseUrl，只是其他地方都写错了。
      this.globalData.bastUrl = res.platform == 'devtools' ? 'https://api.ontheroadstore.com/' : 'https://api.ontheroadstore.com/'
      //  this.globalData.bastUrl = res.platform == 'devtools' ? 'https://apitest.ontheroadstore.com/' : 'https://apitest.ontheroadstore.com/'
      }
    })
    this.login()
    sensorsFuns(sensors, this) //神策一些方法处理，传入sensors和app 
  },
  onShow: function(opt) {
      //收藏场景进来领取优惠券
      if (opt.scene === 1089) {
        req(this.globalData.bastUrl, `appv6/coupon/receiveMultipleCoupon?from="collect_coupon"`, {
          couponList:["2019051614110718185"]
        }, 'POST').then(res => {
  
          if (res.status == 1) {
            setTimeout(()=>{
              wx.showToast({
                title: '10元优惠券已到账，下单即可使用',
                icon: 'none',
                duration: 2000
              })
            },2500)
          }
        })
       }
  
  },
  onHide: function() {},
  onError: function() {},
  login: function(callback,failback) {
    // 登录
    wx_login(this.globalData.bastUrl,failback).then(res => {
      if(!res.token&&failback){
        failback()
      }
      req(this.globalData.bastUrl, 'appv4/user/simple', {}, "GET", true).then(res => {
        this.globalData.hsUserInfo = res.data
        this.globalData.authorizationStatus = true
        sensors.login(res.data.id) //神策登录
        if (callback) {
          callback(res.data)
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
        // wx.navigateTo({
        //   url: '/pages/relevanceTel/relevanceTel',
        // })
        wx.navigateTo({
          url: '/pages/login/login',
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