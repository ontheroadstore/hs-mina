const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'

Page({
  data: {
    mainStatus: false,                        // 加载
    authorization: false,                     // 授权
    shareString: null,                        // 分享串
    blowStatus: false,                        // 打击按钮
    sceneStatus: false,                       // 切换打击
    damageNum: 10,                            // 朋友打击伤害
    dialogGifStatus: false,                   // 打击动画
    dialogStatus: false,                      // 提示窗
    dialogGif: null,                          // 打击动画
    dialoText: null,                          // 提示文案
    battlefieldInfo: null,                    // 战报信息
    recordLog: null,                          // 战斗记录
    activerecordLog: null,                    // 当前战斗记录
    recordLogPage: 1,                         // 战斗记录页数
    activeRecordLogPage: 0,                   // 当前页
    dialogAnimationStatus: false,
    opacityAnimstion: null
  },
  onLoad: function (options) {
    if (options.scene){
      var shareString = decodeURIComponent(options.scene)
    } else {
      var shareString = options.share
    }
    const that = this
    this.setData({
      shareString: shareString
    })
    wx.getUserInfo({
      success: function () {
        req(app.globalData.bastUrl, 'wxapp/wine/getShareInfo', {
          shareString: that.data.shareString
        }, 'POST', true).then( res => {
          if(res.data == 0){
            wx.redirectTo({
              url: '/pages/activity/activity',
            })
          }
          const recordLogPage = res.data.log.length / 3 != parseInt(res.data.log.length / 3) ? parseInt(res.data.log.length / 3) : res.data.log.length / 3 - 1
          that.setData({
            mainStatus: true,
            battlefieldInfo: res.data,
            recordLog: res.data.log,
            activerecordLog: res.data.log.slice(0, 3),
            recordLogPage: recordLogPage,
            damageNum: res.data.hit
          })
        })
      },
      fail: function () {
        that.setData({
          mainStatus: true,
          authorization: true
        })
      }
    })
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  onShareAppMessage: function () {
    const title = '酒保耍流氓，我已经把他打到残血了，快一起来打这孙子！'
    return {
      title: title,
      path: '/pages/activityShare/activityShare?share=' + this.data.shareString,
      imageUrl: 'http://img8.ontheroadstore.com/upload/180622/c56c8d58d9e36fbe34740d7753843671.png'
    }
  },
  getuserinfo: function (res) {
    const that = this
    if (res.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        authorization: false
      })
      app.login(that.onLoad)
    }
  },
  closeDialogGif: function () {
    this.setData({
      dialogGifStatus: false,
      blowType: 0,
      dialogAnimationStatus: false,
      dialogStatus: true
    })
  },
  // 我也要玩
  ending: function () {
    req(app.globalData.bastUrl, 'wxapp/wine/countInfo/save', {}, 'GET', true)
    wx.redirectTo({
      url: '/pages/activity/activity',
    })
  },
  // 打击动画
  blow: function (e) {
    const that = this
    this.setData({
      blowType: parseInt(e.target.dataset.type)
    })
    req(app.globalData.bastUrl, 'wxapp/wine/shareHit', {
      hitType: this.data.blowType,
      shareString: that.data.shareString
    }, 'POST', true).then(res => {
      console.log(res)
      if (res.data.status){
        const text = '你的帮忙让好友取得了压倒性的优势，现在开始玩自己的吧！！！！'
        this.setData({
          dialoText: text,
          dialogGif: res.data,
          dialogGifStatus: true,
          blowStatus: false
        })
        setTimeout(function () {
          that.setData({
            dialogAnimationStatus: true
          })
          const opacityAnimstion = wx.createAnimation({
            duration: 200,
            timingFunction: "ease",
            delay: 0
          })
          that.opacityAnimstion = opacityAnimstion
          opacityAnimstion.opacity(1).step()
          that.setData({
            opacityAnimstion: opacityAnimstion.export()
          })
        }, 2000)
      } else {
        const text = res.data.msg
        that.setData({
          dialoText: text,
          dialogGifStatus: false,
          dialogStatus: true
        })
      }
    })
    
  },
  // 切换场景
  tabScene: function () {
    this.setData({
      blowStatus: true,
      sceneStatus: true
    })
  },
  // 战斗记录翻页
  tabRecordLogPage: function (e) {
    const page = e.target.dataset.page
    const activeRecordLogPage = this.data.activeRecordLogPage
    if (page == 'up') {
      const page = (activeRecordLogPage - 1) * 3
      const num = (activeRecordLogPage - 1) * 3 + 3
      this.setData({
        activeRecordLogPage: activeRecordLogPage - 1,
        activerecordLog: this.data.recordLog.slice(page, num)
      })
    } else if (page == 'next') {
      const page = (activeRecordLogPage + 1) * 3
      const num = (activeRecordLogPage + 1) * 3 + 3
      this.setData({
        activeRecordLogPage: activeRecordLogPage + 1,
        activerecordLog: this.data.recordLog.slice(page, num)
      })
    }
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