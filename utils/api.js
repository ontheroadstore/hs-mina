import { request } from './wx-promise-request';
let categoriesJson = '../jsons/categories.json';


const getCategories = () => {
  wx.request({
    url: '../jsons/categories.json',
    method: 'GET',
    success:(data) => {
      console.log(data);
    },
    fail: (data) => {
      console.log(data);
    }
  })
}
// 微信登陆接口
const wx_login = (baseUrl, callback) => {
  wx.login({
    success: (res) => {
      let code = res.code
      wx.getUserInfo({
        success: (res) => {
          var data = {
            code: code,
            encryptedData: res.encryptedData,
            iv: res.iv,
            signature: res.signature,
            rawData: res.rawData
          }
          request({
            url: baseUrl + 'appv5_1/login/wechatapp',
            data: data,
            method: 'POST'
          }).then(res => {
            switch (res.data.status) {
              case 1:
                wx.setStorageSync('token', res.data.data.token)
                if (typeof callback === "function") {
                  callback()
                }
              break;
              default:
                wx.showToast({ title: '截图给客服，登陆接口坏了。', icon: 'none', duration: 2000 })
            }
          })
        },
        fail: (res) => {
          //用户拒绝授权
          if (res.errMsg == "getUserInfo:cancel" || res.errMsg == "getUserInfo:fail auth deny") {
            wx.redirectTo({
              url: '../xxx-page/xxx-page'
            })
          }
        }
      })
    },
    fail: (res) => {
      wx.showToast({ title: '微信登陆失败！', icon: 'loading', duration: 2000 })
    }
  })
}
// 封装请求接口
const req = (baseUrl, url, data, method) => {
  return new Promise(function (resolve, reject) {
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
    })
  })
}

module.exports = {
  getCategories: getCategories,
  wx_login: wx_login,
  req: req
}
