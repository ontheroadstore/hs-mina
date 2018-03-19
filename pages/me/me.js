// pages/me/me.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: null
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    console.log(app.userInfo)
    // 查看用户信息是否存储，没有重新获取
    if(app.userInfo){
      this.setData({
        userInfo: app.userInfo
      })
    }else{
      // 获取信息，写入app存储 头像加/64处理
      const avatar = util.singleUserAvatarTransform('http://thirdwx.qlogo.cn/mmopen/Hy1aD7zVQ9Z2EUS6reW0aZPmQXtxz8XFvZ90JWddhScvVaEraUggrIsZvD7D5ne5HUaEWnJhGJM6saX2icO5MXEt9uMSHqicQ6')
      const userInfo = {
        id: 64,
        name: '小妖',
        avatar: avatar,
        tel: null
      }
      this.setData({
        userInfo: userInfo
      })
      app.userInfo = userInfo
    }
  }
})