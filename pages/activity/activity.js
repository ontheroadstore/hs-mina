const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

Page({
  data: {
    loading: true,                      // 延迟加载
    authorization: false,               // 授权
    gameCurrency: 0,                    // 抽奖次数
    prizeContentStatus: false,          // 我的奖品列表
    noSingleNum: 0,                     // 免单卷数量
    drawStatus: false,                  // 抽奖状态 true 进行中
    isSuccess: false,                   // 是否显示未中奖
    noDraw: false,                      // 没有抽奖次数图 显示状态
    selectedImage: null,                // 奖品图
    facility: null,                     // 老虎机动画
    lightArr: null,                     // 随机灯
    scrollImage1: null,                 // 滚动动画
    scrollImage2: null,                 // 滚动动画
    scrollImage3: null,                 // 滚动动画
    handShankStatus: [false, true, true, true, true],                 // 杠杆动画
    selectUserId: null,                 // 选中的用户ID
    selectUserName: null,               // 选中的用户name
    toastStatus: false,                 // 提示窗显示状态
    isIphoneX: app.globalData.isIphoneX      // 是否IphoneX
  },
  onShow: function () {
    this.closeToast()
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
    var onReady = this.onReady
    wx.getUserInfo({
      success: function () {
        req(app.globalData.bastUrl, 'appv5_1/tigger/getStatus', {}).then(res => {
          // 活动是否到期
          if (res.data) {
            req(app.globalData.bastUrl, 'appv5_1/tigger/getCoin', {}, 'GET', false, onReady).then(res => {
              that.setData({
                gameCurrency: res.data.coin,
                noSingleNum: res.data.winNum
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
    // 检测session_key 是否过期
    this.checkSession()
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
    if (this.data.gameCurrency == 0) {
      setTimeout(function () {
        that.setData({
          noDraw: true
        })
      }, 200)
      return false
    }
    setTimeout(function () {
      that.lightRandom()
      that.scrollImage()
    }, 400)
    setTimeout(function () {
      that.draw()
    }, 2400)
  },
  draw: function () {
    const that = this
    // 刷新token后回调
    const activityError = function () {
      that.resetDraw()
      wx.showToast({
        title: '拉杆断了。重拉一次',
        icon: 'none',
        duration: 2000
      })
    }
    req(app.globalData.bastUrl, 'appv5_1/tigger/tiggerRun', {}, 'GET', false, activityError).then(res => {
      if (res.data.status == 0) {
        that.setData({
          noDraw: true
        })
      }
      if (res.data.isSuccess == 1) {
        // 中奖后 记录打赏信息 抽奖ID selectedImage orderImage
        that.setData({
          gameCurrency: res.data.coin,
          noSingleNum: res.data.winNum,
          selectedImage: res.data.giftInfo.img2
        })
      }
      if (res.data.isSuccess == 0 && res.data.coin != 0) {
        that.setData({
          gameCurrency: res.data.coin,
          isSuccess: true
        })
      }
      if (res.data.isSuccess == 0 && res.data.coin == 0) {
        that.setData({
          gameCurrency: res.data.coin,
          lastResult: true
        })
      }
      setTimeout(function () {
        that.setData({
          handShankStatus: [false, true, true, true, true]
        })
      }, 100)
    })
  },
  // 立即购买 定位到卖家列表
  buyBtn: function () {
    this.resetDraw()
    this.scrollUser()
  },
  // 未中奖 再抽一次
  tryAgain: function () {
    this.resetDraw()
    const that = this
    setTimeout(function() {
      that.handShank()
    },300)    
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
    let status = e.target.dataset.status
    const url = '/pages/user/user?id=' + id + '&name=' + name
    if (this.data.noSingleNum == 0 && !status) {
      this.setData({
        toastStatus: true,
        selectUserId: id,
        selectUserName: name
      })
      return false
    }
    wx.navigateTo({
      url: url
    })
  },
  closeToast: function () {
    this.setData({
      toastStatus: false,
      selectUserId: null,
      selectUserName: null
    })
  },
  toast: function () {
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
  // 我的奖品
  prizeContent: function (e) {
    const status = e.target.dataset.status
    if (this.data.noSingleNum == 0) {
      wx.showToast({
        title: '现在毛也没有，还不赶紧去抽！',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (status == 0) {
      this.setData({
        prizeContentStatus: true
      })
    } else {
      this.setData({
        prizeContentStatus: false
      })
    }
    
  },
  // 定位到卖家列表
  scrollUser: function () {
    var query = wx.createSelectorQuery()
    query.select('#activity5').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      wx.pageScrollTo({
        scrollTop: res[0].top,
        duration: 200
      })
    })
    this.setData({
      prizeContentStatus: false
    })
  },
  // 重置抽奖
  resetDraw: function () {
    this.setData({
      drawStatus: false,
      isSuccess: false,
      selectedImage: null,
      lastResult: false,
      noDraw: false,
      handShankStatus: [false, true, true, true, true]
    })
  },
  // 分享加金币
  onShareAppMessage: function (res) {
    const that = this
    return {
      title: '狠货天天抽，最高价值¥2399，次数上不封顶',
      path: '/pages/activity/activity',
      imageUrl: 'http://img8.ontheroadstore.com/upload/180528/3b7b4161ab2690f9fe8b10188cbedeff.png',
      success: function (res) {
        // 用户未授权分享不去请求接口
        if (res.shareTickets && !that.data.authorization) {
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success: function (data) {
              // 将获取的encryptedData 传入后台
              that.addShareIncrCoin(data)
            }
          })
        } else if (!that.data.authorization) {
          that.addShareIncrCoin()
        }
      }
    }
  },
  // 分享增加抽奖
  addShareIncrCoin: function (code) {
    const that = this
    req(app.globalData.bastUrl, 'appv5_1/tigger/shareIncrCoin', {
      code: code
    }, 'POST', true).then(res => {
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
      }k
    })
  },
  // 检测checkSession
  checkSession: function () {
    wx.checkSession({
      fail: function () {
        app.login()
      }
    })
  }
})
