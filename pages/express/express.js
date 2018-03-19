// pages/express/express.js
const app = getApp()
const util = require('../../utils/util.js')

//假数据
const expresss = require('../../data/expressss.js')
const expresss1 = require('../../data/expressss1.js')
const chartss = require('../../data/chartss.js')


Page({

  data: {
    expressInfo: null,
    expressData: null,
    randomGoods: null
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '物流信息'
    })
    var expressData = null
    // 时间格式处理
    if (expresss1.data.data){
      expressData = []
      expresss1.data.data.forEach(function(item, index){
        item['newDay'] = item.time.slice(5, 10)
        item['newTime'] = item.time.slice(11)
        expressData.push(item)
      })
    }
    console.log(expressData.length)
    this.setData({
      expressData: expressData,
      expressInfo: expresss1.data,
      randomGoods: util.userAvatarTransform(chartss.data.recommended, 'user_avatar')
    })
    console.log(expresss)
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