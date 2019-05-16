// pages/getCollectCoupon/getCollectCoupon.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userTel: undefined,
    getUserInfoStatus: false,
    ifGoBind: true, //未绑定是否去绑定页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
      // 通常来说这个页是必须登录的页，如果没有登录将跳转到登录页
      // 跳转之前设置一个flag标识已经去过登录页，
      // 如果没有登录而是点击了返回，则根据这个flag判断是否返回首页。
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