const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

Page({
  data: {
    loading: true,                      // 延迟加载
    authorization: false,               // 授权
    streamerText: null,                 // 滚动文字
    streamerAnimation: null,            // 文字滚动动画
    gameCurrency: 0,                    // 抽奖次数
    winLogId: 0,                        // 抽奖Id
    drawStatus: false,                  // 抽奖状态 true 进行中
    isSuccess: false,                   // 是否显示未中奖
    noDraw: false,                      // 没有抽奖次数图 显示状态
    selectedImage: null,                // 奖品图
    orderImage: null,                   // 下单图
    paymentStatus: 0,                   // 支付状态 1为支付中
    address: null,                      // 用户地址
    paymentInfo: null,                  // 生成打赏订单数据 后台返回
    prizeIntroduce: 0,                  // 奖品介绍 切换状态
    facility: null,                     // 老虎机动画
    lightArr: null,                     // 随机灯
    scrollImage1: null,                 // 滚动动画
    scrollImage2: null,                 // 滚动动画
    scrollImage3: null,                 // 滚动动画
    handShankStatus: [false, true, true, true, true],                 // 杠杆动画
    supernatant: false,                 // 首页动画
    supernatantAnimation: null,         // 首页动画
    supernatant_circle1: null,          // 首页动画
    supernatant_circle2: null,          // 首页动画
    supernatant_circle3: null,          // 首页动画
    supernatant_circle4: null,          // 首页动画
    supernatant_circle5: null,          // 首页动画
    classifyAnimation1: null,           // 分类动画
    classifyAnimation2: null,           // 分类动画
    classifyAnimation3: null,           // 分类动画
    classifyAnimation4: null,           // 分类动画
    classifyAnimation5: null,           // 分类动画
    classifyAnimation6: null,           // 分类动画
    classifyAnimation7: null,           // 分类动画
    classifyAnimation8: null,           // 分类动画
    classifyAnimation9: null,           // 分类动画
    supernatantActiveAnimation: null,   // 首页动画
    isIphoneX: app.globalData.isIphoneX      // 是否IphoneX
  },
  onReady: function() {
    // this.paymentSuccess()
    
    const that = this
    setTimeout(function () {
      that.setData({
        loading: false
      })
    }, 1000)
    wx.getUserInfo({
      success: function() {
        req(app.globalData.bastUrl, 'appv5_1/tigger/getStatus', {}).then(res => {
          // 活动是否到期
          if (res.data) {
            req(app.globalData.bastUrl, 'appv5_1/tigger/getCoin', {}).then(res => {
              that.setData({
                gameCurrency: res.data
              })
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '活动已结束',
              showCancel: false,
              success: function (data) {
                if (data.confirm) {
                  wx.reLaunch({
                    url: '/pages/index/index'
                  })
                }
              }
            })
          }
        })
      },
      fail: function() {
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

    // 文字动画
    const textArr = ['手工黑巧克力', '吮吸飞机杯', '口红震动棒', '情趣润滑油', '冰淇淋振动棒', '波特小人飞机杯', '深喉飞机杯','可可红酒']
    var textNum = 1;
    const firstRandom = randomNum()
    const streamerAnimation = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear',
    })
    
    this.streamerAnimation = streamerAnimation
    streamerAnimation.translateY(-24).step({ duration: 400 }).translateY(-48).step({ duration: 400, delay: 4200 }).translateY(0).step()
    that.setData({
      streamerText: '恭喜尾号' + firstRandom + '用户抽中免单参与券',
      streamerAnimation: that.streamerAnimation.export()
    })
    
    setInterval(function () {
      const random = randomNum()
      textNum = textNum + 1
      const isWin = textNum / 10
      var textWin = '恭喜尾号' + random + '用户抽中免单参与券'
      if (parseInt(isWin) == isWin){
        const good = textArr[parseInt(Math.random() * 8)]
        textWin = '恭喜尾号' + random + '用户抽中' + good
      }
      that.streamerAnimation.translateY(-24).step({ duration: 400 }).translateY(-48).step({ duration: 400, delay: 4200 }).translateY(0).step()
      that.setData({
        streamerText: textWin,
        streamerAnimation: that.streamerAnimation.export()
      })
    }, 5200)
  },
  // 随机 灯
  lightRandom: function() {
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
      if (num == 2400){
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
    setTimeout(function(){
      scrollImage1.translateY(0).step({ duration: 0, delay: 0})
      scrollImage2.translateY(0).step({ duration: 0, delay: 0 })
      scrollImage3.translateY(0).step({ duration: 0, delay: 0 })
      that.setData({
        scrollImage1: scrollImage1.export(),
        scrollImage2: scrollImage2.export(),
        scrollImage3: scrollImage3.export()
      })
    },2200)
  },
  // 拉杆
  handShank: function() {
    if (this.data.drawStatus){
      return false
    }
    if (this.data.gameCurrency == 0){
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
      if(m == 6){
        clearInterval(time)
      } else if (m == 2){
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
    setTimeout(function() {
      that.lightRandom()
      that.scrollImage()
    },400)
    setTimeout(function () {
      that.draw()
    }, 2800)
  },
  draw: function() {
    const that = this
    req(app.globalData.bastUrl, 'appv5_1/tigger/tiggerRun', {}).then(res => {
      if (res.data.status == 0){
        that.setData({
          noDraw: true
        })
      }
      if (res.data.isSuccess == 0){
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
          orderImage: res.data.giftInfo.img,
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
  // 立即下单
  buyBtn: function() {
    // 开始支付
    this.setData({
      paymentStatus: 1
    })
  },
  // 取消下单
  closeBtn: function() {
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
  noSelectedCloseBtn: function() {
    this.resetDraw()
  },
  // 获取用户地址
  getAddress: function() {
    const that = this
    wx.chooseAddress({
      success: function (data) {
        that.setData({
          address: data
        })
      },
      fail: function(res) {
        if (res.errMsg == 'chooseAddress:fail auth deny') {
          wx.openSetting({
            success: function () {
              that.getAddress()
            }
          })
        }
      }
    })
  },
  // 添加用户地址
  addAddress: function () {
    const address = this.data.address
    const winLogId = this.data.winLogId
    const that = this
    if (!address){
      return wx.showToast({
        title: '请添加收货地址',
        icon: 'none',
        duration: 1000
      })
    }
    const addressInfo = address.provinceName + address.cityName + address.countyName + address.detailInfo
    req(app.globalData.bastUrl, 'appv5_1/tigger/setAddress', {
      id: winLogId,
      mobile: address.telNumber,
      address: addressInfo,
      name: address.userName
    }, 'POST').then(res => {
      if (res.status == 1) {
        that.createorder()
      }
    })
  },
  // 创建打赏订单
  createorder: function () {
    req(app.globalData.bastUrl, 'appv3_1/createorder', this.data.paymentInfo, 'POST').then(res => {
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
          that.paymentSuccess()
        },
        fail: function(){
          wx.showModal({
            title: '提示',
            content: '取消视为放弃本次中奖资格',
            cancelText: '放弃奖品',
            confirmText: '继续支付',
            success: function (data) {
              if (data.confirm) {
                that.wxpayment(prepayId)
              } else if (data.cancel){
                that.resetDraw()
              }
            }
          })
        }
      })
    })
  },
  // 支付成功 用户多获取一次分享抽奖
  paymentSuccess: function() {
    const that = this
    req(app.globalData.bastUrl, 'appv5_1/tigger/unlockShare', {}).then(res => {
      wx.showModal({
        title: '支付成功',
        content: '请等待客服联系发货,分享可再玩一次',
        showCancel: false,
        success: function(data) {
          if (data.confirm) {
            that.resetDraw()
          }
        }
      })
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
  // 跳转首页
  navigateToIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  // 跳转分类
  navigateToCategorie: function (e) {
    const url = e.target.dataset.type
    wx.reLaunch({
      url: '/pages/activityIndex/activityIndex?url=' + url
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
  resetDraw: function() {
    this.setData({
      paymentStatus: 0,
      winLogId: 0,
      drawStatus: false,
      isSuccess: false,
      selectedImage: null,
      orderImage: null,
      address: null,
      noDraw: false
    })
  },
  // 分享加金币
  onShareAppMessage: function(res) {
    const that = this
    return {
      title: '狠货天天抽，最高价值¥588，次数上不封顶',
      path: '/pages/activity/activity',
      imageUrl: 'http://img8.ontheroadstore.com/upload/180513/e8f735fc23f386c411a16855ab263cf4.png',
      success: function (res) {
        // 转发成功
        req(app.globalData.bastUrl, 'appv5_1/tigger/shareIncrCoin', {}, 'GET', true).then(res => {
          that.resetDraw()
          that.setData({
            gameCurrency: res.data.coin
          })
          if (res.data.status == 1){
            wx.showToast({
              title: '分享成功，获得一次抽奖',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    }
  },
  // 浮层显示
  supernatantShow: function () {
    const that = this
    // 浮层切换动画
    this.setData({
      supernatant: true
    })
    const supernatantActiveAnimation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    })
    this.supernatantActiveAnimation = supernatantActiveAnimation
    supernatantActiveAnimation.width('120rpx').height('120rpx').step()


    const supernatantAnimation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.supernatantAnimation = supernatantAnimation
    supernatantAnimation.opacity(0).step()
    this.setData({
      supernatantActiveAnimation: supernatantActiveAnimation.export(),
      supernatantAnimation: supernatantAnimation.export()
    })

    // 圆出现动画
    const supernatant_circle1 = wx.createAnimation({
      duration: 80,
      delay: 240,
      timingFunction: 'linear',
    })
    const supernatant_circle2 = wx.createAnimation({
      duration: 80,
      delay: 160,
      timingFunction: 'linear',
    })
    const supernatant_circle3 = wx.createAnimation({
      duration: 80,
      delay: 80,
      timingFunction: 'linear',
    })
    const supernatant_circle4 = wx.createAnimation({
      duration: 80,
      timingFunction: 'linear',
    })
    this.supernatant_circle1 = supernatant_circle1
    this.supernatant_circle2 = supernatant_circle2
    this.supernatant_circle3 = supernatant_circle3
    this.supernatant_circle4 = supernatant_circle4
    supernatant_circle1.width('743rpx').height('700rpx').step()
    supernatant_circle2.width('500rpx').height('500rpx').step()
    supernatant_circle3.width('599rpx').height('560rpx').step()
    supernatant_circle4.width('451rpx').height('388rpx').step()
    setTimeout(function () {
      that.setData({
        supernatant_circle1: supernatant_circle1.export(),
        supernatant_circle2: supernatant_circle2.export(),
        supernatant_circle3: supernatant_circle3.export(),
        supernatant_circle4: supernatant_circle4.export()
      })
    }, 100)

    // 分类图标出现动画
    const classifyAnimation1 = wx.createAnimation({
      duration: 300,
      delay: 20,
      timingFunction: 'ease',
    })
    const classifyAnimation2 = wx.createAnimation({
      duration: 300,
      delay: 40,
      timingFunction: 'linear',
    })
    const classifyAnimation3 = wx.createAnimation({
      duration: 300,
      delay: 60,
      timingFunction: 'linear',
    })
    const classifyAnimation4 = wx.createAnimation({
      duration: 300,
      delay: 80,
      timingFunction: 'linear',
    })
    const classifyAnimation5 = wx.createAnimation({
      duration: 300,
      delay: 100,
      timingFunction: 'linear',
    })
    const classifyAnimation6 = wx.createAnimation({
      duration: 300,
      delay: 120,
      timingFunction: 'linear',
    })
    const classifyAnimation7 = wx.createAnimation({
      duration: 300,
      delay: 140,
      timingFunction: 'linear',
    })
    const classifyAnimation8 = wx.createAnimation({
      duration: 300,
      delay: 160,
      timingFunction: 'linear',
    })
    const classifyAnimation9 = wx.createAnimation({
      duration: 300,
      delay: 180,
      timingFunction: 'linear',
    })
    this.classifyAnimation1 = classifyAnimation1
    this.classifyAnimation2 = classifyAnimation2
    this.classifyAnimation3 = classifyAnimation3
    this.classifyAnimation4 = classifyAnimation4
    this.classifyAnimation5 = classifyAnimation5
    this.classifyAnimation6 = classifyAnimation6
    this.classifyAnimation7 = classifyAnimation7
    this.classifyAnimation8 = classifyAnimation8
    this.classifyAnimation9 = classifyAnimation9
    classifyAnimation1.top('217rpx').opacity(1).step()
    classifyAnimation2.top('329rpx').opacity(1).step()
    classifyAnimation3.top('552rpx').opacity(1).step()
    classifyAnimation4.top('828rpx').opacity(1).step()
    classifyAnimation5.top('617rpx').opacity(1).step()
    classifyAnimation6.top('1043rpx').opacity(1).step()
    classifyAnimation7.top('449rpx').opacity(1).step()
    classifyAnimation8.top('927rpx').opacity(1).step()
    classifyAnimation9.top('612rpx').opacity(1).step()
    setTimeout(function () {
      that.setData({
        classifyAnimation1: classifyAnimation1.export(),
        classifyAnimation2: classifyAnimation2.export(),
        classifyAnimation3: classifyAnimation3.export(),
        classifyAnimation4: classifyAnimation4.export(),
        classifyAnimation5: classifyAnimation5.export(),
        classifyAnimation6: classifyAnimation6.export(),
        classifyAnimation7: classifyAnimation7.export(),
        classifyAnimation8: classifyAnimation8.export(),
        classifyAnimation9: classifyAnimation9.export()
      })
    }, 400)
  },
  // 浮层隐藏 重置状态
  supernatantHide: function () {
    this.setData({
      supernatant: false
    })
    // 浮层切换动画
    const supernatantActiveAnimation = this.supernatantActiveAnimation
    supernatantActiveAnimation.width(0).height(0).step({ duration: 10 })

    const supernatantAnimation = this.supernatantAnimation
    supernatantAnimation.opacity(1).step({ duration: 10 })

    // 圆出现动画
    const supernatant_circle1 = this.supernatant_circle1
    const supernatant_circle2 = this.supernatant_circle2
    const supernatant_circle3 = this.supernatant_circle3
    const supernatant_circle4 = this.supernatant_circle4
    supernatant_circle1.width(0).height(0).step({ duration: 10 })
    supernatant_circle2.width(0).height(0).step({ duration: 10 })
    supernatant_circle3.width(0).height(0).step({ duration: 10 })
    supernatant_circle4.width(0).height(0).step({ duration: 10 })

    // 分类图标
    const classifyAnimation1 = this.classifyAnimation1
    const classifyAnimation2 = this.classifyAnimation2
    const classifyAnimation3 = this.classifyAnimation3
    const classifyAnimation4 = this.classifyAnimation4
    const classifyAnimation5 = this.classifyAnimation5
    const classifyAnimation6 = this.classifyAnimation6
    const classifyAnimation7 = this.classifyAnimation7
    const classifyAnimation8 = this.classifyAnimation8
    const classifyAnimation9 = this.classifyAnimation9
    classifyAnimation1.top('157rpx').opacity(0).step()
    classifyAnimation2.top('269rpx').opacity(0).step()
    classifyAnimation3.top('492rpx').opacity(0).step()
    classifyAnimation4.top('768rpx').opacity(0).step()
    classifyAnimation5.top('557rpx').opacity(0).step()
    classifyAnimation6.top('983rpx').opacity(0).step()
    classifyAnimation7.top('389rpx').opacity(0).step()
    classifyAnimation8.top('867rpx').opacity(0).step()
    classifyAnimation9.top('552rpx').opacity(0).step()

    this.setData({
      supernatant_circle1: supernatant_circle1.export(),
      supernatant_circle2: supernatant_circle2.export(),
      supernatant_circle3: supernatant_circle3.export(),
      supernatant_circle4: supernatant_circle4.export(),
      supernatantAnimation: supernatantAnimation.export(),
      supernatantActiveAnimation: supernatantActiveAnimation.export(),
      classifyAnimation1: classifyAnimation1.export(),
      classifyAnimation2: classifyAnimation2.export(),
      classifyAnimation3: classifyAnimation3.export(),
      classifyAnimation4: classifyAnimation4.export(),
      classifyAnimation5: classifyAnimation5.export(),
      classifyAnimation6: classifyAnimation6.export(),
      classifyAnimation7: classifyAnimation7.export(),
      classifyAnimation8: classifyAnimation8.export(),
      classifyAnimation9: classifyAnimation9.export()
    })
  }
})

function randomNum() {
  const x1 = String(parseInt(Math.random() * 10))
  const x2 = String(parseInt(Math.random() * 10))
  const x3 = String(parseInt(Math.random() * 10))
  const x4 = String(parseInt(Math.random() * 10))
  return x1 + x2 + x3 + x4
}