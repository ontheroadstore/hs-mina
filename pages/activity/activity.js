const app = getApp()
const util = require('../../utils/util.js')
import { req } from '../../utils/api.js'
var images1 = [
  'http://img8.ontheroadstore.com/upload/180608/5a53db85924183eae60a41c498b81d50.jpg',
  'http://img8.ontheroadstore.com/upload/180608/eca9fd36bf608588560542b619528b21.jpg',
  'http://img8.ontheroadstore.com/upload/180608/90fc87a250533eec25143603159c21d1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6750c4665a408ee9ad97f3e612742a72.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8ecaee3beee4d8ddf7c3004c22cfbfd0.jpg',
  'http://img8.ontheroadstore.com/upload/180608/241faddd611854c43b306be3e23d960f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/591dc4524ced871cd9fd2cae5b8d14fd.jpg',
  'http://img8.ontheroadstore.com/upload/180608/40171200270af231d6759963fde55d22.jpg',
  'http://img8.ontheroadstore.com/upload/180608/b8a378309fc999cd0ad175e4fd0ca162.jpg',
  'http://img8.ontheroadstore.com/upload/180608/169c99fbbdef28858214ec1b498e3626.jpg',
  'http://img8.ontheroadstore.com/upload/180608/f927b4368ae2cb73b5c034bc53cf72ee.jpg',
  'http://img8.ontheroadstore.com/upload/180608/f141b9207b30832120b6de1217883274.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6f5120dfd917a1f763c0f99d085367b4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/9ba28040648c5ae8f62bf6b0db94c8b9.jpg',
  'http://img8.ontheroadstore.com/upload/180608/14366a5c94efad504f15718fbdab6f56.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2550a3265a2c6d04a49b2621ecbb47c5.jpg',
  'http://img8.ontheroadstore.com/upload/180608/23d4f27b924118b84d48091a3184ee76.jpg',
  'http://img8.ontheroadstore.com/upload/180608/bbdc159e0a152ebb22e0da3f2b77452b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/37f3794d6510a7038469a59452a5f628.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7e07d5fa10eb0e226e0b49982ad3f404.jpg',
  'http://img8.ontheroadstore.com/upload/180608/92bbce9784f9535638fa2bb19a840d08.jpg',
  'http://img8.ontheroadstore.com/upload/180608/142410fefa297fd403e69e7cf431aa70.jpg',
  'http://img8.ontheroadstore.com/upload/180608/94ab1cffadb08ec4a84d017640f1d622.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ae8d34c3dcc862664d1533dfbfb99f8a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/a882cf627873159099986d949707b0d0.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2dd90e41641b8be1c3e25edece4544ec.jpg',
  'http://img8.ontheroadstore.com/upload/180608/aed6d448629ea6306ab50a4d27c9760f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/f379282b635498f37fdf08d44e981610.jpg',
  'http://img8.ontheroadstore.com/upload/180608/c9168899d9e07a8965a0924b9937f2c1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2c5e46cb3a94878b18882bb40f1b2c6f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0fc336f2b2e448a52233c1e090a51c1c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/41e05b743d6f27005a1c38c5ff69be69.jpg',
  'http://img8.ontheroadstore.com/upload/180608/39eed299823125789650d37edeb73fa2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/9784148b453d3e905bb34b5526dc001b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ca0bc11734662e88a0b363dda006d5f1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/963794a3c22f4bcab05ed804255efc7c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8e8ff295ff971f91f4c54245e394d67e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ec09c3dfc721e8953151d988771647b0.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8d7bbfb3a0ff56f7e703eb72366fa9e2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8e731362e96fed6eb412493589709bb1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0d090f2c366520df368eab560735f5f4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6e5c9c7409a54099f071059ad9f9ba3b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0bbf2f1e558c06938eb2d5db86dfdbf8.jpg',
  'http://img8.ontheroadstore.com/upload/180608/da9d1f4cb51ce0b65fd8e4279ebd39d5.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ef23bf6e3207f3efb25195c517d5e701.jpg',
  'http://img8.ontheroadstore.com/upload/180608/f194e3e51bb8c52741f68b79eb9166ed.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6e1730298ddd18918a1ff521169eef58.jpg',
  'http://img8.ontheroadstore.com/upload/180608/74ec2f1e105efd14ed5ca0ac4d57a681.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7fc9e77d687a4670b8c15eb613b50fb4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/814ac2d7b5a0412bb62d5f4fe027c618.jpg'
]
var images2 = [
  'http://img8.ontheroadstore.com/upload/180608/87a9abd3a50a8fef325eadb8c4b9512b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/3e4cbc3b964907cd5e9f2e22ef0caee9.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8a530ef6246fc8cea8d76b43ce8915b1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d734ff02ea767a57d77aa1bc8b882e8c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/c1c661b755970e44abcba0fff5529943.jpg',
  'http://img8.ontheroadstore.com/upload/180608/b933864139216d3751926d69313ec663.jpg',
  'http://img8.ontheroadstore.com/upload/180608/a9f7a1ffeb3b0000cdb783431816ffd4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/73cb8ebaac569310e1dbf78715116c34.jpg',
  'http://img8.ontheroadstore.com/upload/180608/f0dec6fa8b3e03e9a5e0b7de439f7e96.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2120de22261a13eba2f75730b235c595.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7b9a08a8db7866f22bb079e0a54fb725.jpg',
  'http://img8.ontheroadstore.com/upload/180608/9f6c36943a097cabf8a1049789d7e91f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/8b54da0a23fc6520b81653bc09c02269.jpg',
  'http://img8.ontheroadstore.com/upload/180608/14c7d3f7b6762ec393607c6738e961f3.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1445825f584acf17ff5d39a02245e723.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1163aeaaf0f64c4b78e31999ff5487ca.jpg',
  'http://img8.ontheroadstore.com/upload/180608/05586e7b2c4e1351fe8a1ef5640d3cb2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d92f5a6b71c063902e3b4a78ec4dab04.jpg',
  'http://img8.ontheroadstore.com/upload/180608/5c544a4a82e545263c09b2692db61703.jpg',
  'http://img8.ontheroadstore.com/upload/180608/90b671ef363367c663fba1424ce739d1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/949925559aa5346fdab0bbad28a1f2ab.jpg',
  'http://img8.ontheroadstore.com/upload/180608/3ed2316e052160b7b17f7ce48137528e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/796985c9c454d087c563348585ec5e5c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/47c5a7dc2a5d04d9576d48256a19e403.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6c99164a3a1ee48f732b799070af3df1.jpg',
  'http://img8.ontheroadstore.com/upload/180608/42ad0e7631aeed0fc60d26590478c0ce.jpg',
  'http://img8.ontheroadstore.com/upload/180608/35b68e9cd61e5e76bd784a4c521c1820.jpg',
  'http://img8.ontheroadstore.com/upload/180608/88c21dc36700b7613cd185c4187d0163.jpg',
  'http://img8.ontheroadstore.com/upload/180608/5432d9f32324c52a0b575d6b120d1968.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1ba8f476f29319b59133fb4eac673580.jpg',
  'http://img8.ontheroadstore.com/upload/180608/5b1d2f68d27b93e2fd0873e80b225102.jpg',
  'http://img8.ontheroadstore.com/upload/180608/dc8adff9b9e1626be5daf746931518e2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/e70f5e5980aed90a906e1eb5958178bc.jpg',
  'http://img8.ontheroadstore.com/upload/180608/b5567738edd86af998a7239a065af462.jpg',
  'http://img8.ontheroadstore.com/upload/180608/256add7cb916fb693d4d459cd98de50c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/33c72169b8f22957e420c4d1956d471a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/447d86ebcb85e64df81bc63be4bdb0d9.jpg',
  'http://img8.ontheroadstore.com/upload/180608/fe651fa75ae36749010e9601986c95d8.jpg',
  'http://img8.ontheroadstore.com/upload/180608/f922cc4cd95038678b5c23ad0300b02c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2cddccdc79e9b1f61fabf19a23f1626e.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0bd366443c1d2e0aaf2c14e381016ee5.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0a3e50109f235ed1c5171429ed6bf5f2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/75aa53b63579e57fef6cde1689d3edf3.jpg',
  'http://img8.ontheroadstore.com/upload/180608/bff892b59ee1856d9a9e2b6afd633785.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d457ce673a5bce904343905fedf09b33.jpg',
  'http://img8.ontheroadstore.com/upload/180608/4b52aa0fae91ed659fe70afe1c76408a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7b941c07d4005ecb2dbe102a9b8c49b8.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1f974ebb18be2117a4914f46bca1546b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/605643aa9e6d4f06fe7ad782a1851c80.jpg',
  'http://img8.ontheroadstore.com/upload/180608/aa3237a2589c5c1b909306444bc4219f.jpg'
]
var images3 = [
  'http://img8.ontheroadstore.com/upload/180608/c4dd4be4b7593dcef568ecfc8d31e2e7.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d2af16da2ce12d729d7ce931aa7498ae.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6774071f0e7dcb4f53181214907e6bc2.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0d7b44284428bd73064804db627268fa.jpg',
  'http://img8.ontheroadstore.com/upload/180608/e25e0b65286fda803a6ee4b28d579a2c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/22899c53b7c3a2c85920acf09d40d9e7.jpg',
  'http://img8.ontheroadstore.com/upload/180608/efdacebb35f7420e732bd79fa147c26a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1b3fadaa7cd04addceb60fd74001573a.jpg',
  'http://img8.ontheroadstore.com/upload/180608/b5e3838760be0fa5a519b7dd01b6779d.jpg',
  'http://img8.ontheroadstore.com/upload/180608/2f6758483886d1d79fb1d26a4b0b4c34.jpg',
  'http://img8.ontheroadstore.com/upload/180608/b71d61e6d4b1b1e956bc852a3aff04ac.jpg',
  'http://img8.ontheroadstore.com/upload/180608/4f1d4b7637ba261e77acb630a524296c.jpg',
  'http://img8.ontheroadstore.com/upload/180608/577197d78fe09d0d562367a539c45f84.jpg',
  'http://img8.ontheroadstore.com/upload/180608/15f2f3baa9c20dcfa1e4ccca4ed71fa6.jpg',
  'http://img8.ontheroadstore.com/upload/180608/da35e10bd3e7eb62da31ba9de048ef19.jpg',
  'http://img8.ontheroadstore.com/upload/180608/0861ff850744cecf498201ef09aa2c13.jpg',
  'http://img8.ontheroadstore.com/upload/180608/de725f235be3fdca2145f7a855ab5cae.jpg',
  'http://img8.ontheroadstore.com/upload/180608/976d01299181e46755abee7186c4ad53.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6e9b790bd7b99059ba41c1f21a5746f7.jpg',
  'http://img8.ontheroadstore.com/upload/180608/bdf2735dda0cd06ec3c4f4a0d9cfcea5.jpg',
  'http://img8.ontheroadstore.com/upload/180608/1f02109a6a27480263dc2b20d5fc896b.jpg',
  'http://img8.ontheroadstore.com/upload/180608/e1213978e1ee4885200b02f7868625a0.jpg',
  'http://img8.ontheroadstore.com/upload/180608/ffb39a413c76e915b451f149453683fd.jpg',
  'http://img8.ontheroadstore.com/upload/180608/6ae6edc60f4b2ace574d18b3326d3e79.jpg',
  'http://img8.ontheroadstore.com/upload/180608/7f5275e95ceccf738b9aa609a554eeb0.jpg',
  'http://img8.ontheroadstore.com/upload/180608/97c96dccfa2ab97a3a6804f8d4b1a262.jpg',
  'http://img8.ontheroadstore.com/upload/180608/28932b7abc5a11e2cbf4a84942cba023.jpg',
  'http://img8.ontheroadstore.com/upload/180608/c70daa27e8af2071802e0aa3a642ec1f.jpg',
  'http://img8.ontheroadstore.com/upload/180608/d6f9150db6a63c4184f186e49c30c0f4.jpg',
  'http://img8.ontheroadstore.com/upload/180608/fd20d49de6ac019ab7b9d2fde07dacd8.jpg',
  'http://img8.ontheroadstore.com/upload/180608/56c028c6f33d51088d0129c07bc3d808.jpg',
]
Page({
  data: {
    authorization: false,                     // 用户是否授权
    liquorBgSize: {},                         // liquorBg背景缩放尺寸
    liquorBgAnimation: null,                  // 背景动画
    loadingStatic: 0,                         // 加载进度
    progressAnimation: null,                  // 加载进度动画
    loadingSuccess: false,                    // 加载成功
    startingUpStatus: true,                   // 开机界面显示状态
    startAnimation: images1,                  // 开始动画图片列表
    startAnimationNum: 0,                     // 动画图片显示顺序
    startAnimationStatus: false,              // 动画进行状态
    dialogGifStatus: false,                   // gif弹窗显示
    dialogAnimationStatus: false,             // gif显示
    blowType: 0,                              // 拳打 脚踢
    opacityAnimstion: null,                   // 拳打 脚踢 渐变动画
    combatGifStatus: false,                   // 打斗背景gif
    blowStatus: false,                        // 拳打脚踢按钮显示
    blowLoading: false,                       // 是否打击中
    strikeStatus: false,                      // 上下按钮栏
    procedureState: 0,                        // 存档参数
    dialogNum: 0,                             // 弹窗显示
    dialogActive: 0,                          // 当前显示弹窗
    blowNum: 0,                               // 打击次数
    damageNum: 0,                             // 伤害总数
    employCash: 0,                            // 优惠价格
    msgData: null,                            // 打击文案图片
    dialogText5: { title: '腿软了！赶紧叫人吧！'},
    battlefieldStatus: false,                 // 我的战报显示
    battlefieldReportStatus: false,           // 战报图片
    canvasData: null,                         // 生成战报的信息
    activityInfoStatus: false,                // 活动规则
    winelistStatus: false,                    // 酒单显示
    resetDialogStatus: true,                  // 重置提示窗
    goodsActive: 0,                           // 选中的酒单
    orderDialogStatus: false,                 // 订单提示窗
    goodList: null,                           // 商品列表
    activeGood: null,                         // 选中的商品
    shareUrl: null,                           // 分享地址
    addressInfo: null,                        // 收货地址
    battlefieldInfo: null,                    // 战报信息
    recordLog: null,                          // 战斗记录
    activerecordLog: null,                    // 当前战斗记录
    recordLogPage: 1,                         // 战斗记录页数
    activeRecordLogPage: 0,                   // 当前页
    audioNum: 0,                              // 加载音频数
    textArr: [],                              // 文字显示列表
    activeText: -1,                           // 当前显示文字
    isIphoneX: app.globalData.isIphoneX      // 是否IphoneX
  },
  onLoad: function () {
    const that = this
    var onLoad = this.onLoad
    wx.getUserInfo({
      success: function () {
        req(app.globalData.bastUrl, 'wxapp/wine/getStatus', {} ,'GET', true).then(res => {
          // 活动是否到期
          if (res.data) {
          // 根据存档定位用户停留位置
            req(app.globalData.bastUrl, 'wxapp/wine/getStep', {}, 'GET', true, onLoad).then(res => {
              that.setData({
                procedureState: res.data
              })
              that.getInfo()
              that.getShareString()
              if (res.data == 'start') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  dialogNum: 1,
                  dialogActive: 1,
                  startAnimationStatus: true
                })
              } else if (res.data == 'fight') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  startAnimationStatus: true,
                  strikeStatus: true,
                  blowStatus: true,
                  combatGifStatus: true,
                  dialogNum: 0,
                  dialogActive: 0
                })
              } else if (res.data == 'slienceChooice') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  startAnimationStatus: true,
                  dialogNum: 9,
                  dialogActive: 9
                })
              } else if (res.data == 'slience') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  startAnimationStatus: true,
                  strikeStatus: true,
                  winelistStatus: true,
                  dialogNum: 0,
                  dialogActive: 0
                })
              } else if (res.data == 'gameOver') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  startAnimationStatus: true,
                  strikeStatus: true,
                  blowStatus: true,
                  combatGifStatus: true,
                  dialogNum: 0,
                  dialogActive: 0,
                  dialogText5: { title: '都TM打死了你还鞭尸' }
                })
              } else if (res.data == 'dieChooice') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  startAnimationStatus: true,
                  strikeStatus: true,
                  blowStatus: false,
                  combatGifStatus: true,
                  dialogNum: 7,
                  dialogActive: 7,
                  dialogText5: { title: '都TM打死了你还鞭尸' }
                })
              } else if (res.data == 'die') {
                that.setData({
                  loadingSuccess: true,
                  startingUpStatus: false,
                  startAnimationStatus: true,
                  strikeStatus: true,
                  blowStatus: true,
                  combatGifStatus: true,
                  dialogNum: 0,
                  dialogActive: 0,
                  dialogText5: { title: '都TM打死了你还鞭尸' }
                })
              }
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
  },
  onReady: function () {
    // 微信直接加载图片不能超150 大概 显示后在进行添加 且不能直接加载 startAnimation: images
    const that = this
    setTimeout(function() {
      const startAnimation = that.data.startAnimation
      that.setData({
        startAnimation: startAnimation.concat(images2)
      })
    }, 2000)
    setTimeout(function () {
      const startAnimation = that.data.startAnimation
      that.setData({
        startAnimation: startAnimation.concat(images3)
      })
    }, 2500)
    this.audioLoading()
    // wx.downloadFile({
    //   url: 'https://img8.ontheroadstore.com/wine/music/1.mp3',
    //   success: function (res) {
    //     if (res.statusCode === 200) {
    //       const bg = wx.createInnerAudioContext()
    //       bg.src = res.tempFilePath
    //       bg.loop = true
    //       bg.obeyMuteSwitch = true
    //       bg.play()
    //       bg.onPlay(() => {
    //         console.log('开始播放')
    //       })
    //       bg.onError((res) => {
    //         console.log(res.errMsg)
    //         console.log(res.errCode)
    //       })
    //     }
    //   }
    // })
  },
  onShow: function () {
    this.bgLoadingProgressBar()
    // 获取酒单信息
    req(app.globalData.bastUrl, 'wxapp/wine/getGoodsInfo', {}, 'GET', true).then(res => {
      this.setData({
        goodList: res.data
      })
    })
  },
  // 获取用户 活动信息
  getInfo: function () {
    req(app.globalData.bastUrl, 'wxapp/wine/getInfo', {}, 'GET', true).then(res => {
      const recordLogPage = res.data.log.length / 5 != parseInt(res.data.log.length / 5) ? parseInt(res.data.log.length / 5) : res.data.log.length / 5 - 1
      this.setData({
        blowNum: res.data.hitNum,
        damageNum: res.data.hit,
        employCash: res.data.cash,
        battlefieldInfo: res.data,
        recordLog: res.data.log,
        activerecordLog: res.data.log.slice(0, 5),
        recordLogPage: recordLogPage
      })
    })
  },
  // 拳打脚踢
  blow: function (e) {
    const num = parseInt(Math.random() * 6) + 1
    this['attack' + num].play()
    if (this.back2) {
      this.back2.play()
    }
    if (this.data.blowLoading){
      return false
    }
    this.setData({
      blowLoading: true,
      blowType: parseInt(e.target.dataset.type)
    })
    const that = this
    // 设置文案
    this.setDialogText5()
    // 超过5次后
    if (that.data.blowNum >= 5 && that.data.procedureState == 'fight') {
      that.setData({
        blowLoading: false,
        dialogGifStatus: false,
        blowStatus: false,
        dialogNum: 6,
        dialogActive: 6
      })
      this.textShow(3)
      return false
    } else if (that.data.blowNum >= 5 && that.data.procedureState != 'fight') {
      that.setData({
        blowLoading: false,
        dialogGifStatus: false,
        dialogNum: 5,
        dialogActive: 5
      })
      setTimeout(function(){
        that.setData({
          dialogGifStatus: false,
          blowStatus: true,
          dialogNum: 0,
          dialogActive: 0
        })
      },2000)
      return false
    }
    // 接口获取文字图片信息 blowType 打击类型 
    req(app.globalData.bastUrl, 'wxapp/wine/hit', {
      hitType: this.data.blowType
    }, 'POST', true).then(res => {
      if (res.data.status){
        that.setData({
          dialogGifStatus: true,
          blowStatus: false,
          msgData: {
            img: res.data.msg.img,
            msg: res.data.msg.msg
          }
        })
        setTimeout(function () {
          req(app.globalData.bastUrl, 'wxapp/wine/getInfo', {}, 'GET', true).then(res => {
            const opacityAnimstion = wx.createAnimation({
              duration: 200,
              timingFunction: "ease",
              delay: 0
            })
            that.opacityAnimstion = opacityAnimstion
            opacityAnimstion.opacity(1).step()
            that.setData({
              blowNum: res.data.hitNum,
              damageNum: res.data.hit,
              employCash: res.data.cash,
              blowLoading: false,
              dialogAnimationStatus: true
            })
            that.setData({
              opacityAnimstion: opacityAnimstion.export()
            })
          })
        }, 2000)
      } else{
        that.setData({
          blowLoading: false,
          blowStatus: false,
          dialogNum: 5,
          dialogActive: 5
        })
        setTimeout(function () {
          that.setData({
            blowLoading: false,
            blowStatus: true,
            dialogNum: 0,
            dialogActive: 0
          })
        }, 2000)
      }
    })
  },
  // 关闭打击动画
  closeDialogGif: function () {
    if (this.data.blowNum == 1 || this.data.blowNum == 4 || this.data.blowNum == 5) {
      this.setData({
        blowStatus: true
      })
    } else if (this.data.blowNum == 2) {
      this.setData({
        dialogNum: 2,
        dialogActive: 2
      })
      this.textShow(1)
    } else if (this.data.blowNum == 3) {
      this.setData({
        dialogNum: 3,
        dialogActive: 3
      })
      this.textShow(2)
    }
    this.setData({
      dialogGifStatus: false,
      blowType: 0,
      dialogAnimationStatus: false
    })
  },
  // 结局
  ending: function (e) {
    const ending = e.target.dataset.ending
    if (ending == 1){
      this.setData({
        procedureState: 'gameOver',
        dialogNum: 0,
        dialogActive: 0,
        blowStatus: true,
        winelistStatus: true
      })
    } else if (ending == 2) {
      this.setData({
        procedureState: 'die',
        dialogNum: 8,
        dialogActive: 8,
        blowStatus: false,
        employCash: 20
      })
      this.textShow(5)
    } else if (ending == 3){
      this.setData({
        procedureState: 0,
        blowStatus: true,
        dialogNum: 10,
        dialogActive: 10
      })
      this.textShow(6)
    } else if (ending == 4) {
      this.setData({
        dialogNum: 0,
        dialogActive: 0,
        blowStatus: true
      })
      this.openWinelist()
    } else if (ending == 5) {
      // 重置游戏
      this.resetGame()
    }
    this.procedure()
    this.select.play()
  },
  // dialog3 文案切换
  setDialogText5: function () {
    var text = this.data.dialogText5
    if (this.data.blowNum >= 5 && this.data.procedureState == 'gameOver') {
      text = { title: '得饶人处且饶人，拿优惠买酒吧！' }
    } else if (this.data.blowNum >= 5 && this.data.procedureState == 'die') {
      text = { title: '都TM进小黑屋了，还不老实' }
    } else {
      text = { title: '腿软了！赶紧叫人吧！' }
    }
    this.setData({
      dialogText5: text
    })
  },
  // dialog6 文案切换
  setDialogText6: function () {
    this.setData({
      dialogNum: 7,
      dialogActive: 7,
      procedureState: 'dieChooice'
    })
    this.procedure()
    this.select.play()
    this.textShow(4)
  },
  // 选择见义勇为
  samaritan: function () {
    this.setData({
      procedureState: 'fight',
      strikeStatus: true,
      blowStatus: true,
      combatGifStatus: true,
      dialogNum: 0,
      dialogActive: 0
    })
    this.procedure()
    this.select.play()
    if (this.back2){
      this.back2.play()
    }
  },
  // 选择默不作声
  slienceChooice: function () {
    this.setData({
      procedureState: 'slienceChooice',
      dialogNum: 9,
      dialogActive: 9
    })
    this.procedure()
    this.select.play()
    this.textShow(7)
  },
  // 接受贿赂 购买
  slience: function () {
    this.setData({
      procedureState: 'slience',
      strikeStatus: true,
      winelistStatus: true,
      blowStatus: false,
      employCash: 20,
      dialogNum: 0,
      dialogActive: 0
    })
    this.procedure()
    this.select.play()
  },
  // 存档
  procedure: function () {
    req(app.globalData.bastUrl, 'wxapp/wine/saveStep', {
      step: this.data.procedureState
    }, 'POST', true)
  },
  // 打开酒单
  openWinelist: function () {
    this.setData({
      battlefieldStatus: false,
      winelistStatus: true,
      blowStatus: this.data.procedureState == 'slience' ? false : true,
      dialogNum: 0,
      dialogActive: 0
    })
    this.setProcedureState()
    this.menu.play()
  },
  // 打开战报
  openBattlefield: function () {
    this.setData({
      battlefieldStatus: true,
      winelistStatus: false,
      blowStatus: true,
      dialogNum: 0,
      dialogActive: 0
    })
    this.setProcedureState()
    this.getInfo()
    this.menu.play()
  },
  closeWinelistBattlefield: function () {
    this.setData({
      winelistStatus: false,
      battlefieldStatus: false
    })
  },
  // 打开战报生成页
  openBattlefieldReport: function (e) {
    const status = e.target.dataset.status
    const that = this
    if (status == 0){
      this.setData({
        battlefieldReportStatus: false
      })
      return false
    } else {
      this.setData({
        battlefieldReportStatus: true
      })
      req(app.globalData.bastUrl, 'wxapp/wine/getShareJpeg', {}, 'GET', true).then(res => {
        var text1 = '招募给力队友一起惩治流氓酒保，做酒吧正义小宝贝~'
        var text2 = '来试试看谁会是帮倒忙让酒保回血的百无一用添乱壮士~'
        var userImgUrl1 = replaceStr(that.data.battlefieldInfo.user.avatar)
        var userImgUrl2 = '/images/zhugong.png'
        var userImgUrl3 = '/images/keng.png'
        var userImgUrl2Status = false
        var userImgUrl3Status = false
        if (that.data.battlefieldInfo.hexagon.best){
          userImgUrl2 = replaceStr(that.data.battlefieldInfo.hexagon.best.avatar)
          text1 = that.data.battlefieldInfo.hexagon.best.msg
          userImgUrl2Status = true
        }
        if (that.data.battlefieldInfo.hexagon.worst) {
          userImgUrl3 = replaceStr(that.data.battlefieldInfo.hexagon.worst.avatar)
          text2 = that.data.battlefieldInfo.hexagon.worst.msg
          userImgUrl3Status = true
        }
        const num = parseInt(Math.random() * 30) + 20
        const data = {
          imgUrl1: '/images/canvasBg.png',
          imgUrl2: '/images/help.png',
          imgUrl3: '/images/defraud.png',
          userImgUrl1: userImgUrl1,
          userImgUrl2: userImgUrl2,
          userImgUrl3: userImgUrl3,
          userImgUrl2Status: userImgUrl2Status,
          userImgUrl3Status: userImgUrl3Status,
          userImgUrl4: '/images/default_img.png',
          codeImgUrl: replaceStr(res.data),
          text1: text1,
          text2: text2,
          spotArr: [that.data.battlefieldInfo.hexagon.hit, that.data.battlefieldInfo.hexagon.justice, that.data.battlefieldInfo.hexagon.cash, num, that.data.battlefieldInfo.hexagon.glamour, that.data.battlefieldInfo.hexagon.luck]
        }
        that.creatCanvas(data)
      })
    }
  },
  // 加载战报信息
  creatCanvas: function (data) {
    wx.showLoading({
      title: '生成中',
      mask: true
    })
    var that = this
    var num = 0
    this.setData({
      canvasData: data
    })
    wx.getImageInfo({
      src: data.imgUrl1,
      success: function (res) {
        getImageInfoSuccess(data.imgUrl1, 'imgUrl1')
      }
    })
    wx.getImageInfo({
      src: data.imgUrl2,
      success: function (res) {
        getImageInfoSuccess(data.imgUrl2, 'imgUrl2')
      }
    })
    wx.getImageInfo({
      src: data.imgUrl3,
      success: function (res) {
        getImageInfoSuccess(data.imgUrl3, 'imgUrl3')
      }
    })
    wx.getImageInfo({
      src: data.userImgUrl1,
      complete: function (res) {
        getImageInfoSuccess(res.path, 'userImgUrl1')
      }
    })
    wx.getImageInfo({
      src: data.userImgUrl2,
      complete: function (res) {
        if (data.userImgUrl2Status){
          getImageInfoSuccess(res.path, 'userImgUrl2')
        } else {
          getImageInfoSuccess(data.userImgUrl2, 'userImgUrl2')
        }
      }
    })
    wx.getImageInfo({
      src: data.userImgUrl3,
      complete: function (res) {
        if (data.userImgUrl3Status) {
          getImageInfoSuccess(res.path, 'userImgUrl3')
        } else {
          getImageInfoSuccess(data.userImgUrl3, 'userImgUrl3')
        }
      }
    })
    // 默认用户头像 在获取用户头像失败时使用
    wx.getImageInfo({
      src: data.userImgUrl4,
      success: function (res) {
        getImageInfoSuccess(data.userImgUrl4, 'userImgUrl4')
      }
    })
    wx.getImageInfo({
      src: data.codeImgUrl,
      complete: function (res) {
        getImageInfoSuccess(res.path, 'codeImgUrl')
      }
    })

    function getImageInfoSuccess(path, propertyName) {
      var canvasData = that.data.canvasData
      canvasData[propertyName] = path
      that.setData({
        canvasData: canvasData
      })
      num = num + 1
      that.drawImage(num)
    }
  },
  // 绘制战报
  drawImage: function (num) {
    if(num == 8){
      const systemInfo = wx.getSystemInfoSync()
      const ratio = systemInfo.windowWidth / 375
      const canvasData = this.data.canvasData
      // 五角点位置
      var spotArr = canvasData.spotArr
      if (!canvasData.userImgUrl1){
        canvasData.userImgUrl1 = canvasData.userImgUrl4
      }
      if (!canvasData.userImgUrl2) {
        canvasData.userImgUrl2 = canvasData.userImgUrl4
      }
      if (!canvasData.userImgUrl3) {
        canvasData.userImgUrl3 = canvasData.userImgUrl4
      }
      var showCanvas = wx.createCanvasContext('showCanvas')
      showCanvas.closePath()
      showCanvas.clearRect(0, 0, 375, 603)
      showCanvas.scale(0.81 * ratio, 0.81 * ratio)
      showCanvas.drawImage(canvasData.imgUrl1, 0, 0, 375, 603)

      var lineToArr1 = [{
          left: 188,
          top: 268
        }, {
          left: 188,
          top: 268
        }, {
          left: 188,
          top: 268
        }, {
          left: 188,
          top: 268
        }, {
          left: 188,
          top: 268
        }, {
          left: 188,
          top: 268
      }]
      lineToArr1[0].top = parseInt(268 - 122 / 50 * spotArr[0])
      lineToArr1[1].top = parseInt(268 - 59 / 50 * spotArr[1])
      lineToArr1[1].left = parseInt(188 + 104 / 50 * spotArr[1])
      lineToArr1[2].top = parseInt(268 + 62 / 50 * spotArr[2])
      lineToArr1[2].left = parseInt(188 + 104 / 50 * spotArr[2])
      lineToArr1[3].top = parseInt(268 + 122 / 50 * spotArr[3])
      lineToArr1[4].top = parseInt(268 + 62 / 50 * spotArr[4])
      lineToArr1[4].left = parseInt(188 - 106 / 50 * spotArr[4])
      lineToArr1[5].top = parseInt(268 - 59 / 50 * spotArr[5])
      lineToArr1[5].left = parseInt(188 - 106 / 50 * spotArr[5])

      showCanvas.beginPath()
      showCanvas.setStrokeStyle('#DF3C5E')
      showCanvas.setFillStyle('rgba(185,51,83,0.51)')
      showCanvas.setLineJoin('round')
      showCanvas.setLineWidth(2)
      // 默认点showCanvas.moveTo(188, 268)
      // showCanvas.moveTo(188, 144)
      // showCanvas.lineTo(292, 209)
      // showCanvas.lineTo(292, 330)
      // showCanvas.lineTo(188, 390)
      // showCanvas.lineTo(82, 330)
      // showCanvas.lineTo(82, 209)
      showCanvas.moveTo(lineToArr1[0].left, lineToArr1[0].top)
      showCanvas.lineTo(lineToArr1[1].left, lineToArr1[1].top)
      showCanvas.lineTo(lineToArr1[2].left, lineToArr1[2].top)
      showCanvas.lineTo(lineToArr1[3].left, lineToArr1[3].top)
      showCanvas.lineTo(lineToArr1[4].left, lineToArr1[4].top)
      showCanvas.lineTo(lineToArr1[5].left, lineToArr1[5].top)
      showCanvas.closePath()
      showCanvas.fill()
      showCanvas.stroke()
      showCanvas.beginPath()
      showCanvas.stroke()
      showCanvas.draw(true)
      showCanvas.save()
      // 用户头像
      showCanvas.beginPath()
      showCanvas.arc(188, 269, 31, 0, 2 * Math.PI)
      showCanvas.closePath()
      showCanvas.arc(36, 483, 24, 0, 2 * Math.PI)
      showCanvas.closePath()
      showCanvas.arc(337, 551, 24, 0, 2 * Math.PI)
      showCanvas.clip()
      showCanvas.drawImage(canvasData.userImgUrl1, 157, 238, 62, 62)
      showCanvas.drawImage(canvasData.userImgUrl2, 12, 459, 48, 48)
      showCanvas.drawImage(canvasData.userImgUrl3, 313, 527, 48, 48)
      showCanvas.draw(true)
      showCanvas.restore()
      showCanvas.drawImage(canvasData.imgUrl2, 10, 497, 53, 20)
      showCanvas.drawImage(canvasData.imgUrl3, 311, 565, 53, 20)
      showCanvas.drawImage(canvasData.codeImgUrl, 316, 18, 49, 49)
      showCanvas.setFontSize(12)
      showCanvas.setFillStyle("#FFF")
      showCanvas.setTextAlign('left')
      const showCanvastextArr1 = textArr(showCanvas, canvasData.text1)
      const showCanvastextArr2 = textArr(showCanvas, canvasData.text2)
      showCanvas.fillText(showCanvastextArr1[0], 87, 484, 231)
      showCanvas.fillText(showCanvastextArr1[1], 87, 504, 231)
      showCanvas.fillText(showCanvastextArr2[0], 54, 552, 231)
      showCanvas.fillText(showCanvastextArr2[1], 54, 572, 231)
      showCanvas.draw(true)




      var hiddenCanvas = wx.createCanvasContext('hiddenCanvas')
      hiddenCanvas.closePath()
      hiddenCanvas.clearRect(0, 0, 375 * 2, 603 * 2)
      hiddenCanvas.drawImage(canvasData.imgUrl1, 0, 0, 375 * 2, 603 * 2)
      var lineToArr2 = [{
          left: 188 * 2,
          top: 268 * 2
        }, {
            left: 188 * 2,
            top: 268 * 2
        }, {
            left: 188 * 2,
            top: 268 * 2
        }, {
            left: 188 * 2,
            top: 268 * 2
        }, {
            left: 188 * 2,
            top: 268 * 2
        }, {
          left: 188 * 2,
          top: 268 * 2
      }]
      lineToArr2[0].top = parseInt(268 - 122 / 50 * spotArr[0]) * 2
      lineToArr2[1].top = parseInt(268 - 59 / 50 * spotArr[1]) * 2
      lineToArr2[1].left = parseInt(188 + 104 / 50 * spotArr[1]) * 2
      lineToArr2[2].top = parseInt(268 + 62 / 50 * spotArr[2]) * 2
      lineToArr2[2].left = parseInt(188 + 104 / 50 * spotArr[2]) * 2
      lineToArr2[3].top = parseInt(268 + 122 / 50 * spotArr[3]) * 2
      lineToArr2[4].top = parseInt(268 + 62 / 50 * spotArr[4]) * 2
      lineToArr2[4].left = parseInt(188 - 106 / 50 * spotArr[4]) * 2
      lineToArr2[5].top = parseInt(268 - 59 / 50 * spotArr[5]) * 2
      lineToArr2[5].left = parseInt(188 - 106 / 50 * spotArr[5]) * 2
      hiddenCanvas.beginPath()
      hiddenCanvas.setStrokeStyle('#DF3C5E')
      hiddenCanvas.setFillStyle('rgba(185,51,83,0.51)')
      hiddenCanvas.setLineJoin('round')
      hiddenCanvas.setLineWidth(2)
      hiddenCanvas.moveTo(lineToArr2[0].left, lineToArr2[0].top)
      hiddenCanvas.lineTo(lineToArr2[1].left, lineToArr2[1].top)
      hiddenCanvas.lineTo(lineToArr2[2].left, lineToArr2[2].top)
      hiddenCanvas.lineTo(lineToArr2[3].left, lineToArr2[3].top)
      hiddenCanvas.lineTo(lineToArr2[4].left, lineToArr2[4].top)
      hiddenCanvas.lineTo(lineToArr2[5].left, lineToArr2[5].top)
      hiddenCanvas.closePath()
      hiddenCanvas.fill()
      hiddenCanvas.stroke()
      hiddenCanvas.beginPath()
      hiddenCanvas.stroke()
      hiddenCanvas.draw(true)
      hiddenCanvas.save()
      // 用户头像
      hiddenCanvas.beginPath()
      hiddenCanvas.arc(188 * 2, 269 * 2, 31 * 2, 0, 2 * Math.PI)
      hiddenCanvas.closePath()
      hiddenCanvas.arc(36 * 2, 483 * 2, 24 * 2, 0, 2 * Math.PI)
      hiddenCanvas.closePath()
      hiddenCanvas.arc(337 * 2, 551 * 2, 24 * 2, 0, 2 * Math.PI)
      hiddenCanvas.clip()
      hiddenCanvas.drawImage(canvasData.userImgUrl1, 157 * 2, 238 * 2, 62 * 2, 62 * 2)
      hiddenCanvas.drawImage(canvasData.userImgUrl2, 12 * 2, 459 * 2, 48 * 2, 48 * 2)
      hiddenCanvas.drawImage(canvasData.userImgUrl3, 313 * 2, 527 * 2, 48 * 2, 48 * 2)
      hiddenCanvas.draw(true)
      hiddenCanvas.restore()
      hiddenCanvas.drawImage(canvasData.imgUrl2, 10 * 2, 497 * 2, 53 * 2, 20 * 2)
      hiddenCanvas.drawImage(canvasData.imgUrl3, 311 * 2, 565 * 2, 53 * 2, 20 * 2)
      hiddenCanvas.drawImage(canvasData.codeImgUrl, 316 * 2, 18 * 2, 49 * 2, 49 * 2)
      hiddenCanvas.setFontSize(24)
      hiddenCanvas.setFillStyle("#FFF")
      hiddenCanvas.setTextAlign('left')
      const hiddenCanvastextArr1 = textArr(showCanvas, canvasData.text1)
      const hiddenCanvastextArr2 = textArr(showCanvas, canvasData.text2)
      hiddenCanvas.fillText(hiddenCanvastextArr1[0], 85 * 2, 484 * 2, 231 * 2)
      hiddenCanvas.fillText(hiddenCanvastextArr1[1], 85 * 2, 504 * 2, 231 * 2)
      hiddenCanvas.fillText(hiddenCanvastextArr2[0], 52 * 2, 552 * 2, 231 * 2)
      hiddenCanvas.fillText(hiddenCanvastextArr2[1], 52 * 2, 572 * 2, 231 * 2)
      hiddenCanvas.draw(true)
      wx.hideLoading()
    }
  },
  // 保存相册
  preserveImg: function () {
    wx.showLoading({
      title: '保存中',
      mask: true
    })
    const that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 750,
      height: 1206,
      destWidth: 750,
      destHeight: 1206,
      canvasId: 'hiddenCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function() {
            that.setData({
              battlefieldReportStatus: false
            })
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (res){
            wx.getSetting({
              success: function (res) {
                console.log(res)
                if (!res.authSetting['scope.writePhotosAlbum']){
                  wx.openSetting()
                }
              }
            })
          }
        })
      }
    })
  },
  // 关闭活动规则
  activityInfo: function (e) {
    const status = e.target.dataset.status
    if (status == 0){
      this.setData({
        activityInfoStatus: false
      })
    } else {
      this.setData({
        activityInfoStatus: true
      })
    }
  },
  // 重置提示窗显示
  resetGameShow: function (e) {
    const status = e.target.dataset.status
    if (status == 1){
      this.setData({
        resetDialogStatus: false,
        blowStatus: false,
        dialogNum: 0
      })
      this.menu.play()
    } else {
      this.setData({
        resetDialogStatus: true,
        blowStatus: this.data.dialogActive == 0 && this.data.procedureState != 'slience' ? true : false,
        dialogNum: this.data.dialogActive
      })
      this.select.play()
    }
  },
  // 重置游戏
  resetGame: function () {
    const that = this
    this.select.play()
    if (this.back2){
      this.back2.stop()
    }
    req(app.globalData.bastUrl, 'wxapp/wine/replay', {}, 'GET').then(res => {
      that.setData({
        liquorBgSize: {},
        liquorBgAnimation: null,
        loadingStatic: 0,
        progressAnimation: null,
        loadingSuccess: false,
        startingUpStatus: true,
        startAnimationNum: 0,
        startAnimationStatus: false,
        dialogGifStatus: false,
        blowType: 0,
        opacityAnimstion: null,
        dialogAnimationStatus: false,
        blowStatus: false,
        combatGifStatus: false,
        strikeStatus: false,
        procedureState: 0,
        dialogNum: 0,
        dialogActive: 0,
        blowNum: 0,
        blowLoading: false,
        damageNum: 0,
        employCash: 0,
        msgData: null,
        dialogText5: { title: '腿软了！赶紧叫人吧！' },
        battlefieldStatus: false,
        battlefieldReportStatus: false,
        activityInfoStatus: false,
        canvasData: null,
        winelistStatus: false,
        orderDialogStatus: false,
        goodsActive: 0,
        addressInfo: null,
        goodList: null,
        battlefieldInfo: null,
        recordLog: null,
        activerecordLog: null,
        recordLogPage: 1,
        activeRecordLogPage: 0,
        activeGood: null,
        resetDialogStatus: true,
        audioNum: 0,
        activeText: -1
      })
      that.bgLoadingProgressBar('reset')
      req(app.globalData.bastUrl, 'wxapp/wine/getGoodsInfo', {}, 'GET', true).then(res => {
        that.setData({
          goodList: res.data
        })
      })
    })
    
  },
  // 跳过动画
  skipAnimation: function () {
    this.setData({
      startAnimationNum: 132
    })
    if (this.back1){
      this.back1.stop()
    }
  },
  // 活动开始
  startActivity: function () {
    const that = this
    this.setData({
      startingUpStatus: false
    })
    if (this.back1){
      this.back1.play()
    }
    var time = setInterval(function () {
      if (that.data.startAnimationNum <= 131){
        that.setData({
          startAnimationNum: that.data.startAnimationNum + 1
        })
      }else{
        clearInterval(time)
        that.textShow(0)
        
        // 点击开始则 开始记录
        that.setData({
          dialogNum: 1,
          dialogActive: 1,
          startAnimationStatus: true,
          procedureState: 'start'
        })
        that.procedure()
      }
    }, 80)
  },
  // 背景移动动画
  bgLoadingProgressBar: function (reset) {
    // 背景跟着一起动， 加载动画2s以上 背景只持续2s
    const liquorBgAnimation = wx.createAnimation({
      duration: 3000,
      timingFunction: 'linear'
    })
    liquorBgAnimation.right(0).step()

    const progressAnimation = wx.createAnimation({
      duration: 3000,
      timingFunction: 'linear'
    })
    progressAnimation.width('366rpx').step()
    this.setData({
      liquorBgAnimation: liquorBgAnimation.export(),
      progressAnimation: progressAnimation.export()
    })
    if (reset){
      var that = this
      setTimeout(function () {
        that.setData({
          loadingSuccess: true
        })
      }, 3000)
    } else {
      var that = this
      setTimeout(function () {
        if (that.data.loadingStatic >= 263 && that.data.audioNum == 12) {
        // if (that.data.loadingStatic >= 263) {
          that.setData({
            loadingSuccess: true
          })
        } else {
          setTimeout(function () {
            that.setData({
              loadingSuccess: true
            })
          }, 2000)
        }
      }, 3600)
    }
    
  },
  // 资源加载
  loadStatic: function (res) {
    var loadingStatic = this.data.loadingStatic + 1
    this.setData({
      loadingStatic: loadingStatic
    })
  },
  // 授权
  getuserinfo: function (res) {
    const that = this
    if (res.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        authorization: false
      })
      app.login(that.onLoad)
    }
  },
  // 商品切换
  tabGoods: function (e) {
    const active = e.target.dataset.active
    this.setData({
      goodsActive: active
    })
  },
  // 战斗记录翻页
  tabRecordLogPage: function (e) {
    const page = e.target.dataset.page
    const activeRecordLogPage = this.data.activeRecordLogPage
    if (page == 'up'){
      const page = (activeRecordLogPage - 1) * 5
      const num = (activeRecordLogPage - 1) * 5 + 5
      this.setData({
        activeRecordLogPage: activeRecordLogPage - 1,
        activerecordLog: this.data.recordLog.slice(page, num)
      })
    } else if (page == 'next') {
      const page = (activeRecordLogPage + 1) * 5
      const num = (activeRecordLogPage + 1) * 5 + 5
      this.setData({
        activeRecordLogPage: activeRecordLogPage + 1,
        activerecordLog: this.data.recordLog.slice(page, num)
      })
    }
  },
  // 获取分享hash
  getShareString: function () {
    const that = this
    req(app.globalData.bastUrl, 'wxapp/wine/getShareString', {}, 'GET', true).then(res => {
      that.setData({
        shareUrl: '/pages/activityShare/activityShare?share=' + res.data
      })
    })
  },
  // 购买
  paymentBtn: function (e) {
    const goodinfo = e.target.dataset
    var activeGood = {
      "post_title": goodinfo.post_title,
      "max": goodinfo.max > this.data.employCash ? goodinfo.price - this.data.employCash : goodinfo.price - goodinfo.max,
      "img": goodinfo.img,
      "price": goodinfo.price,
      "desc": goodinfo.desc,
      "address_id": 0,
      "type": 1,
      "orders": [{
        "attach": "",
        "items": [{ "counts": 1, "item_id": goodinfo.id, "mid": goodinfo.mid }],
        "seller_name": goodinfo.uname,
        "seller_uid": goodinfo.uid
      }],
      "payment_type": 3
    }
    this.setData({
      orderDialogStatus: true,
      winelistStatus: false,
      activeGood: activeGood
    })
    req(app.globalData.bastUrl, 'appv2/defaultaddress', {}, "GET", true).then(res => {
      if (res.status == 1) {
        activeGood.address_id = res.data.id
        this.setData({
          addressInfo: res.data,
          activeGood: activeGood
        })
      }
    })
  },
  // 选择收货地址
  selectAddress: function () {
    const that = this
    
    wx.chooseAddress({
      success: function (res) {
        // 待保存的地址信息
        req(app.globalData.bastUrl, 'appv1/usernewaddress', {
          address_detail: res.detailInfo,
          city: res.cityName,
          district: res.countyName,
          is_default: 0,
          mobile: res.telNumber,
          postal_code: res.postalCode,
          province: res.provinceName,
          user_name: res.userName
        }, 'POST', true).then(res => {
          req(app.globalData.bastUrl, 'appv2/defaultaddress', {}, "GET", true).then(res => {
            if (res.status == 1) {
              const activeGood = that.data.activeGood
              activeGood.address_id = res.data.id
              that.setData({
                addressInfo: res.data,
                activeGood: activeGood
              })
            }
          })
        })
      },
      fail: function () {
        wx.getSetting({
          success: function (res) {
            if (!res.authSetting['scope.address']) {
              wx.openSetting({
                success: function () {
                  wx.getSetting({
                    success: function (res) {
                      if (res.authSetting['scope.address']) {
                        that.selectAddress()
                      }
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  },
  // 支付
  payment: function (order) {
    req(app.globalData.bastUrl, 'wxapp/wine/createOrder', {
      address_id: this.data.activeGood.address_id,
      type: 1,
      orders: this.data.activeGood.orders,
      payment_type: 3
    }, 'POST').then(res => {
      if (res.code == 1) {
        this.buychecking(res.data)
      }
    })
  },
  buychecking: function (ordernumber) {
    // 订单号
    this.setData({
      orderNumber: ordernumber
    })
    req(app.globalData.bastUrl, 'appv2_1/buychecking', {
      order_number: ordernumber,
      payment_type: 3
    }, 'POST', true).then(res => {
      this.wxpayment(res.data)
    })
  },
  // 微信支付方法
  // 文档：https://developers.weixin.qq.com/miniprogram/dev/api/api-pay.html
  wxpayment: function (prepayId) {
    const orderNumber = this.data.orderNumber
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
        success: function () {
          // 推送 appv5_1/wxapp/payment/action
          req(app.globalData.bastUrl, 'appv2_1/buysuccess', {
            order_number: orderNumber
          }, 'POST')
          that.paymentSuccess(prepayId)
        },
        fail: function () {
          req(app.globalData.bastUrl, 'appv2_1/buyfailed', {
            order_number: orderNumber
          }, 'POST')
          req(app.globalData.bastUrl, 'wxapp/wine/returnDiscount', {
            order_number: orderNumber
          }, 'POST')
        }
      })
    })
  },
  // 支付成功后回调
  paymentSuccess: function (prepayId) {
    const that = this
    const orderNumber = this.data.orderNumber
    const activityStatus = this.data.activityStatus
    req(app.globalData.bastUrl, 'appv5_1/wxapp/payment/action', {
      order_number: orderNumber,
      prepay_id: prepayId
    }, 'POST', true).then(res => {
      wx.showToast({
        title: '购买成功',
        icon: 'success',
        duration: 2000
      })
      that.setData({
        orderDialogStatus: false,
        winelistStatus: true,
        activeGood: null,
        addressInfo: null
      })
      that.getInfo()
    })
  },
  // 关闭支付
  closePayment: function () {
    this.setData({
      orderDialogStatus: false,
      winelistStatus: true,
      activeGood: null
    })
  },
  // 在选择小黑屋时 切换酒单
  setProcedureState: function () {
    if (this.data.procedureState == 'dieChooice') {
      this.setData({
        procedureState: 'fight'
      })
      this.procedure()
    }
  },
  // 分享 默认分享是活动页 如果当前用户已经可以叫人代打 分享代打页
  onShareAppMessage: function () {
    this.menu.play()
    const that = this
    this.setData({
      dialogNum: 0,
      dialogActive: 0,
      blowStatus: true
    })
    this.setProcedureState()
    // 在分享前生成哈希 在已经打完第三次 最好是每次打击都返回 前2次为null 3次后有哈希值x！
    const title = '酒保耍流氓，我打了他' + this.data.damageNum + '点血，快一起来打这孙子！'
    return {
      title: title,
      path: this.data.shareUrl,
      imageUrl: 'http://img8.ontheroadstore.com/upload/180622/c56c8d58d9e36fbe34740d7753843671.png',
      success: function (res) {
        that.addShareIncrCoin()
      }
    }
  },
  // 分享增加抽奖
  addShareIncrCoin: function () {
    const that = this
    if (that.data.blowNum == 4 || that.data.blowNum == 3) {
      req(app.globalData.bastUrl, 'wxapp/wine/share', {}, 'GET', true).then(res => {
        that.setData({
          dialogNum: 4,
          dialogActive: 4,
          blowStatus: false
        })
        setTimeout(function () {
          that.setData({
            dialogNum: 0,
            dialogActive: 0,
            blowStatus: true
          })
        }, 2000)
      })
    }
  },
  // 音频加载
  audioLoading: function () {
    const audioArr = [{
      url: 'https://img8.ontheroadstore.com/wine/music/back1.mp3',
      name: 'back1'
    }, {
      url: 'https://img8.ontheroadstore.com/wine/music/back2.mp3',
      name: 'back2',
      loop: true
    }, {
      url: 'https://img8.ontheroadstore.com/wine/music/select.mp3',
      name: 'select'
    }, {
      url: 'https://img8.ontheroadstore.com/wine/music/menu.mp3',
      name: 'menu'
    }, {
      url: 'https://img8.ontheroadstore.com/wine/music/font1.mp3',
      name: 'font',
      loop: true
    }, {
      url: 'https://img8.ontheroadstore.com/wine/music/1.mp3',
      name: 'attack1'
    }, {
      url: 'https://img8.ontheroadstore.com/wine/music/2.mp3',
      name: 'attack2'
    }, {
      url: 'https://img8.ontheroadstore.com/wine/music/3.mp3',
      name: 'attack3'
    }, {
      url: 'https://img8.ontheroadstore.com/wine/music/4.mp3',
      name: 'attack4'
    }, {
      url: 'https://img8.ontheroadstore.com/wine/music/5.mp3',
      name: 'attack5'
    }, {
      url: 'https://img8.ontheroadstore.com/wine/music/6.mp3',
      name: 'attack6'
    }, {
      url: 'https://img8.ontheroadstore.com/wine/music/7.mp3',
      name: 'attack7'
    }]
    for (var i = 0; i < audioArr.length; i++){
      this.circulationAudioLoading(audioArr[i])
    }
  },
  // 循环添加加载视频
  circulationAudioLoading: function (audio) {
    const that = this
    wx.downloadFile({
      url: audio.url,
      success: function (res) {
        if (res.statusCode === 200) {
          that.setData({
            audioNum: that.data.audioNum + 1
          })
          const bg = wx.createInnerAudioContext()
          that[audio.name] = bg
          bg.src = res.tempFilePath
          bg.obeyMuteSwitch = true
          if (audio.loop) {
            bg.loop = true
          }
        }
      }
    })
  },
  // 文字显示
  textShow: function (num) {
    this.setText()
    this.setData({
      activeText: num
    })
    this.font.play()
    const that = this
    var textArr = this.data.textArr
    const activeTextArr = textArr[num]['title'].split('')
    const activeTextLength = activeTextArr.length
    var textNum = 0
    const activeText = activeTextArr[textNum]
    textArr[num].title = activeText
    that.setData({
      textArr: textArr
    })
    var time = setInterval(function(){
      textNum = textNum + 1
      if (textNum >= activeTextLength){
        clearInterval(time)
        that.font.stop()
        const activeText = activeTextArr[textNum]
        textArr[num].selectShwo = true
        that.setData({
          textArr: textArr
        })
      } else {
        const activeText = activeTextArr[textNum]
        textArr[num].title = textArr[num].title + activeText
        that.setData({
          textArr: textArr
        })
      }
      
    },100)
  },
  // 设置文字
  setText: function () {
    this.setData({
      textArr: [{
        title: '叮！你发现酒保在耍流氓 ！',
        selectShwo: false
      }, {
        title: '围观群众对你见义勇为的行为表示认可，他们凑了' + this.data.employCash + '元给你买酒',
        selectNum: false
      }, {
        title: '酒保叫来帮手，这是茬架啊，再想动手只能叫人了',
        selectNum: false
      }, {
        title: '酒保瘫倒在地上，再打就出人命了！',
        selectNum: false
      }, {
        title: '都他妈说了不能打了你还打，请选择在小黑屋中度过余生的方式',
        selectNum: false
      }, {
        title: '狱友对你的硬气很赞扬，给你凑了20块钱买酒',
        selectNum: false
      }, {
        title: '那个！这页面我没时间做，你要不重来吧 ',
        selectNum: false
      }, {
        title: '酒保对你臭不要脸的行为表示认同，送了你一张20元优惠券',
        selectNum: false
      }]
    })
  },
  // 返回首页
  returnIndex: function () {
    if (this.back2){
      this.back2.stop()
    }
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  catchtouchmove: function () {
    // console.log(1)
  }
})

function textArr(context, text){
  var text1 = text
  var chr = text1.split("")
  var temp = ""
  var row = []
  for (var a = 0; a < chr.length; a++) {
    if (context.measureText(temp).width < 231) {
      temp += chr[a]
    }
    else {
      a--
      row.push(temp)
      temp = ""
    }
  }
  row.push(temp)
  if (row.length == 1){
    row.push('')
  } else if (row.length == 3){
    row[2] = ''
  }
  return row
}
function replaceStr(url) {
  var str = url
  var newStr = str.replace('http', 'https')
  return newStr
}
