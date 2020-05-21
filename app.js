// app.js
import request from './utils/request'
import ways from './utils/index';
import utils from './utils/util';
import area from './utils/area.js'
// 接口地址
const apiHost = 'https://demo.bbsx.magcloud.net'

App({
  request,
  ways,
  utils,
  area,
  onLaunch: function (options) {
   
  },
  
  validatePhoneNumber : function (string) {
    var pattern = /^1[345789]\d{9}$/;
    if (pattern.test(string)) {
      return true;
    }
    return false;
  },
  toast:function(value)
  {

    wx.showToast({
      title: value,
      icon: 'none',
      duration: 2000
    })
  },
  checkIsVip:function(){
    var userInfo = wx.getStorageSync("current-user");
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/choose',
      })
      return;
    }
  },
  globalData: {
    userInfo: null,
  },
  apiHost,
  apis: {
    // 登录

    // 通用
    cardRule: `${apiHost}/minsu/api/Index/index`,
    loadInfo: `${apiHost}/user_center/api/v1/user/loadInfo`,

    // 首页展示
    home: `${apiHost}/minsu/api/Index/home`,
    articlePage: `${apiHost}/minsu/api/article/page`,
    articleLoad: `${apiHost}/minsu/api/article/load`,

    // 搜索模块
    searchKeys: `${apiHost}/minsu/api/minsu/searchKeys`,
    roomMonth: `${apiHost}/minsu/api/minsu/roomMonth`,
    tagData: `${apiHost}/minsu/api/Tag/tagData`,
    listStore: `${apiHost}/minsu/api/minsu/listStore`,
    city: `${apiHost}/minsu/api/index/city`,

    // 民宿详情
    loadStore: `${apiHost}/minsu/api/minsu/loadStore`,
    listRoomModel: `${apiHost}/minsu/api/minsu/listRoomModel`,
    loadModel: `${apiHost}/minsu/api/minsu/loadModel`,
    checkHasRoom: `${apiHost}/minsu/api/minsu/checkHasRoom`,

    // 订单管理
    create: `${apiHost}/minsu/api/roomOrder/create`,
    paySuccess: `${apiHost}/minsu/api/roomOrder/paySuccess`,
    cancelOrder: `${apiHost}/minsu/api/roomOrder/cancelOrder`,
    page: `${apiHost}/minsu/api/roomOrder/page`,
    load: `${apiHost}/minsu/api/roomOrder/load`,
    refundOrderPage: `${apiHost}/minsu/api/roomOrder/refundOrderPage`,

    // 商城
    goodsPage: `${apiHost}/minsu/api/mall/goodsPage`,
    goodsLoad: `${apiHost}/minsu/api/mall/goodsLoad`,
    orderLoad: `${apiHost}/minsu/api/mall/orderLoad`,
    // 黑金卡
    pageList: `${apiHost}/minsu/api/BlackCard/pageList`,
    cardBuy: `${apiHost}/minsu/api/BlackCard/cardBuy`,
    userBlackCardData: `${apiHost}/minsu/api/BlackCard/userBlackCardData`,
    // 全局配置-入住黑金卡政策，黑金卡规则及会员协议
    index: `${apiHost}/minsu/api/Index/index`,

    // 支付
    wxMiniPay: `${apiHost}/order_center/open/weixinOrder/wxMiniPay`
  }
})