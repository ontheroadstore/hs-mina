// pages/express/express.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'


Page({

  data: {
    expressInfo: null,
    expressData: [],
    randomGoods: null
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '物流信息'
    })
    req(app.globalData.bastUrl, 'appv2_1/express', {
      order_id: options.order_number
    }, "GET", true).then(res => {
      var expressData = []
      // 时间格式处理
      if (res.data.data) {
        res.data.data.forEach(function (item, index) {
          item['newDay'] = item.time.slice(5, 10)
          item['newTime'] = item.time.slice(11)
          expressData.push(item)
        })
      }
      this.setData({
        expressData: expressData,
        expressInfo: res.data
      })
    })
  },
  // 商品跳转article
  navigateToGoods: function (e) {
    let id = e.target.dataset.id
    const url = '/pages/article/article?id=' + id
    wx.navigateTo({
      url: url
    })
  },
  // 卖家中心跳转user
  navigateToUser: function (e) {
    let id = e.target.dataset.id
    let name = e.target.dataset.name
    const url = '/pages/user/user?id=' + id + '&name=' + name
    wx.navigateTo({
      url: url
    })
  }
})