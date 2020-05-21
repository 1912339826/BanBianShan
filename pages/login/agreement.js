// pages/login/agreement.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    agreement:false,
    hostUrl: app.apiHost,
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
        // wx.request({
        //   url: app.apiHost + '/minsu/api/Index/index',
        //   header: {
        //     'cookie': wx.getStorageSync("sessionid"),
        //     'Authorization': "Bearer " + wx.getStorageSync("user-auth")
        //   },
        //   success(res){
        //     console.log(res);
        //     that.setData({
        //       agreement: res.data.global.vip_agreement
        //     })
        //   }
        // })
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

  }
})