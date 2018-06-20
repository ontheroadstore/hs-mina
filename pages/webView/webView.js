// pages/webView/webView.js
const app = getApp()
import { req } from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url: options.url,
      shareTitle: options.title
    })
    const that = this
    req(app.globalData.bastUrl, 'wxapp/winedoit/status').then(res => {
      if (res.data) {
        req(app.globalData.bastUrl, 'wxapp/winedoit/getIsSell', {
          goodsIds: 1095535
        }, 'POST').then(res => {
          if (res.data.isCanSell && res.data.userCanBy == '1') {
            that.setData({
              url: app.globalData.bastUrl + 'appv5_1/wxapp/adPage/18',
            })
          }
        })
      }
    })
  },
  // 分享
  onShareAppMessage: function () {
    var url = this.data.url
    const shareTitle = this.data.shareTitle
    return {
      title: shareTitle,
      path: '/pages/webView/webView?url=' + url,
      success: function () {
        if (url == 'https://apitest.ontheroadstore.com/appv5_1/wxapp/adPage/17' || url == 'https://api.ontheroadstore.com/appv5_1/wxapp/adPage/17') {
          req(app.globalData.bastUrl, 'wxapp/winedoit/share', {}, 'GET', true).then(res => {
            wx.showToast({
              title: '分享成功，活动商品下单立减5元/件',
              icon: 'none',
              duration: 2000
            })
          })
        }
      }
    }
  },
})