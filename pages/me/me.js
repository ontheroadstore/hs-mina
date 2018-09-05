// pages/me/me.js
const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

Page({
  data: {
    userInfo: null,
    userTel: undefined,
    getUserInfoStatus: false,
    ifGoBind: true, //未绑定是否去绑定页
  },
  onLoad: function(){
     
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    
    //已登录且绑定
    if(this.data.userInfo && this.data.userTel){
      return;
    }
    app.ifLogin((globalUserInfo) => {
      let userTel = String(globalUserInfo.telphone)
      let userTelArr = userTel.split("");
      for (let i = 3; i < 7; i++) {
        userTelArr[i] = '*'
      }
      userTel = userTelArr.join("")
      this.setData({
        userInfo: globalUserInfo,
        userTel: userTel,
      })
    }, ()=>{
      if(this.data.ifGoBind===false){
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      this.setData({
        ifGoBind: !this.data.ifGoBind,
      })
    }, this.data.ifGoBind)
  },
  bindgetuserinfo: function(res) {
    if (res.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        getUserInfoStatus: false
      })
      app.login(this.onShow)
    }
  },
  repulseGetUserInfo: function () {
    this.setData({
      getUserInfoStatus: false
    })
  }
})