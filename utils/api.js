import { request, setConfig } from './wx-promise-request';
const app = getApp()

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
          success: (res) => {
            request({
              url: baseUrl + 'appv5_1/login/wechatapp',
              data: {
                code: code,
                user_info: {
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl,
                  gender: res.userInfo.gender,
                  city: res.userInfo.city,
                  province: res.userInfo.province,
                  country: res.userInfo.country,
                  language: res.userInfo.language
                }
              },
              method: 'POST'
            }).then(res => {
              switch (res.data.status) {
                case 1:
                  wx.setStorageSync('token', res.data.data.token)
                  resolve()
                  break;
                default:
                  wx.showToast({ title: '截图给客服，登陆接口坏了。', icon: 'none', duration: 2000 })
                  reject()
              }
            })
          },
          fail: (res) => {
            //用户拒绝授权
            if (res.errMsg == "getUserInfo:cancel" || res.errMsg == "getUserInfo:fail auth deny") {
              wx.redirectTo({
                url: '../xxx-page/xxx-page'
              })
              reject()
            }
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
const req = (baseUrl, url, data, method, showLoadingStatus) => {
  return new Promise(function (resolve, reject) {
    if (!showLoadingStatus){
      wx.showNavigationBarLoading()
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }
    request({
      url: baseUrl + url,
      data: data,
      method: method,
      header: {
        'Authorization': wx.getStorageSync('token')
      }
    }).then(res => {
      if (res.statusCode == 200) {
        switch (res.data.status) {
          case 1:
            resolve(res.data)
            break;
          default:
            wx.showToast({ title: res.data.info, icon: 'none', duration: 2000 })
        }
      } else if (res.statusCode == 401) {
        // 请求登陆
        wx_login(baseUrl)
        
      }
    }).catch(error => {
      reject(error)
    }).then(res => {
      if (!showLoadingStatus){
        wx.hideNavigationBarLoading()
        wx.hideLoading()
      }
      
    })
  })
}

module.exports = {
  req: req,
  wx_login: wx_login
}
