Page({
  data: {
    blowStatus: false,                // 打击按钮
    sceneStatus: false,               // 切换打击
    damageNum: 10,                    // 朋友打击伤害
    dialogGifStatus: false,           // 打击动画
    dialogStatus: false               // 提示窗
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  onShareAppMessage: function () {
  
  },
  // 我也要玩
  ending: function () {
    wx.redirectTo({
      url: '/pages/activity/activity',
    })
  },
  // 打击动画
  blow: function () {
    const that = this
    this.setData({
      dialogGifStatus: true,
      blowStatus: false
    })
    setTimeout(function () {
      that.setData({
        dialogGifStatus: false,
        dialogStatus: true
      })
    }, 2000)
  },
  // 切换场景
  tabScene: function () {
    this.setData({
      blowStatus: true,
      sceneStatus: true
    })
  },
  // 活动规则
  activityInfo: function (e) {
    const status = e.target.dataset.status
    if (status == 0) {
      this.setData({
        activityInfoStatus: false
      })
    } else {
      this.setData({
        activityInfoStatus: true
      })
    }
  },
  catchtouchmove: function () {
    // console.log(1)
  },
})