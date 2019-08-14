// pages/login/login.js

const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,  
    getUserInfoStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getUserInfo({
      success: function () {
        if(!app.globalData.hsUserInfo){
          wx.navigateTo({
            url: '/pages/relevanceTel/relevanceTel',
          })
        }
      },
      fail: function () {
       
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  jumpIndex(){
    // wx.switchTab({
    //   url: '/pages/index/index'
    // })
    wx.navigateBack({
      delta: 1
    })
  },
  bindgetuserinfo: function (res) {
    if (res.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        getUserInfoStatus: false,
        userInfo: res.detail.userInfo,
      })
      wx.setStorageSync('userInfo', res.detail.userInfo);
      app.login((res)=>{
        if(res.telphone){
          wx.navigateBack({});
        }else{
          wx.navigateTo({
            url: '/pages/relevanceTel/relevanceTel',
          })
        }
      },()=>{
        wx.navigateTo({
          url: '/pages/relevanceTel/relevanceTel',
        })
      })
     
     
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})