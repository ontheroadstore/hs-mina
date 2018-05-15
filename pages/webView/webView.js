// pages/webView/webView.js
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
  },
  // 分享
  onShareAppMessage: function () {
    const url = this.data.url
    const shareTitle = this.data.shareTitle
    console.log(url)
    console.log(shareTitle)
    return {
      title: shareTitle,
      path: '/pages/webView/webView?url=' + url
    }
  },
})