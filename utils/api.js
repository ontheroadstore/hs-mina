import { request, setConfig } from './wx-promise-request';
// import { getPageType, addFunctions } from './sensors_fun.js';
var sensors = require('./sensorsdata.min.js');

// initSensors();

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
}

// 微信登陆接口
const wx_login = (baseUrl) => {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: (res) => {
        let code = res.code
        wx.getUserInfo({
          lang: 'zh_CN',
          success: (res) => {
            request({
              url: baseUrl + 'appv5_2/wechat/wechatAppLogin',
              data:{
                wxappcode: code,
                user_info: {
                  user_name: res.userInfo.nickName  ,
                  avatar: res.userInfo.avatarUrl,
                  sex: res.userInfo.gender,
                  city: res.userInfo.city,
                  province: res.userInfo.province,
                  country: res.userInfo.country,
                }
              },
              method: 'POST'
            }).then(res => {
              let data = res.data.data;
              switch (res.data.status) {
                case 1:
                  wx.setStorageSync('token', res.data.data.token)
                  resolve(res.data.data)
                
                  // if(res.data.data.token){
                  //   resolve()
                  // }else{
                  //   wx.navigateTo({
                  //     url: '/pages/relevanceTel/relevanceTel',
                  //   })
                  // }
                  break;
                default:
                  wx.showToast({ title: '截图给客服，登陆接口坏了。', icon: 'none', duration: 2000 })
                  reject()
              }
            })
          },
          fail: (res) => {
            console.log('拒绝授权')
            //初始化时拒绝授权，无法登录，在需要登录的页面跳到绑定手机号页处理
          }
        })
      },
      fail: (res) => {
        wx.showToast({ title: '微信登陆失败！', icon: 'loading', duration: 2000 })
        reject()
      }
    })
  })
}
// 封装请求接口
const req = (baseUrl, url, data, method, showLoadingStatus, call) => {
  return new Promise(function (resolve, reject) {
    if (!showLoadingStatus){
      wx.showNavigationBarLoading()
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }
    if (call) {
      var callback = call
    }
    request({
      url: baseUrl + url,
      data: data,
      method: method,
      header: {
        'Authorization': wx.getStorageSync('token'),
        'UseSource': 'wxapp', //设置用户来源是小程序
        'version' : '4.5', //接口版本
        'SCProperties': sensorsHeader(),
      }
    }).then(res => {
     
      if (!showLoadingStatus) {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
      }
      if (res.statusCode == 200) {
        switch (res.data.status) {
          case 1:
            resolve(res.data)
            break;
          default:
          if(url.indexOf("collect_coupon")!=-1){
            return
          }
            wx.showToast({ title: res.data.info.toString(), icon: 'none', duration: 2000 })
            reject(res.data)
        }
      } else if (res.statusCode == 401) {
        // 请求登陆
        wx_login(baseUrl)
        // 在用户登录过期后，需要回调更新页面状态
        if (callback) {
          callback()
        }
      }
    }).catch(error => {
      reject(error)
      if (!showLoadingStatus) {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
      }
    })
  })
}
/*
// 神策初始化
function initSensors(){
  sensors.init();
  sensors.registerApp({
    platformType: '小程序',//公共属性 ：平台
  });
  sensors.para.autoTrack.pageShow = function () {
    return {
      pageType: getPageType(),
    }
  };
  addFunctions(sensors); //为sensors增加其他封装过的方法
}
*/
// 神策header
function sensorsHeader(){
  let obj = sensors.getPresetProperties();//获取预置属性
  obj.platformType = '小程序';
  obj._distinct_id = sensors.store.getDistinctId()
  let txt = encodeURI(JSON.stringify(obj));
  return txt;
}


module.exports = {
  req: req,
  wx_login: wx_login,
  sensors: sensors,
}
