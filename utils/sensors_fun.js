// 神策pagetype
// 神策用url转pagetype
function getPageType() {
  let url = getCurrentPageUrl();

  let pathArr = [
    { name: "推荐页", path: "pages/index/index", },
    { name: "确认订单页", path: "pages/createOrder/createOrder", },
    { name: "购物车页", path: "pages/chart/chart", },
    { name: "商品详情页", path: "pages/article/article", },
    { name: "我的订单页", path: "pages/orderInfo/orderInfo", },
    { name: "订单物流页", path: "pages/express/express", },
    { name: "我的订单页", path: "pages/orders/orders", },
    { name: "我的页面（买家版）", path: "pages/me/me", },
    { name: "我的收藏页", path: "pages/likeGoods/likeGoods", },
    { name: "登录注册页", path: "pages/relevanceTel/relevanceTel", },
    { name: "卖家店铺页", path: "pages/user/user", },
    { name: "购物车页", path: "pages/secondLevelChart/secondLevelChart", },
    { name: "我的优惠券页", path: "pages/userCoupon/userCoupon", },
 
  ]

  for (let i = 0; i < pathArr.length; i++) {
    let item = pathArr[i];
    let path = item.path;
 
    if (url.indexOf(path) > -1) {
      console.log('pagetype:',item.name);
      return item.name;
    }
  }
  return '';
}
/*获取当前页url*/
function getCurrentPageUrl() {
  let pages = getCurrentPages()    //获取加载的页面
  let currentPage = pages[pages.length - 1]    //获取当前页面的对象
  let url = currentPage.route    //当前页面url
  return url
}
/*封装坑位方法*/
function addFunctions(sensors){
  sensors.funMkt = function (type, page, content, location, desc, id){
    sensors.track('mkt_event', {
      mkt_type: type,
      mkt_page: page,
      mkt_content: String(content),
      mkt_location: String(location),
      mkt_desc: String(desc),
      commodityID: String(id),
    });
  }
}


module.exports = {
  getPageType: getPageType,
  addFunctions: addFunctions,
}
