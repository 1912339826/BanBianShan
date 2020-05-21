// pages/mine/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
      userInfo:false,
      is_vip:0,
      card_num:0,
      card_log:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var data = wx.getStorageSync("current-user");
    console.log(data.data);
    this.setData({
      userInfo: data.data ? data.data : false
    })
    wx.request({
      url: app.apiHost + '/minsu/api/BlackCard/userBlackCardData',
      header: {
        'cookie': wx.getStorageSync("sessionid"),
        'Authorization': "Bearer " + wx.getStorageSync("user-auth")
      },
      success(res){
        console.log(res);
        if (res.data.is_vip) {
          // console.log(data);
          data.data.is_vip = res.data.is_vip;
          // console.log(data);
          wx.setStorageSync("current-user",data);
        }
        that.setData({
            is_vip:res.data.is_vip,
            card_num:res.data.total,
            card_log:res.data.data
        }) 
      }
    });
    

  },

  handleTab(e) {
    console.log(e.currentTarget.dataset.type)
    app.checkIsVip();
    const type = e.currentTarget.dataset.type / 1
    let url
    switch (type) {
      case 1:
        url = '/pages/setting/index'
        break
      case 2:
        url = '/pages/card/buy'
        break
    }
    console.log(url)
    wx.navigateTo({
      url
    })
  },

  login:function()
  {
    wx.navigateTo({
      url: '/pages/login/choose',
    })
  },  


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toCardBind:function(){
    app.checkIsVip();
    wx.navigateTo({
      url: '/pages/card/bind',
    })
  },
  toCardLog:function(){
    app.checkIsVip();
     wx.navigateTo({
       url: '/pages/card/index',
     })
  },
  linkUs:function(){
    wx.showModal({
      title: '联系我们',
      content: '您可以微信搜索“半边山下”公众号留言提问',
      showCancel:false,
      confirmText:"好的",
      confirmColor:"#c19a55"
    })
  },
  toVipCardRule:function(){
    app.checkIsVip();
    wx.navigateTo({
      url: '/pages/card/VipCardRule',
    })
  } 
})