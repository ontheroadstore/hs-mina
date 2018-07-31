// pages/purchaseList/purchaseList.js
const app = getApp()
import { req } from '../../utils/api.js'
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleId:'',     //商品id
    purchaseList:[],  //哆嗦列表
    nowPage: 0,           //当前页
    totalPage: 1,      //总页
    totalCount: 2,      //总数量
    ifOver: false,    //是否结束了
    ifLoading: false, //是否正在加载,
    nowTime:'',       //当前时间13位时间戳
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '哆嗦列表'
    })
    let articleId = options.articleId;
    this.setData({
      articleId: articleId,
      nowTime: new Date().getTime(),
    })
    this.getPurchaseList(articleId,1);
  },

  //获取哆嗦列表 
  getPurchaseList(articleId,page){

    if (this.data.ifLoading){
      return false;
    }
    if (this.data.ifOver || this.data.nowPage == this.data.totalPage) {
      return false;
    }
    
    this.setData({
      ifLoading:true
    })

    articleId = articleId || this.data.articleId;
    page = page || this.data.nowPage + 1;

    let pageSize = 20;
    req(app.globalData.bastUrl, 'appv5_2/goods/' + articleId + '/getPurchaseList', {
      'page': page,
      'rows': pageSize
    }).then(res => {

      this.fixTime(res.data.userlist);

      let totalCount = res.data.total_count;
      let totalPage = Math.ceil(totalCount / pageSize);
      this.setData({
        totalCount: totalCount,
        purchaseList: this.data.purchaseList.concat(res.data.userlist),
        nowPage: page,
        totalPage: totalPage,
        ifOver: page>=totalPage,
        ifLoading: false,
      })

    },err => {
      this.setData({
        ifLoading: false,
      })
    })

  },

  //滚动加载列表事件 
  evGetPurchaseList: function (event){
    this.getPurchaseList();
  },

  //修改日期为对应文字
  fixTime: function (userlist){
    userlist.forEach((v,k)=>{
      v.createtime = this.transTime(v.createtime,this.data.newTime)
    });
  },

  //调整日期
  transTime: function (timeTxt,nowTime){
    // 1分钟刚刚 1小时-几分钟前 n小时 n天 n周 n月 三月以上就显示年月日时分
    timeTxt = timeTxt.replace(/-/g, "/");//ios 无法识别2018-07-23这样的格式，需要转换为2018/07/23这样的格式
    let oldTime = new Date(timeTxt).getTime();//获取13位时间戳
    nowTime = nowTime || new Date().getTime();//获取当前13位时间戳
    let diffTime = parseInt((nowTime - oldTime)/1000); //时间差，精度 : 秒

    let txt = timeTxt;
    let n = '';
    if (diffTime < 60) {
      txt = '刚刚'; 
    }else if (diffTime < 60*60) {
      txt = '几分钟前';
    }else if (diffTime < 24*60*60) {
      n = parseInt(diffTime / (60 * 60));
      txt = n + '小时前';
    }else if (diffTime < 7*24*60*60) {
      n = parseInt(diffTime / (24 * 60 * 60));
      txt = n + '天前';
    }else if (diffTime < 30*24*60*60) {
      n = parseInt(diffTime / (7 * 24 * 60 * 60));
      txt = n + '周前';
    }else if (diffTime < 3*30*24*60*60) {
      n = parseInt(diffTime / (30 * 24 * 60 * 60));
      txt = n + '个月前';
    }else{
      txt = timeTxt.substr(0,16)
    }

    return txt;
  }

})