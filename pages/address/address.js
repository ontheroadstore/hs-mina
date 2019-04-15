// pages/address/address.js
const app = getApp()

//假数据
import { req } from '../../utils/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,    // 是否IphoneX
    addressItems: [],                       // 地址列表
    addressType: 0,                         // 0：通过我的地址进入  1：确认订单页进入
    orderType: 0,                            // 订单类型传入什么在返回什么(确认订单页)
    openSettingPopup: false,                  //打开设置授权弹窗
  },
  onLoad: function (options) {
    // options type参数 0：通过我的地址进入  1：确认订单页进入
    // 0情况下正常操作
    // 1情况在 设置默认后,微信添加地址(设为默认地址) 返回--确认订单页
    this.setData({
      orderType: options.orderType,
      addressType: options.type
    })
    wx.setNavigationBarTitle({
      title: '收货地址'
    })
    this.getAddr()
  },
  // 删除地址
  deleteAddress: function (e) {
    const id = e.target.dataset.id
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          req(app.globalData.bastUrl, 'appv2/removeaddress', {
            target_address_id: id
          }, 'POST').then(res => {
            if (res.code == 1) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              // 清除数组中 删除的地址
              that.getAddr()
            }
          })
        }
      }
    })
  },
  // 设置默认地址
  setDefault: function (e) {
    console.log(e)
    const id = e.target.dataset.id
    // addressType=1 设置成功后返回订单页
    // if (this.data.addressType == 1) {
    //   const orderType = this.data.orderType
    //   wx.navigateTo({
    //     url: '/pages/createOrder/createOrder?type=' + orderType
    //   })
    // }
    req(app.globalData.bastUrl, 'appv2/updateaddress', {
      target_address_id: id,
      is_default: 1
    }, 'POST').then(res => {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
      // addressType = 1 设置成功后返回订单页
      if (this.data.addressType == 1) {
        const orderType = this.data.orderType
        wx.redirectTo({
          url: '/pages/createOrder/createOrder?type=' + orderType
        })
      }else{
        //这里没有在本地对设置为默认地址做更改，如果不是从订单页来的，
        //设置默认地址后需要重新获取地址
        this.getAddr();
      }
    })
  },
  // 添加微信地址
  addAddress: function () {
    const that = this
    wx.chooseAddress({
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '是否保存地址',
          success: function (data) {
            if (data.confirm) {
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
              }, 'POST').then(res => {
                if (res.code = 1) {
                  wx.showToast({
                    title: '保存成功',
                  })
                }
                that.getAddr(true)
              })
              // addressType=1 设置成功后返回订单页
              // setTimeout(()=>{
              //   if (that.data.addressType == 1) {
              //     const orderType = that.data.orderType
              //     wx.navigateTo({
              //       url: '/pages/createOrder/createOrder?type=' + orderType
              //     })
              //   }
              // },2000)
              
            }
          }
        })
      },
      fail: function () {
        wx.getSetting({
          success: function (res) {
            if (!res.authSetting['scope.address']) {
              //显示“打开设置页”弹窗
              that.setData({
                openSettingPopup:true,
              });
            }
          }
        })

      }
    })
    
  },
  getAddr: function (type=false) {
    var that = this
    req(app.globalData.bastUrl, 'appv2/useraddress').then(res => {
      this.setData({
        addressItems: res.data
      })
      if(type){
          if (that.data.addressType == 1) {
              const orderType = that.data.orderType
              wx.navigateTo({
                url: '/pages/createOrder/createOrder?type=' + orderType
              })
            }
      }
    })
  },
  //拒绝打开设置授权 
  repulseOpenSetting: function (){
    this.setData({
      openSettingPopup: false,
    });
  },
  // 打开设置授权回调
  openSettingCallback: function (res){
    if (res && res.detail && res.detail.authSetting && res.detail.authSetting['scope.address']){
      //设置成功 res.detail.authSetting['scope.address'] === true;
      this.setData({
        openSettingPopup: false,
      });
      this.addAddress();
    }
  },
})