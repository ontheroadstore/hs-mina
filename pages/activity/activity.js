const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

Page({
  data: {
    loading: true,                      // 延迟加载
    authorization: false,               // 授权
    gameCurrency: 9,                    // 抽奖次数
    winLogId: 0,                        // 抽奖Id
    drawStatus: false,                  // 抽奖状态 true 进行中
    isSuccess: false,                   // 是否显示未中奖
    noDraw: false,                      // 没有抽奖次数图 显示状态
    selectedImage: null,                // 奖品图
    paymentInfo: null,                  // 生成打赏订单数据 后台返回
    prizeIntroduce: 0,                  // 奖品介绍 切换状态
    facility: null,                     // 老虎机动画
    lightArr: null,                     // 随机灯
    scrollImage1: null,                 // 滚动动画
    scrollImage2: null,                 // 滚动动画
    scrollImage3: null,                 // 滚动动画
    handShankStatus: [false, true, true, true, true],                 // 杠杆动画
    isIphoneX: app.globalData.isIphoneX      // 是否IphoneX
  },
  onReady: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    const that = this
    setTimeout(function () {
      that.setData({
        loading: false
      })
    }, 1000)
    wx.getUserInfo({
      success: function () {
        req(app.globalData.bastUrl, 'appv5_1/tigger/getStatus', {}).then(res => {
          // 活动是否到期
          if (res.data) {
            req(app.globalData.bastUrl, 'appv5_1/tigger/getCoin', {}).then(res => {
              that.setData({
                gameCurrency: res.data
              })
            })
          } else {
            // wx.showModal({
            //   title: '提示',
            //   content: '活动已结束',
            //   showCancel: false,
            //   success: function (data) {
            //     if (data.confirm) {
            //       wx.reLaunch({
            //         url: '/pages/index/index'
            //       })
            //     }
            //   }
            // })
          }
        })
      },
      fail: function () {
        that.setData({
          authorization: true
        })
      }
    })
    const facility = wx.createAnimation({
      duration: 50,
      timingFunction: 'linear',
    })
    this.facility = facility
    that.setData({
      facility: that.facility.export()
    })
    setInterval(function () {
      that.facility.opacity(0).step().opacity(1).step({ delay: 50 }).opacity(0).step({ delay: 100 }).opacity(1).step({ delay: 150 })
      that.setData({
        facility: facility.export()
      })
    }, 2000)
  },
  // 随机 灯
  lightRandom: function () {
    const that = this
    var num = 0
    const time = setInterval(function () {
      num = num + 100
      const arr = [0, 1, 2, 3, 4, 5]
      var newArr = []
      arr.forEach(function (item, index) {
        const num = parseInt(Math.random() * 12 + 1)
        newArr.push(num)
      })
      that.setData({
        lightArr: newArr
      })
      if (num == 2400) {
        clearInterval(time)
        that.setData({
          lightArr: []
        })
      }
    }, 100)
  },
  // 滚动动画
  scrollImage: function () {
    const that = this
    var scrollImage1 = wx.createAnimation({
      duration: 2800,
      timingFunction: 'ease',
    })
    var scrollImage2 = wx.createAnimation({
      duration: 2800,
      delay: 150,
      timingFunction: 'ease',
    })
    var scrollImage3 = wx.createAnimation({
      duration: 2800,
      delay: 300,
      timingFunction: 'ease',
    })
    scrollImage1.translateY(-6000).step()
    scrollImage2.translateY(-6000).step()
    scrollImage3.translateY(-6000).step()
    this.setData({
      scrollImage1: scrollImage1.export(),
      scrollImage2: scrollImage2.export(),
      scrollImage3: scrollImage3.export()
    })
    setTimeout(function () {
      scrollImage1.translateY(0).step({ duration: 0, delay: 0 })
      scrollImage2.translateY(0).step({ duration: 0, delay: 0 })
      scrollImage3.translateY(0).step({ duration: 0, delay: 0 })
      that.setData({
        scrollImage1: scrollImage1.export(),
        scrollImage2: scrollImage2.export(),
        scrollImage3: scrollImage3.export()
      })
    }, 2200)
  },
  // 拉杆
  handShank: function () {
    if (this.data.drawStatus) {
      return false
    }
    if (this.data.gameCurrency == 0) {
      this.setData({
        noDraw: true
      })
      return false
    }
    this.setData({
      drawStatus: true
    })
    var m = 1
    const that = this
    const time = setInterval(function () {
      m = m + 1
      if (m == 6) {
        clearInterval(time)
      } else if (m == 2) {
        that.setData({
          handShankStatus: [true, false, true, true, true]
        })
      } else if (m == 3) {
        that.setData({
          handShankStatus: [true, true, false, true, true]
        })
      } else if (m == 4) {
        that.setData({
          handShankStatus: [true, true, true, false, true]
        })
      } else if (m == 5) {
        that.setData({
          handShankStatus: [true, true, true, true, false]
        })
      }
    }, 20)
    setTimeout(function () {
      that.lightRandom()
      that.scrollImage()
    }, 400)
    setTimeout(function () {
      that.draw()
    }, 2800)
  },
  draw: function () {
    const that = this
    req(app.globalData.bastUrl, 'appv5_1/tigger/tiggerRun', {}).then(res => {
      if (res.data.status == 0) {
        that.setData({
          noDraw: true
        })
      }
      if (res.data.isSuccess == 0) {
        that.setData({
          gameCurrency: res.data.coin,
          isSuccess: true
        })
      } else if (res.data.isSuccess == 1) {
        // 中奖后 记录打赏信息 抽奖ID selectedImage orderImage
        res.data.payment_info.tiggerWinId = res.data.winLogId
        that.setData({
          gameCurrency: res.data.coin,
          selectedImage: res.data.giftInfo.img2,
          paymentInfo: res.data.payment_info,
          winLogId: res.data.winLogId
        })
      }
      setTimeout(function () {
        that.setData({
          handShankStatus: [false, true, true, true, true]
        })
      }, 100)
    })
  },
  // 取消下单
  closeBtn: function () {
    const that = this
    wx.showModal({
      title: '提示',
      content: '取消视为放弃本次中奖资格',
      cancelText: '放弃奖品',
      confirmText: '继续下单',
      success: function (res) {
        if (res.confirm) {
        } else if (res.cancel) {
          that.resetDraw()
        }
      }
    })
  },
  // 未中奖
  noSelectedCloseBtn: function () {
    this.resetDraw()
  },

  // 奖品介绍
  activityContent: function (e) {
    const num = e.target.dataset.num
    this.setData({
      prizeIntroduce: num
    })
  },
  activityHide: function () {
    this.setData({
      prizeIntroduce: 0
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
  // 跳转首页
  navigateToIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index'
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
  },
  // 授权
  bindgetuserinfo: function (res) {
    const that = this
    if (res.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        authorization: false
      })
      app.login(that.onReady)
    }
  },
  // 重置抽奖
  resetDraw: function () {
    this.setData({
      winLogId: 0,
      drawStatus: false,
      isSuccess: false,
      selectedImage: null,
      noDraw: false
    })
  },
  // 分享加金币
  onShareAppMessage: function (res) {
    const that = this
    return {
      title: '狠货天天抽，最高价值¥588，次数上不封顶',
      path: '/pages/activity/activity',
      imageUrl: 'http://img8.ontheroadstore.com/upload/180513/e8f735fc23f386c411a16855ab263cf4.png',
      success: function (res) {
        console.log(res)
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (data) {
            // 将获取的encryptedData 传入后台
            console.log(data)
          }
        })
        // 转发成功
        req(app.globalData.bastUrl, 'appv5_1/tigger/shareIncrCoin', {}, 'GET', true).then(res => {
          that.resetDraw()
          that.setData({
            gameCurrency: res.data.coin
          })
          if (res.data.status == 1) {
            wx.showToast({
              title: '分享成功，获得一次抽奖',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    }
  }
})
