const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

Page({
  data: {
    gameCurrency: 0,
    paymentInfo: null,
    supernatant: false,
    winLogId: 0,
    drawStatus: false,
    prizeIntroduce: 0,
    supernatantAnimation: null,
    supernatant_circle1: null,
    supernatant_circle2: null,
    supernatant_circle3: null,
    supernatant_circle4: null,
    supernatant_circle5: null,
    supernatantActiveAnimation: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function() {
    req(app.globalData.bastUrl, 'appv5_1/tigger/getStatus', {}).then(res => {
      if (res.data){
        req(app.globalData.bastUrl, 'appv5_1/tigger/getCoin', {}).then(res => {
          this.setData({
            gameCurrency: res.data
          })
        })
      }else{
        wx.reLaunch({
          url: '/pages/chart/chart'
        })
      }
    })
  },
  draw: function() {
    const that = this
    this.setData({
      drawStatus: true
    })
    setTimeout(function(){
      that.setData({
        drawStatus: false
      })
      // req(app.globalData.bastUrl, 'appv5_1/tigger/tiggerRun', {}).then(res => {
      //   console.log(res)
      //   if (res.data.isSuccess == 0) {
      //     // 未中奖 显示图片
      //   } else if (res.data.isSuccess == 1) {
      //     // 中奖后 用户插入地址
      //     that.setData({
      //       drawStatus: false,
      //       winLogId: res.data.winLogId
      //     })
      //     that.detectionAddress(res.data.winLogId)
      //   }
      // })
    },2160)
  },
  // 添加用户地址
  addAddress: function () {
    const that = this
    wx.chooseAddress({
      success: function(data) {
        const address = data.provinceName + data.cityName + data.countyName + data.detailInfo 
        req(app.globalData.bastUrl, 'appv5_1/tigger/setAddress', {
          id: that.data.winLogId,
          mobile: data.telNumber,
          address: address,
          name: data.userName
        }, 'POST').then(res => {
          if (res.status == 1) {
            // 去支付
            wx.showModal({
              title: '核对地址',
              content: '请确定您的收货信息',
              cancelText: '返回修改',
              confirmText: '确认支付',
              success: function (data) {
                if (data.confirm) {
                  that.createorder()
                } else if (data.cancel) {
                  that.addAddress()
                }
              }
            })
          }
        })
      },
      fail: function() {
        wx.showModal({
          title: '请选择收货地址',
          content: '取消视为放弃本次奖品',
          success: function (res) {
            if (res.confirm) {
              that.addAddress()
            }
          }
        })
      }
    })
  },
  // 创建打赏订单
  createorder: function () {
    req(app.globalData.bastUrl, 'appv3_1/createorder', {
      type: 0,
      tiggerWinId: this.data.winLogId,
      orders: this.data.paymentInfo
    }, 'POST').then(res => {
      if (res.code == 1) {
        this.buychecking(res.data)
      }
    })
  },
  // 换取支付id
  buychecking: function (ordernumber) {
    req(app.globalData.bastUrl, 'appv2_1/buychecking', {
      order_number: ordernumber,
      payment_type: 3
    }, 'POST').then(res => {
      this.wxpayment(res.data)
    })
  },
  // 微信支付方法
  // ordernummber
  // 文档：https://developers.weixin.qq.com/miniprogram/dev/api/api-pay.html
  wxpayment: function (prepayId) {
    const that = this
    req(app.globalData.bastUrl, 'appv5_1/payment/getWxPaymentParam', {
      package: 'prepay_id=' + prepayId
    }, 'POST').then(res => {
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        success: function() {
          wx.showModal({
            title: '支付成功',
            content: '请等待客服联系发货',
            showCancel: false
          })
        },
        // 
        fail: function(){
          wx.showModal({
            title: '支付',
            content: '取消视为放弃本次奖品',
            success: function (data) {
              if (data.confirm) {
                that.wxpayment(prepayId)
              }
            }
          })
        }
      })
    })
  },
  // 检测用户是否授权调用地址
  detectionAddress: function () {
    const that = this
    wx.getSetting({
      complete: function (res) {
        if (res.authSetting['scope.address']) {
          that.addAddress()
        }else{
          wx.showModal({
            title: '地址授权',
            content: '授权通讯地址，取消视为放弃本次奖品',
            success: function (data) {
              if (data.confirm) {
                wx.openSetting({
                  success: function () {
                    that.addAddress()
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  // 浮层显示
  supernatantShow: function () {
    this.setData({
      supernatant: true
    })
    const supernatantActiveAnimation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    })
    this.supernatantActiveAnimation = supernatantActiveAnimation
    supernatantActiveAnimation.width('160rpx').height('160rpx').step()
    

    const supernatantAnimation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.supernatantAnimation = supernatantAnimation
    supernatantAnimation.opacity(0).step()

    const supernatant_circle1 = wx.createAnimation({
      duration: 200,
      delay: 250,
      timingFunction: 'linear',
    })
    const supernatant_circle2 = wx.createAnimation({
      duration: 200,
      delay: 400,
      timingFunction: 'linear',
    })
    const supernatant_circle3 = wx.createAnimation({
      duration: 200,
      delay: 550,
      timingFunction: 'linear',
    })
    const supernatant_circle4 = wx.createAnimation({
      duration: 200,
      delay: 700,
      timingFunction: 'linear',
    })
    const supernatant_circle5 = wx.createAnimation({
      duration: 200,
      delay: 850,
      timingFunction: 'linear',
    })
    this.supernatant_circle1 = supernatant_circle1
    this.supernatant_circle2 = supernatant_circle2
    this.supernatant_circle3 = supernatant_circle3
    this.supernatant_circle4 = supernatant_circle4
    this.supernatant_circle5 = supernatant_circle5
    supernatant_circle1.width('400rpx').height('400rpx').step()
    supernatant_circle2.width('500rpx').height('500rpx').step()
    supernatant_circle3.width('600rpx').height('600rpx').step()
    supernatant_circle4.width('700rpx').height('700rpx').step()
    supernatant_circle5.width('700rpx').height('700rpx').step()
    this.setData({
      supernatantActiveAnimation: supernatantActiveAnimation.export(),
      supernatantAnimation: supernatantAnimation.export()
    })
    const that = this
    setTimeout(function() {
      that.setData({
        supernatant_circle1: supernatant_circle1.export(),
        supernatant_circle2: supernatant_circle2.export(),
        supernatant_circle3: supernatant_circle3.export(),
        supernatant_circle4: supernatant_circle4.export(),
        supernatant_circle5: supernatant_circle5.export()
      })
    },250)
  },
  // 浮层隐藏
  supernatantHide: function() {
    this.setData({
      supernatant: false
    })

    const supernatantActiveAnimation = this.supernatantActiveAnimation
    supernatantActiveAnimation.width(0).height(0).step({ duration: 10})

    const supernatantAnimation = this.supernatantAnimation
    supernatantAnimation.opacity(1).step({ duration: 10 })

    const supernatant_circle1 = this.supernatant_circle1
    const supernatant_circle2 = this.supernatant_circle2
    const supernatant_circle3 = this.supernatant_circle3
    const supernatant_circle4 = this.supernatant_circle4
    const supernatant_circle5 = this.supernatant_circle5
    supernatant_circle1.width(0).height(0).step({ duration: 10 })
    supernatant_circle2.width(0).height(0).step({ duration: 10 })
    supernatant_circle3.width(0).height(0).step({ duration: 10 })
    supernatant_circle4.width(0).height(0).step({ duration: 10 })
    supernatant_circle5.width(0).height(0).step({ duration: 10 })

    this.setData({
      supernatant_circle1: supernatant_circle1.export(),
      supernatant_circle2: supernatant_circle2.export(),
      supernatant_circle3: supernatant_circle3.export(),
      supernatant_circle4: supernatant_circle4.export(),
      supernatant_circle5: supernatant_circle5.export(),
      supernatantAnimation: supernatantAnimation.export(),
      supernatantActiveAnimation: supernatantActiveAnimation.export()
    })
  },
  // 奖品介绍
  activityContent: function(e) {
    const num = e.target.dataset.num
    this.setData({
      prizeIntroduce: num
    })
  },
  activityHide: function() {
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
  // 卖家中心跳转user
  navigateToUser: function (e) {
    let id = e.target.dataset.id
    let name = e.target.dataset.name
    const url = '/pages/user/user?id=' + id + '&name=' + name
    wx.navigateTo({
      url: url
    })
  },
  // 分享加金币
  onShareAppMessage: function(res) {
    return {
      title: '老虎机活动',
      path: '/pages/activity/activity',
      imageUrl: 'http://img8.ontheroadstore.com/upload/171110/726a1be76eb4735036201441587c3058.png',
      success: function (res) {
        // 转发成功
        req(app.globalData.bastUrl, 'appv5_1/tigger/shareIncrCoin', {}).then(res => {
          console.log(res)
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})